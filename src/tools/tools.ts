import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { Context, ContextConfig } from "../solana";
import { Err, Ok } from "../utils";
import { ServerToolSchema, ToolMethod } from "./tool.types";
import { SUPPORTED_TOOLS_MAP } from "./toolList";

/**
 * Returns a function that can be safely registered with an MCP server.
 * The function will call the tool method and convert the results so
 * that they adhere to the protocol.
 */
export function buildToolHandler<T extends Context = Context>(
  tool: ToolMethod<T>,
  context: T
) {
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

/**
 * Binds all the tools to the server.
 * see toolList.ts for the list of tools.
 */
export function bindTools<
  C extends ContextConfig,
  T extends Record<string, ServerToolSchema<C>>
>(server: McpServer, tools: T, context: C) {
  const allTools = Object.entries({
    ...SUPPORTED_TOOLS_MAP,
    ...tools,
  });

  for (const [name, tool] of allTools) {
    server.tool(
      name,
      tool.description,
      tool.parameters,
      buildToolHandler(tool.method, context)
    );
  }
}
