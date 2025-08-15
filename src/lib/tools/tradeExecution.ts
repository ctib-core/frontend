import type { OrderSpec, TradeExecutionResult } from "@/utils/types";
import { placeLimitOrder } from "@/lib/services/limitOrders";

export async function runTradeExecutionTool(args: { order: OrderSpec }): Promise<TradeExecutionResult> {
  return await placeLimitOrder(args.order);
}


