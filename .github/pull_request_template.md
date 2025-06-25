# Pull Request Template
# プルリクエストテンプレート

## Summary / 概要
<!-- Briefly describe what this PR does -->
<!-- このPRが何をするかを簡潔に説明してください -->

## Related Issue / 関連Issue
<!-- Link to the GitHub issue this PR addresses -->
<!-- このPRが対応するGitHub issueにリンクしてください -->

Closes #<!-- issue number -->

## Type of Change / 変更の種類
<!-- Check the relevant option -->
<!-- 該当するオプションにチェックしてください -->

- [ ] 🐛 Bug fix / バグ修正 (non-breaking change which fixes an issue)
- [ ] ✨ New feature / 新機能 (non-breaking change which adds functionality)
- [ ] 💥 Breaking change / 破壊的変更 (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update / ドキュメント更新
- [ ] 🔧 Code refactoring / コードリファクタリング (no functional changes)
- [ ] 🧪 Test addition/modification / テスト追加・修正
- [ ] 🔨 Build/CI changes / ビルド・CI変更

## Changes Made / 実施した変更
<!-- List the main changes made in this PR -->
<!-- このPRで行った主な変更をリストしてください -->

- 
- 
- 

## Testing / テスト
<!-- Describe how you tested your changes -->
<!-- 変更をどのようにテストしたかを説明してください -->

- [ ] Code builds without errors / コードがエラーなしでビルドされる
- [ ] All tests pass / 全テストが合格
- [ ] ESLint passes / ESLintが合格
- [ ] TypeScript type checking passes / TypeScript型チェックが合格
- [ ] Manual testing completed / 手動テスト完了
- [ ] Tested on multiple Node.js versions / 複数のNode.jsバージョンでテスト済み

## Code Review Checklist / コードレビューチェックリスト
<!-- Confirm that you have followed our code quality standards -->
<!-- コード品質基準に従ったことを確認してください -->

### Self-Review Completed / セルフレビュー完了
- [ ] **Mandatory**: Followed [CODE_REVIEW_CHECKLIST.md](../CODE_REVIEW_CHECKLIST.md) / **必須**: [CODE_REVIEW_CHECKLIST.md](../CODE_REVIEW_CHECKLIST.md) に従った
- [ ] Removed redundant code and comments / 冗長なコードとコメントを削除
- [ ] Used meaningful variable and function names / 意味のある変数名と関数名を使用
- [ ] Added bilingual comments for public APIs / パブリックAPIにバイリンガルコメントを追加
- [ ] Handled all error cases appropriately / 全エラーケースを適切に処理

### Code Quality / コード品質
- [ ] Functions are under 50 lines / 関数が50行未満
- [ ] Nesting depth is 3 levels or less / ネスト深度が3レベル以下
- [ ] No magic numbers or hardcoded values / マジックナンバーやハードコードされた値なし
- [ ] No TODO comments in final code / 最終コードにTODOコメントなし
- [ ] Code follows DRY principle / コードがDRY原則に従っている

### Git Workflow / Gitワークフロー
- [ ] Created feature branch from main / mainからfeatureブランチを作成
- [ ] Used conventional commit format / 従来のコミット形式を使用
- [ ] Commit messages are bilingual / コミットメッセージがバイリンガル
- [ ] Referenced issue numbers in commits / コミットでissue番号を参照

## Screenshots / スクリーンショット
<!-- If applicable, add screenshots to help explain your changes -->
<!-- 該当する場合、変更を説明するスクリーンショットを追加してください -->

## Documentation Updates / ドキュメント更新
<!-- Check if documentation needs to be updated -->
<!-- ドキュメントの更新が必要かチェックしてください -->

- [ ] README.md updated if needed / 必要に応じてREADME.mdを更新
- [ ] CLAUDE.md updated if needed / 必要に応じてCLAUDE.mdを更新
- [ ] API documentation updated / APIドキュメントを更新
- [ ] WORKFLOW.md updated if needed / 必要に応じてWORKFLOW.mdを更新

## Breaking Changes / 破壊的変更
<!-- If this introduces breaking changes, list them here -->
<!-- 破壊的変更を導入する場合、ここにリストしてください -->

- None / なし

## Additional Notes / 追加メモ
<!-- Any additional information that would be helpful for reviewers -->
<!-- レビュアーに役立つ追加情報があれば記載してください -->

---

## For Reviewers / レビュアー向け
<!-- This section is for reviewers to check -->
<!-- このセクションはレビュアーがチェックするためのものです -->

### Review Checklist / レビューチェックリスト
- [ ] Code changes align with the PR description / コード変更がPR説明と一致している
- [ ] All CI checks are passing / 全CIチェックが合格している
- [ ] Code follows project conventions / コードがプロジェクト規約に従っている
- [ ] No security vulnerabilities introduced / セキュリティ脆弱性が導入されていない
- [ ] Documentation is adequate / ドキュメントが適切である
- [ ] Changes are backward compatible (if applicable) / 変更が後方互換性を保っている（該当する場合）

### Review Comments / レビューコメント
<!-- Space for reviewer feedback -->
<!-- レビュアーフィードバック用スペース -->