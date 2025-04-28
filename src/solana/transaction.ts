import {
  AddressLookupTableAccount,
  Keypair,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getErrorMessage } from "../utils";
import { Context } from "./context";

/**
 * Extracts the instructions from a transaction
 * Typically this is used when you receive a serialized transaction from
 * a third party and you want to extract the instructions from it.
 */
export async function extractTransactionInstructions(
  transaction: VersionedTransaction | Transaction,
  context: Context
) {
  let instructions = [];

  // For versioned transactions, we need to handle address lookup tables to
  // decompile the message and extract instructions.
  if (transaction instanceof VersionedTransaction) {
    const addressLookupTable = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await context.connection
              .getAccountInfo(lookup.accountKey)
              .then((res) => res?.data || new Uint8Array())
          ),
        });
      })
    );
    const message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts: addressLookupTable,
    });
    instructions.push(...message.instructions);
  } else {
    instructions.push(...transaction.instructions);
  }

  return instructions;
}

interface SendAndConfirmTransactionParams {
  instructions: TransactionInstruction[];
  payer: Keypair;
  signers: Keypair[];
  commitment?: "processed" | "confirmed" | "finalized";
  context: Context;
}

/**
 * Reusable function to build a transactions.
 * This allows for our sendAndConfirmTransaction to implement
 * retry logic for BlockHeightExceeded errors.
 */
export async function buildVersionedTransaction({
  payer,
  instructions,
  signers,
  context,
}: SendAndConfirmTransactionParams) {
  const latestBlockhash = await context.connection.getLatestBlockhash();
  const versionedMessage = new TransactionMessage({
    payerKey: payer.publicKey,
    instructions,
    recentBlockhash: latestBlockhash.blockhash,
  }).compileToV0Message();

  const versionedTransaction = new VersionedTransaction(versionedMessage);
  versionedTransaction.sign([payer, ...signers]);

  return versionedTransaction;
}
/**
 * Submits a transaction to the RPC node and polls for confirmation.
 * This function will retry the transaction if it fails with a BlockHeightExceeded error.
 */
export async function sendAndConfirmTransaction(
  params: SendAndConfirmTransactionParams
) {
  const {
    instructions,
    payer,
    signers,
    commitment = "confirmed",
    context,
  } = params;

  let signature = "";
  let currentCommitment = undefined;
  let failureCount = 0;
  let error = "";
  while (commitment !== currentCommitment && failureCount < 3) {
    try {
      if (!signature) {
        const versionedTransaction = await buildVersionedTransaction({
          payer,
          instructions,
          signers,
          context,
        });
        signature = await context.connection.sendTransaction(
          versionedTransaction
        );
      } else {
        const status = await context.connection.getSignatureStatus(signature);
        // In this case the transaction as successfully included in a block
        // but failed. Here we may want to retry the transaction.
        if (status?.value?.err) {
          error = `Transaction failed: ${JSON.stringify(status.value.err)}`;
          break;
        } else if (currentCommitment !== status.value?.confirmationStatus) {
          currentCommitment = status.value?.confirmationStatus;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      error = getErrorMessage(error);
      failureCount++;
    }
  }

  return {
    success: commitment === currentCommitment,
    signature,
    error,
  };
}
