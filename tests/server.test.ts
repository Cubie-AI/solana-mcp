import { describe, it } from "@jest/globals";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Connection } from "@solana/web3.js";
import { createServer, Server } from "node:http";
import { AddressInfo } from "node:net";
import { solanaMCPClient, solanaMCPServer } from "../src";

describe("server", () => {
  async function setupServer() {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    const config = {
      name: "test",
      version: "1.0.0",
      context: {
        connection: new Connection(
          "https://attentive-misty-fire.solana-mainnet.quiknode.pro/0b36d5bc75f1cdb3d1a872cf5a66945bf0b412a4/"
        ),
        payerKeypair: undefined,
      },
      transport,
    };

    const mcpServer = solanaMCPServer(config);

    await mcpServer.connect(transport);

    server.on("request", (req, res) => {
      transport.handleRequest(req, res);
    });

    // Start the server on a random port
    const baseUrl = await new Promise<URL>((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const addr = server.address() as AddressInfo;
        resolve(new URL(`http://127.0.0.1:${addr.port}`));
      });
    });

    return {
      server,
      mcpServer,
      transport,
      baseUrl,
    };
  }

  let server: Server;
  let mcpServer: McpServer;
  let serverTransport: StreamableHTTPServerTransport;
  let baseUrl: URL;

  beforeEach(async () => {
    const setup = await setupServer();
    server = setup.server;
    mcpServer = setup.mcpServer;
    serverTransport = setup.transport;
    baseUrl = setup.baseUrl;
  });

  afterEach(async () => {
    await mcpServer.close().catch(() => {});
    await serverTransport.close().catch(() => {});
    server.close();
  });

  it("should support a client", async () => {
    const transport = new StreamableHTTPClientTransport(baseUrl);
    const client = solanaMCPClient({
      transport,
    });
    await client.connect(transport);

    const { tools } = await client.listTools();
    expect(tools).toBeDefined();
    expect(tools.length).toBeGreaterThan(0);
  });

  it("should throw error when using solana tools", async () => {
    const transport = new StreamableHTTPClientTransport(baseUrl);
    const client = solanaMCPClient({
      transport,
    });

    await client.connect(transport);

    const result = (await client.callTool({
      name: "getTokenSupply",
      arguments: {
        mint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    })) as any;

    console.dir(result);
    expect(result).toBeDefined();
    expect(result.isError);
  });
});
