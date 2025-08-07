"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X } from 'lucide-react'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import TradingViewChart from '@/components/TradingViewChart'

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
  const [selectedToken, setSelectedToken] = React.useState('BTCUSD');
  const [tradeType, setTradeType] = React.useState<'buy' | 'sell'>('buy');
  const [lotSize, setLotSize] = React.useState(0.01);
  const [takeProfit, setTakeProfit] = React.useState('');
  const [stopLoss, setStopLoss] = React.useState('');
  const [selectedRatio, setSelectedRatio] = React.useState<number | null>(null);
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);

  const { data: tradingTokens = [] } = useQuery({
    queryKey: ['trading-tokens'],
    queryFn: fetchTradingTokens,
    staleTime: 5 * 1000, // 5 seconds for real-time updates
    retry: 2,
    retryDelay: 5000,
  });

  const selectedTokenData = tradingTokens.find(token => token.symbol === selectedToken);
  const currentPrice = selectedTokenData?.price || 0;

  // Update TP/SL when token changes
  React.useEffect(() => {
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

  // Simulate live price updates
  React.useEffect(() => {
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

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Trading</h1>
        </div>

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
                <div className="text-right">
                  <div className="text-2xl font-bold">${selectedTokenData?.price.toLocaleString()}</div>
                  <div className={`text-sm ${selectedTokenData?.change && selectedTokenData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedTokenData?.change && selectedTokenData.change >= 0 ? '+' : ''}{selectedTokenData?.change}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* TradingView Chart - Increased height by 30% */}
            <div className="h-83 bg-background rounded-lg border border-crypto-border overflow-hidden">
              <TradingViewChart 
                symbol={selectedTokenData?.tradingViewSymbol || 'BTCUSDT'} 
                height={332} // Increased from 256 by 30%
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

        {/* Open Positions */}
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
      </div>
    </div>
  );
};

export default Page;