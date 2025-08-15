/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  chainId?: number;
}

export interface QuoteResponse {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: any[];
  estimatedGas: number;
  gasCost: string;
  gasPrice: string;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gas: number;
    gasPrice: string;
  };
}

export interface LimitOrderParams {
  makerAsset: string;
  takerAsset: string;
  makingAmount: string;
  takingAmount: string;
  maker: string;
  expiration?: number;
  salt?: string;
  receiver?: string;
}

export interface LimitOrder {
  makerAsset: string;
  takerAsset: string;
  makingAmount: string;
  takingAmount: string;
  maker: string;
  salt: string;
  receiver: string;
  allowedSender: string;
  interactions: string;
  expiration: number;
  nonce: number;
  signature: string;
  orderHash: string;
  status: 'pending' | 'filled' | 'cancelled' | 'expired';
  createdAt: number;
  filledAt?: number;
  cancelledAt?: number;
}

export interface PortfolioOverview {
  totalValue: number;
  totalValueChange24h: number;
  totalValueChangePercent24h: number;
  tokens: TokenBalance[];
  chains: ChainBalance[];
  protocols: ProtocolBalance[];
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  value: number;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  chainId: number;
  logoURI?: string;
}

export interface ChainBalance {
  chainId: number;
  chainName: string;
  totalValue: number;
  tokenCount: number;
}

export interface ProtocolBalance {
  protocolId: string;
  protocolName: string;
  totalValue: number;
  tokenCount: number;
  apr?: number;
  unclaimedFees?: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

export interface AIMarketData {
  quote: QuoteResponse;
  availableTokens: TokenInfo[];
  marketDepth: OrderBook;
  timestamp: number;
  volatility: number;
  liquidity: number;
}
