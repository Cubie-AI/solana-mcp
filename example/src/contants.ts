import "dotenv/config";

export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
export const SOLANA_RPC_WS_URL =
  process.env.SOLANA_RPC_WS_URL || SOLANA_RPC_URL.replace("http", "ws");
