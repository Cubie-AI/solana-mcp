import {
  AddressLookupTableAccount,
  Keypair,
  SendTransactionError,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Context } from "./context";

export async function extractTransactionInstructions(
  transaction: VersionedTransaction | Transaction,
  context: Context
) {
  let instructions = [];
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

export async function buildVersionedTransaction({
  payer,
  instructions,
  signers,
  context,
}: SendAndConfirmTransactionParams) {
  console.log("[TRANSACTION]:: Building versioned transaction...");

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
        console.log("Fetching transaction status...");
        const status = await context.connection.getSignatureStatus(signature);
        if (status?.value?.err) {
          throw new Error(
            `Transaction failed: ${JSON.stringify(status.value.err)}`
          );
        } else if (currentCommitment !== status.value?.confirmationStatus) {
          console.log(
            `Status changed from ${currentCommitment} to ${status.value?.confirmationStatus}`
          );
          currentCommitment = status.value?.confirmationStatus;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      if (error instanceof SendTransactionError) {
        console.log(await error.getLogs(context.connection));
      } else {
        console.error(error);
      }

      failureCount++;
    }
  }

  return {
    success: commitment === currentCommitment,
    signature,
  };
}
