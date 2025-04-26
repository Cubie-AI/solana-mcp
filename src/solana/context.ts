import { Connection, Keypair } from "@solana/web3.js";

export class Context {
  constructor(public connection: Connection, public keypair?: Keypair) {}
}
