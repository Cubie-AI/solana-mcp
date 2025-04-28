import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Context } from "../solana";
import { Err, Ok } from "../utils";
import { ToolMethod } from "./tool.types";
import { SUPPORTED_TOOLS } from "./toolList";

function buildToolHandler(tool: ToolMethod, context: Context) {
  return async (args: any) => {
    let result: CallToolResult;
    try {
      const data = await tool(args, context);
      result = Ok(data);
    } catch (error) {
      result = Err(error);
    }
    return result;
  };
}

export function bindTools(server: McpServer, context: Context) {
  for (const { name, description, parameters, method } of SUPPORTED_TOOLS) {
    server.tool(
      name,
      description,
      parameters,
      buildToolHandler(method, context)
    );
  }
}
