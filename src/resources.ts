import {
  ListResourcesCallback,
  McpServer,
  ReadResourceTemplateCallback,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import {
  getAddressBalance,
  getAddressHoldings,
  getSignaturesForAddress,
} from "./solana/address";
import {
  getTokenHolders,
  getTokenProgramByMintAddress,
  getTokenSupply,
} from "./solana/token";

interface AttachResourceParams {
  mcpServer: McpServer;
  name: string;
  uri: string;
  description?: string;
  readCallback: ReadResourceTemplateCallback;
  list?: ListResourcesCallback;
}

function defaultList(uri: string, name: string, description: string = "") {
  return () => ({
    resources: [
      {
        uri,
        name,
        description,
      },
    ],
  });
}

export function attachResource(params: AttachResourceParams) {
  const {
    mcpServer,
    uri,
    name,
    description = "",
    readCallback,
    list = defaultList(uri, name, description),
  } = params;

  mcpServer.resource(
    name,
    new ResourceTemplate(uri, {
      list,
    }),
    async (uri: any, args: any, extra: any) => {
      let result: ReadResourceResult = {
        contents: [{ uri, success: false, text: "Unknown error" }],
      };
      try {
        result = await readCallback(uri, args, extra);
      } catch (error) {
        console.error("Error in readCallback:", error);
        if (error instanceof Error) {
          result = {
            contents: [
              {
                uri,
                success: false,
                text: error.message,
              },
            ],
          };
        }
      }
      return result;
    }
  );
}

export function attachTokenResources(mcpServer: McpServer) {
  attachResource({
    mcpServer,
    name: "getTokenSupply",
    uri: "token://{mint}/supply",
    description: "Get the token supply for a given mint address",
    readCallback: async (uri: any, { mint }: any) => {
      if (typeof mint !== "string") {
        throw new Error("Invalid mint address");
      }

      const supply = await getTokenSupply(mint);

      return {
        contents: [
          {
            uri,
            text: `Token supply for ${mint}`,
            supply,
          },
        ],
      };
    },
  });

  attachResource({
    mcpServer,
    name: "getTokenHolders",
    uri: "token://{mint}/holders",
    description: "Get the token holders for a given mint address",
    readCallback: async (uri: any, { mint }: any) => {
      if (typeof mint !== "string") {
        throw new Error("Invalid mint address");
      }

      const holders = await getTokenHolders(mint);

      return {
        contents: [
          {
            uri,
            text: `Token holders for ${mint}`,
            mint,
            holders,
          },
        ],
      };
    },
  });

  attachResource({
    mcpServer,
    name: "getTokenProgramByMintAddress",
    uri: "token://{mint}/program",
    description: "Get the token program ID for a given mint address",
    readCallback: async (uri: any, { mint }: any) => {
      if (typeof mint !== "string") {
        throw new Error("Invalid mint address");
      }

      const program = await getTokenProgramByMintAddress(mint);

      return {
        contents: [
          {
            uri,
            text: `Token program for ${mint}`,
            program,
          },
        ],
      };
    },
  });
}

export function attachAddressResources(mcpServer: McpServer) {
  attachResource({
    mcpServer,
    name: "getAddressBalance",
    uri: "address://{address}/balance",
    description: "Get the wallet balance for a given address",
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
    mcpServer,
    name: "getSignaturesForAddress",
    uri: "address://{address}/signatures",
    description: "Get the transaction signatures for a given address",
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

  attachResource({
    mcpServer,
    name: "getTokensByAddress",
    uri: "address://{address}/tokens",
    description: "Get the token holdings for a given address",
    readCallback: async (uri: any, { address }: any) => {
      if (typeof address !== "string") {
        throw new Error("Invalid address");
      }

      const tokens = await getAddressHoldings(address);

      return {
        contents: [
          {
            uri,
            text: `Tokens for ${address}`,
            tokens,
          },
        ],
      };
    },
  });
}
