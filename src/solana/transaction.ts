import {
  AddressLookupTableAccount,
  Commitment,
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Context } from "../context";
import { getErrorMessage, UnsupportedMethod } from "../utils";

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
    context: { connection } = { connection: null },
  } = params;

  let result;

  try {
    if (!connection) {
      throw new UnsupportedMethod(
        "sendAndConfirmTransaction requires a connection"
      );
    }

    const versionedTransaction = await buildVersionedTransaction({
      payer,
      instructions,
      signers,
      context: { connection },
    });

    const signature = await connection.sendTransaction(versionedTransaction);

    const confirmed = await confirmTransaction({
      signature,
      connection,
      commitment,
    });

    result = {
      signature,
      success: confirmed?.success ?? false,
    };
  } catch (error) {
    error = getErrorMessage(error);
  }

  return result;
}

interface ConfirmTransactionParams {
  signature: string;
  connection: Connection;
  commitment?: Commitment;
}
/**
 * Confirms a transaction by polling the RPC node for its status.
 */
async function confirmTransaction(params: ConfirmTransactionParams) {
  const { signature, connection, commitment = "confirmed" } = params;
  let attempts = 0;
  let result;
  let currentCommitment = undefined;
  try {
    while (commitment !== currentCommitment && attempts < 3) {
      const status = await connection.getSignatureStatus(signature);

      // In this case the transaction was successfully included in a block
      // but failed. Here we may want to retry the transaction.
      if (status?.value?.err) {
        throw new Error(
          `Transaction failed: ${JSON.stringify(status.value.err)}`
        );
      }

      currentCommitment = status.value?.confirmationStatus;
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (attempts >= 3) {
      throw new Error(
        "Transaction confirmation timed out. Exceeded 3 attempts."
      );
    }

    result = {
      success: true,
      signature,
    };
  } catch (error) {
    result = {
      success: false,
      error: getErrorMessage(error),
    };
  } finally {
    return result;
  }
}
