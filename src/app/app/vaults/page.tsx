"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Lock, Unlock, Zap, Target, BarChart3 } from 'lucide-react'
import React from 'react'

// Mock vault data
const AVAILABLE_VAULTS = [
  { id: '1', name: 'BTC-USDC Vault', pair: 'BTC/USDC', tvl: 2500000, apy: 12.5, risk: 'low', status: 'active', minDeposit: 100, maxDeposit: 100000, strategy: 'Automated Market Making' },
  { id: '2', name: 'ETH-USDT Vault', pair: 'ETH/USDT', tvl: 1800000, apy: 15.2, risk: 'medium', status: 'active', minDeposit: 500, maxDeposit: 50000, strategy: 'Yield Farming' },
  { id: '3', name: 'SOL-USDC Vault', pair: 'SOL/USDC', tvl: 800000, apy: 18.7, risk: 'high', status: 'active', minDeposit: 200, maxDeposit: 25000, strategy: 'Liquidity Mining' },
  { id: '4', name: 'Stablecoin Vault', pair: 'USDC/USDT', tvl: 5000000, apy: 8.3, risk: 'low', status: 'active', minDeposit: 1000, maxDeposit: 1000000, strategy: 'Stable Yield' }
];

const USER_VAULTS = [
  { id: '1', name: 'BTC-USDC Vault', pair: 'BTC/USDC', deposited: 5000, earned: 625, apy: 12.5, status: 'active', startDate: '2024-01-01', lastHarvest: '2024-01-15', nextHarvest: '2024-01-22' },
  { id: '2', name: 'ETH-USDT Vault', pair: 'ETH/USDT', deposited: 3000, earned: 456, apy: 15.2, status: 'active', startDate: '2024-01-10', lastHarvest: '2024-01-15', nextHarvest: '2024-01-20' }
];

const VAULT_HISTORY = [
  { id: '1', name: 'SOL-USDC Vault', pair: 'SOL/USDC', deposited: 2000, withdrawn: 2000, earned: 374, apy: 18.7, status: 'completed', startDate: '2023-10-01', endDate: '2023-12-01' },
  { id: '2', name: 'Stablecoin Vault', pair: 'USDC/USDT', deposited: 10000, withdrawn: 10000, earned: 830, apy: 8.3, status: 'completed', startDate: '2023-08-15', endDate: '2023-11-15' }
];

const Page = () => {
  const [selectedVault, setSelectedVault] = React.useState<string | null>(null);
  const [showDepositModal, setShowDepositModal] = React.useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);

  const totalDeposited = USER_VAULTS.reduce((sum, vault) => sum + vault.deposited, 0);
  const totalEarned = USER_VAULTS.reduce((sum, vault) => sum + vault.earned, 0);
  const averageApy = USER_VAULTS.reduce((sum, vault) => sum + vault.apy, 0) / USER_VAULTS.length;

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Vaults</h1>
          <Button onClick={() => setShowDepositModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        </div>

        {/* Vault Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Deposited</h3>
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalDeposited.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Active deposits</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Earned</h3>
              <Zap className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">${totalEarned.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Yield earned</div>
          </Card>

          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Average APY</h3>
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{averageApy.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Weighted average</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Vaults */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Available Vaults</h3>
            <div className="space-y-3">
              {AVAILABLE_VAULTS.map((vault) => (
                <div key={vault.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{vault.name}</div>
                      <div className="text-sm text-muted-foreground">{vault.pair}</div>
                    </div>
                    <Badge variant={vault.risk === 'low' ? 'default' : vault.risk === 'medium' ? 'secondary' : 'destructive'}>
                      {vault.risk} risk
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">APY</div>
                      <div className="font-medium text-green-500">{vault.apy}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">TVL</div>
                      <div className="font-medium">${(vault.tvl / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Min Deposit</div>
                      <div className="font-medium">${vault.minDeposit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Strategy</div>
                      <div className="font-medium text-xs">{vault.strategy}</div>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setShowDepositModal(true)}>
                    <Lock className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* User Vaults */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">My Vaults</h3>
            {USER_VAULTS.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No active vaults
              </div>
            ) : (
              <div className="space-y-3">
                {USER_VAULTS.map((vault) => (
                  <div key={vault.id} className="p-4 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{vault.name}</div>
                        <div className="text-sm text-muted-foreground">{vault.pair}</div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Deposited</div>
                        <div className="font-medium">${vault.deposited.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Earned</div>
                        <div className="font-medium text-green-500">${vault.earned}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">APY</div>
                        <div className="font-medium">{vault.apy}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Next Harvest</div>
                        <div className="font-medium">{vault.nextHarvest}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Zap className="w-4 h-4 mr-1" />
                        Harvest
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Unlock className="w-4 h-4 mr-1" />
                        Withdraw
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Vault History */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Vault History</h3>
          <div className="space-y-3">
            {VAULT_HISTORY.map((vault) => (
              <div key={vault.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{vault.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {vault.startDate} - {vault.endDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${vault.deposited.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    Earned: ${vault.earned}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {vault.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Vault Analytics */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Vault Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deposit Amount</label>
                <input
                  type="number"
                  placeholder="Enter deposit amount"
                  className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vault Selection</label>
                <select className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>BTC-USDC Vault (12.5% APY)</option>
                  <option>ETH-USDT Vault (15.2% APY)</option>
                  <option>SOL-USDC Vault (18.7% APY)</option>
                  <option>Stablecoin Vault (8.3% APY)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lock Period</label>
                <select className="w-full px-3 py-2 bg-background border border-crypto-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>180 days</option>
                  <option>365 days</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <h4 className="font-medium mb-2">Yield Projection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Initial Deposit:</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">APY:</span>
                    <span className="font-medium text-green-500">12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">30-day Yield:</span>
                    <span className="font-medium">$102.74</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">1-year Yield:</span>
                    <span className="font-medium">$1,250.00</span>
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Deposit to Vault
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 