import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getErrorMessage } from "./error";

export function Err(error: unknown): CallToolResult {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: getErrorMessage(error),
      },
    ],
  };
}

export function Ok(data: any): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data),
      },
    ],
  };
}
