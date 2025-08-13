"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Wallet, Zap, Brain } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import TradingViewChart from '@/components/TradingViewChart'
import { 
  fetchWalletBalances, 
  getPopularTokens, 
  createLimitOrder,
  getLimitOrders,
  cancelLimitOrder,
  fetch1inchQuote,
  validateApiKey,
  initializeWallet,
  getWalletStatus,
  fetchLineChart,
  fetchCandleChart,
  type TokenInfo,
  type QuoteResponse,
  type LimitOrder,
  type ChartPeriod,
  type CandlePeriod
} from '@/lib/1inch'

// Polygon API key
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

// Trading tokens
const TRADING_TOKENS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', icon: Bitcoin, tradingViewSymbol: 'BTCUSDT' },
  { symbol: 'ETHUSD', name: 'Ethereum', icon: TrendingUp, tradingViewSymbol: 'ETHUSDT' },
  { symbol: 'USDCUSD', name: 'USD Coin', icon: DollarSign, tradingViewSymbol: 'USDCUSDT' },
  { symbol: 'ETHUSDT', name: 'Ethereum USDT', icon: DollarSign, tradingViewSymbol: 'ETHUSDT' }
];

// Lot size presets
const LOT_SIZE_PRESETS = [
  { label: '-0.5', value: -0.5 },
  { label: '-0.1', value: -0.1 },
  { label: '0.01', value: 0.01 },
  { label: '+0.1', value: 0.1 },
  { label: '+0.5', value: 0.5 }
];

// Risk:Reward ratios
const RISK_RATIOS = [
  { name: '1:3', value: 3 },
  { name: '1:5', value: 5 },
  { name: '1:7', value: 7 }
];

// Types for API responses
interface OHLCData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface TradingTokenData {
  symbol: string;
  name: string;
  icon: any;
  tradingViewSymbol: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  lotSize: number;
  entryPrice: number;
  currentPrice: number;
  takeProfit: number;
  stopLoss: number;
  pips: number;
  profit: number;
  status: 'open' | 'closed';
  openTime: Date;
  closeTime?: Date;
  closePrice?: number;
}

// Helper function to get pip value for crypto pairs
function getPipValue(symbol: string): number {
  // For crypto pairs, pip value depends on the price range
  const price = getFallbackPrice(symbol);
  if (price >= 1000) return 0.1; // BTC, ETH - 0.1 pip
  if (price >= 100) return 0.01; // Mid-range tokens
  if (price >= 1) return 0.001; // Stablecoins
  return 0.0001; // Default
}

// Helper function to calculate pips for crypto
function calculatePips(currentPrice: number, targetPrice: number, symbol: string): number {
  const pipValue = getPipValue(symbol);
  return Math.abs(targetPrice - currentPrice) / pipValue;
}

// Helper function to calculate profit/loss for crypto
function calculateProfitLoss(
  entryPrice: number, 
  currentPrice: number, 
  lotSize: number, 
  type: 'buy' | 'sell',
  symbol: string
): number {
  const pipValue = getPipValue(symbol);
  const pips = type === 'buy' 
    ? (currentPrice - entryPrice) / pipValue
    : (entryPrice - currentPrice) / pipValue;
  
  // For crypto, calculate profit based on lot size and price movement
  const priceDifference = type === 'buy' 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  // Calculate profit based on lot size (1 lot = $100,000 equivalent)
  const lotValue = Math.abs(lotSize) * 100000;
  const profit = (priceDifference / entryPrice) * lotValue;
  
  return profit;
}

