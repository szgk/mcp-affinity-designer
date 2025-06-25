# Development Workflow Guide
# 開発ワークフローガイド

This guide explains how to properly work with GitHub issues using our branch strategy and commit conventions.
このガイドでは、ブランチ戦略とコミット規約を使用してGitHub issueを適切に処理する方法を説明します。

## Quick Reference
## クイックリファレンス

### Branch Creation / ブランチ作成
```bash
# For issue #N with description
# issue #N (説明付き)の場合
git checkout main
git pull origin main
git checkout -b feature/issue-N-short-description
```

### Commit Format / コミット形式
```bash
git commit -m "type(scope): description

Detailed description in English.

日本語での詳細説明。

Part of #N"  # or "Addresses #N" or "Closes #N"
```

## Step-by-Step Workflow
## ステップバイステップワークフロー

### 1. Starting Work on an Issue
### 1. issueでの作業開始

**Before starting / 作業開始前:**
- Assign yourself to the issue / issueを自分にアサイン
- Read the issue description and acceptance criteria / issue説明と受け入れ基準を読む
- Comment on the issue if you need clarification / 明確化が必要な場合はissueにコメント

**Create feature branch / featureブランチ作成:**
```bash
# Make sure you're on main and up to date
# mainブランチにいて最新であることを確認
git checkout main
git pull origin main

# Create feature branch with descriptive name
# 説明的な名前でfeatureブランチを作成
git checkout -b feature/issue-2-api-research

# Example branch names / ブランチ名の例:
# feature/issue-2-api-research
# feature/issue-3-document-management  
# feature/issue-4-layer-operations
# hotfix/server-crash-fix
# docs/update-readme
```

### 2. Making Commits
### 2. コミット作成

**Commit early and often / 早期に頻繁にコミット:**
- Make a commit after each logical unit of work / 論理的な作業単位ごとにコミット
- Don't wait until the entire feature is complete / 機能全体が完了するまで待たない
- Each commit should build successfully / 各コミットは正常にビルドされる必要がある

**Commit message examples / コミットメッセージ例:**

```bash
# Initial setup commit / 初期設定コミット
git commit -m "feat(api): add Windows automation research structure

Create initial file structure for researching Windows automation options.
Include PowerShell and COM investigation framework.

Windows自動化調査用の初期ファイル構造を作成。
PowerShellとCOM調査フレームワークを含む。

Part of #2"

# Implementation commit / 実装コミット  
git commit -m "feat(api): implement PowerShell detection script

Add PowerShell script to detect Affinity Designer installation.
Include error handling and logging functionality.

Affinity Designerインストール検出用PowerShellスクリプトを追加。
エラーハンドリングとログ機能を含む。

Addresses #2"

# Final commit / 最終コミット
git commit -m "feat(api): complete Windows automation research

Finish research with comprehensive documentation of available automation 
methods. Include proof-of-concept scripts and recommendations.

利用可能な自動化方法の包括的なドキュメントで調査を完了。
概念実証スクリプトと推奨事項を含む。

Closes #2"
```

### 3. Commit Types and Scopes
### 3. コミットタイプとスコープ

**Common types / 一般的なタイプ:**
- `feat` - New features / 新機能
- `fix` - Bug fixes / バグ修正  
- `docs` - Documentation / ドキュメント
- `test` - Tests / テスト
- `refactor` - Code refactoring / コードリファクタリング
- `style` - Formatting, semicolons, etc. / フォーマット、セミコロン等
- `chore` - Build process, dependencies / ビルドプロセス、依存関係

**Common scopes / 一般的なスコープ:**
- `mcp` - MCP server core / MCPサーバーコア
- `api` - Affinity Designer API / Affinity Designer API
- `server` - Server functionality / サーバー機能
- `tools` - MCP tools / MCPツール
- `docs` - Documentation / ドキュメント
- `test` - Testing / テスト
- `config` - Configuration / 設定

### 4. Push and Pull Request
### 4. プッシュとプルリクエスト

**Push your branch / ブランチをプッシュ:**
```bash
# Push feature branch to GitHub
# featureブランチをGitHubにプッシュ
git push -u origin feature/issue-N-description
```

**Create Pull Request / プルリクエスト作成:**
```bash
# Using GitHub CLI / GitHub CLIを使用
gh pr create --title "Implement feature X (Issue #N)" --body "
## Summary / 概要

Brief description of what was implemented.
実装内容の簡潔な説明。

## Changes / 変更点

- List of main changes
- 主要な変更点のリスト

## Testing / テスト

How the changes were tested.
変更のテスト方法。

Closes #N
"
```

### 5. After Merge / マージ後

**Clean up local branches / ローカルブランチのクリーンアップ:**
```bash
# Switch back to main / mainに戻る
git checkout main

# Pull latest changes / 最新の変更をプル
git pull origin main

# Delete the feature branch / featureブランチを削除
git branch -d feature/issue-N-description

# Delete remote tracking branch / リモート追跡ブランチを削除
git remote prune origin
```

## Best Practices
## ベストプラクティス

### Do's / すべきこと

✅ **Create feature branches for every issue / 全issueにfeatureブランチを作成**
✅ **Use descriptive branch names / 説明的なブランチ名を使用**
✅ **Make small, focused commits / 小さく焦点を絞ったコミット**
✅ **Write clear commit messages in both languages / 両言語で明確なコミットメッセージを書く**
✅ **Reference issue numbers in commits / コミットでissue番号を参照**
✅ **Test your changes before committing / コミット前に変更をテスト**
✅ **Clean up branches after merge / マージ後にブランチをクリーンアップ**

### Don'ts / してはいけないこと

❌ **Don't commit directly to main / mainに直接コミットしない**
❌ **Don't make huge commits with many changes / 多くの変更を含む巨大なコミットを作らない**
❌ **Don't use generic commit messages / 汎用的なコミットメッセージを使わない**
❌ **Don't commit broken code / 壊れたコードをコミットしない**
❌ **Don't forget to reference issue numbers / issue番号の参照を忘れない**
❌ **Don't leave feature branches around after merge / マージ後にfeatureブランチを残さない**

## Troubleshooting
## トラブルシューティング

### Common Issues / よくある問題

**Branch is behind main / ブランチがmainより遅れている:**
```bash
git checkout main
git pull origin main
git checkout feature/issue-N-description
git rebase main
```

**Need to fix commit message / コミットメッセージを修正する必要がある:**
```bash
# For the last commit / 最後のコミットの場合
git commit --amend

# For multiple commits / 複数のコミットの場合
git rebase -i HEAD~n  # where n is number of commits
```

**Accidentally committed to main / 誤ってmainにコミット:**
```bash
# Create branch from current position / 現在の位置からブランチを作成
git checkout -b feature/issue-N-description

# Reset main to previous state / mainを前の状態にリセット
git checkout main
git reset --hard HEAD~1  # or to specific commit
```

## Tools and Automation
## ツールと自動化

### Helpful Git Aliases / 便利なGitエイリアス
```bash
# Add to your ~/.gitconfig / ~/.gitconfigに追加
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    fb = checkout -b  # feature branch: git fb feature/issue-1-name
```

### VS Code Integration / VS Code統合
- Install GitLens extension / GitLens拡張機能をインストール
- Configure conventional commits extension / conventional commits拡張機能を設定
- Use built-in Git interface / 組み込みGitインターフェースを使用

This workflow ensures consistent, trackable, and collaborative development while maintaining high code quality.
このワークフローは、高いコード品質を維持しながら、一貫性があり、追跡可能で、協力的な開発を確保します。