/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, ArrowRight, Settings, BarChart3, Clock } from 'lucide-react'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Mock token data
const TOKENS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, price: 45000, change: 2.5, balance: 0.245 },
  { symbol: 'ETH', name: 'Ethereum', icon: TrendingUp, price: 3000, change: -1.2, balance: 2.15 },
  { symbol: 'USDC', name: 'USD Coin', icon: DollarSign, price: 1.00, change: 0.0, balance: 5000.00 },
  { symbol: 'SOL', name: 'Solana', icon: TrendingDown, price: 100, change: 5.8, balance: 15.5 },
  { symbol: 'PUL', name: 'Pulley', icon: TrendingUp, price: 0.004, change: 0.0, balance: 10000.00 }
];

const SWAP_HISTORY = [
  { id: '1', fromToken: 'BTC', toToken: 'ETH', fromAmount: 0.05, toAmount: 0.75, rate: 0.015, status: 'completed', time: '2 hours ago', txHash: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { id: '2', fromToken: 'ETH', toToken: 'USDC', fromAmount: 1.5, toAmount: 4500, rate: 3000, status: 'completed', time: '1 day ago', txHash: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { id: '3', fromToken: 'USDC', toToken: 'SOL', fromAmount: 1000, toAmount: 10, rate: 0.01, status: 'pending', time: '3 days ago', txHash: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' }
];

const SwapContent = () => {
  const searchParams = useSearchParams();
  
  // Initialize state from URL parameters if they exist
  const [fromToken, setFromToken] = React.useState(() => {
    const from = searchParams.get('from');
    return from && TOKENS.find(t => t.symbol === from) ? from : 'BTC';
  });
  
  const [toToken, setToToken] = React.useState(() => {
    const to = searchParams.get('to');
    return to && TOKENS.find(t => t.symbol === to) ? to : 'ETH';
  });
  
  const [fromAmount, setFromAmount] = React.useState(() => {
    const amount = searchParams.get('amount');
    return amount || '';
  });
  
  const [toAmount, setToAmount] = React.useState('');
  const [slippage, setSlippage] = React.useState(0.5);
  const [showSettings, setShowSettings] = React.useState(false);

  const fromTokenData = TOKENS.find(token => token.symbol === fromToken);
  const toTokenData = TOKENS.find(token => token.symbol === toToken);

  // Calculate swap rate
  const swapRate = fromTokenData && toTokenData ? toTokenData.price / fromTokenData.price : 0;

  // Calculate output amount
  React.useEffect(() => {
    if (fromAmount && fromTokenData && toTokenData) {
      const calculatedAmount = parseFloat(fromAmount) * swapRate;
      setToAmount(calculatedAmount.toFixed(6));
    }
  }, [fromAmount, fromTokenData, toTokenData, swapRate]);

  // Handle URL parameter changes
  React.useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const amount = searchParams.get('amount');
    
    if (from && TOKENS.find(t => t.symbol === from)) {
      setFromToken(from);
    }
    if (to && TOKENS.find(t => t.symbol === to)) {
      setToToken(to);
    }
    if (amount) {
      setFromAmount(amount);
    }
  }, [searchParams]);

  const handleSwap = () => {
    if (!fromAmount || !toAmount) return;
    
    // Mock swap execution
    console.log(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
    
    // Reset form
    setFromAmount('');
    setToAmount('');
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Swap</h1>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Pre-filled swap info banner */}
        {searchParams.get('from') && searchParams.get('amount') && (
          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">Pre-filled Swap</div>
                  <div className="text-sm text-blue-700">
                    Ready to swap {searchParams.get('amount')} {searchParams.get('from')} for {toToken}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFromAmount('');
                  setToAmount('');
                }}
              >
                Clear
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Swap Interface */}
          <Card className="bg-crypto-card border-crypto-border p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Swap Tokens</h3>
            
            {/* From Token */}
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">From</label>
                  <div className="text-sm text-muted-foreground">
                    Balance: {fromTokenData?.balance} {fromToken}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {fromTokenData && React.createElement(fromTokenData.icon, { className: "w-6 h-6" })}
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className="bg-transparent border-none text-lg font-medium focus:outline-none"
                    >
                      {TOKENS.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent border-none text-right text-lg font-medium focus:outline-none"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${fromAmount && fromTokenData ? (parseFloat(fromAmount) * fromTokenData.price).toFixed(2) : '0.00'}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={switchTokens}
                  className="w-10 h-10 rounded-full"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">To</label>
                  <div className="text-sm text-muted-foreground">
                    Balance: {toTokenData?.balance} {toToken}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {toTokenData && React.createElement(toTokenData.icon, { className: "w-6 h-6" })}
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className="bg-transparent border-none text-lg font-medium focus:outline-none"
                    >
                      {TOKENS.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1 bg-transparent border-none text-right text-lg font-medium focus:outline-none"
                    readOnly
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ ${toAmount && toTokenData ? (parseFloat(toAmount) * toTokenData.price).toFixed(2) : '0.00'}
                </div>
              </div>

              {/* Swap Details */}
              {fromAmount && toAmount && (
                <div className="p-4 bg-background rounded-lg border border-crypto-border">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span>1 {fromToken} = {swapRate.toFixed(6)} {toToken}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Slippage</span>
                      <span>{slippage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span>~$5.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleSwap}
                disabled={!fromAmount || !toAmount}
              >
                Swap {fromToken} for {toToken}
              </Button>
            </div>
          </Card>

          {/* Token List & Settings */}
          <div className="space-y-6">
            {/* Popular Tokens */}
            <Card className="bg-crypto-card border-crypto-border p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Tokens</h3>
              <div className="space-y-3">
                {TOKENS.map((token) => {
                  const Icon = token.icon;
                  return (
                    <div key={token.symbol} className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6" />
                        <div>
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
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Settings */}
            {showSettings && (
              <Card className="bg-crypto-card border-crypto-border p-6">
                <h3 className="text-lg font-semibold mb-4">Swap Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Slippage Tolerance</label>
                    <div className="flex space-x-2">
                      {[0.1, 0.5, 1.0].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Slippage</label>
                    <input
                      type="number"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value))}
                      step="0.1"
                      min="0.1"
                      max="50"
                      className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Swap History */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
          <div className="space-y-3">
            {SWAP_HISTORY.map((swap) => (
              <div key={swap.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {swap.fromAmount} {swap.fromToken} → {swap.toAmount} {swap.toToken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rate: 1 {swap.fromToken} = {swap.rate} {swap.toToken}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{swap.time}</div>
                  <Badge variant={swap.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {swap.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Price Chart Placeholder */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
          <div className="h-64 bg-background rounded-lg border border-crypto-border flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Price chart coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwapContent />
    </Suspense>
  );
};

export default Page; 