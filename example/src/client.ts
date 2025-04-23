import { startMcpClient } from "@cubie-ai/solana-mcp";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { NATIVE_MINT } from "@solana/spl-token";

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

  const resources = await client.listResources();

  console.dir(resources, { depth: null });

  const tools = await client.listTools();

  console.dir(tools, { depth: null });

  const quote = await client.callTool({
    name: "getTokenQuote",
    arguments: {
      inputMint: NATIVE_MINT.toString(),
      outputMint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      amount: 1,
    },
  });

  console.dir(quote, { depth: null });
}

main();
