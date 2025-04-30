/**
 * Parameters for fetching the Jupiter quote.
 */
interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  /** The UI amount of either the input or output mint. */
  amount: number;
  slippage?: number;
  /** The direction of the swap indicates whether the `amount` supplied should be normalized using the decimals of the input or output mint.
   * ExactIn: `amount` will be normalized using the input mint decimals.
   * ExactOut: `amount` will be normalized using the output mint decimals.
   */
  swapMode?: "ExactIn" | "ExactOut";
}

/**
 * Jupiter Route Response
 */
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

/**
 * Jupiter Quote Response
 */
export interface JupiterQuoteResponse {
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

/**
 * We wrap the Jupiter quote response to include UI amounts.
 * This provides user-friendly information directly to the agents
 */
interface SolanaMCPQuoteResponse extends JupiterQuoteResponse {
  outputUIAmount: string;
  inputUIAmount: string;
}

/**
 * Parameters for the Jupiter swap.
 */
interface JupiterSwapParams extends JupiterQuoteParams {}

/** Jupiter Swap Response */
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
/** Jupiter Basic Price Item */
interface TokenPrice {
  id: string;
  type: string;
  price: string;
}

/** Jupiter Price Response */
interface PriceResponse {
  data: Record<string, TokenPrice>;
  timeTaken: number;
}

/**
 * Parameters for fetching the price of a token.
 */
interface GetPriceParams {
  inputMint: string;
  outputMint?: string;
}

export {
  type GetPriceParams,
  type JupiterQuoteParams,
  type JupiterSwapParams,
  type JupiterSwapResponse,
  type PriceResponse,
  type SolanaMCPQuoteResponse,
  type TokenPrice,
};
