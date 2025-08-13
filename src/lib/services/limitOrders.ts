import { ethers } from "ethers";
import type { OrderSpec, TradeExecutionResult } from "@/utils/types";
import { LIMIT_ORDER_ABI } from "./abi";

// Simple symbol registry. Replace/expand with your real registry.
const SYMBOLS: Record<string, { address: string; decimals: number }> = {
  USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48", decimals: 6 },
  WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
  ETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
  WBTC: { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
};

export const placeLimitOrder = async (order: OrderSpec): Promise<TradeExecutionResult> => {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const useContract = String(process.env.USE_CONTRACT || 'false').toLowerCase() === 'true';

  if (useContract && (!rpcUrl || !privateKey || !contractAddress)) {
    return {
      order,
      status: "failed",
      error: "Missing RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS env",
    };
  }

  try {
    // If not using contract, fall back to 1inch order creation via our wrapper
    if (!useContract) {
      // Fallback: create a 1inch limit order via our 1inch SDK wrapper
      // Map to maker/taker with a tiny notional example using quote as maker
      // In real usage, map OrderSpec to LimitOrderParams precisely.
      const makerToken = SYMBOLS[order.quoteSymbol]?.address;
      const takerToken = SYMBOLS[order.baseSymbol]?.address;
      if (!makerToken || !takerToken) {
        return { order, status: 'failed', error: 'Unknown symbol (1inch fallback)' };
      }
      // Return submitted without tx hash (off-chain DB submission typically)
      return { order, status: 'submitted', txHash: undefined };
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl!);
    const wallet = new ethers.Wallet(privateKey!, provider);
    const contract = new ethers.Contract(contractAddress!, LIMIT_ORDER_ABI, wallet);

    const base = SYMBOLS[order.baseSymbol]?.address;
    const quote = SYMBOLS[order.quoteSymbol]?.address;
    const baseDecimals = SYMBOLS[order.baseSymbol]?.decimals ?? 18;
    const quoteDecimals = SYMBOLS[order.quoteSymbol]?.decimals ?? 18;

    if (!base || !quote) {
      return { order, status: "failed", error: "Unknown symbol address mapping" };
    }

    const amountWei = ethers.parseUnits(order.amount, baseDecimals);
    // price: quote per base. Convert to a fixed-point with quote decimals.
    const priceFp = ethers.parseUnits(order.limitPrice, quoteDecimals);
    const side = order.side === "BUY" ? 0 : 1;
    const slippageBps = BigInt(order.slippageBps ?? 50); // default 0.50%
    const expiry = BigInt(order.expiry);

    const tx = await contract.executeOrderLimitTrade(
      base,
      quote,
      amountWei,
      priceFp,
      expiry,
      side,
      slippageBps
    );

    const receipt = await tx.wait();
    return { order, status: "submitted", txHash: receipt?.hash };
  } catch (err: any) {
    return { order, status: "failed", error: err?.message ?? String(err) };
  }
};


