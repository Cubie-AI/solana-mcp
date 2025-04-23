import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { MCP_VERSION } from "./utils/constants";

interface StartMcpClientParams {
  name?: string;
  version?: string;
  transport: StdioClientTransport | SSEClientTransport;
}
export async function startMcpClient(params: StartMcpClientParams) {
  const {
    name = "Solana MCP Client",
    version = MCP_VERSION,
    transport,
  } = params;
  const client = new Client({
    name,
    version,
  });

  await client.connect(transport);

  console.log(`MCP Client started with name: ${name} and version: ${version}`);
  return client;
}
