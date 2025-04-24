import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { getPublicKey } from "../utils/helpers";
import { Context } from "./context";
import { sendAndConfirmTransaction } from "./transaction";

interface TransferSolanaParams {
  to: string;
  amount: number;
}
export async function transferSolana(
  params: TransferSolanaParams,
  context: Context
) {
  try {
    const amount = Math.floor(params.amount * LAMPORTS_PER_SOL); // 1 sol = 1e9 lamports
    const { to } = params;

    if (!context.privateKey) {
      throw new Error("Private key is required for transfer");
    }

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: context.privateKey.publicKey,
        toPubkey: getPublicKey(to), // Ensure to use the correct public key
        lamports: amount,
      }),
    ];

    const signature = await sendAndConfirmTransaction({
      instructions,
      payer: context.privateKey,
      context: context,
      signers: [],
      commitment: "confirmed",
    });

    return signature;
  } catch (error) {
    throw error;
  }
}
