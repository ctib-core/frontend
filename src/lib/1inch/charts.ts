import { ONECHIN_CONFIG, getAuthHeaders, validateApiKey } from './config';

export interface ChartDataPoint {
  time: number;
  value: number;
}

export interface LineChartResponse {
  data: ChartDataPoint[];
}

export interface CandleDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandleChartResponse {
  data: CandleDataPoint[];
}

export type ChartPeriod = '24H' | '1W' | '1M' | '1Y' | 'AllTime';
export type CandlePeriod = 300 | 900 | 3600 | 14400 | 86400 | 604800; // 5m, 15m, 1h, 4h, 1d, 1w

/**
 * Fetch historical line chart data for a token pair
 */
export const fetchLineChart = async (
  token0: string,
  token1: string,
  period: ChartPeriod,
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<LineChartResponse> => {
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockLineChartData();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/charts/v1.0/chart/line/${token0}/${token1}/${period}/${chainId}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Charts API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockLineChartData();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching line chart data:', error);
    return getMockLineChartData();
  }
};

/**
 * Fetch historical candle chart data for a token pair
 */
export const fetchCandleChart = async (
  token0: string,
  token1: string,
  seconds: CandlePeriod,
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<CandleChartResponse> => {
  if (!validateApiKey()) {
    console.warn('No API key found, using mock data');
    return getMockCandleChartData();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(
      `${ONECHIN_CONFIG.BASE_URL}/charts/v1.0/chart/aggregated/candle/${token0}/${token1}/${seconds}/${chainId}`,
      {
        headers: getAuthHeaders(),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Charts API error: ${response.status} - ${response.statusText}, using mock data`);
      return getMockCandleChartData();
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching candle chart data:', error);
    return getMockCandleChartData();
  }
};

/**
 * Get price history for a token pair (24h data)
 */
export const getPriceHistory = async (
  token0: string,
  token1: string,
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<ChartDataPoint[]> => {
  try {
    const chartData = await fetchLineChart(token0, token1, '24H', chainId);
    return chartData.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return getMockLineChartData().data;
  }
};

/**
 * Get candle data for trading charts
 */
export const getCandleData = async (
  token0: string,
  token1: string,
  period: CandlePeriod = 3600, // 1 hour candles by default
  chainId = ONECHIN_CONFIG.DEFAULT_CHAIN_ID
): Promise<CandleDataPoint[]> => {
  try {
    const chartData = await fetchCandleChart(token0, token1, period, chainId);
    return chartData.data;
  } catch (error) {
    console.error('Error fetching candle data:', error);
    return getMockCandleChartData().data;
  }
};

// Mock data for development
const getMockLineChartData = (): LineChartResponse => ({
  data: Array.from({ length: 24 }, (_, i) => ({
    time: Date.now() - (23 - i) * 3600000, // Last 24 hours
    value: 3000 + Math.random() * 200 - 100 // Random price around 3000
  }))
});

const getMockCandleChartData = (): CandleChartResponse => ({
  data: Array.from({ length: 24 }, (_, i) => {
    const basePrice = 3000 + Math.random() * 200 - 100;
    const open = basePrice;
    const close = basePrice + (Math.random() - 0.5) * 50;
    const high = Math.max(open, close) + Math.random() * 20;
    const low = Math.min(open, close) - Math.random() * 20;
    
    return {
      time: Date.now() - (23 - i) * 3600000,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000
    };
  })
});
