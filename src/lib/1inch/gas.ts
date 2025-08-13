import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';

export interface GasPriceResponse {
  fast: number;
  standard: number;
  slow: number;
  timestamp: number;
}

export interface GasEstimateResponse {
  gasLimit: number;
  gasPrice: number;
  estimatedCost: string;
}

/**
 * Fetch current gas prices for a chain
 */
export const fetchGasPrice = async (
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<GasPriceResponse> => {
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockGasPrice();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/gas/v1.1/${chainId}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Gas API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockGasPrice();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return getMockGasPrice();
  }
};

/**
 * Estimate gas for a transaction
 */
export const estimateGas = async (
  from: string,
  to: string,
  data: string,
  value: string,
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<GasEstimateResponse> => {
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockGasEstimate();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/gas/v1.1/${chainId}/estimate`,
      {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to,
          data,
          value
        }),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Gas estimate API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockGasEstimate();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error estimating gas:', error);
    return getMockGasEstimate();
  }
};

/**
 * Get recommended gas price for transaction speed
 */
export const getRecommendedGasPrice = async (
  speed: 'fast' | 'standard' | 'slow' = 'standard',
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<number> => {
  try {
    const gasPrice = await fetchGasPrice(chainId);
    return gasPrice[speed];
  } catch (error) {
    console.error('Error getting recommended gas price:', error);
    return 20000000000; // 20 gwei default
  }
};

// Mock data for development
const getMockGasPrice = (): GasPriceResponse => ({
  fast: 25000000000, // 25 gwei
  standard: 20000000000, // 20 gwei
  slow: 15000000000, // 15 gwei
  timestamp: Date.now()
});

const getMockGasEstimate = (): GasEstimateResponse => ({
  gasLimit: 210000,
  gasPrice: 20000000000, // 20 gwei
  estimatedCost: '4200000000000000' // 0.0042 ETH
});
