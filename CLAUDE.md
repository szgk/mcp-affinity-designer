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

## Git Workflow and Branch Strategy
## Gitワークフローとブランチ戦略

### Branch Naming Convention
### ブランチ命名規則

Always create feature branches for each GitHub issue:
各GitHub issueに対して必ずfeatureブランチを作成してください：

```bash
# Pattern: feature/issue-{number}-{short-description}
# パターン: feature/issue-{番号}-{短い説明}

git checkout -b feature/issue-1-mcp-server-foundation
git checkout -b feature/issue-2-api-research
git checkout -b feature/issue-3-document-management
```

**Branch Types / ブランチタイプ:**
- `feature/issue-N-description` - For implementing GitHub issues / GitHub issue実装用
- `hotfix/description` - For urgent bug fixes / 緊急バグ修正用
- `docs/description` - For documentation-only changes / ドキュメントのみの変更用

### Commit Guidelines
### コミットガイドライン

**Commit Message Format / コミットメッセージ形式:**
```
<type>(<scope>): <description>

<detailed description in English>

<detailed description in Japanese>

<optional footer>
```

**Commit Types / コミットタイプ:**
- `feat` - New feature / 新機能
- `fix` - Bug fix / バグ修正
- `docs` - Documentation changes / ドキュメント変更
- `style` - Code style changes (formatting, etc.) / コードスタイル変更（フォーマット等）
- `refactor` - Code refactoring / コードリファクタリング
- `test` - Adding or modifying tests / テスト追加・修正
- `chore` - Build process or auxiliary tool changes / ビルドプロセスや補助ツール変更

**Examples / 例:**
```bash
# Feature implementation / 機能実装
git commit -m "feat(mcp): implement basic server structure

Add core MCP server with stdio transport and error handling.

stdio トランスポートとエラーハンドリングを含むコアMCPサーバーを追加。

Addresses #1"

# Bug fix / バグ修正
git commit -m "fix(server): resolve connection timeout issue

Fix timeout handling in MCP server connection setup.

MCPサーバー接続設定でのタイムアウト処理を修正。

Fixes #15"

# Documentation / ドキュメント
git commit -m "docs(readme): update installation instructions

Update README with new installation steps and examples.

新しいインストール手順と例でREADMEを更新。"
```

### Workflow Steps
### ワークフロー手順

**1. Start working on an issue / issueの作業開始**
```bash
# Create and switch to feature branch / featureブランチを作成して切り替え
git checkout main
git pull origin main
git checkout -b feature/issue-N-description
```

**2. Make incremental commits / 増分コミット**
```bash
# Make small, logical commits / 小さく論理的なコミットを作成
git add -A
git commit -m "feat(scope): implement X functionality

Add X feature with proper error handling.

適切なエラーハンドリングでX機能を追加。

Part of #N"
```

**3. Complete the issue / issueの完了**
```bash
# Final commit that closes the issue / issueをクローズする最終コミット
git commit -m "feat(scope): complete Y implementation

Finish implementing Y feature with full functionality.

Y機能の完全な実装を完了。

Closes #N"

# Push branch / ブランチをプッシュ
git push -u origin feature/issue-N-description
```

**4. Create Pull Request / プルリクエスト作成**
- Create PR from feature branch to main / featureブランチからmainへのPR作成
- Reference the issue number in PR description / PR説明でissue番号を参照
- Wait for review or merge directly if working solo / レビューを待つか、単独作業の場合は直接マージ

**5. Clean up / クリーンアップ**
```bash
# After merge, clean up local branch / マージ後、ローカルブランチをクリーンアップ
git checkout main
git pull origin main
git branch -d feature/issue-N-description
```

### Commit Frequency Guidelines
### コミット頻度ガイドライン

**When to commit / コミットするタイミング:**
- After implementing a single logical feature / 単一の論理的機能を実装後
- After fixing a specific bug / 特定のバグを修正後
- After adding tests for new functionality / 新機能のテストを追加後
- Before major refactoring / 大規模なリファクタリング前
- At least once per work session / 作業セッションごとに最低1回

**Avoid / 避けるべきこと:**
- Mixing multiple features in one commit / 複数機能を1つのコミットに混在
- Committing broken/non-functional code / 壊れた/動作しないコードのコミット
- Very large commits with many changes / 多くの変更を含む非常に大きなコミット
- Generic commit messages like "fix" or "update" / "fix"や"update"のような汎用的なコミットメッセージ

## AI Code Review and Quality Standards
## AIコードレビューと品質基準

### Mandatory AI Self-Review Process
### 必須AIセルフレビュープロセス

**IMPORTANT: Claude must perform self-review after writing any code.**
**重要: Claudeはコードを書いた後、必ずセルフレビューを実行する必要があります。**

After creating or modifying code, Claude must:
コードを作成または修正した後、Claudeは以下を実行する必要があります：

1. **Review for redundancy / 冗長性の確認**
   - Remove duplicate code / 重複コードの削除
   - Eliminate unnecessary comments / 不要なコメントの除去
   - Simplify overly complex logic / 過度に複雑なロジックの簡素化

2. **Check readability / 可読性の確認**
   - Use clear, descriptive variable names / 明確で説明的な変数名を使用
   - Add meaningful comments only where necessary / 必要な場合のみ意味のあるコメントを追加
   - Ensure proper code structure and formatting / 適切なコード構造とフォーマットを確保

3. **Verify functionality / 機能の検証**
   - Ensure code builds without errors / エラーなしでコードがビルドされることを確認
   - Check for logical errors / 論理エラーの確認
   - Validate edge cases are handled / エッジケースが処理されていることを検証

