import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getPublicKey,
  InvalidValueError,
  validateListResponse,
} from "../utils";
import {
  GetAddressBalanceParams,
  GetAddressHoldingsParams,
  GetSignatureParams,
} from "./address.types";
import { Context } from "./context";

export async function getAddressBalance(
  params: GetAddressBalanceParams,
  context: Context
) {
  const { address } = params;
  try {
    const accountInfo = await context.connection.getAccountInfo(
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
  params: GetSignatureParams,
  context: Context
) {
  const { address, limit, before, until } = params;
  try {
    const signatures = await context.connection.getSignaturesForAddress(
      getPublicKey(address),
      {
        limit,
        before,
        until,
      }
    );

    validateListResponse(signatures, "SignaturesForAddress");
    return signatures;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the Token and Token 2022 accounts for a given address.
 */
export async function getAddressHoldings(
  params: GetAddressHoldingsParams,
  context: Context
) {
  const { address } = params;
  const { connection } = context;
  try {
    const mint = getPublicKey(address);
    const tokens = await connection.getParsedTokenAccountsByOwner(mint, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokens2022 = await connection.getParsedTokenAccountsByOwner(mint, {
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
