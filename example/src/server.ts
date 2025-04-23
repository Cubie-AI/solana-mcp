import { startMcpServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  await startMcpServer({
    name: "Solana MCP Server",
    version: "1.0.0",
    transport: new StdioServerTransport(),
  });
}

main();
