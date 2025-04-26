import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Context, createSolanaConnection } from "./solana";
import { bindTools } from "./tools";
import {
  DEFAULT_SERVER_NAME,
  DEFAULT_SERVER_VERSION,
  DEFAULT_SOLANA_CONFIG,
} from "./utils";

interface ServerConfig {
  solanaRpcUrl?: string;
  solanaRpcWsUrl?: string;
  commitment?: string;
}
interface StartMcpServerParams {
  transport: StdioServerTransport | SSEServerTransport;
  config: ServerConfig;
  name?: string;
  version?: string;
}

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
  const context = new Context(connection);

  bindTools(mcpServer, context);
  await mcpServer.connect(transport);
  return mcpServer;
}
