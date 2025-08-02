"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Send, Download, Upload, Copy, Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// Mock wallet data
const WALLET_BALANCES = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, balance: 0.245, value: 11250.50, change: 2.5, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ETH', name: 'Ethereum', icon: TrendingUp, balance: 2.15, value: 6450.75, change: -1.2, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { symbol: 'USDC', name: 'USD Coin', icon: DollarSign, balance: 5000.00, value: 5000.00, change: 0.0, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { symbol: 'SOL', name: 'Solana', icon: TrendingDown, balance: 15.5, value: 1550.00, change: 5.8, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' }
];

const RECENT_TRANSACTIONS = [
  { id: '1', type: 'received', symbol: 'BTC', amount: 0.05, value: 2250.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', status: 'confirmed', time: '2 hours ago' },
  { id: '2', type: 'sent', symbol: 'ETH', amount: 0.5, value: 1500.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', status: 'confirmed', time: '1 day ago' },
  { id: '3', type: 'received', symbol: 'USDC', amount: 1000.00, value: 1000.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', status: 'pending', time: '3 days ago' },
  { id: '4', type: 'sent', symbol: 'SOL', amount: 2.5, value: 250.00, from: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', to: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', status: 'confirmed', time: '1 week ago' }
];

const Page = () => {
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(null);
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [showReceiveModal, setShowReceiveModal] = React.useState(false);

  const totalValue = WALLET_BALANCES.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = WALLET_BALANCES.reduce((sum, asset) => sum + (asset.value * asset.change / 100), 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Hide Balances
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Balance</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Connected</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
              <div className={`text-sm ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (24h)
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setShowSendModal(true)} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" onClick={() => setShowReceiveModal(true)} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Receive
              </Button>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Wallet Address</div>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-background px-2 py-1 rounded">
                  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Assets</h3>
            <div className="space-y-3">
              {WALLET_BALANCES.map((asset) => {
                const Icon = asset.icon;
                return (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-8 h-8" />
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${asset.value.toLocaleString()}</div>
                      <div className={`text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {RECENT_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'received' ? <ArrowUpDown className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{tx.type}</div>
                      <div className="text-sm text-muted-foreground">{tx.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${tx.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">${tx.value.toLocaleString()}</div>
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                <div>
                  <div className="font-medium">Backup Wallet</div>
                  <div className="text-sm text-muted-foreground">Download your wallet backup</div>
                </div>
                <Button variant="outline" size="sm">Backup</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                <div>
                  <div className="font-medium">Private Key</div>
                  <div className="text-sm text-muted-foreground">View your private key</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {showPrivateKey && (
                <div className="p-3 bg-background rounded-lg border border-crypto-border">
                  <div className="text-sm text-muted-foreground mb-2">Private Key (Keep this secret!)</div>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-background px-2 py-1 rounded flex-1">
                      xprv9s21ZrQH143K3QTDL4LXw2F7HEq3Cpwq7qYbcpP6i8i2g1DAnQRKxKiLmnd56eGYWjrgYk5cTKSYjG1c3kZMnW3rdpkSj5Uvu6NeaEQ1e
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard('xprv9s21ZrQH143K3QTDL4LXw2F7HEq3Cpwq7qYbcpP6i8i2g1DAnQRKxKiLmnd56eGYWjrgYk5cTKSYjG1c3kZMnW3rdpkSj5Uvu6NeaEQ1e')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page; 