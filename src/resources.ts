import {
  ListResourcesCallback,
  McpServer,
  ReadResourceTemplateCallback,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { getTokenSupply } from "./solana/token";

interface AttachResourceParams {
  mcpServer: McpServer;
  name: string;
  uri: string;
  readCallback: ReadResourceTemplateCallback;
  list?: ListResourcesCallback;
}

function defaultList(uri: string, name: string) {
  return () => ({
    resources: [
      {
        uri,
        name,
        description: "Get the supply for a token mint",
      },
    ],
  });
}

export function attachResource(params: AttachResourceParams) {
  const {
    mcpServer,
    uri,
    name,
    readCallback,
    list = defaultList(uri, name),
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
    name: "getTokenSupply",
    uri: "token://{mint}/supply",
    mcpServer,
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
}
