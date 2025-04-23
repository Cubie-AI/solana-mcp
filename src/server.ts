import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { attachAddressResources, attachTokenResources } from "./resources";
import { MCP_VERSION } from "./utils/constants";

interface StartMcpServerParams {
  name?: string;
  version?: string;
  transport: StdioServerTransport | SSEServerTransport;
}

export async function startMcpServer(params: StartMcpServerParams) {
  const {
    name = "Solana MCP Server",
    version = MCP_VERSION,
    transport,
  } = params;
  const mcpServer = new McpServer({
    name,
    version,
  });

  attachTokenResources(mcpServer);
  attachAddressResources(mcpServer);

  await mcpServer.connect(transport);

  console.log(`MCP Server started with name: ${name} and version: ${version}`);
  return mcpServer;
}
