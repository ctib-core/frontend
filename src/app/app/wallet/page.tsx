"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Send, Download, Upload, Copy, Eye, EyeOff, Wallet, Coins, ArrowLeft, ArrowRight, Zap, BarChart3 } from 'lucide-react'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { readContract, writeContract } from '@wagmi/core'
import { useWriteContract } from 'wagmi'
import { controller_abi, controller_addr, core_addr, gateway_abi, gateway_addr } from '@/utils/web3'
import { useAccount } from '@particle-network/connectkit'

// Mock wallet data
const WALLET_BALANCES = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, balance: 0.245, value: 11250.50, change: 2.5, address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { symbol: 'ETH', name: 'Ethereum', icon: TrendingUp, balance: 2.15, value: 6450.75, change: -1.2, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { symbol: 'USDC', name: 'USD Coin', icon: DollarSign, balance: 5000.00, value: 5000.00, change: 0.0, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' },
  { symbol: 'SOL', name: 'Solana', icon: TrendingDown, balance: 15.5, value: 1550.00, change: 5.8, address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' },
  { symbol: 'PUL', name: 'Pulley', icon: TrendingUp, balance: 10000.00, value: 40.00, change: 0.0, address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' }
];

// Mock trading pool and liquidity data
const TRADING_POOL_DATA = {
  deposited: 5000.00,
  yield: 125.50,
  apy: 8.5
};

const PULLEY_LIQUIDITY_DATA = {
  deposited: 2500.00,
  yield: 45.75,
  apy: 12.2
};

// Supported tokens for trading pool
const SUPPORTED_TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', icon: DollarSign, balance: 5000.00 },
  { symbol: 'ETH', name: 'Ethereum', icon: TrendingUp, balance: 2.15 },
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin, balance: 0.245 }
];

const RECENT_TRANSACTIONS = [
  { id: '1', type: 'received', symbol: 'BTC', amount: 0.05, value: 2250.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', status: 'confirmed', time: '2 hours ago' },
  { id: '2', type: 'sent', symbol: 'ETH', amount: 0.5, value: 1500.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', status: 'confirmed', time: '1 day ago' },
  { id: '3', type: 'received', symbol: 'USDC', amount: 1000.00, value: 1000.00, from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', status: 'pending', time: '3 days ago' },
  { id: '4', type: 'sent', symbol: 'SOL', amount: 2.5, value: 250.00, from: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', to: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', status: 'confirmed', time: '1 week ago' }
];

// Types for the deposit/withdraw functionality
type DepositAction = 'buy-pulley' | 'deposit-pool';
type WithdrawAction = 'withdraw-pool' | 'withdraw-liquidity';
type CardView = 'options' | 'form';

const Page = () => {
  const router = useRouter();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  console.log(address)


  async function buyPulleyTokens() {

    await writeContract(
      {
        abi: gateway_abi,
        address: gateway_addr,
        functionName: "buyPulleyTokens",
        account: address as `0x${string}`,
        args: [core_addr, depositAmount]
      }
    )
  }


  async function depositToTradingPool() {

    await writeContract(
      {
        abi: gateway_abi,
        address: gateway_addr,
        functionName: "depositToTradingPool",
        args: [core_addr, depositAmount],
        account: address as `0x${string}`,
      }
    )
  }

  // integration 

  // New state for deposit/withdraw functionality
  const [showDepositCard, setShowDepositCard] = useState(false);
  const [showWithdrawCard, setShowWithdrawCard] = useState(false);
  const [depositAction, setDepositAction] = useState<DepositAction | null>(null);
  const [withdrawAction, setWithdrawAction] = useState<WithdrawAction | null>(null);
  const [depositCardView, setDepositCardView] = useState<CardView>('options');
  const [withdrawCardView, setWithdrawCardView] = useState<CardView>('options');

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Success and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const totalValue = WALLET_BALANCES.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = WALLET_BALANCES.reduce((sum, asset) => sum + (asset.value * asset.change / 100), 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Handle deposit actions
  const handleDepositAction = (action: DepositAction) => {
    setDepositAction(action);
    setDepositCardView('form');
  };

  // Handle withdraw actions
  const handleWithdrawAction = (action: WithdrawAction) => {
    setWithdrawAction(action);
    setWithdrawCardView('form');
  };

  // Handle buy pulley tokens
  const handleBuyPulley = async () => {
    if (!depositAmount) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Buying ${depositAmount} PUL tokens`);

      setSuccessMessage(`Successfully bought ${depositAmount} PUL tokens!`);
      setShowSuccess(true);


      // start contract deposit. 
      buyPulleyTokens();

      // Reset form after delay
      setTimeout(() => {
        setDepositAmount('');
        setDepositCardView('options');
        setShowDepositCard(false);
        setShowSuccess(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error buying PUL tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit to trading pool
  const handleDepositToPool = async () => {
    if (!depositAmount || !selectedToken) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Depositing ${depositAmount} ${selectedToken} to trading pool`);

      setSuccessMessage(`Successfully deposited ${depositAmount} ${selectedToken} to trading pool!`);
      setShowSuccess(true);

      // deposit
      depositToTradingPool()

      // Reset form after delay
      setTimeout(() => {
        setDepositAmount('');
        setSelectedToken('USDC');
        setDepositCardView('options');
        setShowDepositCard(false);
        setShowSuccess(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error depositing to pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle withdraw from trading pool
  const handleWithdrawFromPool = async () => {
    if (!withdrawAmount) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Withdrawing ${withdrawAmount} from trading pool`);

      setSuccessMessage(`Successfully withdrew ${withdrawAmount} from trading pool!`);
      setShowSuccess(true);

      // Reset form after delay
      setTimeout(() => {
        setWithdrawAmount('');
        setWithdrawCardView('options');
        setShowWithdrawCard(false);
        setShowSuccess(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error withdrawing from pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle withdraw from pulley liquidity
  const handleWithdrawLiquidity = () => {
    if (!withdrawAmount) return;
    console.log(`Withdrawing ${withdrawAmount} from pulley liquidity`);
    // Route to swap page with PUL as from token
    router.push(`/app/swap?from=PUL&to=USDC&amount=${withdrawAmount}`);
  };

  // Percentage withdrawal helpers
  const handlePercentageWithdraw = (percentage: number) => {
    let maxAmount = 0;
    if (withdrawAction === 'withdraw-pool') {
      maxAmount = TRADING_POOL_DATA.deposited + TRADING_POOL_DATA.yield;
    } else {
      maxAmount = PULLEY_LIQUIDITY_DATA.deposited + PULLEY_LIQUIDITY_DATA.yield;
    }
    const amount = (maxAmount * percentage) / 100;
    setWithdrawAmount(amount.toFixed(2));
  };

  // Get max withdraw amount based on action
  const getMaxWithdrawAmount = () => {
    if (withdrawAction === 'withdraw-pool') {
      return TRADING_POOL_DATA.deposited + TRADING_POOL_DATA.yield;
    } else {
      return PULLEY_LIQUIDITY_DATA.deposited + PULLEY_LIQUIDITY_DATA.yield;
    }
  };

  // Get current yield data based on action
  const getCurrentYieldData = () => {
    if (withdrawAction === 'withdraw-pool') {
      return TRADING_POOL_DATA;
    } else {
      return PULLEY_LIQUIDITY_DATA;
    }
  };

  // Validate withdraw amount
  const isWithdrawAmountValid = () => {
    if (!withdrawAmount) return false;
    const amount = parseFloat(withdrawAmount);
    const maxAmount = getMaxWithdrawAmount();
    return amount > 0 && amount <= maxAmount;
  };

  // Validate deposit amount
  const isDepositAmountValid = () => {
    if (!depositAmount) return false;
    const amount = parseFloat(depositAmount);
    return amount > 0;
  };

  // Reset card states
  const resetDepositCard = () => {
    setShowDepositCard(false);
    setDepositAction(null);
    setDepositCardView('options');
    setDepositAmount('');
    setSelectedToken('USDC');
  };

  const resetWithdrawCard = () => {
    setShowWithdrawCard(false);
    setWithdrawAction(null);
    setWithdrawCardView('options');
    setWithdrawAmount('');
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <div className="flex items-center space-x-2">
            <Button className="text-white hover:text-white" variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {showBalances ? 'Hide Balances' : 'Show Balances'}
            </Button>
            <Button className="text-white hover:text-white" variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Total Balance Card */}
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Balance</h3>
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
              <Button variant="outline" onClick={() => setShowReceiveModal(true)} className="flex-1 hover:text-white">
                <Upload className="w-4 h-4 mr-2" />
                Receive
              </Button>
            </div>
          </div>
        </Card>

        {/* Deposit & Withdraw Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-crypto-card border-crypto-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Earn & Grow</h3>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">Trading Pool</div>
                    <div className="text-sm text-muted-foreground">APY: {TRADING_POOL_DATA.apy}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${TRADING_POOL_DATA.deposited.toLocaleString()}</div>
                    <div className="text-sm text-green-500">+${TRADING_POOL_DATA.yield}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-crypto-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">Pulley Liquidity</div>
                    <div className="text-sm text-muted-foreground">APY: {PULLEY_LIQUIDITY_DATA.apy}%</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${PULLEY_LIQUIDITY_DATA.deposited.toLocaleString()}</div>
                    <div className="text-sm text-green-500">+${PULLEY_LIQUIDITY_DATA.yield}</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowDepositCard(true)} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline" onClick={() => setShowWithdrawCard(true)} className="flex-1 hover:text-white">
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col hover:text-white" onClick={() => router.push('/app/swap')}>
                <ArrowUpDown className="w-6 h-6 mb-2" />
                <span className="text-sm">Swap</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col hover:text-white" onClick={() => router.push('/app/trading')}>
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">Trade</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col hover:text-white" onClick={() => router.push('/app/portfolio')}>
                <BarChart3 className="w-6 h-6 mb-2" />
                <span className="text-sm">Portfolio</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col hover:text-white" onClick={() => router.push('/app/markets')}>
                <TrendingDown className="w-6 h-6 mb-2" />
                <span className="text-sm">Markets</span>
              </Button>
            </div>
          </Card>
        </div>

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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
                <Button className="text-white hover:text-white" variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                <div>
                  <div className="font-medium">Backup Wallet</div>
                  <div className="text-sm text-muted-foreground">Download your wallet backup</div>
                </div>
                <Button className="text-white hover:text-white" variant="outline" size="sm">Backup</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Deposit Card Modal */}
      {showDepositCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-crypto-card border-crypto-border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Deposit</h3>
              <Button variant="ghost" size="sm" onClick={resetDepositCard}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {showSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">{successMessage}</div>
              </div>
            )}

            {depositCardView === 'options' ? (
              <div className="space-y-3">
                <Button
                  className="w-full justify-start h-16"
                  variant="outline"
                  onClick={() => handleDepositAction('buy-pulley')}
                >
                  <div className="flex items-center space-x-3">
                    <Coins className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medium">Buy Pulley Tokens</div>
                      <div className="text-sm text-muted-foreground">Mint PUL stablecoin</div>
                    </div>
                  </div>
                </Button>
                <Button
                  className="w-full justify-start h-16"
                  variant="outline"
                  onClick={() => handleDepositAction('deposit-pool')}
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medium">Deposit in Trading Pool</div>
                      <div className="text-sm text-muted-foreground">Earn yield on your assets</div>
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDepositCardView('options')}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {depositAction === 'buy-pulley' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount to Buy (PUL)</label>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Current PUL Price: $0.004
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Estimated Cost: ${depositAmount ? (parseFloat(depositAmount) * 0.004).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full"
                        min="0.01"
                        step="0.01"
                      />
                      {depositAmount && !isDepositAmountValid() && (
                        <div className="text-sm text-red-500 mt-1">
                          Amount must be greater than 0
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleBuyPulley}
                        className="flex-1"
                        disabled={!isDepositAmountValid() || isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Buy PUL'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleBuyPulley}
                        className="flex-1"
                        disabled={!isDepositAmountValid() || isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Buy & Deposit'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount to Deposit</label>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Balance: {SUPPORTED_TOKENS.find(t => t.symbol === selectedToken)?.balance} {selectedToken}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const balance = SUPPORTED_TOKENS.find(t => t.symbol === selectedToken)?.balance || 0;
                            setDepositAmount(balance.toString());
                          }}
                          className="text-xs"
                        >
                          Max
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full"
                        min="0.01"
                        step="0.01"
                        max={SUPPORTED_TOKENS.find(t => t.symbol === selectedToken)?.balance}
                      />
                      {depositAmount && !isDepositAmountValid() && (
                        <div className="text-sm text-red-500 mt-1">
                          Amount must be greater than 0
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Token</label>
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_TOKENS.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center space-x-2">
                                {React.createElement(token.icon, { className: "w-4 h-4" })}
                                <span>{token.symbol}</span>
                                <span className="text-muted-foreground">({token.balance})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleDepositToPool}
                      className="w-full"
                      disabled={!isDepositAmountValid() || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Deposit to Pool'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Withdraw Card Modal */}
      {showWithdrawCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-crypto-card border-crypto-border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Withdraw</h3>
              <Button variant="ghost" size="sm" onClick={resetWithdrawCard}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {showSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">{successMessage}</div>
              </div>
            )}

            {withdrawCardView === 'options' ? (
              <div className="space-y-3">
                <Button
                  className="w-full justify-start h-16"
                  variant="outline"
                  onClick={() => handleWithdrawAction('withdraw-pool')}
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medium">Withdraw from Trading Pool</div>
                      <div className="text-sm text-muted-foreground">Get your assets back</div>
                    </div>
                  </div>
                </Button>
                <Button
                  className="w-full justify-start h-16"
                  variant="outline"
                  onClick={() => handleWithdrawAction('withdraw-liquidity')}
                >
                  <div className="flex items-center space-x-3">
                    <Coins className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-medium">Withdraw from Pulley Liquidity</div>
                      <div className="text-sm text-muted-foreground">Burn PUL for other assets</div>
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWithdrawCardView('options')}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {withdrawAction === 'withdraw-pool' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border border-crypto-border">
                      <div className="text-sm text-muted-foreground mb-2">Available to Withdraw</div>
                      <div className="text-2xl font-bold">${getMaxWithdrawAmount().toFixed(2)}</div>
                      <div className="text-sm text-green-500">+${getCurrentYieldData().yield} yield earned</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount to Withdraw</label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full"
                        max={getMaxWithdrawAmount()}
                        step="0.01"
                      />
                      {withdrawAmount && !isWithdrawAmountValid() && (
                        <div className="text-sm text-red-500 mt-1">
                          Amount must be between 0 and ${getMaxWithdrawAmount().toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100].map((percentage) => (
                        <Button
                          key={percentage}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePercentageWithdraw(percentage)}
                        >
                          {percentage === 100 ? 'Max' : `${percentage}%`}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleWithdrawFromPool}
                      className="w-full"
                      disabled={!isWithdrawAmountValid() || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Withdraw from Pool'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border border-crypto-border">
                      <div className="text-sm text-muted-foreground mb-2">Available to Withdraw</div>
                      <div className="text-2xl font-bold">${getMaxWithdrawAmount().toFixed(2)}</div>
                      <div className="text-sm text-green-500">+${getCurrentYieldData().yield} yield earned</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount to Withdraw</label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full"
                        max={getMaxWithdrawAmount()}
                        step="0.01"
                      />
                      {withdrawAmount && !isWithdrawAmountValid() && (
                        <div className="text-sm text-red-500 mt-1">
                          Amount must be between 0 and ${getMaxWithdrawAmount().toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[25, 50, 75, 100].map((percentage) => (
                        <Button
                          key={percentage}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePercentageWithdraw(percentage)}
                        >
                          {percentage === 100 ? 'Max' : `${percentage}%`}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleWithdrawLiquidity}
                      className="w-full"
                      disabled={!isWithdrawAmountValid()}
                    >
                      Burn PUL & Get Assets
                    </Button>
                  </div>
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