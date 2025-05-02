import { describe } from "@jest/globals";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Connection } from "@solana/web3.js";
import { createServer, Server } from "node:http";
import { AddressInfo } from "node:net";
import path from "node:path";
import { solanaMCPClient, solanaMCPServer } from "../src";

describe("Client", () => {
  async function setupServer() {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    const config = {
      name: "test2",
      version: "1.0.0",
      context: {
        connection: new Connection(
          "https://attentive-misty-fire.solana-mainnet.quiknode.pro/0b36d5bc75f1cdb3d1a872cf5a66945bf0b412a4/"
        ),
      },
      transport,
    };

    const mcpServer = solanaMCPServer(config);

    mcpServer.connect(transport);

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

  let client: Client;

  beforeEach(async () => {
    const setup = await setupServer();
    server = setup.server;
    mcpServer = setup.mcpServer;
    serverTransport = setup.transport;
    baseUrl = setup.baseUrl;

    // Set up resuable Client
    const clientTransport = new StreamableHTTPClientTransport(
      new URL("/mcp", baseUrl)
    );
    client = solanaMCPClient({
      transport: clientTransport,
    });

    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await mcpServer.close().catch(() => {});
    await serverTransport.close().catch(() => {});
    server.close();
  });

  // IN THESE TESTS, WE ARE TESTING THE CLIENTS
  it("should be able to create a client with StdioClientTransport", async () => {
    const transport = new StdioClientTransport({
      command: "node",
      args: [path.join(__dirname, "../example/dist/server.js")],
    });
    const client = solanaMCPClient({
      transport,
    });

    await client.connect(transport);
    expect(client).toBeDefined();
  });

  it("should be able to connect to SSE server with StreamableHTTPCClient", async () => {
    const clientTransport = new StreamableHTTPClientTransport(
      new URL("/sse", baseUrl)
    );

    const client = solanaMCPClient({
      transport: clientTransport,
    });
    expect(client).toBeDefined();
    await client.connect(clientTransport);
    const tools = await client.listTools();
    expect(tools).toBeDefined();
  });

  it("should be able to create a client with StreamableHTTPClientTransport", async () => {
    const clientTransport = new StreamableHTTPClientTransport(
      new URL("/mcp", baseUrl)
    );

    const client = solanaMCPClient({
      transport: clientTransport,
    });
    expect(client).toBeDefined();
    await client.connect(clientTransport);
    const tools = await client.listTools();
    expect(tools).toBeDefined();
  });

  // TEST ALL TOOLS IN src/solana/token.ts
  it("should get token supply", async () => {
    const result = await client.callTool({
      name: "getTokenSupply",
      arguments: {
        mint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    });
    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
  });

  it("should get token holders", async () => {
    const result = await client.callTool({
      name: "getTokenHolders",
      arguments: {
        mint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    });
    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
  });

  it("should get token program by mint address", async () => {
    const result = await client.callTool({
      name: "getTokenProgramByMintAddress",
      arguments: {
        mint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    });
    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
  });

  it("should get token decimals", async () => {
    const result = await client.callTool({
      name: "getTokenDecimals",
      arguments: {
        mint: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    });
    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
  });

  // TEST ALL TOOLS IN src/solana/address.ts
  it("should get address balance", async () => {
    const result = await client.callTool({
      name: "getAddressBalance",
      arguments: {
        address: "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump",
      },
    });
    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
  });
});
