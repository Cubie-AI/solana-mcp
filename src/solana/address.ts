import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getPublicKey,
  InvalidValueError,
  validateListResponse,
} from "../utils";
import { Context } from "./context";

interface GetAddressBalanceParams {
  address: string;
}
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

interface GetSignatureParams {
  address: string;
  limit?: number;
  before?: string;
  until?: string;
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

interface GetAddressHoldingsParams {
  address: string;
}
export async function getAddressHoldings(
  params: GetAddressHoldingsParams,
  context: Context
) {
  const { address } = params;
  try {
    const mint = getPublicKey(address);
    const tokens = await context.connection.getParsedTokenAccountsByOwner(
      mint,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    const tokens2022 = await context.connection.getParsedTokenAccountsByOwner(
      mint,
      {
        programId: TOKEN_2022_PROGRAM_ID,
      }
    );

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
