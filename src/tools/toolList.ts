import { z } from "zod";
import {
  getPrice,
  getQuote,
  getTokenDecimals,
  getTokenHolders,
  getTokenProgramByMintAddress,
  getTokenSupply,
} from "../solana";
import {
  getAddressBalance,
  getAddressHoldings,
  getSignaturesForAddress,
} from "../solana/";

export const SUPPORTED_TOOLS = [
  {
    name: "getTokenHolders",
    description: "Get token holders for a specific mint address",
    parameters: {
      mint: z.string(),
    },
    method: getTokenHolders,
  },
  {
    name: "getTokenSupply",
    description: "Get the total supply of a specific token",
    parameters: {
      mint: z.string(),
    },
    method: getTokenSupply,
  },
  {
    name: "getTokenProgramByMintAddress",
    description: "Get the token program by mint address",
    parameters: {
      mint: z.string(),
    },
    method: getTokenProgramByMintAddress,
  },

  {
    name: "getTokenDecimals",
    description: "Get the decimals of a specific token",
    parameters: {
      mint: z.string(),
    },
    method: getTokenDecimals,
  },

  // Tools for operating on an address
  {
    name: "getAddressBalance",
    description: "Get the balance of a specific address",
    parameters: {
      address: z.string(),
    },
    method: getAddressBalance,
  },
  {
    name: "getAddressHoldings",
    description: "Get the holdings of a specific address",
    parameters: {
      address: z.string(),
    },
    method: getAddressHoldings,
  },
  {
    name: "getSignaturesForAddress",
    description: "Get the signatures for a specific address",
    parameters: {
      address: z.string(),
    },
    method: getSignaturesForAddress,
  },

  // Jupiter tools
  {
    name: "getJupiterQuote",
    description: "Get a quote from Jupiter for a specific swap",
    parameters: {
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.string(),
      slippage: z.string().optional(),
    },
    method: getQuote,
  },

  {
    name: "getPrice",
    description: "Get the price of a specific token",
    parameters: {
      inputMint: z.string(),
      outputMint: z
        .string()
        .optional()
        .default("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    },
    method: getPrice,
  },
];

export const SUPPORTED_TOOLS_MAP = SUPPORTED_TOOLS.reduce(
  (acc, tool) => ({
    ...acc,
    [tool.name]: {
      description: tool.description,
      parameters: tool.parameters,
      method: tool.method,
    },
  }),
  {}
);
