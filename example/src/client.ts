import { solanaMCPClient } from "@cubie-ai/solana-mcp";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const CUBIE_MINT = "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump";
async function main() {
  const transport = new StdioClientTransport({
    args: ["dist/server.js"],
    command: "node",
  });

  const client = solanaMCPClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transport: transport,
  });

  await client.connect(transport);

  const tools = await client.listTools();

  const supply = await client.callTool({
    name: "getTokenSupply",
    arguments: {
      mint: CUBIE_MINT,
    },
  });
}

main();
