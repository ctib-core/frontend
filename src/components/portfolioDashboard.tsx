"use client"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChevronDown, Plus, Minus, Wallet, Zap } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { 
  fetchWalletBalances, 
  fetchPortfolioOverview,
  validateApiKey,
  initializeWallet,
  getWalletStatus,
  type TokenInfo
} from '@/lib/1inch';
import React from 'react';

const PortfolioDashboard = () => {
  // Check if API key is configured (client-side only)
  const [hasApiKey, setHasApiKey] = React.useState(false);
  
  React.useEffect(() => {
    setHasApiKey(validateApiKey());
  }, []);

  // Initialize wallet for 1inch data
  React.useEffect(() => {
    // Initialize with a demo wallet for testing
    initializeWallet('0x1234567890123456789012345678901234567890');
  }, []);

  // Get wallet status
  const walletStatus = getWalletStatus();

  // 1inch Data Queries
  const { data: balances = [] } = useQuery({
    queryKey: ['1inch-balances'],
    queryFn: () => fetchWalletBalances(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: portfolio } = useQuery({
    queryKey: ['1inch-portfolio'],
    queryFn: () => fetchPortfolioOverview(),
    enabled: walletStatus.isConnected && hasApiKey,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Sample data for charts (fallback)
  const lineChartData = [
    { time: "04:00", value: 24.2 },
    { time: "09:00", value: 24.5 },
    { time: "14:00", value: 24.8 },
    { time: "19:00", value: 24.3 },
    { time: "00:00", value: 24.7 },
  ];

  const volumeData = [
    { time: "04:00", volume: 28 },
    { time: "09:00", volume: 35 },
    { time: "14:00", volume: 42 },
    { time: "19:00", volume: 38 },
    { time: "00:00", volume: 32 },
  ];

  const getTokenByAddress = (address: string) => {
    return balances.find(t => t.address.toLowerCase() === address.toLowerCase());
  };

  const formatTokenAmount = (amount: string, decimals: number = 18): string => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toFixed(6);
  };

  return (
    <div className="w-full h-full">
      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <div className="flex items-center gap-2">
            <Badge variant={hasApiKey ? "default" : "secondary"}>
              {hasApiKey ? "✅ 1inch API Connected" : "❌ 1inch API Missing"}
            </Badge>
            {walletStatus.isConnected && (
              <Badge variant="outline">
                🦊 {walletStatus.formattedAddress}
              </Badge>
            )}
          </div>
        </div>

        {/* 1inch Portfolio Overview */}
        {portfolio && (
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">1inch Portfolio Overview</h3>
              <Badge variant="secondary">
                <Zap className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-bold">${portfolio.totalValue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">24h Change</div>
                <div className={`text-lg font-semibold ${portfolio.totalValueChangePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.totalValueChangePercent24h >= 0 ? '+' : ''}{portfolio.totalValueChangePercent24h.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Tokens</div>
                <div className="text-lg font-semibold">{portfolio.tokens.length}</div>
              </div>
            </div>
          </Card>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Value Locked */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">TOTAL VALUE LOCKED (TVL)</h3>
                <div className="flex space-x-2">
                  {["1D", "7D", "1M", "3M", "6M", "1Y", "ALL"].map((period) => (
                    <Button
                      key={period}
                      variant={period === "1D" ? "default" : "ghost"}
                      size="sm"
                      className="text-xs h-6 px-2"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">$24.7M</div>
              <div className="text-xs text-muted-foreground">29 Aug 2023</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Volume */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">VOLUME</h3>
                <div className="flex space-x-2">
                  {["1D", "7D", "1M", "3M", "6M", "1Y", "ALL"].map((period) => (
                    <Button
                      key={period}
                      variant={period === "1D" ? "default" : "ghost"}
                      size="sm"
                      className="text-xs h-6 px-2"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">$32.4M</div>
              <div className="text-xs text-muted-foreground">29 Aug 2023</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis hide />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* 1inch Wallet Balances */}
        {balances.length > 0 && (
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">1inch Wallet Balances</h3>
              <Badge variant="secondary">
                <Wallet className="w-3 h-3 mr-1" />
                Live Balances
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {balances.slice(0, 6).map((balance) => {
                const token = getTokenByAddress(balance.address);
                return (
                  <div key={balance.address} className="flex items-center justify-between p-4 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                      <div>
                        <div className="font-medium">{token?.symbol || balance.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token?.name || balance.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatTokenAmount(balance.balance, 18)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${balance.value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Farm Pools Section */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">ALL POOLS</Button>
                <Button variant="default" size="sm">FARM</Button>
                <Button variant="ghost" size="sm">OPTIONS</Button>
                <Button variant="ghost" size="sm">COLLATERAL</Button>
                <Button variant="ghost" size="sm">VAULT</Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">4/16 Farm Pools</span>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                ADD POOL
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-background border-crypto-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
                  <span className="font-semibold text-foreground">Curve</span>
                  <Badge variant="secondary" className="text-xs">Farm Pool</Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-foreground">sETH 2 to ETH</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">APR 10%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Become a liquidity provider to allow instantaneous swaps between sETH ETH
                  StakeWise users
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                CHECK GUIDE
              </Button>
            </Card>

            <Card className="bg-background border-crypto-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                  <span className="font-semibold text-foreground">Moonbeam</span>
                  <Badge variant="secondary" className="text-xs">Farm Pool</Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-foreground">ETH to DAI</h4>
                <p className="text-xs text-muted-foreground">
                  Become a liquidity provider to allow instantaneous swaps between ETH DAI
                  StakeWise users
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                CHECK GUIDE
              </Button>
            </Card>
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-crypto-card border-l border-crypto-border p-6 space-y-6 hidden">
        {/* Token Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded-full"></div>
              <span className="font-semibold text-foreground">ETH</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <span className="font-semibold text-foreground">USDC</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Commission */}
        <div className="">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Commission</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.01%</div>
              <div className="text-xs text-muted-foreground">0% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.05%</div>
              <div className="text-xs text-muted-foreground">56% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">0.3%</div>
              <div className="text-xs text-muted-foreground">42% select</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">1%</div>
              <div className="text-xs text-muted-foreground">2% select</div>
            </div>
          </div>
        </div>

        {/* Price Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Low price</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-lg font-semibold text-foreground">1644.2381</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">High price</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="text-lg font-semibold text-foreground">1654.1327</div>
          </div>
        </div>

        {/* Add Liquidity Button */}
        <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
          ADD LIQUIDITY
        </Button>
      </div>
    </div>
  );
};

export { PortfolioDashboard };