import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Context } from "../solana";
import { err, ok, Result } from "../utils";
import { ToolMethod } from "./tool.types";
import { SUPPORTED_TOOLS } from "./toolList";

function buildToolHandler(tool: ToolMethod, context: Context) {
  return async (args: any): Promise<CallToolResult> => {
    let result: Result;
    try {
      const data = await tool(args, context);
      result = ok(data);
    } catch (error) {
      result = err(error);
    }
    return {
      content: [
        {
          type: "text",
          success: result.success,
          ...(result?.data || {}),
        },
      ],
    };
  };
}

export function bindTools(server: McpServer, context: Context) {
  for (const { name, description, parameters, method } of SUPPORTED_TOOLS) {
    console.log(`Binding tool: ${name}`);
    server.tool(
      name,
      description,
      parameters,
      buildToolHandler(method, context)
    );
  }
}
