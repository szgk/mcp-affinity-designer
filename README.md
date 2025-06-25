# MCP Affinity Designer Server
# MCP Affinity Designer サーバー

MCP (Model Context Protocol) server for Affinity Designer integration.
Affinity Designer統合用のMCP（Model Context Protocol）サーバーです。

## Overview
## 概要

This MCP server enables AI assistants to interact with Affinity Designer, providing capabilities for:
このMCPサーバーは、AIアシスタントがAffinity Designerと連携できるようにし、以下の機能を提供します：

- Document manipulation / ドキュメント操作
- Layer management / レイヤー管理
- Export operations / エクスポート操作
- Tool automation / ツール自動化

## Platform Support
## プラットフォームサポート

**Primary Target: Windows**
**主要ターゲット：Windows**

Windows implementation uses:
Windows実装では以下を使用します：
- PowerShell automation scripts / PowerShell自動化スクリプト
- COM (Component Object Model) if available / COM（Component Object Model）利用可能な場合
- Win32 API for window management / ウィンドウ管理用Win32 API
- .NET libraries for advanced functionality / 高度な機能用.NETライブラリ

**Secondary Target: macOS (Contributors Needed)**
**セカンダリターゲット：macOS（協力者募集中）**

We are seeking contributors with macOS environment to help implement:
macOS環境を持つ協力者を募集して以下の実装をお手伝いいただいています：
- AppleScript/JavaScript for Automation (JXA) integration
- macOS testing and validation
- Platform-specific feature development

If you have macOS and Affinity Designer, please see our [macOS support issue](https://github.com/szgk/mcp-affinity-designer/issues/6) for ways to contribute!
macOSとAffinity Designerをお持ちの方は、協力方法について[macOSサポートissue](https://github.com/szgk/mcp-affinity-designer/issues/6)をご覧ください！

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
## 開発

### Setup / セットアップ
```bash
# Install dependencies / 依存関係をインストール
npm install

# Build the project / プロジェクトをビルド
npm run build

# Run development server / 開発サーバーを実行
npm run dev
```

### Available Commands / 利用可能なコマンド
```bash
npm run build      # Build TypeScript to JavaScript / TypeScriptをJavaScriptにビルド
npm run dev        # Run development server with auto-reload / 自動リロード付き開発サーバーを実行
npm run lint       # Run ESLint for code quality / コード品質チェック用ESLintを実行
npm run typecheck  # Run TypeScript type checking / TypeScript型チェックを実行
```

### Testing / テスト
```bash
# Test the MCP server manually / MCPサーバーを手動でテスト
node test-server.js

# Or run the server directly / またはサーバーを直接実行
node dist/index.js
```

### Available Tools / 利用可能なツール
The MCP server currently provides these tools:
MCPサーバーは現在以下のツールを提供します：

- `get_server_info` - Get server information and status / サーバー情報とステータスを取得
- `check_affinity_designer` - Check Affinity Designer installation / Affinity Designerのインストールをチェック

## License

MIT