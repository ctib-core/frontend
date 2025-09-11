"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TradingPair {
  id: string;
  name: string;
  price: number;
  change24h: number;
}

const mockTradingPairs: TradingPair[] = [
  { id: 'btc-usd', name: 'BTC/USD', price: 45000, change24h: 2.5 },
  { id: 'eth-usd', name: 'ETH/USD', price: 2800, change24h: -1.2 },
  { id: 'sol-usd', name: 'SOL/USD', price: 95, change24h: 5.8 },
];

export function SimpleTrading() {
  const [selectedPair, setSelectedPair] = useState<TradingPair>(mockTradingPairs[0]);
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    
    // Simulate trade execution
    setTimeout(() => {
      console.log(`${orderType.toUpperCase()} ${amount} ${selectedPair.name}`);
      setIsLoading(false);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simple Trading</CardTitle>
          <CardDescription>
            Trade cryptocurrencies with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trading Pair Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Pair</label>
            <div className="grid grid-cols-3 gap-2">
              {mockTradingPairs.map((pair) => (
                <Button
                  key={pair.id}
                  variant={selectedPair.id === pair.id ? 'default' : 'outline'}
                  onClick={() => setSelectedPair(pair)}
                  className="text-xs"
                >
                  {pair.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-lg font-bold">
              ${selectedPair.price.toLocaleString()}
            </span>
            <span className={`text-sm ${selectedPair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {selectedPair.change24h >= 0 ? '+' : ''}{selectedPair.change24h}%
            </span>
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Order Type</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderType === 'buy' ? 'default' : 'outline'}
                onClick={() => setOrderType('buy')}
                className={orderType === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Buy
              </Button>
              <Button
                variant={orderType === 'sell' ? 'default' : 'outline'}
                onClick={() => setOrderType('sell')}
                className={orderType === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Sell
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (USD)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Execute Trade */}
          <Button
            onClick={handleTrade}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            {isLoading ? 'Processing...' : `${orderType.toUpperCase()} ${selectedPair.name}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
