import { startMcpServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SOLANA_RPC_URL } from "./contants";

async function main() {
  await startMcpServer({
    name: "Solana MCP Server",
    version: "1.0.0",
    transport: new StdioServerTransport(),
    config: {
      solanaRpcUrl: SOLANA_RPC_URL,
      commitment: "confirmed",
    },
  });
}

main();
