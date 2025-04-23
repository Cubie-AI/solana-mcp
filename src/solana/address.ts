import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { InvalidValueError } from "../utils/error";
import { getPublicKey } from "../utils/helpers";
import { validateListResponse } from "../utils/validators";
import { solana } from "./connection";

export async function getAddressBalance(address: string) {
  try {
    const accountInfo = await solana.getAccountInfo(
      getPublicKey(address),
      "confirmed"
    );

    if (!accountInfo || !accountInfo.lamports) {
      throw new InvalidValueError("Invalid response from getParsedAccountInfo");
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

    validateListResponse(signatures, "SignaturesForAddress");

    return signatures;
  } catch (error) {
    throw error;
  }
}

export async function getAddressHoldings(address: string) {
  try {
    const mint = getPublicKey(address);
    const tokens = await solana.getParsedTokenAccountsByOwner(mint, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokens2022 = await solana.getParsedTokenAccountsByOwner(mint, {
      programId: TOKEN_2022_PROGRAM_ID,
    });

    const allTokens = [];
    if (tokens.value && tokens.value.length > 0) {
      allTokens.push(...tokens.value);
    }
    if (tokens2022.value && tokens2022.value.length > 0) {
      allTokens.push(...tokens2022.value);
    }

    return allTokens.map((data) => ({
      mint: data.account.data.parsed.info.mint,
      ...(data.account.data.parsed.info.tokenAmount ?? {}),
    }));
  } catch (error) {
    throw error;
  }
}
