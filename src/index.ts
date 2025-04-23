import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { MCP_VERSION } from "./utils/constants";

const transport = new StdioClientTransport({
  args: ["dist/server.js"],
  command: "node",
});
const client = new Client({
  name: "Solana MCP Client",
  version: MCP_VERSION,
});

async function main() {
  await client.connect(transport);

  const resources = await client.listResources();

  console.log(`Available resources: \n${JSON.stringify(resources, null, 2)}`);

  // Read a resource
  const tokenSupply = await client.readResource({
    uri: "token://6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN/supply",
  });
  console.dir(tokenSupply, { depth: null });

  const addressBalance = await client.readResource({
    uri: "address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/balance",
  });

  console.dir(addressBalance, { depth: null });

  const addressSignatures = await client.readResource({
    uri: "address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/signatures",
  });
  console.dir(addressSignatures, { depth: null });
}

main();
