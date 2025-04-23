import { PublicKey } from "@solana/web3.js";
import { InvalidPublicKey } from "./error";

export function getPublicKey(address: string) {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new InvalidPublicKey(`Invalid public key: ${address}`);
  }
}
