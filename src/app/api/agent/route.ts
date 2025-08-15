/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { z } from "zod";
import { runTradingAgent } from "@/lib/agents/tradingAgent";

const RequestSchema = z.object({
  userIntent: z.string(),
  budget: z.string(),
  baseSymbol: z.string(),
  quoteSymbol: z.string(),
  timeframe: z.enum(["scalp", "swing", "position"]),
  riskTolerance: z.enum(["low", "medium", "high"]),
  marketSnapshot: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid payload", issues: parsed.error.flatten() }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const result = await runTradingAgent(parsed.data);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}


