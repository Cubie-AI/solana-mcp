import { Connection } from "@solana/web3.js";

export class Context {
  constructor(public connection: Connection, public privateKey?: string) {}
}
