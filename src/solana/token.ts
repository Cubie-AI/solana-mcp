import { TokenAmount } from "@solana/web3.js";
import { getPublicKey } from "../utils/helpers";
import { solana } from "./connection";

export async function getTokenSupply(mint: string): Promise<TokenAmount> {
  try {
    const response = await solana.getTokenSupply(
      getPublicKey(mint),
      "confirmed"
    );

    if (!response || !response.value) {
      throw new Error("Invalid response from getTokenSupply");
    }

    return response.value;
  } catch (error) {
    console.error("Error fetching token supply:", error);
    throw error;
  }
}
