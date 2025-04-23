# solana-mcp

## Installation

To install and use the `@cubie-ai/solana-mcp` package use the following command:

```
npm i @cubie-ai/solana-mcp
```

## Resources

View the available resources in: [RESOURCES](RESOURCES.md)

## Usage

### Create a Solana MCP server

Create a `server.js` file and add the following:

```typescript
import { startMcpServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = startMcpServer({
    name: "Solana MCP Server",
    version: "1.0.0",
    transaport: new StdioServerTransport(),
  });
}

main();
```

### Creating a MCP Client

Create a `client.js` file and add the following:

```typescript
import { startMcpClient } from "@cubie-ai/solana-mcp";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    args: ["server.js"],
    command: "node",
  });

  const client = startMcpClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transaport,
  });

  const resources = await client.listResources();

  console.dir(resources, { depth: null });

  console.log(
    "Retrieving token holders for mint: 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump"
  );

  const cubieHolders = await client.readResource({
    uri: "token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/holders",
  });

  console.dir(cubieHolders, { depth: null });
}

main();
```

The expected output of the above client program is:

```
MCP Client started with name: Solana MCP Client and version: 1.0.0
MCP Server has the following resources: {
  "resources": [
    {
      "uri": "token://{mint}/supply",
      "name": "getTokenSupply",
      "description": "Get the token supply for a given mint address"
    },
    {
      "uri": "token://{mint}/holders",
      "name": "getTokenHolders",
      "description": "Get the token holders for a given mint address"
    },
    {
      "uri": "token://{mint}/program",
      "name": "getTokenProgramByMintAddress",
      "description": "Get the token program ID for a given mint address"
    },
    {
      "uri": "address://{address}/balance",
      "name": "getAddressBalance",
      "description": "Get the wallet balance for a given address"
    },
    {
      "uri": "address://{address}/signatures",
      "name": "getSignaturesForAddress",
      "description": "Get the transaction signatures for a given address"
    },
    {
      "uri": "address://{address}/tokens",
      "name": "getTokensByAddress",
      "description": "Get the token holdings for a given address"
    }
  ]
}

Retrieving token holders for mint: 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump
{
  contents: [
    {
      uri: 'token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/holders',
      text: 'Token holders for 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
      mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
      holders: [
        {
          owner: 'HAMpE3xwU5bsRfKzzL45sgoYpCKcgtMeMmTKfrbs1oRv',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '199043148426',
          decimals: 6,
          uiAmount: 199043.148426,
          uiAmountString: '199043.148426'
        },
        {
          owner: '2Tmgd28h22G5xXUCRdeJSg1Kf3HYEV8Vz1vuHC6j6AWW',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '1',
          decimals: 6,
          uiAmount: 0.000001,
          uiAmountString: '0.000001'
        },
        {
          owner: 'BVi3YPRCFQeHd6AvgEr6C4gq2HZK6Gnw7i3fA75PnkZw',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '1098877766667',
          decimals: 6,
          uiAmount: 1098877.766667,
          uiAmountString: '1098877.766667'
        },
        ... 1400 more items
      ]
    }
  ]
}

```
