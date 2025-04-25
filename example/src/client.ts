import { startMcpClient } from "@cubie-ai/solana-mcp";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    args: ["dist/server.js"],
    command: "node",
  });

  const client = await startMcpClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transport,
  });

  const tools = await client.listTools();
  console.dir(tools, { depth: null });
}

main();
