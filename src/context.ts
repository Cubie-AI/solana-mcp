import { Connection, Keypair } from "@solana/web3.js";

/**
 * Configuration used to create the runtime context for the server.
 */
export interface ContextConfig {
  /**
   * A connection to a fullnode JSON RPC endpoint
   */
  connection: Connection;

  /**
   * The payer keypair.
   * This is used for signing transactions.
   */
  payerKeypair?: Keypair;
}

export class Context {
  /**
   * The connection to the Solana cluster.
   */
  connection: Connection;
  /**
   * The payer keypair.
   * This is used for signing transactions.
   */
  payerKeypair?: Keypair;

  constructor({ connection, payerKeypair }: ContextConfig) {
    this.connection = connection;
    this.payerKeypair = payerKeypair;
  }
}
