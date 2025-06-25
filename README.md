# MCP Affinity Designer Server

MCP (Model Context Protocol) server for Affinity Designer integration.

## Overview

This MCP server enables AI assistants to interact with Affinity Designer, providing capabilities for:
- Document manipulation
- Layer management
- Export operations
- Tool automation

## Installation

```bash
npm install mcp-affinity-designer
```

## Usage

Configure your MCP client to use this server:

```json
{
  "mcpServers": {
    "affinity-designer": {
      "command": "node",
      "args": ["./path/to/mcp-affinity-designer/dist/index.js"]
    }
  }
}
```

## Development

```bash
npm install
npm run build
npm run dev
```

## License

MIT