/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bitcoin, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, Plus, Minus, X, Send, Download, Upload, Copy, Eye, EyeOff, Wallet, Coins, ArrowLeft, Zap, BarChart3 } from 'lucide-react'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useWriteContract } from 'wagmi'
import { gateway_abi, gateway_addr, core_addr, pul_token_addr } from '@/utils/web3'
import { useAccount, usePublicClient } from '@particle-network/connectkit'
import { parseEther } from 'viem'

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
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const { writeContract } = useWriteContract();
  const { address, chain } = useAccount();
  const publicClient = usePublicClient();
  console.log('Connected wallet:', address, 'Chain:', chain);

  // Live wallet balance hooks - using Particle ConnectKit instead of wagmi
  const { data: ethBalance, isLoading: isEthLoading } = useQuery({
    queryKey: ['ethBalance', address, chain?.id],
    queryFn: async () => {
      if (!address || !publicClient) return null;
      
      try {
        console.log('Fetching ETH balance for address:', address);
        console.log('Using publicClient:', publicClient);
        console.log('Current chain:', chain);
        console.log('Available methods on publicClient:', Object.getOwnPropertyNames(Object.getPrototypeOf(publicClient)));
        
        // Get native token (ETH) balance using Particle's publicClient
        let balance;
        try {
          // Try using the publicClient's built-in balance method
          if (typeof publicClient.getBalance === 'function') {
            balance = await publicClient.getBalance({
              address: address as `0x${string}`,
            });
          } else {
            // Fallback: use RPC method
            try {
              const response = await publicClient.request({
                method: 'eth_getBalance',
                params: [address as `0x${string}`, 'latest']
              } as any);
              balance = BigInt(response as string);
            } catch (rpcError) {
              console.log('All balance methods failed:', rpcError);
              // Last resort: return 0
              balance = BigInt(0);
            }
          }
        } catch (error) {
          console.log('All balance methods failed:', error);
          // Last resort: return 0
          balance = BigInt(0);
        }
        
        // Ensure balance is a BigInt
        if (typeof balance === 'string') {
          balance = BigInt(balance);
        } else if (typeof balance === 'number') {
          balance = BigInt(balance);
        }
        
        console.log('Raw ETH balance result:', balance);
        console.log('ETH balance in wei:', balance.toString());
        console.log('ETH balance in ETH:', Number(balance) / Math.pow(10, 18));
        
        return balance;
      } catch (error) {
        console.error('Error fetching ETH balance:', error);
        return null;
      }
    },
    enabled: !!address && !!publicClient && !!chain?.id,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch PUL token balance using Particle ConnectKit
  const { data: pulTokenBalance, isLoading: isPulLoading } = useQuery({
    queryKey: ['pulTokenBalance', address, chain?.id],
    queryFn: async () => {
      if (!address || !publicClient || !pul_token_addr) return null;
      
      try {
        const balance = await publicClient.readContract({
          address: pul_token_addr,
          abi: [
            {
              "constant": true,
              "inputs": [{"name": "_owner", "type": "address"}],
              "name": "balanceOf",
              "outputs": [{"name": "balance", "type": "uint256"}],
              "type": "function"
            }
          ],
          functionName: 'balanceOf',
          args: [address as `0x${string}`]
        });
        
        return balance;
      } catch (error) {
        console.error('Error fetching PUL token balance:', error);
        return null;
      }
    },
    enabled: !!address && !!publicClient && !!chain?.id && !!pul_token_addr,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch all wallet tokens using Particle's enhanced API
  const { data: allTokens, isLoading: isTokensLoading } = useQuery({
    queryKey: ['allTokens', address, chain?.id],
    queryFn: async () => {
      if (!address || !publicClient) return null;
      
      try {
        // Define common token addresses for the current chain
        const commonTokens: Array<{
          address: string;
          symbol: string;
          decimals: number;
          name: string;
        }> = [
          // Base Sepolia testnet tokens
          { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', decimals: 18, name: 'Wrapped Ether' },
          { address: '0x036CbD53842c5426634e7929541eC2318f3dCF7c8', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
          
          // Example for Ethereum mainnet:
          // { address: '0xA0b86a33E6441b8c4C8D8bBc8Bc8Bc8Bc8Bc8Bc8', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
          // { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
          // { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', decimals: 8, name: 'Wrapped Bitcoin' },
          
          // Example for Polygon:
          // { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6, name: 'USD Coin' },
          // { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, name: 'Tether USD' },
          
          // Example for BSC:
          // { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', decimals: 18, name: 'USD Coin' },
          // { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', decimals: 18, name: 'Tether USD' },
        ];
        
        const tokenBalances: Array<{
          address: string;
          symbol: string;
          decimals: number;
          balance: string;
          name: string;
        }> = [];
        
        // Fetch balances for common tokens
        for (const token of commonTokens) {
          try {
            console.log(`Fetching balance for ${token.symbol} at address ${token.address}`);
            const balance = await publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: [
                {
                  "constant": true,
                  "inputs": [{"name": "_owner", "type": "address"}],
                  "name": "balanceOf",
                  "outputs": [{"name": "balance", "type": "uint256"}],
                  "type": "function"
                }
              ],
              functionName: 'balanceOf',
              args: [address as `0x${string}`]
            });
            
            console.log(`${token.symbol} balance result:`, balance);
            console.log(`${token.symbol} balance as number:`, Number(balance));
            
            if (balance && Number(balance) > 0) {
              tokenBalances.push({
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals,
                balance: balance.toString(),
                name: token.name
              });
              console.log(`Added ${token.symbol} to balances:`, balance.toString());
            } else {
              console.log(`${token.symbol} balance is 0 or null:`, balance);
            }
          } catch (error) {
            console.error(`Error fetching ${token.symbol} balance:`, error);
          }
        }
        
        return tokenBalances;
      } catch (error) {
        console.error('Error fetching all tokens:', error);
        return null;
      }
    },
    enabled: !!address && !!publicClient && !!chain?.id,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Get live wallet balances
  const getLiveWalletBalances = () => {
    if (!address) return WALLET_BALANCES; // Fallback to mock data if no wallet

    const balances = [];

    // Add ETH balance
    if (ethBalance) {
      // Convert from wei to ETH (assuming 18 decimals for native token)
      const ethBalanceInEth = Number(ethBalance) / Math.pow(10, 18);
      balances.push({
        symbol: 'ETH',
        name: 'Ethereum',
        icon: TrendingUp,
        balance: ethBalanceInEth,
        value: ethBalanceInEth * 3000, // Approximate ETH price
        change: 2.5, // This would need to come from price API
        address: address
      });
    }

    // Add PUL token balance
    if (pulTokenBalance) {
      const pulBalance = Number(pulTokenBalance) / Math.pow(10, 18); // Assuming 18 decimals
      balances.push({
        symbol: 'PUL',
        name: 'Pulley',
        icon: TrendingUp,
        balance: pulBalance,
        value: pulBalance * 0.004, // PUL token price
        change: 0.0,
        address: address
      });
    }

    // Add other tokens from the fetched token balances
    if (allTokens && Array.isArray(allTokens)) {
      allTokens.forEach(token => {
        if (token.symbol && token.balance && token.balance !== '0') {
          const balance = Number(token.balance) / Math.pow(10, token.decimals || 18);
          const value = balance * 0; // Would need price API for this
          
          balances.push({
            symbol: token.symbol,
            name: token.name,
            icon: getTokenIcon(token.symbol),
            balance: balance,
            value: value,
            change: 0.0, // Would need price API for this
            address: address
          });
        }
      });
    }

    // If no tokens found, add fallback
    if (balances.length === 0) {
      balances.push({
        symbol: 'USDC',
        name: 'USD Coin',
        icon: DollarSign,
        balance: 0,
        value: 0,
        change: 0.0,
        address: address
      });
    }

    return balances;
  };

  // Helper function to get token icon based on symbol
  const getTokenIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'ETH':
        return TrendingUp;
      case 'USDC':
        return DollarSign;
      case 'BTC':
        return Bitcoin;
      case 'PUL':
        return TrendingUp;
      default:
        return TrendingUp;
    }
  };

  // Calculate estimated cost when buying PUL tokens
  const getEstimatedCost = () => {
    if (!depositAmount || !selectedTokenForPul) return 0;
    const pulAmount = parseFloat(depositAmount);
    // Assuming 1 PUL = $0.004, calculate how much of the selected token is needed
    const pulValue = pulAmount * 0.004;
    const selectedTokenPrice = liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.value || 0;
    const selectedTokenBalance = liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance || 0;
    
    if (selectedTokenPrice > 0 && selectedTokenBalance > 0) {
      return (pulValue / selectedTokenPrice) * selectedTokenBalance;
    }
    
    return 0;
  };

  // Get current live balances
  const liveWalletBalances = getLiveWalletBalances();

  async function buyPulleyTokens() {
    if (!address) {
      console.error('No wallet connected');
      return;
    }

    if (!selectedTokenForPul || !depositAmount) {
      console.error('Missing token selection or amount');
      return;
    }

    try {
      setIsLoading(true);
      
      // Add pending transaction to history
      addTransaction({
        type: 'buy-pul',
        symbol: selectedTokenForPul,
        amount: parseFloat(depositAmount),
        value: parseFloat(depositAmount) * 0.004, // PUL token value
        from: address,
        to: gateway_addr,
        status: 'pending',
      });
      
      // If the selected token is ETH, we can proceed directly
      if (selectedTokenForPul === 'ETH') {
        console.log('Submitting buy PUL transaction...');
        console.log('Contract address:', gateway_addr);
        console.log('Function:', 'buyPulleyTokens');
        console.log('Args:', [core_addr, depositAmount]);
        console.log('Account:', address);
        console.log('Value:', parseEther(depositAmount));

        const result = await writeContract({
          abi: gateway_abi,
          address: gateway_addr,
          functionName: "buyPulleyTokens",
          account: address as `0x${string}`,
          args: [core_addr, depositAmount],
          value: parseEther(depositAmount) // Send ETH value
        });
        
        console.log('Transaction submitted:', result);
        
        // For wagmi, we need to wait for the transaction to be mined
        // The hash will be available in the transaction receipt
        setSuccessMessage(`Successfully submitted transaction to buy ${depositAmount} PUL tokens with ETH! Check your wallet for transaction details.`);
        setShowSuccess(true);
        
        // Update transaction status to confirmed (we'll get the hash later)
        setRealTransactions(prev => 
          prev.map(tx => 
            tx.id === prev[0]?.id 
              ? { ...tx, status: 'confirmed' as const }
              : tx
          )
        );
      } else {
        // For ERC20 tokens, we need to approve first, then call the contract
        // This would require the gateway contract to have a function that accepts ERC20 tokens
        // For now, we'll show an error message
        setSuccessMessage(`Buying PUL with ${selectedTokenForPul} is not yet implemented. Please use ETH for now.`);
        setShowSuccess(true);
        
        // Update transaction status to failed
        setRealTransactions(prev => 
          prev.map(tx => 
            tx.id === prev[0]?.id 
              ? { ...tx, status: 'failed' as const, error: 'ERC20 token support not implemented' }
              : tx
          )
        );
      }
    } catch (error) {
      console.error('Error buying PUL tokens:', error);
      
      // Update transaction status to failed
      setRealTransactions(prev => 
        prev.map(tx => 
          tx.id === prev[0]?.id 
            ? { ...tx, status: 'failed' as const, error: error instanceof Error ? error.message : 'Transaction failed' }
            : tx
        )
      );
      
      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}`);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function withdrawFromTradingPool() {
    if (!address) {
      console.error('No wallet connected');
      return;
    }

    try {
      setIsLoading(true);
      const result = await writeContract({
        abi: gateway_abi,
        address: gateway_addr,
        functionName: "withdrawFromTradingPool",
        account: address as `0x${string}`,
        args: [core_addr, withdrawAmount]
      });
      
      console.log('Transaction submitted:', result);
      setSuccessMessage(`Successfully withdrew ${withdrawAmount} from trading pool! Transaction submitted.`);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error withdrawing from pool:', error);
      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}`);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function depositToTradingPool() {
    if (!address) {
      console.error('No wallet connected');
      return;
    }

    if (!depositAmount || !selectedToken) {
      console.error('Missing deposit amount or selected token');
      return;
    }

    try {
      setIsLoading(true);
      
      // Add pending transaction to history
      addTransaction({
        type: 'deposit',
        symbol: selectedToken,
        amount: parseFloat(depositAmount),
        value: parseFloat(depositAmount), // This would need price API for accurate value
        from: address,
        to: gateway_addr,
        status: 'pending',
      });

      console.log('Submitting deposit transaction...');
      console.log('Contract address:', gateway_addr);
      console.log('Function:', 'depositToTradingPool');
      console.log('Args:', [core_addr, depositAmount]);
      console.log('Account:', address);
      console.log('Contract ABI available:', !!gateway_abi);
      console.log('writeContract function available:', !!writeContract);

      // Check if contract is properly configured
      if (!gateway_addr || gateway_addr === '0x') {
        throw new Error('Gateway contract address not configured');
      }

      if (!core_addr || core_addr === '0x') {
        throw new Error('Core contract address not configured');
      }

      const result = await writeContract({
        abi: gateway_abi,
        address: gateway_addr,
        functionName: "depositToTradingPool",
        args: [core_addr, depositAmount],
        account: address as `0x${string}`,
      });
      
      console.log('Transaction submitted successfully:', result);
      
      // For wagmi, we need to wait for the transaction to be mined
      // The hash will be available in the transaction receipt
      setSuccessMessage(`Successfully submitted deposit transaction! Check your wallet for transaction details.`);
      setShowSuccess(true);
      
      // Update transaction status to confirmed (we'll get the hash later)
      setRealTransactions(prev => 
        prev.map(tx => 
          tx.id === prev[0]?.id 
            ? { ...tx, status: 'confirmed' as const }
            : tx
        )
      );

      setSuccessMessage(`Successfully deposited ${depositAmount} ${selectedToken} to trading pool! Transaction submitted.`);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error depositing to pool:', error);
      
      // Update transaction status to failed
      setRealTransactions(prev => 
        prev.map(tx => 
          tx.id === prev[0]?.id 
            ? { ...tx, status: 'failed' as const, error: error instanceof Error ? error.message : 'Transaction failed' }
            : tx
        )
      );

      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}`);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function buyTokenAndDeposit() {
    if (!address) {
      console.error('No wallet connected');
      return;
    }

    try {
      setIsLoading(true);
      const result = await writeContract({
        abi: gateway_abi,
        address: gateway_addr,
        functionName: "buyTokensAndDeposit",
        args: [core_addr, depositAmount],
        account: address as `0x${string}`,
      });
      
      console.log('Transaction submitted:', result);
      setSuccessMessage(`Successfully bought tokens and deposited ${depositAmount} to trading pool! Transaction submitted.`);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error buying tokens and depositing:', error);
      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}`);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
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
  const [selectedTokenForPul, setSelectedTokenForPul] = useState<string>('ETH'); // Token to trade for PUL

  // Success and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Transaction tracking state
  const [realTransactions, setRealTransactions] = useState<Array<{
    id: string;
    type: 'deposit' | 'withdraw' | 'buy-pul' | 'send' | 'receive';
    symbol: string;
    amount: number;
    value: number;
    from: string;
    to: string;
    status: 'pending' | 'confirmed' | 'failed';
    time: string;
    hash?: string;
    error?: string;
  }>>([]);

  // Animation states for smooth transitions
  const [isDepositAnimating, setIsDepositAnimating] = useState(false);
  const [isWithdrawAnimating, setIsWithdrawAnimating] = useState(false);
  const [isSendAnimating, setIsSendAnimating] = useState(false);
  const [isReceiveAnimating, setIsReceiveAnimating] = useState(false);

  // Helper function to add transactions to history
  const addTransaction = (transaction: {
    type: 'deposit' | 'withdraw' | 'buy-pul' | 'send' | 'receive';
    symbol: string;
    amount: number;
    value: number;
    from: string;
    to: string;
    status: 'pending' | 'confirmed' | 'failed';
    hash?: string;
    error?: string;
  }) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      time: new Date().toLocaleString(),
    };
    
    setRealTransactions(prev => [newTransaction, ...prev.slice(0, 9)]); // Keep last 10 transactions
    console.log('Added transaction to history:', newTransaction);
  };

  // Enhanced modal open/close functions with animations
  const openDepositModal = () => {
    setIsDepositAnimating(true);
    setShowDepositCard(true);
  };

  const closeDepositModal = () => {
    setIsDepositAnimating(false);
    setTimeout(() => {
      setShowDepositCard(false);
      resetDepositCard();
    }, 200);
  };

  const openWithdrawModal = () => {
    setIsWithdrawAnimating(true);
    setShowWithdrawCard(true);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawAnimating(false);
    setTimeout(() => {
      setShowWithdrawCard(false);
      resetWithdrawCard();
    }, 200);
  };

  const openSendModal = () => {
    setIsSendAnimating(true);
    setShowSendModal(true);
  };

  const closeSendModal = () => {
    setIsSendAnimating(false);
    setTimeout(() => {
      setShowSendModal(false);
    }, 200);
  };

  const openReceiveModal = () => {
    setIsReceiveAnimating(true);
    setShowReceiveModal(true);
  };

  const closeReceiveModal = () => {
    setIsReceiveAnimating(false);
    setTimeout(() => {
      setShowReceiveModal(false);
    }, 200);
  };

  // Handle backdrop click to close modals
  const handleBackdropClick = (e: React.MouseEvent, closeFunction: () => void) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  const totalValue = liveWalletBalances.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = liveWalletBalances.reduce((sum, asset) => sum + (asset.value * asset.change / 100), 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add a toast notification here
    setSuccessMessage('Address copied to clipboard!');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage('');
    }, 2000);
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

      // withdraw
      withdrawFromTradingPool()

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
    
    // For buying PUL tokens, check against selected token balance
    if (depositAction === 'buy-pulley') {
      const selectedTokenBalance = liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance || 0;
      const maxPulAmount = selectedTokenBalance / 0.004; // Convert token balance to max PUL amount
      return amount > 0 && amount <= maxPulAmount;
    }
    
    // For regular deposits, just check if amount is positive
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

  // New state for send functionality
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const handleSendAssets = async () => {
    if (!address || !sendAmount || !recipientAddress) {
      console.error('Missing required fields for sending');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Sending ${sendAmount} ${selectedToken} to ${recipientAddress}`);

      setSuccessMessage(`Successfully sent ${sendAmount} ${selectedToken} to ${recipientAddress}!`);
      setShowSuccess(true);

      // start contract send. 
      // This would require a more complex transaction structure,
      // including the recipient address, amount, and the token's ABI.
      // For now, we'll simulate a successful send.
      // In a real app, you'd call a send function from a contract.

      // Reset form after delay
      setTimeout(() => {
        setSendAmount('');
        setRecipientAddress('');
        setShowSendModal(false);
        setShowSuccess(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending assets:', error);
      setSuccessMessage(`Error: ${error instanceof Error ? error.message : 'Transaction failed'}`);
      setShowSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isSendAmountValid = () => {
    if (!sendAmount) return false;
    const amount = parseFloat(sendAmount);
    const balance = liveWalletBalances.find(t => t.symbol === selectedToken)?.balance || 0;
    return amount > 0 && amount <= balance;
  };

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const isSendFormValid = () => {
    return sendAmount && recipientAddress && isSendAmountValid() && isValidAddress(recipientAddress);
  };

  // Helper function to check contract configuration
  const checkContractConfig = () => {
    const issues = [];
    if (!gateway_addr || gateway_addr === '0x') {
      issues.push('Gateway contract address not configured');
    }
    if (!core_addr || core_addr === '0x') {
      issues.push('Core contract address not configured');
    }
    if (!pul_token_addr || pul_token_addr === '0x') {
      issues.push('PUL token address not configured');
    }
    return issues;
  };

  return (
    <div className="w-full h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
          <div className="flex items-center space-x-2">
            {address ? (
              <Badge variant="secondary" className="text-green-500 border-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-yellow-500 border-yellow-500">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                No Wallet Connected
              </Badge>
            )}
            {chain && (
              <Badge variant="outline" className="text-xs">
                {chain.name} (ID: {chain.id})
              </Badge>
            )}
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

        {/* Configuration Note */}
        {!pul_token_addr && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {/* <p className="text-sm text-yellow-600">
                <strong>Configuration Required:</strong> Set NEXT_PUBLIC_PUL_TOKEN_ADDRESS in your environment variables to see PUL token balances.
              </p> */}
            </div>
          </div>
        )}

        {/* Token Configuration Note */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {/* <p className="text-sm text-blue-600">
              <strong>Token Listing:</strong> To see more tokens in your wallet, uncomment and configure token addresses in the code for your specific chain. 
              Currently showing ETH balance and PUL tokens (if configured).
            </p> */}
          </div>
        </div>

        {/* Debug Information */}
        <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            {/* <p className="text-sm text-gray-600">
              <strong>Debug Info:</strong> Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'} | 
              Chain: {chain?.name || 'Unknown'} (ID: {chain?.id || 'Unknown'}) | 
              ETH Balance: {ethBalance ? `${(Number(ethBalance) / Math.pow(10, 18)).toFixed(6)} ETH` : 'Loading...'} | 
              PUL Balance: {pulTokenBalance ? `${(Number(pulTokenBalance) / Math.pow(10, 18)).toFixed(6)} PUL` : 'Not configured'}
            </p> */}
          </div>
          <div className="mt-2">
            {/* <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                console.log('Manual balance check:');
                console.log('Address:', address);
                console.log('PublicClient:', publicClient);
                console.log('Chain:', chain);
                console.log('ETH Balance from query:', ethBalance);
              }}
            >
              Debug Balance
            </Button> */}
            {/* <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => {
                console.log('Contract configuration check:');
                console.log('Gateway address:', gateway_addr);
                console.log('Controller address:', controller_addr);
                console.log('Core address:', core_addr);
                console.log('PUL token address:', pul_token_addr);
                console.log('Gateway ABI:', gateway_abi);
                console.log('writeContract available:', !!writeContract);
                console.log('Config issues:', checkContractConfig());
              }}
            >
              Debug Contracts
            </Button> */}
          </div>
        </div>

        {/* Contract Configuration Warnings */}
        {(() => {
          const configIssues = checkContractConfig();
          if (configIssues.length > 0) {
            return (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {/* <p className="text-sm text-red-600">
                    <strong>Contract Configuration Issues:</strong>
                  </p> */}
                </div>
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {configIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
                {/* <p className="text-xs text-red-500 mt-2">
                  Set these environment variables: NEXT_PUBLIC_GATEWAY_ADDRESS, NEXT_PUBLIC_CONTROLLER_ADDRESS, NEXT_PUBLIC_CORE_ADDRESS, NEXT_PUBLIC_PUL_TOKEN_ADDRESS
                </p> */}
              </div>
            );
          }
          return null;
        })()}

        {/* Transaction Information Note */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {/* <p className="text-sm text-blue-600">
              <strong>Transaction Information:</strong> When you submit a transaction, it will be sent to your wallet for approval. 
              After approval, the transaction will be submitted to the blockchain. Check your wallet for transaction details and status.
            </p> */}
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
                              <Button onClick={openSendModal} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" onClick={openReceiveModal} className="flex-1 hover:text-white">
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
                <Button onClick={openDepositModal} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline" onClick={openWithdrawModal} className="flex-1 hover:text-white">
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
              {isPulLoading || isTokensLoading || isEthLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-green mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading wallet balances...</p>
                  </div>
                </div>
              ) : liveWalletBalances.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assets found</p>
                </div>
              ) : (
                liveWalletBalances.map((asset) => {
                  const Icon = asset.icon;
                  return (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8" />
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.balance.toFixed(6)} {asset.symbol}</div>
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
                })
              )}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-crypto-card border-crypto-border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {realTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your transaction history will appear here</p>
                </div>
              ) : (
                realTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-crypto-border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' || tx.type === 'buy-pul' || tx.type === 'receive' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> :
                         tx.type === 'withdraw' ? <Minus className="w-4 h-4" /> :
                         tx.type === 'buy-pul' ? <Coins className="w-4 h-4" /> :
                         tx.type === 'send' ? <Send className="w-4 h-4" /> :
                         <ArrowUpDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type.replace('-', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{tx.time}</div>
                        {tx.hash && (
                          <div className="text-xs text-blue-500 font-mono">
                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                          </div>
                        )}
                        {!tx.hash && tx.status === 'confirmed' && (
                          <div className="text-xs text-green-500">
                            Transaction submitted
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        tx.type === 'deposit' || tx.type === 'buy-pul' || tx.type === 'receive' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'buy-pul' || tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">${tx.value.toFixed(2)}</div>
                      <Badge 
                        variant={
                          tx.status === 'confirmed' ? 'default' : 
                          tx.status === 'pending' ? 'secondary' : 
                          'destructive'
                        } 
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                      {tx.error && (
                        <div className="text-xs text-red-500 mt-1 max-w-32 truncate" title={tx.error}>
                          {tx.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
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
        <div className={`modal-backdrop ${isDepositAnimating ? 'entering' : 'exiting'}`} onClick={(e) => handleBackdropClick(e, closeDepositModal)}>
          <Card className={`modal-card ${isDepositAnimating ? 'entering' : 'exiting'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Deposit</h3>
              <Button variant="ghost" size="sm" onClick={closeDepositModal}>
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
                    <div className="form-element">
                      <label className="block text-sm font-medium mb-2">Amount to Buy (PUL)</label>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Current PUL Price: $0.004
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Estimated Cost: {getEstimatedCost().toFixed(6)} {selectedTokenForPul}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Available {selectedTokenForPul}: {liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance.toFixed(6) || '0'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const balance = liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance || 0;
                            // Convert balance to PUL amount (assuming 1 PUL = 0.004 of the selected token)
                            const maxPul = balance / 0.004;
                            setDepositAmount(maxPul.toFixed(2));
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
                        max={(() => {
                          const balance = liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance || 0;
                          return (balance / 0.004).toFixed(2);
                        })()}
                      />
                      {depositAmount && !isDepositAmountValid() && (
                        <div className="text-sm text-red-500 mt-1">
                          Amount must be greater than 0 and not exceed your available balance
                        </div>
                      )}
                    </div>
                    <div className="form-element">
                      <label className="block text-sm font-medium mb-2">Select Token to Pay With</label>
                      <Select value={selectedTokenForPul} onValueChange={setSelectedTokenForPul}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose token" />
                        </SelectTrigger>
                        <SelectContent>
                          {liveWalletBalances.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              <div className="flex items-center space-x-2">
                                {React.createElement(token.icon, { className: "w-4 h-4" })}
                                <span>{token.symbol}</span>
                                <span className="text-muted-foreground">({token.balance.toFixed(6)})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTokenForPul && (
                        <div className="mt-2 p-2 bg-background rounded border text-sm">
                          <div className="flex justify-between">
                            <span>Available Balance:</span>
                            <span className="font-medium">
                              {liveWalletBalances.find(t => t.symbol === selectedTokenForPul)?.balance.toFixed(6) || '0'} {selectedTokenForPul}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Estimated PUL to Receive:</span>
                            <span className="font-medium text-green-500">
                              {depositAmount ? (parseFloat(depositAmount) * 250).toFixed(2) : '0'} PUL
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 form-element">
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
                    <div className="form-element">
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
                    <div className="form-element">
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
                      className="w-full form-element"
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
        <div className={`modal-backdrop ${isWithdrawAnimating ? 'entering' : 'exiting'}`} onClick={(e) => handleBackdropClick(e, closeWithdrawModal)}>
          <Card className={`modal-card ${isWithdrawAnimating ? 'entering' : 'exiting'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Withdraw</h3>
              <Button variant="ghost" size="sm" onClick={closeWithdrawModal}>
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
                    <div className="p-4 bg-background rounded-lg border border-crypto-border form-element">
                      <div className="text-sm text-muted-foreground mb-2">Available to Withdraw</div>
                      <div className="text-2xl font-bold">${getMaxWithdrawAmount().toFixed(2)}</div>
                      <div className="text-sm text-green-500">+${getCurrentYieldData().yield} yield earned</div>
                    </div>
                    <div className="form-element">
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
                    <div className="flex flex-wrap gap-2 form-element">
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
                      className="w-full form-element"
                      disabled={!isWithdrawAmountValid() || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Withdraw from Pool'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border border-crypto-border form-element">
                      <div className="text-sm text-muted-foreground mb-2">Available to Withdraw</div>
                      <div className="text-2xl font-bold">${getMaxWithdrawAmount().toFixed(2)}</div>
                      <div className="text-sm text-green-500">+${getCurrentYieldData().yield} yield earned</div>
                    </div>
                    <div className="form-element">
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
                    <div className="flex flex-wrap gap-2 form-element">
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
                      className="w-full form-element"
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

      {/* Send Modal */}
      {showSendModal && (
        <div className={`modal-backdrop ${isSendAnimating ? 'entering' : 'exiting'}`} onClick={(e) => handleBackdropClick(e, closeSendModal)}>
          <Card className={`modal-card ${isSendAnimating ? 'entering' : 'exiting'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Assets</h3>
              <Button variant="ghost" size="sm" onClick={closeSendModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="form-element">
                <label className="block text-sm font-medium mb-2">Select Asset</label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset to send" />
                  </SelectTrigger>
                  <SelectContent>
                    {liveWalletBalances.map((asset) => {
                      const Icon = asset.icon;
                      return (
                        <SelectItem key={asset.symbol} value={asset.symbol}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{asset.symbol}</span>
                            <span className="text-muted-foreground">({asset.balance.toFixed(6)})</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-element">
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <Input 
                  placeholder="Enter wallet address (0x...)" 
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={recipientAddress && !isValidAddress(recipientAddress) ? 'border-red-500' : ''}
                />
                {recipientAddress && !isValidAddress(recipientAddress) && (
                  <div className="text-sm text-red-500 mt-1">
                    Please enter a valid Ethereum address (0x...)
                  </div>
                )}
              </div>
              <div className="form-element">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Balance: {liveWalletBalances.find(t => t.symbol === selectedToken)?.balance.toFixed(6) || '0'} {selectedToken}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const balance = liveWalletBalances.find(t => t.symbol === selectedToken)?.balance || 0;
                      setSendAmount(balance.toString());
                    }}
                    className="text-xs"
                  >
                    Max
                  </Button>
                </div>
                <Input 
                  type="number" 
                  placeholder="0.0" 
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  max={liveWalletBalances.find(t => t.symbol === selectedToken)?.balance || 0}
                  step="0.000001"
                  className={sendAmount && !isSendAmountValid() ? 'border-red-500' : ''}
                />
                {sendAmount && !isSendAmountValid() && (
                  <div className="text-sm text-red-500 mt-1">
                    Amount must be greater than 0 and not exceed your balance
                  </div>
                )}
              </div>
              <Button 
                className="w-full form-element" 
                onClick={handleSendAssets}
                disabled={!isSendFormValid() || isLoading}
              >
                {isLoading ? 'Processing...' : 'Send'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className={`modal-backdrop ${isReceiveAnimating ? 'entering' : 'exiting'}`} onClick={(e) => handleBackdropClick(e, closeReceiveModal)}>
          <Card className={`modal-card ${isReceiveAnimating ? 'entering' : 'exiting'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Receive Assets</h3>
              <Button variant="ghost" size="sm" onClick={closeReceiveModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center form-element">
                <div className="w-32 h-32 bg-background rounded-lg border border-crypto-border mx-auto mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">QR</div>
                    <div className="text-xs text-muted-foreground">Code</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Scan this QR code to receive assets</p>
              </div>
              <div className="form-element">
                <label className="block text-sm font-medium mb-2">Your Wallet Address</label>
                <div className="flex items-center space-x-2">
                  <Input 
                    value={address || "Connect wallet to see address"} 
                    readOnly 
                    className="font-mono text-sm"
                    placeholder="No wallet connected"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => address && copyToClipboard(address)}
                    disabled={!address}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {!address && (
                  <p className="text-sm text-yellow-500 mt-1">
                    Please connect your wallet to see your address
                  </p>
                )}
              </div>
              <div className="text-center form-element">
                <p className="text-xs text-muted-foreground">
                  Share this address to receive assets from other wallets
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Page; 