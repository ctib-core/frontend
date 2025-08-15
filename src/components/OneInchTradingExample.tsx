/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  fetch1inchQuote, 
  getPopularTokens, 
  createLimitOrder,
  fetchPortfolioOverview,
  fetchWalletBalances,
  validateApiKey,
  initializeWallet,
  getWalletStatus,
  type TokenInfo,
  type QuoteResponse,
  type LimitOrder
} from '@/lib/1inch';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus } from 'lucide-react';

interface OneInchTradingExampleProps {
  walletAddress?: string;
}

export const OneInchTradingExample: React.FC<OneInchTradingExampleProps> = ({ 
  walletAddress 
}) => {
  const [selectedFromToken, setSelectedFromToken] = useState<string>('');
  const [selectedToToken, setSelectedToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');

  // Check if API key is configured (client-side only)
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    setHasApiKey(validateApiKey());
  }, []);

  // Initialize wallet if address is provided
  useEffect(() => {
    if (walletAddress) {
      initializeWallet(walletAddress);
    }
  }, [walletAddress]);

  // Get wallet status
  const walletStatus = getWalletStatus();

  // Fetch popular tokens
  const { data: tokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['1inch-tokens'],
    queryFn: getPopularTokens,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch portfolio data
  const { data: portfolio } = useQuery({
    queryKey: ['1inch-portfolio'],
    queryFn: () => fetchPortfolioOverview(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Fetch wallet balances
  const { data: balances = [] } = useQuery({
    queryKey: ['1inch-balances'],
    queryFn: () => fetchWalletBalances(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Set default tokens when tokens are loaded
  useEffect(() => {
    if (tokens.length > 0 && !selectedFromToken) {
      const usdc = tokens.find(t => t.symbol === 'USDC');
      const weth = tokens.find(t => t.symbol === 'WETH');
      if (usdc) setSelectedFromToken(usdc.address);
      if (weth) setSelectedToToken(weth.address);
    }
  }, [tokens, selectedFromToken]);

  // Fetch quote when parameters change
  const fetchQuote = useCallback(async () => {
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
  }, [selectedFromToken, selectedToToken, amount]);

  // Auto-fetch quote when parameters change
  useEffect(() => {
    if (selectedFromToken && selectedToToken && amount) {
      const timeoutId = setTimeout(fetchQuote, 500); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [selectedFromToken, selectedToToken, amount, fetchQuote]);

  // Create limit order
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

  const getTokenByAddress = (address: string): TokenInfo | undefined => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  const formatTokenAmount = (amount: string, decimals: number = 18): string => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toFixed(6);
  };

  return (
    <div className="space-y-6">
      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            1inch Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={hasApiKey ? "default" : "secondary"}>
              {hasApiKey ? "✅ API Key Configured" : "❌ API Key Missing"}
            </Badge>
            {!hasApiKey && (
              <span className="text-sm text-muted-foreground">
                Set NEXT_1INCH_API in your .env.local file
              </span>
            )}
          </div>
          {walletStatus.isConnected && (
            <div className="mt-2">
              <Badge variant="outline">
                🦊 Wallet: {walletStatus.formattedAddress}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${portfolio.totalValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Change</p>
                <p className={`text-lg ${portfolio.totalValueChangePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.totalValueChangePercent24h >= 0 ? '+' : ''}{portfolio.totalValueChangePercent24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Interface */}
      <Card>
        <CardHeader>
          <CardTitle>1inch Trading Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From Token</label>
              <Select value={selectedFromToken} onValueChange={setSelectedFromToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokensLoading ? (
                    <SelectItem value="loading" disabled>Loading tokens...</SelectItem>
                  ) : (
                    tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                          <span className="text-muted-foreground">({token.name})</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">To Token</label>
              <Select value={selectedToToken} onValueChange={setSelectedToToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokensLoading ? (
                    <SelectItem value="loading" disabled>Loading tokens...</SelectItem>
                  ) : (
                    tokens.map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                          <span className="text-muted-foreground">({token.name})</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Order Type */}
          <div>
            <label className="text-sm font-medium">Order Type</label>
            <Select value={orderType} onValueChange={(value: 'market' | 'limit') => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limit Price (for limit orders) */}
          {orderType === 'limit' && (
            <div>
              <label className="text-sm font-medium">Limit Price</label>
              <Input
                type="number"
                placeholder="Enter limit price"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            </div>
          )}

          {/* Quote Display */}
          {quote && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rate:</span>
                    <span className="font-medium">
                      1 {getTokenByAddress(selectedFromToken)?.symbol} = {formatTokenAmount(quote.toTokenAmount)} {getTokenByAddress(selectedToToken)?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{`You'll receive:`}</span>
                    <span className="font-medium">
                      {formatTokenAmount(quote.toTokenAmount)} {getTokenByAddress(selectedToToken)?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gas Cost:</span>
                    <span className="font-medium">
                      {formatTokenAmount(quote.gasCost)} ETH
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={fetchQuote} 
              disabled={!selectedFromToken || !selectedToToken || !amount || isLoadingQuote}
              className="flex-1"
            >
              {isLoadingQuote ? 'Loading...' : 'Get Quote'}
            </Button>
            
            {orderType === 'limit' && quote && (
              <Button 
                onClick={handleCreateLimitOrder}
                disabled={!walletStatus.isConnected}
                variant="outline"
                className="flex-1"
              >
                Create Limit Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Balances */}
      {balances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balances</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OneInchTradingExample;
