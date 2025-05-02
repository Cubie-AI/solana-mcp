/** Shared Configuration between clients and severs */
export interface BaseMCPConfig {
  /**
   * The name of the server.
   * Defaults to "Solana MCP Server".
   */
  name?: string;
  /**
   * The version of the server.
   * Defaults to "1.0.0".
   */
  version?: string;
}
