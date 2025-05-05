import { Context, solanaMCPServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Connection } from "@solana/web3.js";
import z from "zod";

// Define your custom server context
// This is the context that will be passed to all tools
interface MyServerContext extends Context {
  myCustomValue: string;
}

// Define your custom tool which uses your custom context
function myCustomTool(params: { test: string }, context: MyServerContext) {
  return context.myCustomValue;
}

async function main() {
  // Create the runtime context for the server
  const customServerConfig = {
    connection: new Connection("https://api.mainnet-beta.solana.com"),
    myCustomValue: "myCustomValue",
  };

  // Create the transport mechanism for the server
  const transport = new StdioServerTransport();

  // Create the solana-mcp server passing you custome context
  const server = solanaMCPServer<MyServerContext>({
    transport,
    context: customServerConfig,
    tools: {
      myCustomTool: {
        description: "My custom tool",
        parameters: {
          test: z.string().describe("Test parameter"),
          additionalParam: z.number().describe("Additional parameter"),
        },
        method: myCustomTool, // Authomatic type inference on tool handlers
      },
    },
  });

  // Start the server
  await server.connect(transport);
}

main();
