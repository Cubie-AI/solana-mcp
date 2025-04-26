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

// JUPITER SWAP TYPES
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

// JUPITER PRICE TYPES

interface TokenPrice {
  id: string;
  type: string;
  price: string;
}

interface PriceResponse {
  data: Record<string, TokenPrice>;
  timeTaken: number;
}
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
