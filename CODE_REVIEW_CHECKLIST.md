# Code Review Checklist for AI (Claude)
# AI（Claude）用コードレビューチェックリスト

## Overview
## 概要

This checklist MUST be followed by Claude after writing, modifying, or reviewing any code in this project. The AI must perform self-review and make corrections before finalizing any code changes.

このチェックリストは、Claudeがこのプロジェクトでコードを書いたり、修正したり、レビューしたりした後に必ず従わなければならないものです。AIはコード変更を確定する前に、セルフレビューを実行し、修正を行う必要があります。

## Mandatory Review Process
## 必須レビュープロセス

### Phase 1: Initial Code Analysis
### フェーズ1: 初期コード分析

#### Structure and Organization / 構造と組織
- [ ] **File organization**: Code is in appropriate directories / **ファイル組織**: コードが適切なディレクトリにある
- [ ] **Import management**: Only necessary imports, properly organized / **インポート管理**: 必要なインポートのみ、適切に整理
- [ ] **Function grouping**: Related functions are grouped logically / **関数グループ化**: 関連する関数が論理的にグループ化
- [ ] **Code separation**: Business logic separated from infrastructure / **コード分離**: ビジネスロジックがインフラから分離

#### Naming Conventions / 命名規則
- [ ] **Variable names**: Descriptive and self-explanatory / **変数名**: 説明的で自明
- [ ] **Function names**: Clearly indicate purpose and behavior / **関数名**: 目的と動作を明確に示す
- [ ] **Class names**: Follow PascalCase and describe entity / **クラス名**: PascalCaseに従い、エンティティを記述
- [ ] **Constants**: UPPER_SNAKE_CASE with meaningful names / **定数**: 意味のある名前でUPPER_SNAKE_CASE

### Phase 2: Code Quality Assessment
### フェーズ2: コード品質評価

#### Readability / 可読性
- [ ] **Function length**: Functions under 50 lines (ideal) / **関数の長さ**: 関数が50行未満（理想的）
- [ ] **Nesting depth**: Maximum 3 levels of nesting / **ネストの深さ**: 最大3レベルのネスト
- [ ] **Code flow**: Logical flow that's easy to follow / **コードフロー**: 追いやすい論理的なフロー
- [ ] **Complexity**: Avoid overly complex single statements / **複雑さ**: 過度に複雑な単一文を避ける

#### Comments and Documentation / コメントとドキュメント
- [ ] **Comment quality**: Explain "why", not "what" / **コメント品質**: "何を"ではなく"なぜ"を説明
- [ ] **Bilingual docs**: Public APIs have English/Japanese docs / **バイリンガルドキュメント**: パブリックAPIに英語/日本語ドキュメント
- [ ] **Remove TODO**: No TODO comments in final code / **TODO削除**: 最終コードにTODOコメントなし
- [ ] **Update comments**: Comments match current code / **コメント更新**: コメントが現在のコードと一致

#### Error Handling / エラーハンドリング
- [ ] **Error coverage**: All potential errors are handled / **エラーカバレッジ**: 全ての潜在的エラーが処理済み
- [ ] **Error messages**: Meaningful, bilingual error messages / **エラーメッセージ**: 意味のあるバイリンガルエラーメッセージ
- [ ] **Error types**: Appropriate error types and codes / **エラータイプ**: 適切なエラータイプとコード
- [ ] **Graceful failure**: System fails gracefully with good UX / **優雅な失敗**: 良いUXで優雅にシステムが失敗

### Phase 3: Functionality Verification
### フェーズ3: 機能検証

#### Logic and Behavior / ロジックと動作
- [ ] **Logic correctness**: Code does what it's supposed to do / **ロジック正確性**: コードが想定通りに動作
- [ ] **Edge cases**: Boundary conditions are handled / **エッジケース**: 境界条件が処理済み
- [ ] **Input validation**: All inputs are properly validated / **入力検証**: 全ての入力が適切に検証済み
- [ ] **Output consistency**: Outputs are consistent and expected / **出力一貫性**: 出力が一貫性があり期待通り

#### Testing and Build / テストとビルド
- [ ] **Builds cleanly**: Code compiles without warnings / **クリーンビルド**: 警告なしでコードがコンパイル
- [ ] **No console logs**: Remove debug console.log statements / **コンソールログなし**: デバッグconsole.log文を削除
- [ ] **Linting passes**: ESLint rules are satisfied / **リント合格**: ESLintルールが満たされている
- [ ] **Type safety**: TypeScript types are correct / **型安全性**: TypeScript型が正しい

### Phase 4: Performance and Maintainability
### フェーズ4: パフォーマンスと保守性

