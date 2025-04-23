import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface StartMcpClientParams {
  name?: string;
  version?: string;
  transport: StdioClientTransport | SSEClientTransport;
}
export async function startMcpClient(params: StartMcpClientParams) {
  const { name = "Solana MCP Client", version = "1.0.0", transport } = params;
  const client = new Client({
    name,
    version,
  });

  await client.connect(transport);

  console.log(`MCP Client started with name: ${name} and version: ${version}`);
  return client;
}
