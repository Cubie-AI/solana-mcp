import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Keypair } from "@solana/web3.js";
import { Context, createSolanaConnection } from "./solana";
import { bindTools } from "./tools";
import {
  DEFAULT_SERVER_NAME,
  DEFAULT_SERVER_VERSION,
  DEFAULT_SOLANA_CONFIG,
} from "./utils";

/**
 * Configuration used to create the runtime context for the server.
 */
export interface ServerConfig {
  /**
   * The URL of the Solana RPC endpoint.
   * Defaults to the mainnet-beta endpoint.
   */
  solanaRpcUrl?: string;
  /**
   * The URL of the Solana WebSocket endpoint.
   * Defaults to the mainnet-beta WebSocket endpoint.
   */
  solanaRpcWsUrl?: string;
  /**
   * The commitment level for the Solana connection.
   * Defaults to "confirmed".
   */
  commitment?: string;

  /**
   * The payer keypair.
   * This is used for signing transactions.
   */
  payerKeypair?: Keypair;
}

/**
 * Parameters for starting the MCP server.
 */
export interface StartMcpServerParams {
  /**
   * The transport mechanism to use for the server.
   * Can be either StdioServerTransport or SSEServerTransport.
   */
  transport: StdioServerTransport | SSEServerTransport;
  /**
   * The configuration for the server.
   * This includes the Solana RPC URL, WebSocket URL, and commitment level.
   */
  config: ServerConfig;
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

/**
 * Function to start the MCP server.
 * Creates an McpServer instance
 * Creates a new context from the configuration in the params.
 * Builds the tools to inject the context then binds them to the server.
 * Connects the server to the transport.
 */
export async function startMcpServer(params: StartMcpServerParams) {
  const {
    name = DEFAULT_SERVER_NAME,
    version = DEFAULT_SERVER_VERSION,
    transport,
    config = DEFAULT_SOLANA_CONFIG,
  } = params;

  const mcpServer = new McpServer({
    name,
    version,
  });

  const connection = createSolanaConnection(config);
  const context = new Context(connection, config?.payerKeypair);

  bindTools(mcpServer, context);
  await mcpServer.connect(transport);
  return mcpServer;
}
