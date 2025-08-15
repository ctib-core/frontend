// Read API key from any of these (client-safe first). Avoid hardcoded defaults.
const API_KEY = process.env.NEXT_1INCH_API;

export const ONECHIN_CONFIG = {
  API_KEY: `${API_KEY}`,
  BASE_URL: 'https://api.1inch.dev',
  NETWORK_ID: 1, // Ethereum mainnet
  DEFAULT_CHAIN_ID: 1,
  SUPPORTED_CHAINS: [1, 137, 56, 42161, 10, 8453] // Ethereum, Polygon, BSC, Arbitrum, Optimism, Base
};

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${ONECHIN_CONFIG.API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

export const validateApiKey = () => {
  if (!ONECHIN_CONFIG.API_KEY) {
    console.warn('1inch API key not found. Please set NEXT_PUBLIC_1INCH_API (client) or NEXT_1INCH_API/ONEINCH_API_KEY (server).');
    return false;
  }
  return true;
};
