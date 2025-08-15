/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';
import { PortfolioOverview, TokenBalance } from './types';
import { getWalletAddresses } from './wallet';

export const fetchPortfolioOverview = async (addresses?: string[]): Promise<PortfolioOverview> => {
  // Use provided addresses or get from wallet manager
  const walletAddresses = addresses || getWalletAddresses();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockPortfolioOverview();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${walletAddresses.join(',')}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Portfolio API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockPortfolioOverview();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio overview:', error);
    // Return mock data for development
    return getMockPortfolioOverview();
  }
};

export const fetchPortfolioPnL = async (addresses?: string[]): Promise<any> => {
  // Use provided addresses or get from wallet manager
  const walletAddresses = addresses || getWalletAddresses();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockPortfolioPnL();
  }

  try {
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/portfolio/portfolio/v4/overview/erc20/profit_and_loss?addresses=${walletAddresses.join(',')}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      console.warn(`Portfolio PnL API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockPortfolioPnL();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio PnL:', error);
    return getMockPortfolioPnL();
  }
};

export const fetchPortfolioDetails = async (addresses?: string[]): Promise<any> => {
  // Use provided addresses or get from wallet manager
  const walletAddresses = addresses || getWalletAddresses();
  
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockPortfolioDetails();
  }

  try {
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/portfolio/portfolio/v4/overview/erc20/details?addresses=${walletAddresses.join(',')}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      console.warn(`Portfolio Details API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockPortfolioDetails();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio details:', error);
    return getMockPortfolioDetails();
  }
};

// Mock data for development
const getMockPortfolioOverview = (): PortfolioOverview => ({
  totalValue: 15420.50,
  totalValueChange24h: 245.30,
  totalValueChangePercent24h: 1.62,
  tokens: [
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
  chains: [
    {
      chainId: 1,
      chainName: 'Ethereum',
      totalValue: 15420.50,
      tokenCount: 3
    }
  ],
  protocols: [
    {
      protocolId: 'uniswap_v3',
      protocolName: 'Uniswap V3',
      totalValue: 8250.00,
      tokenCount: 2,
      apr: 12.5
    }
  ]
});

const getMockPortfolioPnL = () => ({
  totalPnL: 245.30,
  totalPnLPercent: 1.62,
  tokens: [
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      pnl: 112.50,
      pnlPercent: 1.38
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      pnl: 132.80,
      pnlPercent: 6.52
    }
  ]
});

const getMockPortfolioDetails = () => ({
  totalValue: 15420.50,
  totalValueChange24h: 245.30,
  totalValueChangePercent24h: 1.62,
  tokens: [
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      balance: '2.5',
      value: 8250.00,
      price: 3300.00,
      priceChange24h: 45.00,
      priceChangePercent24h: 1.38,
      chainId: 1
    }
  ]
});
