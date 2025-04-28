# Solana MCP

A solana MCP server.

![Cubie](https://github.com/Cubie-AI/tiny-ai/blob/main/publicMedia.png?raw=true)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)

## Installation

To install and use the `@cubie-ai/solana-mcp` package use the following command:

```
npm i @cubie-ai/solana-mcp
```

## Documentation

Read the docs: [DOCUMENTATION](https://cubie-ai.github.io/solana-mcp/)

## Getting Started

### Creating a Server

```typescript
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
```

### Creating a client

```typescript
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { solanaMCPClient } from "../../dist";

const CUBIE_MINT = "2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump";
async function main() {
  const transport = new StdioClientTransport({
    args: ["dist/server.js"],
    command: "node",
  });

  const client = await solanaMCPClient({
    name: "Solana MCP Client",
    version: "1.0.0",
    transport: transport,
  });

  const tools = await client.listTools();
  console.dir(tools, { depth: null });

  const supply = await client.callTool({
    name: "getTokenSupply",
    arguments: {
      mint: CUBIE_MINT,
    },
  });
  console.dir(supply, { depth: null });
}

main();
```

## Example

Running the example will produce the following output

```js
{
  tools: [
    {
      name: "getTokenHolders",
      description: "Get token holders for a specific mint address",
      inputSchema: {
        type: "object",
        properties: { mint: { type: "string" } },
        required: ["mint"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getTokenSupply",
      description: "Get the total supply of a specific token",
      inputSchema: {
        type: "object",
        properties: { mint: { type: "string" } },
        required: ["mint"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getTokenProgramByMintAddress",
      description: "Get the token program by mint address",
      inputSchema: {
        type: "object",
        properties: { mint: { type: "string" } },
        required: ["mint"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getAddressBalance",
      description: "Get the balance of a specific address",
      inputSchema: {
        type: "object",
        properties: { address: { type: "string" } },
        required: ["address"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getAddressHoldings",
      description: "Get the holdings of a specific address",
      inputSchema: {
        type: "object",
        properties: { address: { type: "string" } },
        required: ["address"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getSignaturesForAddress",
      description: "Get the signatures for a specific address",
      inputSchema: {
        type: "object",
        properties: { address: { type: "string" } },
        required: ["address"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getJupiterQuote",
      description: "Get a quote from Jupiter for a specific swap",
      inputSchema: {
        type: "object",
        properties: {
          inputMint: { type: "string" },
          outputMint: { type: "string" },
          amount: { type: "string" },
          slippage: { type: "string" },
        },
        required: ["inputMint", "outputMint", "amount"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
    {
      name: "getPrice",
      description: "Get the price of a specific token",
      inputSchema: {
        type: "object",
        properties: {
          inputMint: { type: "string" },
          outputMint: {
            type: "string",
            default: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          },
        },
        required: ["inputMint"],
        additionalProperties: false,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
    },
  ];
}
{
  content: [
    {
      type: "text",
      text: '{"amount":"999725949874932","decimals":6,"uiAmount":999725949.874932,"uiAmountString":"999725949.874932"}',
    },
  ];
}
```
