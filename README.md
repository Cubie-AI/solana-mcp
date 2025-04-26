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
import { startMcpServer } from "@cubie-ai/solana-mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SOLANA_RPC_URL } from "./contants";

async function main() {
  await startMcpServer({
    name: "Solana MCP Server",
    version: "1.0.0",
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

  await client.connect(transport);

  // get the available tools
  const tools = await client.listTools();

  client.callTool({
    name: "getTokenHolders",
    params: {
      mint: "MINT",
    },
  });
}

main();
```