// Fetcher function for getting OHLC data for a specific ticker
async function fetchTickerOHLC(ticker: string): Promise<OHLCData> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/X:${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limit hit for ${ticker}, using fallback data`);
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.results?.[0];
    
    if (!result) {
      throw new Error('No data available');
    }
    
    return {
      ticker: ticker,
      name: getTokenName(ticker),
      price: result.c,
      change: Number((((result.c - result.o) / result.o) * 100).toFixed(2)),
      volume: result.v,
      high: result.h,
      low: result.l,
      open: result.o,
      close: result.c,
    };
  } catch (error) {
    console.warn(`Failed to fetch ${ticker}:`, error);
    // Return fallback data for this ticker
    return {
      ticker: ticker,
      name: getTokenName(ticker),
      price: getFallbackPrice(ticker),
      change: getFallbackChange(ticker),
      volume: 0,
      high: 0,
      low: 0,
      open: 0,
      close: 0,
    };
  }
}

// Helper function to get token name
function getTokenName(ticker: string): string {
  switch (ticker) {
    case 'BTCUSD': return 'Bitcoin';
    case 'ETHUSD': return 'Ethereum';
    case 'USDCUSD': return 'USD Coin';
    case 'USDTUSD': return 'Tether';
    default: return ticker.replace('USD', '');
  }
}

// Helper function to get fallback price
function getFallbackPrice(ticker: string): number {
  switch (ticker) {
    case 'BTCUSD': return 45000;
    case 'ETHUSD': return 3000;
    case 'USDCUSD': return 1.00;
    case 'USDTUSD': return 1.00;
    default: return 100;
  }
}

// Helper function to get fallback change
function getFallbackChange(ticker: string): number {
  switch (ticker) {
    case 'BTCUSD': return 2.5;
    case 'ETHUSD': return 1.8;
    case 'USDCUSD': return 0.0;
    case 'USDTUSD': return 0.0;
    default: return 0;
  }
}

// Fetcher function for all trading tokens
async function fetchTradingTokens(): Promise<TradingTokenData[]> {
  try {
    const results = await Promise.all(
      TRADING_TOKENS.map(async (token) => {
        const ohlcData = await fetchTickerOHLC(token.symbol);
        return {
          symbol: token.symbol,
          name: token.name,
          icon: token.icon,
          tradingViewSymbol: token.tradingViewSymbol,
          price: ohlcData.price,
          change: ohlcData.change,
          volume: ohlcData.volume,
          high: ohlcData.high,
          low: ohlcData.low,
          open: ohlcData.open,
          close: ohlcData.close,
        };
      })
    );
    return results;
  } catch (error) {
    console.error('Failed to fetch trading tokens:', error);
    return TRADING_TOKENS.map(token => ({
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      tradingViewSymbol: token.tradingViewSymbol,
      price: getFallbackPrice(token.symbol),
      change: getFallbackChange(token.symbol),
      volume: 0,
      high: 0,
      low: 0,
      open: 0,
      close: 0,
    }));
  }
}

const Page = () => {
  const [selectedToken, setSelectedToken] = useState('BTCUSD');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [lotSize, setLotSize] = useState(0.01);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // 1inch Trading State
  const [tradingMode, setTradingMode] = useState<'cfd' | '1inch'>('cfd');
  const [selectedFromToken, setSelectedFromToken] = useState<string>('');
  const [selectedToToken, setSelectedToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [limitPrice, setLimitPrice] = useState<string>('');
  
  // Chart state for 1inch trading
  const [selectedChartPeriod, setSelectedChartPeriod] = useState<ChartPeriod>('24H');
  const [selectedCandlePeriod, setSelectedCandlePeriod] = useState<CandlePeriod>(3600); // 1 hour
  const [chartData, setChartData] = useState<any>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // AI Trading modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiBudget, setAiBudget] = useState('1000'); // in quote units
  const [aiTimeframe, setAiTimeframe] = useState<'scalp' | 'swing' | 'position'>('swing');
  const [aiRisk, setAiRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [aiIntent, setAiIntent] = useState('Plan limit orders for the selected market');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Check if API key is configured (client-side only)
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    setHasApiKey(validateApiKey());
  }, []);

  // Initialize wallet for 1inch trading
  useEffect(() => {
    // Initialize with a demo wallet for testing
    initializeWallet('0x1234567890123456789012345678901234567890');
  }, []);

  // Get wallet status
  const walletStatus = getWalletStatus();

  const { data: tradingTokens = [] } = useQuery({
    queryKey: ['trading-tokens'],
    queryFn: fetchTradingTokens,
    staleTime: 5 * 1000, // 5 seconds for real-time updates
    retry: 2,
    retryDelay: 5000,
  });

  // 1inch Data Queries
  const { data: tokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['1inch-tokens'],
    queryFn: getPopularTokens,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: balances = [] } = useQuery({
    queryKey: ['1inch-balances'],
    queryFn: () => fetchWalletBalances(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: limitOrders = [] } = useQuery({
    queryKey: ['1inch-orders'],
    queryFn: () => getLimitOrders(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  const selectedTokenData = tradingTokens.find(token => token.symbol === selectedToken);
  const currentPrice = selectedTokenData?.price || 0;

  // Map UI token to base/quote pair supported by our agent/service
  const mapSelectedToPair = useCallback(() => {
    // Prefer USDC as quote for execution
    if (selectedToken.startsWith('ETH')) return { baseSymbol: 'ETH', quoteSymbol: 'USDC' };
    if (selectedToken.startsWith('BTC')) return { baseSymbol: 'WBTC', quoteSymbol: 'USDC' };
    if (selectedToken.startsWith('USDC')) return { baseSymbol: 'ETH', quoteSymbol: 'USDC' }; // default to ETH/USDC
    return { baseSymbol: 'ETH', quoteSymbol: 'USDC' };
  }, [selectedToken]);

  // Set default tokens when tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !selectedFromToken) {
      const usdc = tokens.find(t => t.symbol === 'USDC');
      const weth = tokens.find(t => t.symbol === 'WETH');
      if (usdc) setSelectedFromToken(usdc.address);
      if (weth) setSelectedToToken(weth.address);
    }
  }, [tokens, selectedFromToken]);

  // Update TP/SL when token changes
  useEffect(() => {
    if (currentPrice > 0) {
      // Update TP if it's empty or if we're applying a ratio
      if (!takeProfit) {
        setTakeProfit(currentPrice.toFixed(5));
      }
      // Update SL if it's empty
      if (!stopLoss) {
        setStopLoss(currentPrice.toFixed(5));
      }
    }
  }, [selectedToken, currentPrice]);

  // Calculate pips for TP and SL
  const tpPips = takeProfit ? calculatePips(currentPrice, parseFloat(takeProfit), selectedToken) : 0;
  const slPips = stopLoss ? calculatePips(currentPrice, parseFloat(stopLoss), selectedToken) : 0;

  // Calculate potential profit/loss
  const potentialProfit = tpPips > 0 ? calculateProfitLoss(currentPrice, parseFloat(takeProfit), lotSize, tradeType, selectedToken) : 0;
  const potentialLoss = slPips > 0 ? calculateProfitLoss(currentPrice, parseFloat(stopLoss), lotSize, tradeType, selectedToken) : 0;

  // Apply risk ratio when selected
  const applyRiskRatio = (ratio: number) => {
    if (stopLoss && currentPrice > 0) {
      const slPrice = parseFloat(stopLoss);
      const riskDistance = Math.abs(currentPrice - slPrice);
      const rewardDistance = riskDistance * ratio;
      
      let newTpPrice: number;
      if (tradeType === 'buy') {
        newTpPrice = currentPrice + rewardDistance;
      } else {
        newTpPrice = currentPrice - rewardDistance;
      }
      
      setTakeProfit(newTpPrice.toFixed(5));
      setSelectedRatio(ratio);
    }
  };

  // Handle TP input focus
  const handleTpFocus = () => {
    if (!takeProfit && currentPrice > 0) {
      setTakeProfit(currentPrice.toFixed(5));
    }
  };

  // Handle SL input focus
  const handleSlFocus = () => {
    if (!stopLoss && currentPrice > 0) {
      setStopLoss(currentPrice.toFixed(5));
    }
  };

  // Handle token selection
  const handleTokenSelection = (tokenSymbol: string) => {
    setSelectedToken(tokenSymbol);
    // Reset TP/SL when changing tokens
    setTakeProfit('');
    setStopLoss('');
    setSelectedRatio(null);
  };

  // 1inch Quote fetching
  const fetchQuote = async () => {
    if (!selectedFromToken || !selectedToToken || !amount) return;

    setIsLoadingQuote(true);
    try {
      const quoteData = await fetch1inchQuote(selectedFromToken, selectedToToken, amount);
      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Auto-fetch quote when parameters change
  useEffect(() => {
    if (selectedFromToken && selectedToToken && amount) {
      const timeoutId = setTimeout(fetchQuote, 500); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [selectedFromToken, selectedToToken, amount]);

  // Fetch chart data for 1inch trading
  const fetchChartData = async () => {
    if (!selectedFromToken || !selectedToToken) return;

    setIsLoadingChart(true);
    try {
      const lineData = await fetchLineChart(selectedFromToken, selectedToToken, selectedChartPeriod);
      const candleData = await fetchCandleChart(selectedFromToken, selectedToToken, selectedCandlePeriod);
      
      setChartData({
        line: lineData,
        candle: candleData,
        fromToken: getTokenByAddress(selectedFromToken),
        toToken: getTokenByAddress(selectedToToken)
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Auto-fetch chart data when tokens or period changes
  useEffect(() => {
    if (selectedFromToken && selectedToToken && tradingMode === '1inch') {
      fetchChartData();
    }
  }, [selectedFromToken, selectedToToken, selectedChartPeriod, selectedCandlePeriod, tradingMode]);

  // Create 1inch limit order
  const handleCreateLimitOrder = async () => {
    if (!quote || !walletStatus.isConnected) return;

    try {
      const orderParams = {
        makerAsset: selectedFromToken,
        takerAsset: selectedToToken,
        makingAmount: amount,
        takingAmount: quote.toTokenAmount,
        maker: walletStatus.address!
      };

      const order = await createLimitOrder(orderParams);
      
      console.log('Limit order created:', order);
      alert(`Limit order created! Hash: ${order.orderHash}`);
    } catch (error) {
      console.error('Failed to create limit order:', error);
      alert('Failed to create limit order');
    }
  };

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTokenData) {
        // Simulate small price movements
        const volatility = 0.001; // 0.1% volatility
        const randomChange = (Math.random() - 0.5) * volatility;
        const newPrice = selectedTokenData.price * (1 + randomChange);
        
        // Update the token data
        const updatedTokens = tradingTokens.map(token => 
          token.symbol === selectedToken 
            ? { ...token, price: newPrice }
            : token
        );
        
        // This would normally update the query cache
        console.log('Price update:', newPrice);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [selectedTokenData, selectedToken, tradingTokens]);

  const openPosition = () => {
    if (!selectedTokenData || !takeProfit || !stopLoss) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: selectedToken,
      type: tradeType,
      lotSize,
      entryPrice: currentPrice,
      currentPrice,
      takeProfit: parseFloat(takeProfit),
      stopLoss: parseFloat(stopLoss),
      pips: 0,
      profit: 0,
      status: 'open',
      openTime: new Date(),
    };

    setPositions(prev => [...prev, newPosition]);
    
    // Reset form
    setTakeProfit('');
    setStopLoss('');
    setSelectedRatio(null);
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { 
            ...pos, 
            status: 'closed' as const, 
            closeTime: new Date(), 
            closePrice: currentPrice,
            pips: calculatePips(pos.entryPrice, currentPrice, pos.symbol),
            profit: calculateProfitLoss(pos.entryPrice, currentPrice, pos.lotSize, pos.type, pos.symbol)
          }
        : pos
    ));
  };

  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');

  const getTokenByAddress = (address: string): TokenInfo | undefined => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  const formatTokenAmount = (amount: string, decimals: number = 18): string => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toFixed(6);
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Trading</h1>
          <div className="flex items-center gap-2">
            <Badge variant={hasApiKey ? "default" : "secondary"}>
              {hasApiKey ? "✅ 1inch API Connected" : "❌ 1inch API Missing"}
            </Badge>
            {walletStatus.isConnected && (
              <Badge variant="outline">
                🦊 {walletStatus.formattedAddress}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowAiModal(true)} className="hover:text-white text-white">
              <Brain className="w-4 h-4 mr-2" />
              Trade with AI
            </Button>
          </div>
        </div>

        {/* Trading Mode Selector */}
        <Card className="bg-crypto-card border-crypto-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trading Mode</h3>
            <div className="flex space-x-2">
              <Button
                variant={tradingMode === 'cfd' ? 'default' : 'outline'}
                onClick={() => setTradingMode('cfd')}
                size="sm"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                CFD Trading
              </Button>
              <Button
                variant={tradingMode === '1inch' ? 'default' : 'outline'}
                onClick={() => setTradingMode('1inch')}
                size="sm"
                className="text-white hover:text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                1inch DEX Trading
              </Button>
            </div>
          </div>
        </Card>

        {tradingMode === 'cfd' ? (
          // CFD Trading Interface
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Token Selection */}
              <Card className="bg-crypto-card border-crypto-border p-6">
                <h3 className="text-lg font-semibold mb-4">Select Token</h3>
                <div className="space-y-2">
                  {tradingTokens.map((token) => {
                    const Icon = token.icon;
                    return (
                      <button
                        key={token.symbol}
                        onClick={() => handleTokenSelection(token.symbol)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          selectedToken === token.symbol
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-crypto-border hover:bg-crypto-card'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${token.price.toLocaleString()}</div>
                          <div className={`text-sm ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change}%
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Trading Chart */}
              <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedTokenData?.name} ({selectedTokenData?.symbol})
                  </h3>
                  <div className="flex items-center space-x-4">
                    {/* Chart Period Controls */}
                    <div className="flex space-x-1">
                      {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                        <Button
                          key={period}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${selectedTokenData?.price.toLocaleString()}</div>
                      <div className={`text-sm ${selectedTokenData?.change && selectedTokenData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedTokenData?.change && selectedTokenData.change >= 0 ? '+' : ''}{selectedTokenData?.change}%
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* TradingView Chart */}
                <div className="h-83 bg-background rounded-lg border border-crypto-border overflow-hidden">
                  <TradingViewChart 
                    symbol={selectedTokenData?.tradingViewSymbol || 'BTCUSDT'} 
                    height={332}
                    width="100%"
                  />
                </div>

                {/* OHLC Data */}
                {selectedTokenData && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Open</div>
                      <div className="font-medium">${selectedTokenData.open.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">High</div>
                      <div className="font-medium text-green-500">${selectedTokenData.high.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Low</div>
                      <div className="font-medium text-red-500">${selectedTokenData.low.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Volume</div>
                      <div className="font-medium">${selectedTokenData.volume.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* CFD Trading Controls */}
            <Card className="bg-crypto-card border-crypto-border p-6">
              <h3 className="text-lg font-semibold mb-4">Place CFD Trade</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trade Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Trade Type</label>
                  <div className="flex space-x-2">
                    <Button
                      variant={tradeType === 'buy' ? 'default' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Buy
                    </Button>
                    <Button
                      variant={tradeType === 'sell' ? 'default' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      className="flex-1"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Lot Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">Lot Size</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={lotSize === 0 ? '' : lotSize.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || value === '-') {
                          setLotSize(0);
                        } else {
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue)) {
                            setLotSize(numValue);
                          }
                        }
                      }}
                      placeholder="Enter lot size"
                      className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex space-x-1">
                      {LOT_SIZE_PRESETS.map(preset => (
                        <Button
                          key={preset.value}
                          variant="outline"
                          size="sm"
                          onClick={() => setLotSize(preset.value)}
                          className="flex-1 text-xs"
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Take Profit */}
                <div>
                  <label className="block text-sm font-medium mb-2">Take Profit</label>
                  <input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    onFocus={handleTpFocus}
                    placeholder="Enter TP price"
                    step="0.00001"
                    className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {tpPips > 0 && (
                    <div className="text-sm text-green-500 mt-1">
                      {tpPips.toFixed(1)} pips | Profit: ${potentialProfit.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Stop Loss */}
                <div>
                  <label className="block text-sm font-medium mb-2">Stop Loss</label>
                  <input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    onFocus={handleSlFocus}
                    placeholder="Enter SL price"
                    step="0.00001"
                    className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {slPips > 0 && (
                    <div className="text-sm text-red-500 mt-1">
                      {slPips.toFixed(1)} pips | Loss: ${potentialLoss.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Risk:Reward Ratio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Risk:Reward Ratio</label>
                  <div className="flex space-x-2">
                    {RISK_RATIOS.map(ratio => (
                      <Button
                        key={ratio.value}
                        variant={selectedRatio === ratio.value ? 'default' : 'outline'}
                        onClick={() => applyRiskRatio(ratio.value)}
                        size="sm"
                      >
                        {ratio.name}
                      </Button>
                    ))}
                  </div>
                  {selectedRatio && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Applied {selectedRatio}:1 ratio
                    </div>
                  )}
                </div>

                {/* Place Trade Button */}
                <div className="flex items-end">
                  <Button 
                    className="w-full"
                    variant={tradeType === 'buy' ? 'default' : 'destructive'}
                    onClick={openPosition}
                    disabled={!takeProfit || !stopLoss}
                  >
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedTokenData?.symbol}
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          // 1inch DEX Trading Interface
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Token Selection */}
              <Card className="bg-crypto-card border-crypto-border p-6">
                <h3 className="text-lg font-semibold mb-4">Select Tokens</h3>
                <div className="space-y-4">
                  {/* From Token */}
                  <div>
                    <label className="block text-sm font-medium mb-2">From Token</label>
                    <select
                      value={selectedFromToken}
                      onChange={(e) => setSelectedFromToken(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select token</option>
                      {tokensLoading ? (
                        <option value="loading" disabled>Loading tokens...</option>
                      ) : (
                        tokens.map((token) => (
                          <option key={token.address} value={token.address}>
                            {token.symbol} - {token.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* To Token */}
                  <div>
                    <label className="block text-sm font-medium mb-2">To Token</label>
                    <select
                      value={selectedToToken}
                      onChange={(e) => setSelectedToToken(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select token</option>
                      {tokensLoading ? (
                        <option value="loading" disabled>Loading tokens...</option>
                      ) : (
                        tokens.map((token) => (
                          <option key={token.address} value={token.address}>
                            {token.symbol} - {token.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Get Quote Button */}
                  <Button 
                    onClick={fetchQuote}
                    disabled={!selectedFromToken || !selectedToToken || !amount || isLoadingQuote}
                    className="w-full"
                  >
                    {isLoadingQuote ? 'Loading...' : 'Get Quote'}
                  </Button>
                </div>
              </Card>

              {/* Chart and Quote Display */}
              <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {chartData?.fromToken?.symbol}/{chartData?.toToken?.symbol} Chart
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Chart Period Selector */}
                    <div className="flex space-x-1">
                      {(['24H', '1W', '1M', '1Y'] as ChartPeriod[]).map((period) => (
                        <Button
                          key={period}
                          variant={selectedChartPeriod === period ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedChartPeriod(period)}
                          className="text-xs"
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                    {/* Candle Period Selector */}
                    <select
                      value={selectedCandlePeriod}
                      onChange={(e) => setSelectedCandlePeriod(Number(e.target.value) as CandlePeriod)}
                      className="px-2 py-1 text-xs bg-background border border-crypto-border rounded"
                    >
                      <option value={300}>5m</option>
                      <option value={900}>15m</option>
                      <option value={3600}>1h</option>
                      <option value={14400}>4h</option>
                      <option value={86400}>1d</option>
                      <option value={604800}>1w</option>
                    </select>
                  </div>
                </div>

                {/* TradingView Chart */}
                {chartData ? (
                  <div className="h-64 bg-background rounded-lg border border-crypto-border overflow-hidden mb-4">
                    <TradingViewChart 
                      symbol={`${chartData.fromToken?.symbol}${chartData.toToken?.symbol}`}
                      height={256}
                      width="100%"
                    />
                  </div>
                ) : isLoadingChart ? (
                  <div className="h-64 bg-background rounded-lg border border-crypto-border flex items-center justify-center">
                    <div className="text-muted-foreground">Loading chart...</div>
                  </div>
                ) : (
                  <div className="h-64 bg-background rounded-lg border border-crypto-border flex items-center justify-center">
                    <div className="text-muted-foreground">Select tokens to view chart</div>
                  </div>
                )}

                {/* Quote Information */}
                {quote && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Quote Information</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Rate</div>
                        <div className="font-medium">
                          1 {getTokenByAddress(selectedFromToken)?.symbol} = {formatTokenAmount(quote.toTokenAmount)} {getTokenByAddress(selectedToToken)?.symbol}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">You'll receive</div>
                        <div className="font-medium">
                          {formatTokenAmount(quote.toTokenAmount)} {getTokenByAddress(selectedToToken)?.symbol}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Gas Cost</div>
                        <div className="font-medium">
                          {formatTokenAmount(quote.gasCost)} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Gas</div>
                        <div className="font-medium">
                          {quote.estimatedGas} units
                        </div>
                      </div>
                    </div>

                    {/* Limit Order Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Create Limit Order</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Limit Price</label>
                          <input
                            type="number"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            placeholder="Enter limit price"
                            className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            onClick={handleCreateLimitOrder}
                            disabled={!walletStatus.isConnected}
                            className="w-full"
                          >
                            Create Limit Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Wallet Balances */}
            {balances.length > 0 && (
              <Card className="bg-crypto-card border-crypto-border p-6">
                <h3 className="text-lg font-semibold mb-4">Wallet Balances</h3>
                <div className="space-y-2">
                  {balances.slice(0, 5).map((balance) => {
                    const token = getTokenByAddress(balance.address);
                    return (
                      <div key={balance.address} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token?.symbol || balance.symbol}</span>
                          <span className="text-sm text-muted-foreground">{token?.name || balance.name}</span>
                        </div>
                        <span className="font-medium">
                          {formatTokenAmount(balance.balance, 18)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Limit Orders */}
            {limitOrders.length > 0 && (
              <Card className="bg-crypto-card border-crypto-border p-6">
                <h3 className="text-lg font-semibold mb-4">Your Limit Orders</h3>
                <div className="space-y-2">
                  {limitOrders.map((order) => (
                    <div key={order.orderHash} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                      <div>
                        <div className="font-medium">{order.makerAsset} → {order.takerAsset}</div>
                        <div className="text-sm text-muted-foreground">
                          Amount: {formatTokenAmount(order.makingAmount)} | Status: {order.status}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelLimitOrder(order.orderHash)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Open Positions (CFD Only) */}
        {tradingMode === 'cfd' && (
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Open Positions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
            </div>

            {openPositions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No open positions
              </div>
            ) : (
              <div className="space-y-2">
                {openPositions.map((position) => {
                  const currentPips = calculatePips(position.entryPrice, currentPrice, position.symbol);
                  const currentProfit = calculateProfitLoss(position.entryPrice, currentPrice, position.lotSize, position.type, position.symbol);
                  
                  return (
                    <div key={position.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                      <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          position.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {position.type.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Entry: ${position.entryPrice.toFixed(5)} | Lot: {position.lotSize}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${currentProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${currentProfit.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {currentPips.toFixed(1)} pips
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => closePosition(position.id)}
                      >
                        Close
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Position History */}
            {showHistory && closedPositions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3">Position History</h4>
                <div className="space-y-2">
                  {closedPositions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                      <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          position.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {position.type.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Entry: ${position.entryPrice.toFixed(5)} | Close: ${position.closePrice?.toFixed(5)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${position.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${position.profit.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {position.pips.toFixed(1)} pips
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* AI Trading Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 md:p-6 overflow-y-auto">
          <Card className="bg-crypto-card border-crypto-border w-full max-w-4xl p-4 md:p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-crypto-card/95 backdrop-blur supports-[backdrop-filter]:bg-crypto-card/80 z-10 py-2">
              <h3 className="text-lg font-semibold">Trade with AI</h3>
              <Button variant="ghost" size="sm" onClick={() => { setShowAiModal(false); setAiResult(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Token and Market Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Selected Market</div>
                <div className="font-medium">{selectedTokenData?.name} ({selectedTokenData?.symbol})</div>
                <div className="text-sm">Price: ${currentPrice.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pair for Execution</div>
                <div className="font-medium">
                  {mapSelectedToPair().baseSymbol}/{mapSelectedToPair().quoteSymbol}
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget ({mapSelectedToPair().quoteSymbol})</label>
                <input
                  type="number"
                  value={aiBudget}
                  onChange={(e) => setAiBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timeframe</label>
                <select
                  value={aiTimeframe}
                  onChange={(e) => setAiTimeframe(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="scalp">Scalp</option>
                  <option value="swing">Swing</option>
                  <option value="position">Position</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Risk</label>
                <select
                  value={aiRisk}
                  onChange={(e) => setAiRisk(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Intent</label>
              <input
                type="text"
                value={aiIntent}
                onChange={(e) => setAiIntent(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">The AI will propose and execute multiple limit orders if beneficial.</div>
              <Button 
                onClick={async () => {
                  setAiLoading(true);
                  setAiResult(null);
                  try {
                    const pair = mapSelectedToPair();
                    const marketSnapshot = {
                      symbol: selectedTokenData?.symbol,
                      name: selectedTokenData?.name,
                      price: currentPrice,
                      open: selectedTokenData?.open,
                      high: selectedTokenData?.high,
                      low: selectedTokenData?.low,
                      close: selectedTokenData?.close,
                      changePct: selectedTokenData?.change,
                      // newsSummaries: [] // TODO: integrate news feed
                    };
                    const res = await fetch('/api/agent', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({
                        userIntent: aiIntent,
                        budget: aiBudget,
                        baseSymbol: pair.baseSymbol,
                        quoteSymbol: pair.quoteSymbol,
                        timeframe: aiTimeframe,
                        riskTolerance: aiRisk,
                        marketSnapshot,
                      }),
                    });
                    const data = await res.json();
                    setAiResult(data);
                  } catch (e) {
                    setAiResult({ error: (e as any)?.message || 'Agent error' });
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading}
              >
                {aiLoading ? 'Running...' : 'Execute with AI'}
              </Button>
            </div>

            {aiResult && (
              <div className="mt-6 border-t pt-4 space-y-3">
                {aiResult.error && (
                  <div className="text-red-500 text-sm">{aiResult.error}</div>
                )}
                {!aiResult.error && (
                  <>
                    <div className="text-sm text-muted-foreground">Rationale</div>
                    <div className="p-3 bg-background rounded border border-crypto-border whitespace-pre-wrap text-sm">
                      {aiResult.rationale || 'No rationale returned'}
                    </div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                    <div className="space-y-2">
                      {(aiResult.executed || []).map((ex: any, idx: number) => (
                        <div key={`ex-${idx}`} className="p-3 bg-background rounded border border-crypto-border text-sm flex items-center justify-between">
                          <div>
                            <div className="font-medium">{ex.order.side} {ex.order.baseSymbol}/{ex.order.quoteSymbol}</div>
                            <div className="text-muted-foreground text-xs">Amount: {ex.order.amount} @ {ex.order.limitPrice} | Slippage: {ex.order.slippageBps ?? '-'} bps | Exp: {ex.order.expiry}</div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-medium text-green-500">{ex.status}</div>
                            {ex.txHash && <div className="text-muted-foreground">{ex.txHash.slice(0,10)}...</div>}
                          </div>
                        </div>
                      ))}
                      {(aiResult.failures || []).map((fx: any, idx: number) => (
                        <div key={`fx-${idx}`} className="p-3 bg-background rounded border border-crypto-border text-sm flex items-center justify-between">
                          <div>
                            <div className="font-medium">{fx.order.side} {fx.order.baseSymbol}/{fx.order.quoteSymbol}</div>
                            <div className="text-muted-foreground text-xs">Amount: {fx.order.amount} @ {fx.order.limitPrice}</div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-medium text-red-500">failed</div>
                            {fx.error && <div className="text-muted-foreground">{fx.error}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Page;