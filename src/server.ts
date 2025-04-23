import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { attachAddressResources, attachTokenResources } from "./resources";
import { createSolanaConnection } from "./solana/connection";
import { Context } from "./solana/context";

interface ServerConfig {
  solanaRpcUrl?: string;
  solanaRpcWsUrl?: string;
  commitment?: string;
}
interface StartMcpServerParams {
  name?: string;
  version?: string;
  transport: StdioServerTransport | SSEServerTransport;
  config: ServerConfig;
}

export async function startMcpServer(params: StartMcpServerParams) {
  const {
    name = "Solana MCP Server",
    version = "1.0.0",
    transport,
    config = {
      solanaRpcUrl: "https://api.mainnet-beta.solana.com",
      solanaRpcWsUrl: "wss://api.mainnet-beta.solana.com/stream",
      commitment: "confirmed",
    },
  } = params;

  const context = new Context(
    createSolanaConnection({
      rpcUrl: config.solanaRpcUrl,
      wsUrl: config.solanaRpcWsUrl,
      commitment: config.commitment,
    })
  );
  const mcpServer = new McpServer({
    name,
    version,
  });

  attachTokenResources(mcpServer, context);
  attachAddressResources(mcpServer, context);

  await mcpServer.connect(transport);

  console.log(`MCP Server started with name: ${name} and version: ${version}`);
  return mcpServer;
}
