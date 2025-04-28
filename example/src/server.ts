import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { solanaMCPServer } from "../../dist";
import { SOLANA_RPC_URL } from "./contants";

async function main() {
  await solanaMCPServer({
    transport: new StdioServerTransport(),
    config: {
      solanaRpcUrl: SOLANA_RPC_URL,
      commitment: "confirmed",
    },
  });
}

main();
