
// ai agents
// blockchain data
// 
export interface IAgent {
  name: string;
  id: number;
}

export type OrderSide = "BUY" | "SELL";

export interface OrderSpec {
  baseSymbol: string; // e.g., ETH
  quoteSymbol: string; // e.g., USDC
  side: OrderSide;
  amount: string; // human-readable decimal string
  limitPrice: string; // human-readable decimal string (quote per base)
  expiry: number; // unix seconds
  leverage?: number;
  reduceOnly?: boolean;
  slippageBps?: number; // 1 bps = 0.01%
}

export interface PredictionInput {
  userIntent: string;
  budget: string; // in quote units, decimal string
  baseSymbol: string;
  quoteSymbol: string;
  timeframe: "scalp" | "swing" | "position";
  riskTolerance: "low" | "medium" | "high";
  marketSnapshot?: Record<string, unknown>;
}

export interface PredictionOutput {
  numOrders: number;
  orders: OrderSpec[];
  rationale: string;
}

export interface TradeExecutionResult {
  order: OrderSpec;
  txHash?: string;
  status: "submitted" | "failed";
  error?: string;
}

export interface AgentResultSummary {
  plannedNumOrders: number;
  executed: TradeExecutionResult[];
  failures: TradeExecutionResult[];
  rationale: string;
}