# Claude Code Project Configuration
# Claude Code プロジェクト設定

## Project Context
## プロジェクトコンテキスト

This is an MCP (Model Context Protocol) server for Affinity Designer integration. The goal is to enable AI assistants to interact with Affinity Designer through automation.

これはAffinity Designer統合用のMCP（Model Context Protocol）サーバーです。AIアシスタントが自動化を通してAffinity Designerと連携できるようにすることが目標です。

## Language Requirements
## 言語要件

**IMPORTANT: All text output in this project must include both English and Japanese versions.**

**重要：このプロジェクトでは、全てのテキスト出力に英語版と日本語版の両方を含める必要があります。**

### Documentation Standards
### ドキュメント標準

- All comments must be bilingual (English / Japanese)
- All commit messages must include Japanese translations
- All documentation files must have both languages
- All error messages and logs should be bilingual when possible

- 全てのコメントはバイリンガル（英語/日本語）である必要があります
- 全てのコミットメッセージに日本語訳を含める必要があります
- 全てのドキュメントファイルは両言語で記述する必要があります
- エラーメッセージとログは可能な限りバイリンガルにする必要があります

### Code Comment Format
### コードコメント形式

```typescript
// Create new document with specified dimensions
// 指定されたサイズで新しいドキュメントを作成
function createDocument(width: number, height: number) {
  // Implementation here
  // 実装はこちら
}
```

### Git Commit Format
### Git コミット形式

```
Add document creation functionality

Add functionality to create new documents with specified dimensions.

新しいドキュメント作成機能を追加

指定されたサイズで新しいドキュメントを作成する機能を追加しました。

🤖 Generated with Claude Code(https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Development Guidelines
## 開発ガイドライン

### File Structure
### ファイル構造

- `src/` - TypeScript source code / TypeScript ソースコード
- `docs/` - Documentation files / ドキュメントファイル
- `examples/` - Usage examples / 使用例
- `tests/` - Test files / テストファイル

### Testing
### テスト

Use the following commands for testing:
テストには以下のコマンドを使用してください：

```bash
npm run test      # Run unit tests / ユニットテストを実行
npm run lint      # Run ESLint / ESLintを実行
npm run typecheck # Run TypeScript type checking / TypeScript型チェックを実行
npm run build     # Build the project / プロジェクトをビルド
```

## MCP Server Information
## MCPサーバー情報

This server will provide the following capabilities:
このサーバーは以下の機能を提供します：

- Document management (create, open, save, export)
- Layer operations (create, delete, rename, show/hide)
- Object manipulation (select, move, resize, rotate)
- Export functionality (PNG, JPG, PDF, SVG)

- ドキュメント管理（作成、開く、保存、エクスポート）
- レイヤー操作（作成、削除、名前変更、表示/非表示）
- オブジェクト操作（選択、移動、サイズ変更、回転）
- エクスポート機能（PNG、JPG、PDF、SVG）

## Platform Support
## プラットフォームサポート

- macOS (primary target with AppleScript/JXA support)
- Windows (secondary target with automation libraries)

- macOS（AppleScript/JXAサポートによる主要ターゲット）
- Windows（自動化ライブラリによるセカンダリターゲット）