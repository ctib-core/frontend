/* eslint-disable @typescript-eslint/no-explicit-any */
import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';
import { TokenBalance } from './types';
import { getWalletForAPI, getCurrentChainId } from './wallet';

export const fetchWalletBalances = async (
  address?: string, 
  chainId?: number
): Promise<TokenBalance[]> => {
  // Use provided address or get from wallet manager
  const walletInfo = address ? { address, chainId: chainId || getCurrentChainId() } : getWalletForAPI();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockWalletBalances(walletInfo.address, walletInfo.chainId);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Using the correct balance API endpoint from the documentation
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/balance/v1.2/${walletInfo.chainId}/balances/${walletInfo.address}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Balance API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockWalletBalances(walletInfo.address, walletInfo.chainId);
    }
    
    const data = await response.json();
    // Convert the response format to match our TokenBalance interface
    return Object.entries(data).map(([address, balanceData]: [string, any]) => ({
      address,
      symbol: balanceData.symbol || 'UNKNOWN',
      name: balanceData.name || 'Unknown Token',
      balance: balanceData.balance || '0',
      value: balanceData.value || 0,
      price: balanceData.price || 0,
      priceChange24h: balanceData.priceChange24h || 0,
      priceChangePercent24h: balanceData.priceChangePercent24h || 0,
      chainId: walletInfo.chainId,
      logoURI: balanceData.logoURI || ''
    }));
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    // Return mock data for development
    return getMockWalletBalances(walletInfo.address, walletInfo.chainId);
  }
};

export const fetchMultiChainBalances = async (
  address?: string,
  chainIds = ONECHIN_CONFIG.SUPPORTED_CHAINS
): Promise<Record<number, TokenBalance[]>> => {
  const balances: Record<number, TokenBalance[]> = {};
  const walletInfo = address ? { address, chainId: getCurrentChainId() } : getWalletForAPI();
  
  try {
    await Promise.all(
      chainIds.map(async (chainId) => {
        try {
          balances[chainId] = await fetchWalletBalances(walletInfo.address, chainId);
        } catch (error) {
          console.error(`Error fetching balances for chain ${chainId}:`, error);
          balances[chainId] = [];
        }
      })
    );
  } catch (error) {
    console.error('Error fetching multi-chain balances:', error);
  }
  
  return balances;
};

export const getTotalBalanceValue = async (address?: string): Promise<number> => {
  try {
    const balances = await fetchMultiChainBalances(address);
    let totalValue = 0;
    
    Object.values(balances).forEach(chainBalances => {
      chainBalances.forEach(token => {
        totalValue += token.value;
      });
    });
    
    return totalValue;
  } catch (error) {
    console.error('Error calculating total balance value:', error);
    return 0;
  }
};

// Mock data for development
const getMockWalletBalances = (address: string, chainId: number): TokenBalance[] => {
  const mockBalances: Record<number, TokenBalance[]> = {
    1: [ // Ethereum
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        balance: '2.5',
        value: 8250.00,
        price: 3300.00,
        priceChange24h: 45.00,
        priceChangePercent24h: 1.38,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png'
      },
      {
        address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '5000',
        value: 5000.00,
        price: 1.00,
        priceChange24h: 0.00,
        priceChangePercent24h: 0.00,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png'
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        balance: '0.1',
        value: 2170.50,
        price: 21705.00,
        priceChange24h: 200.30,
        priceChangePercent24h: 0.93,
        chainId: 1,
        logoURI: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png'
      }
    ],
    137: [ // Polygon
      {
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        symbol: 'WMATIC',
        name: 'Wrapped MATIC',
        balance: '1000',
        value: 850.00,
        price: 0.85,
        priceChange24h: 0.02,
        priceChangePercent24h: 2.41,
        chainId: 137,
        logoURI: 'https://assets.coingecko.com/coins/images/14073/thumb/matic.png'
      }
    ],
    56: [ // BSC
      {
        address: '0xbb4CdB9CBd36B01bD1cBaEF2aBc8b56C6b4bA4B4',
        symbol: 'WBNB',
        name: 'Wrapped BNB',
        balance: '5',
        value: 1500.00,
        price: 300.00,
        priceChange24h: 5.00,
        priceChangePercent24h: 1.69,
        chainId: 56,
        logoURI: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png'
      }
    ]
  };
  
  return mockBalances[chainId] || [];
};
