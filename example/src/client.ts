import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { solanaMCPClient } from "../../dist";

const CUBIE_MINT = "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump";
async function main() {
  const transport = new StdioClientTransport({
    args: ["dist/server.js"],
    command: "node",
  });

  const client = await solanaMCPClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transport: transport,
  });

  const tools = await client.listTools();
  console.dir(tools, { depth: null });

  const supply = await client.callTool({
    name: "getTokenSupply",
    arguments: {
      mint: CUBIE_MINT,
    },
  });
  console.dir(supply, { depth: null });
}

main();
