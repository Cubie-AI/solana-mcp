import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Context } from "./solana";
import { bindTools } from "./tools";
import { BaseMCPConfig } from "./types";
import {
  DEFAULT_SERVER_NAME,
  DEFAULT_SERVER_VERSION,
  DEFAULT_SOLANA_CONFIG,
} from "./utils";

/**
 * Parameters for starting the MCP server.
 */
export interface SolanaMCPServerConfig<T extends Context = Context>
  extends BaseMCPConfig {
  /**
   * The transport mechanism to use for the server.
   * Can be either StdioServerTransport or SSEServerTransport.
   */
  transport:
    | StdioServerTransport
    | SSEServerTransport
    | StreamableHTTPServerTransport;
  /**
   * The configuration for the server.
   * This includes the Solana RPC URL, WebSocket URL, and commitment level.
   */
  config: T;
}

/**
 * Function to start the MCP server.
 * Creates an McpServer instance
 * Creates a new context from the configuration in the params.
 * Builds the tools to inject the context then binds them to the server.
 * You are required to call `server.connect(transport)` to start the server.
 */
export function solanaMCPServer<T extends Context>(
  params: SolanaMCPServerConfig<T>
) {
  const {
    name = DEFAULT_SERVER_NAME,
    version = DEFAULT_SERVER_VERSION,
    transport,
    config = DEFAULT_SOLANA_CONFIG,
  } = params;

  if (!transport) {
    throw new Error("Transport is required");
  }
  const mcpServer = new McpServer({
    name,
    version,
    transport,
  });

  bindTools(mcpServer, new Context(config));
  return mcpServer;
}
