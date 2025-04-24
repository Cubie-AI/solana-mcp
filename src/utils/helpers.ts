import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { PublicKey } from "@solana/web3.js";
import { InvalidPublicKey } from "./error";

export function getPublicKey(address: string) {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new InvalidPublicKey(`Invalid public key: ${address}`);
  }
}

interface SafeListResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type ExtractSafeResult<T extends (args: any) => Promise<any>> = SafeListResult<
  Awaited<ReturnType<T>>
>;

async function safeList<Method extends () => Promise<any>>(method: Method) {
  let result: ExtractSafeResult<Method>;

  try {
    const response = await method();
    if (!response) {
      throw new Error("Invalid response");
    }

    result = {
      success: true,
      data: response,
    };
  } catch (error) {
    result = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  return result;
}

export async function safeListResources(mcpClient: Client) {
  return await safeList(mcpClient.listResources);
}

export async function safeListTools(mcpClient: Client) {
  return await safeList(mcpClient.listTools);
}

export async function safeListPrompts(mcpClient: Client) {
  return await safeList(mcpClient.listPrompts);
}
