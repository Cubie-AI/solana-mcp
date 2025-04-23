import { Commitment, Connection } from "@solana/web3.js";

interface CreateSolanaConnectionParams {
  rpcUrl?: string;
  wsUrl?: string;
  commitment?: string;
}
export function createSolanaConnection(params: CreateSolanaConnectionParams) {
  let {
    rpcUrl = "https://api.mainnet-beta.solana.com",
    wsUrl = "",
    commitment = "confirmed",
  } = params;

  if (!wsUrl) {
    wsUrl = rpcUrl.replace("http", "ws");
  }

  return new Connection(rpcUrl, {
    commitment: commitment as Commitment,
    wsEndpoint: wsUrl,
  });
}
