# Solana MCP

## Installation

To install and use the `@cubie-ai/solana-mcp` package use the following command:

```
npm i @cubie-ai/solana-mcp
```

## Resources

View the available resources in: [RESOURCES](RESOURCES.md)

## Usage

I've provided a fully self-contained example in: [/example](/example/) which includes both the server and the client.

### Running the example

To run the example client and server move to the `/example` directory and install the required npm packages:

```
cd example
npm i
```

Next copy the `.env.example` into `.env` and populate the required fields:

```
SOLANA_RPC_URL=
SOLANA_RPC_WSS_URL=
SOLANA_COMMITMENT=
```

Then run the example using:

```
npm start
```

### Create a Solana MCP server

Create a `server.js` file and add the following:

```typescript
import { startMcpServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  await startMcpServer({
    name: "Solana MCP Server",
    version: "1.0.0",
    transport: new StdioServerTransport(),
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
    args: ["dist/server.js"],
    command: "node",
  });

  const client = await startMcpClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transport,
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

The expected output of the example program is:

```
user@machine ~/solana-mcp/example [main]: npm start

> solana-mcp-example@1.0.0 prestart
> npm run build


> solana-mcp-example@1.0.0 build
> rm -rf dist/ && tsc


> solana-mcp-example@1.0.0 start
> node --env-file=.env dist/client.js

MCP Client started with name: Solana MCP Client and version: 1.0.0
{
  resources: [
    {
      uri: 'token://{mint}/supply',
      name: 'getTokenSupply',
      description: 'Get the token supply for a given mint address'
    },
    {
      uri: 'token://{mint}/holders',
      name: 'getTokenHolders',
      description: 'Get the token holders for a given mint address'
    },
    {
      uri: 'token://{mint}/program',
      name: 'getTokenProgramByMintAddress',
      description: 'Get the token program ID for a given mint address'
    },
    {
      uri: 'address://{address}/balance',
      name: 'getAddressBalance',
      description: 'Get the wallet balance for a given address'
    },
    {
      uri: 'address://{address}/signatures',
      name: 'getSignaturesForAddress',
      description: 'Get the transaction signatures for a given address'
    },
    {
      uri: 'address://{address}/tokens',
      name: 'getTokensByAddress',
      description: 'Get the token holdings for a given address'
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
          owner: '2Z169Z5yiZ9oWKcLozg554j92mwew7G7U1nbcNntg8gf',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '1762076148',
          decimals: 6,
          uiAmount: 1762.076148,
          uiAmountString: '1762.076148'
        },
        {
          owner: 'D8PEpdPjoRGBk3zrH1kwHuyzkwTcjj845kGXQYzJzSYV',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '6',
          decimals: 6,
          uiAmount: 0.000006,
          uiAmountString: '0.000006'
        },
        ... 700 more items
      ]
    }
  ]
}

```
