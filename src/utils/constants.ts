import { ServerConfig } from "../server";

export const DEFAULT_SERVER_NAME = "Solana MCP Server";
export const DEFAULT_SERVER_VERSION = "1.0.0";

export const DEFAULT_CLIENT_NAME = "Solana MCP Client";
export const DEFAULT_CLIENT_VERSION = "1.0.0";

export const DEFAULT_COMMITMENT = "confirmed";
export const DEFAULT_SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

export const DEFAULT_SOLANA_CONFIG: ServerConfig = {
  solanaRpcUrl: DEFAULT_SOLANA_RPC_URL,
  solanaRpcWsUrl: DEFAULT_SOLANA_RPC_URL.replace("http", "ws"),
  commitment: DEFAULT_COMMITMENT,
  payerKeypair: undefined,
};
