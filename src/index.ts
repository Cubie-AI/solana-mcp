import { NATIVE_MINT } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";
import { startMcpClient } from "./client";
import { startMcpServer } from "./server";
import { Context } from "./solana/context";
import { swap } from "./solana/jupiter";

async function main() {
  const swapTransaction = await swap(
    {
      inputMint: NATIVE_MINT.toBase58(),
      outputMint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      amount: 1,
    },
    new Context(
      new Connection(
        "https://attentive-misty-fire.solana-mainnet.quiknode.pro/0b36d5bc75f1cdb3d1a872cf5a66945bf0b412a4/"
      ),
      Keypair.generate()
    )
  );
  console.dir(swapTransaction, { depth: null });
}

main();
export { startMcpClient, startMcpServer };
