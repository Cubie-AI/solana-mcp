import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { BaseMCPConfig } from "./types";
import { DEFAULT_CLIENT_NAME, DEFAULT_CLIENT_VERSION } from "./utils";

/**
 * Parameters for starting the MCP client.
 */
export interface StartSolanaMCPClientParams extends BaseMCPConfig {
  /**
   * The transport mechanism to use for the client.
   * Can be either StdioClientTransport, SSEClientTransport, or StreamableHTTPClientTransport.
   */
  transport:
    | StdioClientTransport
    | SSEClientTransport
    | StreamableHTTPClientTransport;
}

/**
 * Function to start the MCP client.
 * Creates a new Client instance with the given transport.
 * You are required to call `client.connect(transport)` to establish the connection.
 */
export function solanaMCPClient(params: StartSolanaMCPClientParams) {
  const {
    name = DEFAULT_CLIENT_NAME,
    version = DEFAULT_CLIENT_VERSION,
    transport,
  } = params;

  const client = new Client({
    name,
    version,
    transport: transport,
  });

  return client;
}
