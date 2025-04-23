import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { attachAddressResources, attachTokenResources } from "./resources";
import { MCP_VERSION } from "./utils/constants";

export const mcpServer = new McpServer({
  name: "Solana MCP Server",
  version: MCP_VERSION,
});

attachTokenResources(mcpServer);
attachAddressResources(mcpServer);

const transport = new StdioServerTransport();
mcpServer.connect(transport);