#### Performance / パフォーマンス
- [ ] **No obvious bottlenecks**: No apparent performance issues / **明らかなボトルネックなし**: 明らかなパフォーマンス問題なし
- [ ] **Resource management**: Proper cleanup of resources / **リソース管理**: リソースの適切なクリーンアップ
- [ ] **Algorithm efficiency**: Reasonable time/space complexity / **アルゴリズム効率**: 合理的な時間/空間計算量
- [ ] **Avoid premature optimization**: Don't optimize unnecessarily / **早期最適化回避**: 不必要な最適化をしない

#### Maintainability / 保守性
- [ ] **DRY principle**: No duplicated code logic / **DRY原則**: 重複したコードロジックなし
- [ ] **Single responsibility**: Each function has one clear purpose / **単一責任**: 各関数が一つの明確な目的を持つ
- [ ] **Minimal dependencies**: Only necessary external dependencies / **最小依存関係**: 必要な外部依存関係のみ
- [ ] **Future-proof**: Easy to modify and extend / **将来対応**: 修正と拡張が容易

## Specific Code Patterns to Avoid
## 避けるべき特定のコードパターン

### Anti-patterns / アンチパターン
❌ **Magic numbers**: Use named constants instead
❌ **マジックナンバー**: 代わりに名前付き定数を使用

```typescript
// Bad / 悪い例
if (user.age > 18) { /* ... */ }

// Good / 良い例  
const LEGAL_AGE = 18;
if (user.age > LEGAL_AGE) { /* ... */ }
```

❌ **Deep nesting**: Refactor using early returns
❌ **深いネスト**: 早期リターンを使用してリファクタリング

```typescript
// Bad / 悪い例
function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        // deep nested logic
      }
    }
  }
}

// Good / 良い例
function processUser(user) {
  if (!user || !user.active || !user.verified) {
    return;
  }
  // main logic here
}
```

❌ **Overly generic names**: Be specific about purpose
❌ **過度に汎用的な名前**: 目的について具体的に

```typescript
// Bad / 悪い例
function process(data) { /* ... */ }
let temp = getValue();

// Good / 良い例
function validateUserInput(userData) { /* ... */ }
let connectionTimeout = getTimeoutValue();
```

## Self-Review Action Items
## セルフレビューアクションアイテム

When Claude identifies issues during review:
レビュー中にClaudeが問題を特定した場合：

### Immediate Actions / 即座のアクション
1. **Stop and fix**: Don't proceed until issues are resolved / **停止して修正**: 問題が解決されるまで進行しない
2. **Document changes**: Explain what was fixed and why / **変更を文書化**: 何が修正され、なぜかを説明
3. **Re-test**: Verify fixes don't break other functionality / **再テスト**: 修正が他の機能を壊さないことを検証
4. **Re-review**: Go through checklist again after fixes / **再レビュー**: 修正後にチェックリストを再度確認

### Communication / コミュニケーション
```markdown
## Code Review Summary / コードレビュー要約

### Issues Found / 発見された問題
- Issue 1: Description / 問題1: 説明
- Issue 2: Description / 問題2: 説明

### Fixes Applied / 適用された修正
- Fix 1: What was changed / 修正1: 変更内容
- Fix 2: What was changed / 修正2: 変更内容

### Final Status / 最終ステータス
✅ All checklist items verified / 全チェックリスト項目が検証済み
✅ Code ready for commit / コードがコミット準備完了
```

## Quality Gates
## 品質ゲート

Code MUST NOT be committed unless:
以下の条件を満たさない限り、コードをコミットしてはいけません：

- [ ] All checklist items are ✅ / 全チェックリスト項目が✅
- [ ] Code builds without errors or warnings / エラーや警告なしでコードがビルド
- [ ] ESLint passes without issues / ESLintが問題なく合格
- [ ] All identified issues have been fixed / 特定された全問題が修正済み
- [ ] Self-review documentation is complete / セルフレビュードキュメントが完成

## Tools Integration
## ツール統合

### Automated Checks / 自動チェック
```bash
# Run before finalizing code / コード確定前に実行
npm run lint      # Code quality / コード品質
npm run typecheck # Type safety / 型安全性
npm run build     # Compilation / コンパイル
```

### Manual Verification / 手動検証
- [ ] Code diff review in IDE / IDEでのコード差分レビュー
- [ ] Function-by-function inspection / 関数ごとの検査
- [ ] Error path testing / エラーパステスト
- [ ] Documentation accuracy check / ドキュメント正確性チェック

Remember: The goal is to produce clean, maintainable, and reliable code that humans can easily understand and modify.
覚えておいてください：目標は、人間が簡単に理解し修正できる、クリーンで保守可能で信頼性の高いコードを作成することです。