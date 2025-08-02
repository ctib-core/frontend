"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Droplets, BarChart3, Target, Activity } from 'lucide-react'
import React from 'react'

// Mock liquidity pool data
const AVAILABLE_POOLS = [
  { id: '1', name: 'BTC-USDC Pool', pair: 'BTC/USDC', tvl: 5000000, volume24h: 2500000, apy: 15.5, fee: 0.3, liquidity: 2500000, status: 'active', risk: 'medium' },
  { id: '2', name: 'ETH-USDT Pool', pair: 'ETH/USDT', tvl: 3200000, volume24h: 1800000, apy: 12.8, fee: 0.3, liquidity: 1600000, status: 'active', risk: 'low' },
  { id: '3', name: 'SOL-USDC Pool', pair: 'SOL/USDC', tvl: 1200000, volume24h: 800000, apy: 22.3, fee: 0.5, liquidity: 600000, status: 'active', risk: 'high' },
  { id: '4', name: 'USDC-USDT Pool', pair: 'USDC/USDT', tvl: 8000000, volume24h: 5000000, apy: 8.2, fee: 0.1, liquidity: 4000000, status: 'active', risk: 'low' }
];

const USER_POSITIONS = [
  { id: '1', name: 'BTC-USDC Pool', pair: 'BTC/USDC', deposited: 5000, currentValue: 5250, earned: 250, apy: 15.5, status: 'active', startDate: '2024-01-01', impermanentLoss: -0.5 },
  { id: '2', name: 'ETH-USDT Pool', pair: 'ETH/USDT', deposited: 3000, currentValue: 3150, earned: 150, apy: 12.8, status: 'active', startDate: '2024-01-10', impermanentLoss: 0.2 }
];

const POOL_HISTORY = [
  { id: '1', name: 'SOL-USDC Pool', pair: 'SOL/USDC', deposited: 2000, withdrawn: 2000, earned: 446, apy: 22.3, status: 'completed', startDate: '2023-10-01', endDate: '2023-12-01', impermanentLoss: -1.2 },
  { id: '2', name: 'USDC-USDT Pool', pair: 'USDC/USDT', deposited: 10000, withdrawn: 10000, earned: 820, apy: 8.2, status: 'completed', startDate: '2023-08-15', endDate: '2023-11-15', impermanentLoss: 0.0 }
];

const Page = () => {
  const [selectedPool, setSelectedPool] = React.useState<string | null>(null);
  const [showAddLiquidityModal, setShowAddLiquidityModal] = React.useState(false);
  const [showRemoveLiquidityModal, setShowRemoveLiquidityModal] = React.useState(false);

  const totalDeposited = USER_POSITIONS.reduce((sum, position) => sum + position.deposited, 0);
  const totalEarned = USER_POSITIONS.reduce((sum, position) => sum + position.earned, 0);
  const totalValue = USER_POSITIONS.reduce((sum, position) => sum + position.currentValue, 0);
  const averageApy = USER_POSITIONS.reduce((sum, position) => sum + position.apy, 0) / USER_POSITIONS.length;

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Liquidity Pools</h1>
          <Button onClick={() => setShowAddLiquidityModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Liquidity
          </Button>
        </div>

        {/* Pool Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Deposited</h3>
              <Droplets className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalDeposited.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active positions</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Current Value</h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Including gains</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Earned</h3>
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Fees earned</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Average APY</h3>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{averageApy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Weighted average</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Pools */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Available Pools</h3>
            <div className="space-y-3">
              {AVAILABLE_POOLS.map((pool) => (
                <div key={pool.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{pool.name}</div>
                      <div className="text-sm text-muted-foreground">{pool.pair}</div>
                    </div>
                    <Badge variant={pool.risk === 'low' ? 'default' : pool.risk === 'medium' ? 'secondary' : 'destructive'}>
                      {pool.risk} risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">APY</div>
                      <div className="font-medium text-green-500">{pool.apy}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">TVL</div>
                      <div className="font-medium">${(pool.tvl / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Fee</div>
                      <div className="font-medium">{pool.fee}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Volume 24h</div>
                      <div className="font-medium">${(pool.volume24h / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setShowAddLiquidityModal(true)}>
                    <Droplets className="w-4 h-4 mr-2" />
                    Add Liquidity
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* User Positions */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">My Positions</h3>
            {USER_POSITIONS.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active positions
              </div>
            ) : (
              <div className="space-y-3">
                {USER_POSITIONS.map((position) => (
                  <div key={position.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{position.name}</div>
                        <div className="text-sm text-muted-foreground">{position.pair}</div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Deposited</div>
                        <div className="font-medium">${position.deposited.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="font-medium">${position.currentValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Earned</div>
                        <div className="font-medium text-green-500">${position.earned}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">IL</div>
                        <div className={`font-medium ${position.impermanentLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {position.impermanentLoss >= 0 ? '+' : ''}{position.impermanentLoss}%
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Minus className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Pool History */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Position History</h3>
          <div className="space-y-3">
            {POOL_HISTORY.map((position) => (
              <div key={position.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{position.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.startDate} - {position.endDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${position.deposited.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Earned: ${position.earned} | IL: {position.impermanentLoss}%
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {position.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pool Analytics */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Pool Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token A Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Token B Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pool Selection</label>
                <select className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>BTC-USDC Pool (15.5% APY)</option>
                  <option>ETH-USDT Pool (12.8% APY)</option>
                  <option>SOL-USDC Pool (22.3% APY)</option>
                  <option>USDC-USDT Pool (8.2% APY)</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <h4 className="font-medium mb-2">Liquidity Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pool Share:</span>
                    <span className="font-medium">0.05%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">LP Tokens:</span>
                    <span className="font-medium">1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Fees:</span>
                    <span className="font-medium">$12.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual APY:</span>
                    <span className="font-medium text-green-500">15.5%</span>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Droplets className="w-4 h-4 mr-2" />
                Add Liquidity
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 