import { ParsedAccountData, TokenAmount } from "@solana/web3.js";
import { InvalidValueError } from "../utils/error";
import { getPublicKey } from "../utils/helpers";
import { validateListResponse } from "../utils/validators";
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
    throw error;
  }
}

export async function getTokenHolders(mint: string) {
  try {
    const tokenProgramId = await getTokenProgramByMintAddress(mint);
    const response = await solana.getParsedProgramAccounts(tokenProgramId, {
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
    });

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

export async function getTokenProgramByMintAddress(mint: string) {
  try {
    const response = await solana.getParsedAccountInfo(getPublicKey(mint));

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
