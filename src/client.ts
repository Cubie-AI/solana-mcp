import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { DEFAULT_CLIENT_NAME, DEFAULT_CLIENT_VERSION } from "./utils";

interface StartMcpClientParams {
  transport: StdioClientTransport | SSEClientTransport;
  name?: string;
  version?: string;
}
export async function startMcpClient(params: StartMcpClientParams) {
  const {
    name = DEFAULT_CLIENT_NAME,
    version = DEFAULT_CLIENT_VERSION,
    transport,
  } = params;

  const client = new Client({
    name,
    version,
    transport: transport,
  });
  await client.connect(transport);

  console.log(`MCP Client started with name: ${name} and version: ${version}`);
  return client;
}
