import { z, ZodRawShape } from "zod";
import {
  getAddressBalance,
  getAddressHoldings,
  getSignaturesForAddress,
} from "../solana/address";
import { getQuote } from "../solana/jupiter";
import {
  getTokenHolders,
  getTokenProgramByMintAddress,
  getTokenSupply,
} from "../solana/token";
import { ToolMethod } from "./tool.types";

type ToolSpec = {
  name: string;
  parameters: ZodRawShape;
  method: ToolMethod;
};

export const SUPPORTED_TOOLS: ToolSpec[] = [
  {
    name: "getTokenHolders",
    parameters: {
      mint: z.string(),
    },
    method: getTokenHolders,
  },
  {
    name: "getTokenSupply",
    parameters: {
      mint: z.string(),
    },
    method: getTokenSupply,
  },
  {
    name: "getTokenProgramByMintAddress",
    parameters: {
      mint: z.string(),
    },
    method: getTokenProgramByMintAddress,
  },

  // Tools for operating on an address
  {
    name: "getAddressBalance",
    parameters: {
      address: z.string(),
    },
    method: getAddressBalance,
  },
  {
    name: "getAddressHoldings",
    parameters: {
      address: z.string(),
    },
    method: getAddressHoldings,
  },
  {
    name: "getSignaturesForAddress",
    parameters: {
      address: z.string(),
    },
    method: getSignaturesForAddress,
  },

  // Jupiter tools
  {
    name: "getJupiterQuote",
    parameters: {
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.string(),
      slippage: z.string().optional(),
    },
    method: getQuote,
  },
];
