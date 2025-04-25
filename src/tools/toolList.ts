import { z, ZodRawShape } from "zod";
import {
  getAddressBalance,
  getAddressHoldings,
  getSignaturesForAddress,
} from "../solana/address";
import { getPrice, getQuote } from "../solana/jupiter";
import {
  getTokenHolders,
  getTokenProgramByMintAddress,
  getTokenSupply,
} from "../solana/token";
import { ToolMethod } from "./tool.types";

type ToolSpec = {
  name: string;
  description: string;
  parameters: ZodRawShape;
  method: ToolMethod;
};

export const SUPPORTED_TOOLS: ToolSpec[] = [
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
