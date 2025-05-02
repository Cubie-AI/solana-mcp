import { VersionedTransaction } from "@solana/web3.js";
import { Context } from "../context";
import { UnsupportedMethod } from "../utils";
import {
  GetPriceParams,
  JupiterQuoteParams,
  JupiterQuoteResponse,
  JupiterSwapParams,
  JupiterSwapResponse,
  PriceResponse,
  SolanaMCPQuoteResponse,
} from "./jupiter.types";
import { getTokenDecimals } from "./token";
import {
  extractTransactionInstructions,
  sendAndConfirmTransaction,
} from "./transaction";

const JUPITER_API_URL = `https://lite-api.jup.ag`;

/**
 * Fetches a quote for a swap using the Jupiter API.
 * To simplify the operations for an agent the params.amount uses the UI amount (before applying decimals).
 * ie: When swapping 1 SOL to USDC, the amount is 1.0 instead of 1000000000.
 */
export async function getQuote(
  params: JupiterQuoteParams,
  context: Context
): Promise<SolanaMCPQuoteResponse> {
  try {
    const {
      inputMint,
      outputMint,
      amount,
      slippage = "100",
      swapMode = "ExactIn",
    } = params;

    // When swap mode is ExactIn, the amount will be normalized using the input mint decimals.
    const inputMintDecimals = await getTokenDecimals(
      { mint: inputMint },
      context
    );

    // When swap mode is ExactOut, the amount will be normalized using the output mint decimals.
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
      `${JUPITER_API_URL}/swap/v1/quote?${urlParams.toString()}`
    );

    const quote = (await response.json()) as JupiterQuoteResponse;

    if (!quote) {
      throw new Error("Invalid response from Jupiter API");
    }
    return {
      ...quote,
      inputUIAmount:
        "" + Number(quote.inAmount) / Math.pow(10, inputMintDecimals),
      outputUIAmount:
        "" + Number(quote.outAmount) / Math.pow(10, outputMintDecimals),
    };
  } catch (error) {
    throw error;
  }
}

export async function swap(params: JupiterSwapParams, context: Context) {
  try {
    const { payerKeypair } = context;
    if (!payerKeypair) {
      throw new UnsupportedMethod(
        `No Keypair provided. Please provide a payer keypair to sign the transaction.`
      );
    }

    const quote = await getQuote(params, context);

    // Call jupiter endpoint to return a base64 encoded transaction
    const swapTransaction = await fetch(`${JUPITER_API_URL}/swap/v1/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userPublicKey: payerKeypair.publicKey.toBase58(),
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
    });

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
      payer: payerKeypair,
      signers: [],
      context,
    });

    return signature;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the price of a token in USD or another token.
 */
export async function getPrice(params: GetPriceParams) {
  try {
    const {
      inputMint,
      outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    } = params;

    const urlSearchParams = new URLSearchParams({
      ids: Array.isArray(inputMint) ? inputMint.join(",") : inputMint,
      vsToken: outputMint,
    });

    const response = await fetch(
      `${JUPITER_API_URL}/price/v2?${urlSearchParams}`
    );

    const responseJson = (await response.json()) as PriceResponse;

    if (
      response.status !== 200 ||
      !responseJson?.data ||
      !(inputMint in responseJson.data)
    ) {
      throw new Error(
        `Error fetching price: ${response.status} ${response.statusText}`
      );
    }

    return responseJson.data[inputMint];
  } catch (error) {
    throw error;
  }
}