4. **Optimize for maintainability / 保守性の最適化**
   - Follow project conventions / プロジェクト規約に従う
   - Use consistent naming patterns / 一貫した命名パターンを使用
   - Ensure code is self-documenting / コードが自己文書化されていることを確保

### Code Quality Requirements
### コード品質要件

**Readability Standards / 可読性基準:**
- Functions should be small and focused (< 50 lines ideal) / 関数は小さく焦点を絞る（50行未満が理想）
- Use meaningful names that explain purpose / 目的を説明する意味のある名前を使用
- Avoid deep nesting (> 3 levels) / 深いネスト（3レベル超）を避ける
- Group related functionality together / 関連する機能をグループ化

**Comment Guidelines / コメントガイドライン:**
- Write comments to explain "why", not "what" / "何を"ではなく"なぜ"を説明するコメントを書く
- Use bilingual comments for public APIs / パブリックAPIにはバイリンガルコメントを使用
- Remove TODO comments before committing / コミット前にTODOコメントを削除
- Update comments when code changes / コードが変更されたらコメントも更新

**Error Handling Standards / エラーハンドリング基準:**
- Always handle potential errors gracefully / 潜在的なエラーを常に適切に処理
- Provide meaningful error messages in both languages / 両言語で意味のあるエラーメッセージを提供
- Use appropriate error types and codes / 適切なエラータイプとコードを使用
- Log errors with sufficient context / 十分なコンテキストでエラーをログ

### Review Checklist for Claude
### Claude用レビューチェックリスト

Before finalizing any code, Claude must verify:
コードを確定する前に、Claudeは以下を検証する必要があります：

**Structure and Organization / 構造と組織:**
- [ ] Code follows project structure conventions / コードがプロジェクト構造規約に従っている
- [ ] Imports are organized and necessary / インポートが整理され必要である
- [ ] Functions are logically grouped / 関数が論理的にグループ化されている
- [ ] No dead or unreachable code / デッドコードや到達不可能なコードがない

**Naming and Documentation / 命名とドキュメント:**
- [ ] All variables have descriptive names / 全ての変数が説明的な名前を持つ
- [ ] Function names clearly describe their purpose / 関数名が目的を明確に説明している
- [ ] Complex logic has explanatory comments / 複雑なロジックに説明コメントがある
- [ ] Public interfaces have bilingual documentation / パブリックインターフェースにバイリンガルドキュメントがある

**Functionality and Reliability / 機能性と信頼性:**
- [ ] Code builds without warnings or errors / コードが警告やエラーなしでビルドされる
- [ ] All edge cases are handled / 全てのエッジケースが処理されている
- [ ] Error conditions are properly managed / エラー条件が適切に管理されている
- [ ] No magic numbers or hardcoded values / マジックナンバーやハードコードされた値がない

**Performance and Efficiency / パフォーマンスと効率性:**
- [ ] No obvious performance bottlenecks / 明らかなパフォーマンスボトルネックがない
- [ ] Resources are properly managed / リソースが適切に管理されている
- [ ] Algorithms are reasonably efficient / アルゴリズムが合理的に効率的である
- [ ] No memory leaks or resource leaks / メモリリークやリソースリークがない

**Maintainability / 保守性:**
- [ ] Code follows DRY principle / コードがDRY原則に従っている
- [ ] Dependencies are minimal and justified / 依存関係が最小限で正当化されている
- [ ] Code is testable / コードがテスト可能である
- [ ] Future modifications will be straightforward / 将来の修正が簡単である

### Immediate Action Required
### 即座に必要なアクション

When Claude identifies issues during self-review:
セルフレビュー中にClaude が問題を特定した場合：

1. **Fix immediately** - Don't wait for human feedback / **即座に修正** - 人間のフィードバックを待たない
2. **Explain changes** - Document what was improved / **変更を説明** - 改善された内容を文書化
3. **Re-review** - Check again after fixes / **再レビュー** - 修正後に再度確認
4. **Test thoroughly** - Ensure fixes don't break functionality / **徹底的にテスト** - 修正が機能を壊さないことを確認

## Platform Support
## プラットフォームサポート

- Windows (primary target with automation libraries like PowerShell, COM, .NET)
- macOS (secondary target - seeking contributors with macOS testing environment)

- Windows（PowerShell、COM、.NET等の自動化ライブラリによる主要ターゲット）
- macOS（セカンダリターゲット - macOSテスト環境を持つ協力者を募集中）

### Windows Automation Approach
### Windows自動化アプローチ

The Windows implementation will focus on:
Windows実装は以下に焦点を当てます：

- COM (Component Object Model) automation if available
- PowerShell scripts for application control
- Win32 API calls for window management
- File system monitoring for document changes

- 利用可能な場合はCOM（Component Object Model）自動化
- アプリケーション制御用PowerShellスクリプト
- ウィンドウ管理用Win32 API呼び出し
- ドキュメント変更のファイルシステム監視

### macOS Support Status
### macOSサポート状況

macOS support is planned but requires contributors with:
macOSサポートは計画されていますが、以下を持つ協力者が必要です：

- macOS development environment
- Affinity Designer installed on macOS
- Experience with AppleScript/JavaScript for Automation (JXA)
- Ability to test automation scripts

- macOS開発環境
- macOSにインストール済みのAffinity Designer
- AppleScript/JavaScript for Automation (JXA)の経験
- 自動化スクリプトのテスト能力