import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';
import { TokenInfo } from './types';

export const fetchSupportedTokens = async (chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID): Promise<TokenInfo[]> => {
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockTokens();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Using the correct tokens API endpoint from the documentation
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/token/v1.2/${chainId}/custom`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Tokens API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockTokens();
    }
    
    const data = await response.json();
    // Convert the response format to match our TokenInfo interface
    return Object.entries(data).map(([address, tokenData]: [string, any]) => ({
      address,
      symbol: tokenData.symbol,
      name: tokenData.name,
      decimals: tokenData.decimals,
      logoURI: tokenData.logoURI,
      chainId: tokenData.chainId,
      tags: tokenData.tags || []
    }));
  } catch (error) {
    console.error('Error fetching supported tokens:', error);
    // Return mock data for development
    return getMockTokens();
  }
};

export const getPopularTokens = async (): Promise<TokenInfo[]> => {
  try {
    const allTokens = await fetchSupportedTokens();
    const popularSymbols = ['USDC', 'USDT', 'ETH', 'BTC', 'DAI', 'WETH', 'WBTC', '1INCH'];
    
    return allTokens.filter(token => 
      popularSymbols.includes(token.symbol.toUpperCase())
    );
  } catch (error) {
    console.error('Error fetching popular tokens:', error);
    return getMockPopularTokens();
  }
};

export const getTokenByAddress = async (address: string, chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID): Promise<TokenInfo | null> => {
  try {
    const tokens = await fetchSupportedTokens(chainId);
    return tokens.find(token => token.address.toLowerCase() === address.toLowerCase()) || null;
  } catch (error) {
    console.error('Error fetching token by address:', error);
    return null;
  }
};

export const getTokenBySymbol = async (symbol: string, chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID): Promise<TokenInfo | null> => {
  try {
    const tokens = await fetchSupportedTokens(chainId);
    return tokens.find(token => token.symbol.toUpperCase() === symbol.toUpperCase()) || null;
  } catch (error) {
    console.error('Error fetching token by symbol:', error);
    return null;
  }
};

// Mock data for development
const getMockTokens = (): TokenInfo[] => [
  {
    address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png',
    chainId: 1
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png',
    chainId: 1
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png',
    chainId: 1
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png',
    chainId: 1
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png',
    chainId: 1
  },
  {
    address: '0x111111111117dC0aa78b770fA6A738034120C302',
    symbol: '1INCH',
    name: '1inch',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png',
    chainId: 1
  }
];

const getMockPopularTokens = (): TokenInfo[] => [
  {
    address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png',
    chainId: 1
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png',
    chainId: 1
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png',
    chainId: 1
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png',
    chainId: 1
  }
];
