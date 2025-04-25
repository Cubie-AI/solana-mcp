import { VersionedTransaction } from "@solana/web3.js";
import { UnsupportedMethod } from "../utils/error";
import { Context } from "./context";
import { getTokenDecimals } from "./token";
import {
  extractTransactionInstructions,
  sendAndConfirmTransaction,
} from "./transaction";

interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage?: number;
  swapMode?: "ExactIn" | "ExactOut";
}

interface JupiteRouteResponse {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

interface JupiterQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee: null;
  priceImpactPct: string;
  routePlan: JupiteRouteResponse[];
  contextSlot: number;
  timeTaken: number;
}

interface SolanaMCPQuoteResponse extends JupiterQuoteResponse {
  outputUIAmount: string;
  inputUIAmount: string;
}

export async function getQuote(params: JupiterQuoteParams, context: Context) {
  try {
    const {
      inputMint,
      outputMint,
      amount,
      slippage = "100",
      swapMode = "ExactIn",
    } = params;

    const inputMintDecimals = await getTokenDecimals(
      { mint: inputMint },
      context
    );
    const outputMintDecimals = await getTokenDecimals(
      { mint: outputMint },
      context
    );

    let normalizedAmount;
    if (swapMode === "ExactIn") {
      normalizedAmount = amount * Math.pow(10, inputMintDecimals);
    } else {
      normalizedAmount = amount * Math.pow(10, outputMintDecimals);
    }

    const urlParams = new URLSearchParams({
      inputMint,
      outputMint,
      amount: normalizedAmount.toString(),
      slippageBps: slippage.toString(),
      swapMode,
    });

    const response = await fetch(
      `https://lite-api.jup.ag/swap/v1/quote?${urlParams.toString()}`
    );

    const quote = (await response.json()) as SolanaMCPQuoteResponse;

    if (!quote) {
      throw new Error("Invalid response from Jupiter API");
    }

    quote.inputUIAmount =
      "" + Number(quote.inAmount) / Math.pow(10, inputMintDecimals);
    quote.outputUIAmount =
      "" + Number(quote.outAmount) / Math.pow(10, outputMintDecimals);
    return quote;
  } catch (error) {
    throw error;
  }
}

interface JupiterSwapParams extends JupiterQuoteParams {}

interface JupiterSwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  computeUnitLimit: number;
  prioritizationType: {
    computeBudget: {
      microLamports: number;
      estimatedMicroLamports: number;
    };
  };
  dynamicSlippageReport: {
    slippageBps: number;
    otherAmount: number;
    simulatedIncurredSlippageBps: number;
    amplificationRatio: string;
    categoryName: string;
    heuristicMaxSlippageBps: number;
  };
  simulationError: null | string;
}
export async function swap(params: JupiterSwapParams, context: Context) {
  try {
    if (!context.privateKey) {
      throw new UnsupportedMethod("No private key provided");
    }

    const quote = await getQuote(params, context);

    // Call jupiter endpoint to return a base64 encoded transaction
    const swapTransaction = await fetch(
      "https://lite-api.jup.ag/swap/v1/swap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPublicKey: context.privateKey.publicKey.toBase58(),
          quoteResponse: quote,
          dynamicComputeUnitLimit: true,
          dynamicSlippage: true,
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 1000000,
              priorityLevel: "veryHigh",
            },
          },
        }),
      }
    );

    // Parse the response
    const swapResponse = (await swapTransaction.json()) as JupiterSwapResponse;

    // Convert the base64 encoded transaction to a buffer
    const buffer = Buffer.from(swapResponse.swapTransaction, "base64");

    // Deserialize the transaction
    const transaction = VersionedTransaction.deserialize(buffer);

    // Extract the relevant instructions from the transaction
    const instructions = await extractTransactionInstructions(
      transaction,
      context
    );

    // Call our redundant sendAndConfirmTransaction function
    const signature = await sendAndConfirmTransaction({
      instructions,
      payer: context.privateKey,
      signers: [],
      context,
    });

    return signature;
  } catch (error) {
    throw error;
  }
}
