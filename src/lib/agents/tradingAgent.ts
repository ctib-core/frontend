import type {
  PredictionInput,
  PredictionOutput,
  AgentResultSummary,
  TradeExecutionResult,
} from "@/utils/types";
import { runPredictionTool } from "@/lib/tools/prediction";
import { runTradeExecutionTool } from "@/lib/tools/tradeExecution";

export async function runTradingAgent(input: PredictionInput): Promise<AgentResultSummary> {
  // 1) Ask prediction tool for plan
  const plan: PredictionOutput = await runPredictionTool(input);

  const executed: TradeExecutionResult[] = [];
  const failures: TradeExecutionResult[] = [];

  // 2) Execute each order (sequential for nonce safety; adjust as needed)
  for (const order of plan.orders) {
    try {
      const res = await runTradeExecutionTool({ order });
      if (res.status === "failed") failures.push(res);
      else executed.push(res);
    } catch (err: any) {
      failures.push({ order, status: "failed", error: err?.message ?? String(err) });
    }
  }

  return {
    plannedNumOrders: plan.numOrders,
    executed,
    failures,
    rationale: plan.rationale,
  };
}


