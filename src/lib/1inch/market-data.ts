/* eslint-disable @typescript-eslint/no-unused-vars */
import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';
import { QuoteResponse, TokenInfo, MarketData } from './types';

export const fetch1inchQuote = async (
  fromToken: string, 
  toToken: string, 
  amount: string
): Promise<QuoteResponse> => {
  if (!validateApiKey()) {
    // Return mock data if no API key
    return {
      fromToken: {
        address: fromToken,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6
      },
      toToken: {
        address: toToken,
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18
      },
      fromTokenAmount: amount,
      toTokenAmount: (parseFloat(amount) * 0.0005).toString(), // Mock rate
      protocols: [],
      estimatedGas: 210000,
      gasCost: '4200000000000000',
      gasPrice: '20000000000',
      tx: {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x1234567890123456789012345678901234567890',
        data: '0x',
        value: '0',
        gas: 210000,
        gasPrice: '20000000000'
      }
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/swap/v5.2/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Quote API error: ${response.status} - ${response.statusText}, using mock data`);
      // Return mock data on API error
      return {
        fromToken: {
          address: fromToken,
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6
        },
        toToken: {
          address: toToken,
          symbol: 'WETH',
          name: 'Wrapped Ether',
          decimals: 18
        },
        fromTokenAmount: amount,
        toTokenAmount: (parseFloat(amount) * 0.0005).toString(),
        protocols: [],
        estimatedGas: 210000,
        gasCost: '4200000000000000',
        gasPrice: '20000000000',
        tx: {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x1234567890123456789012345678901234567890',
          data: '0x',
          value: '0',
          gas: 210000,
          gasPrice: '20000000000'
        }
      };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching 1inch quote:', error);
    // Return mock data on network error
    return {
      fromToken: {
        address: fromToken,
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6
      },
      toToken: {
        address: toToken,
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18
      },
      fromTokenAmount: amount,
      toTokenAmount: (parseFloat(amount) * 0.0005).toString(),
      protocols: [],
      estimatedGas: 210000,
      gasCost: '4200000000000000',
      gasPrice: '20000000000',
      tx: {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x1234567890123456789012345678901234567890',
        data: '0x',
        value: '0',
        gas: 210000,
        gasPrice: '20000000000'
      }
    };
  }
};

export const fetchTokenPrice = async (tokenAddress: string, baseToken = '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8'): Promise<number> => {
  try {
    const quote = await fetch1inchQuote(tokenAddress, baseToken, '1000000000000000000'); // 1 token
    return parseFloat(quote.toTokenAmount) / parseFloat(quote.fromTokenAmount);
  } catch (error) {
    console.error('Error fetching token price:', error);
    return 0;
  }
};

export const fetchMarketData = async (tokenAddress: string): Promise<MarketData> => {
  try {
    const price = await fetchTokenPrice(tokenAddress);
    
    // Mock market data for now - in real implementation, this would come from additional APIs
    return {
      symbol: 'TOKEN',
      price,
      priceChange24h: price * 0.02, // 2% change
      priceChangePercent24h: 2.0,
      volume24h: price * 1000000,
      marketCap: price * 10000000,
      high24h: price * 1.05,
      low24h: price * 0.95,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

export const fetchMultipleTokenPrices = async (tokenAddresses: string[]): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {};
  
  try {
    await Promise.all(
      tokenAddresses.map(async (address) => {
        try {
          prices[address] = await fetchTokenPrice(address);
        } catch (error) {
          console.error(`Error fetching price for ${address}:`, error);
          prices[address] = 0;
        }
      })
    );
  } catch (error) {
    console.error('Error fetching multiple token prices:', error);
  }
  
  return prices;
};

// Helper function to get popular token addresses
export const getPopularTokenAddresses = () => ({
  USDC: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  BTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302'
});
