# MCP Affinity Designer Server
# MCP Affinity Designer サーバー

[![CI](https://github.com/szgk/mcp-affinity-designer/actions/workflows/ci.yml/badge.svg)](https://github.com/szgk/mcp-affinity-designer/actions/workflows/ci.yml)
[![PR Checks](https://github.com/szgk/mcp-affinity-designer/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/szgk/mcp-affinity-designer/actions/workflows/pr-checks.yml)
[![Documentation](https://github.com/szgk/mcp-affinity-designer/actions/workflows/docs.yml/badge.svg)](https://szgk.github.io/mcp-affinity-designer/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

📚 **[Complete Documentation & Examples](https://szgk.github.io/mcp-affinity-designer/)** | **[完全なドキュメントと例](https://szgk.github.io/mcp-affinity-designer/)**

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

## Prerequisites / 必要条件

### Affinity Product Installation Requirements
### Affinity製品インストール要件

**⚠️ IMPORTANT: MSI Installation Required**
**⚠️ 重要：MSIインストールが必要**

To use this MCP server with Affinity Designer, you must install Affinity products using the **MSI installer** from the official website. This ensures the application is installed to `C:\Program Files\` and creates the necessary registry entries for automation.

このMCPサーバーをAffinity Designerと使用するには、公式サイトから**MSIインストーラー**を使用してAffinity製品をインストールする必要があります。これにより、アプリケーションが`C:\Program Files\`にインストールされ、自動化に必要なレジストリエントリが作成されます。

### Custom Installation Paths Configuration
### カスタムインストールパス設定

If your Affinity Designer is installed in a non-standard location, you can customize the installation paths by editing the `affinity-install-paths.json` file in the project root:

Affinity Designerが非標準の場所にインストールされている場合、プロジェクトルートの`affinity-install-paths.json`ファイルを編集してインストールパスをカスタマイズできます：

```json
{
  "windows": {
    "affinityInstallPaths": [
      "C:\\Program Files\\Affinity\\Designer 2\\Designer.exe",
      "C:\\Program Files\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe",
      "C:\\Custom\\Path\\To\\Affinity Designer.exe"
    ]
  },
  "macos": {
    "affinityInstallPaths": [
      "/Applications/Affinity Designer 2.app/Contents/MacOS/Affinity Designer 2",
      "/Applications/Affinity Designer.app/Contents/MacOS/Affinity Designer",
      "/Custom/Path/To/Affinity Designer.app/Contents/MacOS/Affinity Designer"
    ]
  }
}
```

**Important Notes / 重要な注意事項:**
- Add your custom paths to the appropriate platform section / カスタムパスを適切なプラットフォームセクションに追加してください
- Use full paths to the executable file / 実行ファイルへのフルパスを使用してください
- On Windows, use double backslashes (`\\`) for path separators / Windowsでは、パス区切り文字に二重バックスラッシュ（`\\`）を使用してください
- The server will try each path in order until it finds a valid installation / サーバーは有効なインストールが見つかるまで各パスを順番に試行します

## Installation
## インストール

### GitHub Repository Clone Method / GitHubリポジトリクローン方法

```bash
# Clone the repository / リポジトリをクローン
git clone https://github.com/szgk/mcp-affinity-designer.git
cd mcp-affinity-designer

# Install dependencies / 依存関係をインストール
npm install

# Build the project / プロジェクトをビルド
npm run build
```

## Usage
## 使用方法

Configure your MCP client to use this server:
MCPクライアントがこのサーバーを使用するよう設定してください：

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

## Contributing / 貢献

### Development Workflow / 開発ワークフロー
Please follow our Git workflow and branch strategy when contributing:
貢献する際は、Gitワークフローとブランチ戦略に従ってください：

- **Read**: [WORKFLOW.md](./WORKFLOW.md) for detailed development guidelines
- **読む**: 詳細な開発ガイドラインは [WORKFLOW.md](./WORKFLOW.md) を参照
- **Read**: [CLAUDE.md](./CLAUDE.md) for project configuration and standards
- **読む**: プロジェクト設定と標準については [CLAUDE.md](./CLAUDE.md) を参照

### Quick Start for Contributors / 協力者向けクイックスタート
```bash
# 1. Create feature branch for issue / issue用featureブランチを作成
git checkout -b feature/issue-N-description

# 2. Write code and perform mandatory self-review / コードを書いて必須セルフレビューを実行
# Follow CODE_REVIEW_CHECKLIST.md before committing
# コミット前にCODE_REVIEW_CHECKLIST.mdに従う

# 3. Make changes with conventional commits / 従来のコミットで変更を作成
git commit -m "feat(scope): description

English description.

日本語説明。

Part of #N"

# 4. Push and create PR / プッシュしてPRを作成
git push -u origin feature/issue-N-description
gh pr create --title "Title" --body "Description"
```

### Code Quality / コード品質
All code must pass our quality standards:
全てのコードは品質基準を満たす必要があります：

- **Mandatory Review**: [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) must be followed
- **必須レビュー**: [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) に従う必要があります
- **Self-review required**: AI must review and fix code before committing
- **セルフレビュー必須**: AIはコミット前にコードをレビューし修正する必要があります

### Continuous Integration / 継続的インテグレーション
All pull requests automatically run quality checks:
全てのプルリクエストで品質チェックが自動実行されます：

- **TypeScript Type Checking** / TypeScript型チェック
- **ESLint Code Quality** / ESLintコード品質
- **Build Verification** / ビルド検証
- **Commit Message Format** / コミットメッセージ形式
- **Security Scanning** / セキュリティスキャン
- **Code Analysis** / コード分析

PRs must pass all checks before merging.
PRは全チェック合格後にマージ可能になります。

## License

MIT