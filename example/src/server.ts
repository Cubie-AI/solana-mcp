import {
  buildToolHandler,
  Context,
  solanaMCPServer,
} from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Connection } from "@solana/web3.js";
import z from "zod";
import { SOLANA_RPC_URL } from "./contants";

// Define your custom server context
// This is the context that will be passed to all tools
interface MyServerContext extends Context {
  myCustomValue: string;
}

// Define your custom tool
function myCustomTool(params: { test: string }, context: MyServerContext) {
  return context.myCustomValue;
}

async function main() {
  // Create the runtime context for the server
  const customServerConfig: MyServerContext = {
    myCustomValue: "myCustomValue",
    connection: new Connection(SOLANA_RPC_URL, {
      commitment: "confirmed",
    }),
  };

  // Create the transport mechanism for the server
  const transport = new StdioServerTransport();

  // Create the solana-mcp server
  const server = solanaMCPServer<MyServerContext>({
    transport,
    config: customServerConfig,
  });

  // Register the custom tool with the server
  server.tool(
    "testTool",
    "A tool for testing",
    {
      params: z.object({
        test: z.string(),
      }),
    },
    buildToolHandler(myCustomTool, customServerConfig)
  );

  // Start the server
  await server.connect(transport);
}

main();
