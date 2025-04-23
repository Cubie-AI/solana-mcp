import { Commitment, Connection } from "@solana/web3.js";
import {
  SOLANA_COMMITMENT,
  SOLANA_RPC_URL,
  SOLANA_RPC_WSS_URL,
} from "../utils/constants";

export const solana = new Connection(SOLANA_RPC_URL, {
  wsEndpoint: SOLANA_RPC_WSS_URL,
  commitment: SOLANA_COMMITMENT as Commitment,
});
