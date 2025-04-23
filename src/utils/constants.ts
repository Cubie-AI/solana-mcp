export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

export const SOLANA_RPC_WSS_URL =
  process.env.SOLANA_RPC_WSS_URL || SOLANA_RPC_URL.replace("http", "ws");

export const SOLANA_COMMITMENT = process.env.SOLANA_COMMITMENT || "confirmed";

export const MCP_VERSION = process.env.MCP_VERSION || "0.0.1";
