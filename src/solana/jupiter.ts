import { VersionedTransaction } from "@solana/web3.js";
import { UnsupportedMethod } from "../utils";
import { Context } from "./context";
import {
  GetPriceParams,
  JupiterQuoteParams,
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

export async function swap(params: JupiterSwapParams, context: Context) {
  try {
    if (!context.keypair) {
      throw new UnsupportedMethod(
        "To use the swap method, a keypair is required"
      );
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
          userPublicKey: context.keypair.publicKey.toBase58(),
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
      payer: context.keypair,
      signers: [],
      context,
    });

    return signature;
  } catch (error) {
    throw error;
  }
}

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
      `https://lite-api.jup.ag/price/v2?${urlSearchParams}`
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
