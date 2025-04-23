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

export async function startClient() {
  await client.connect(transport);

  const resources = await client.listResources();

  console.log(`Available resources: \n${JSON.stringify(resources, null, 2)}`);

  // const tokenSupply = await client.readResource({
  //   uri: "token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/supply",
  // });
  // console.dir(tokenSupply, { depth: null });

  // const tokenHolders = await client.readResource({
  //   uri: "token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/holders",
  // });
  // console.dir(tokenHolders, { depth: null });

  // const addressBalance = await client.readResource({
  //   uri: "address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/balance",
  // });

  // console.dir(addressBalance, { depth: null });

  // const addressSignatures = await client.readResource({
  //   uri: "address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/signatures",
  // });
  // console.dir(addressSignatures, { depth: null });

  const addressTokenHoldings = await client.readResource({
    uri: "address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/tokens",
  });

  console.dir(addressTokenHoldings, { depth: null });

  // const tokenProgramId = await client.readResource({
  //   uri: "token://2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo/program",
  // });
  // console.dir(tokenProgramId, { depth: null });
}
