// import { startMcpClient } from "@cubie-ai/solana-mcp";
// import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// async function main() {
//   const transport = new StdioClientTransport({
//     args: ["server.js"],
//     command: "node",
//   });

//   const client = startMcpClient({
//     name: "Solana MCP Client",
//     version: "1.0.0",
//     transaport,
//   });

//   const resources = await client.listResources();

//   console.dir(resources, { depth: null });

//   console.log(
//     "Retrieving token holders for mint: 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump"
//   );

//   const cubieHolders = await client.readResource({
//     uri: "token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/holders",
//   });

//   console.dir(cubieHolders, { depth: null });
// }

// main();
