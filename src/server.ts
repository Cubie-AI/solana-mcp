import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { attachResource, attachTokenResources } from "./resources";
import { getAddressBalance, getSignaturesForAddress } from "./solana/address";
import { MCP_VERSION } from "./utils/constants";

export const mcpServer = new McpServer({
  name: "Solana MCP Server",
  version: MCP_VERSION,
});

mcpServer.resource("test", "test://name", async (uri: any) => {
  return {
    contents: [
      {
        uri,
        text: "Hello, world!",
        data: { message: "Hello, world!" },
      },
    ],
  };
});

attachTokenResources(mcpServer);

attachResource({
  name: "getAddressBalance",
  uri: "address://{address}/balance",
  mcpServer,
  readCallback: async (uri: any, { address }: any) => {
    if (typeof address !== "string") {
      throw new Error("Invalid address");
    }

    const balance = await getAddressBalance(address);

    return {
      contents: [
        {
          uri,
          text: `Wallet balance for ${address}`,
          balance,
        },
      ],
    };
  },
});

attachResource({
  name: "getSignaturesForAddress",
  uri: "address://{address}/signatures",
  mcpServer,
  readCallback: async (uri: any, { address, limit, before, until }: any) => {
    if (typeof address !== "string") {
      throw new Error("Invalid address");
    }

    const signatures = await getSignaturesForAddress(address, limit, {
      before,
      until,
    });

    return {
      contents: [
        {
          uri,
          text: `Signatures for ${address}`,
          signatures,
        },
      ],
    };
  },
});
const transport = new StdioServerTransport();
mcpServer.connect(transport);
