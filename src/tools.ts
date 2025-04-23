import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { Context } from "./solana/context";
import { getQuote } from "./solana/jupiter";

export function attachTokenTools(mcpServer: McpServer, context: Context) {
  mcpServer.tool(
    "getTokenQuote",
    {
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.number(),
    },
    async ({ inputMint, outputMint, amount }) => {
      const quote = await getQuote(
        {
          inputMint,
          outputMint,
          amount,
        },
        context
      );
      return {
        content: [
          {
            type: "text",
            text: `Quote for ${amount} ${quote.inputMint} to ${quote.outputMint}`,
            quote,
          },
        ],
      };
    }
  );
}
