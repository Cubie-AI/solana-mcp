import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getPublicKey } from "../utils/helpers";
import { solana } from "./connection";

export async function getAddressBalance(address: string) {
  try {
    const accountInfo = await solana.getAccountInfo(
      getPublicKey(address),
      "confirmed"
    );

    console.dir(accountInfo, { depth: null });

    if (!accountInfo || !accountInfo.lamports) {
      throw new Error("Invalid response from getParsedAccountInfo");
    }

    return {
      amount: accountInfo.lamports,
      amountString: "" + accountInfo.lamports,
      uiAmount: accountInfo.lamports / LAMPORTS_PER_SOL,
      uiAmountString: "" + accountInfo.lamports / LAMPORTS_PER_SOL,
    };
  } catch (error) {
    throw error;
  }
}

export async function getSignaturesForAddress(
  address: string,
  limit = 1000,
  options?: {
    before?: string;
    until?: string;
  }
) {
  try {
    const signatures = await solana.getSignaturesForAddress(
      getPublicKey(address),
      {
        limit,
        ...(options ?? {}),
      }
    );

    if (!signatures || !signatures.length) {
      throw new Error("Invalid response from getSignaturesForAddress");
    }

    return signatures;
  } catch (error) {
    throw error;
  }
}
