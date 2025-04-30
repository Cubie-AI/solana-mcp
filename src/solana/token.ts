import { ParsedAccountData, TokenAmount } from "@solana/web3.js";
import { Context } from "../context";
import {
  getPublicKey,
  InvalidValueError,
  validateListResponse,
} from "../utils";

interface MintParams {
  /** The mint address of the token */
  mint: string;
}
export async function getTokenSupply(
  params: MintParams,
  context: Context
): Promise<TokenAmount> {
  const { mint } = params;
  try {
    const response = await context.connection.getTokenSupply(
      getPublicKey(mint),
      "confirmed"
    );

    if (!response || !response.value) {
      throw new Error("Invalid response from getTokenSupply");
    }

    return response.value;
  } catch (error) {
    throw error;
  }
}

export async function getTokenHolders(params: MintParams, context: Context) {
  try {
    const { mint } = params;
    const tokenProgramId = await getTokenProgramByMintAddress(
      { mint },
      context
    );
    const response = await context.connection.getParsedProgramAccounts(
      tokenProgramId,
      {
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 0,
              bytes: mint,
            },
          },
        ],
      }
    );

    validateListResponse(response, "TokenHolders");

    return response
      .map((data) => {
        const parsedData = data.account.data as ParsedAccountData;
        return {
          owner: data.pubkey.toBase58(),
          mint: parsedData.parsed.info.mint,
          ...(parsedData.parsed.info.tokenAmount || {}),
        };
      })
      .filter((data) => Number(data.amount) > 0);
  } catch (error) {
    throw error;
  }
}

export async function getTokenProgramByMintAddress(
  params: MintParams,
  context: Context
) {
  try {
    const { mint } = params;
    const response = await context.connection.getParsedAccountInfo(
      getPublicKey(mint)
    );

    if (!response || !response.value) {
      throw new InvalidValueError("Invalid response from getParsedAccountInfo");
    }

    const accountData = response.value.data as ParsedAccountData;
    if (!accountData.program) {
      throw new InvalidValueError(`${mint} is not a valid token mint address`);
    }

    return response.value.owner;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the number of decimals for a given token mint address.
 */
export async function getTokenDecimals(params: MintParams, context: Context) {
  try {
    const { mint } = params;
    const mintInfo = await context.connection.getParsedAccountInfo(
      getPublicKey(mint)
    );

    if (!mintInfo || !mintInfo.value || !mintInfo.value.data) {
      throw new InvalidValueError("Invalid response from getParsedAccountInfo");
    }

    const parsedData = mintInfo.value?.data as ParsedAccountData;

    return parsedData.parsed.info.decimals;
  } catch (error) {
    throw error;
  }
}
