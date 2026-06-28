# Testing Handoff for Codex

## 目的

このメモは、テスト整備の途中状態を Codex が引き継げるようにまとめたものです。

## 今やっていること

このプロジェクトに以下のテスト基盤を追加済みです。

- Jest による単体テスト
- Playwright による E2E テスト
- Playwright MCP を使った手動ブラウザ確認

追加済みの主なファイル:

- `jest.config.ts`
- `playwright.config.ts`
- `tests/unit/calc.test.ts`
- `tests/unit/share-button.test.tsx`
- `tests/e2e/app.spec.ts`

## 現在の状態

### 1. Jest 側

Jest の単体テストは通っています。

カバーしている内容:

- `simulate` の計算ロジック
- `ShareButton` の共有URL作成成功時の表示
- `ShareButton` の共有URL作成失敗時のエラー表示

関連ファイル:

- `tests/unit/calc.test.ts`
- `tests/unit/share-button.test.tsx`
- `components/result/share-button.tsx`
- `lib/calc.ts`

想定コマンド:

```bash
pnpm test:unit
```

### 2. Playwright 側

Playwright の簡単な表示確認テストは通っています。

通っているテスト:

- ホーム画面の見出し表示
- 共有URL作成ボタンの表示
- 結果サマリーカードの表示
- 比較年数の変更とタブ切り替え

関連ファイル:

- `tests/e2e/app.spec.ts`

想定コマンド:

```bash
pnpm test:e2e
```

### 3. MCP で手動確認できたこと

Playwright MCP で以下は実際に確認済みです。

- `http://localhost:3000` を開ける
- 共有URL作成ボタンを押せる
- 共有URLが表示される
- 比較年数を 10 年から 5 年へ変更できる
- 使用都市を 東京 から 大阪 へ変更できる
- `月別電気代` タブへ切り替えできる

これは自動テストコードではなく、MCP を通した手動ブラウザ操作で確認したものです。

## うまくいっていないこと

### 1. Playwright で共有URL作成の自動化が不安定

やりたかったこと:

- `共有URLを作成` を Playwright から押す
- 画面上に `共有URL` が表示されることを確認する

問題:

- 手動の MCP 操作では成功する
- しかし headless Playwright の E2E テストでは、クリック後に UI が更新されず `共有URL` が見つからない
- `page.route` で API をモックしても改善しなかった
- `page.addInitScript` で `fetch` を差し替えても改善しなかった
- `locator.click()` と DOM 直接 `element.click()` の両方を試したが改善しなかった

そのため、共有URL作成の自動検証は Jest の `ShareButton` UI テストへ寄せています。

### 2. Playwright で比較年数変更を安定化した

比較年数スライダーは残しつつ、E2E 用に `比較年数を直接選択` の補助セレクトを追加しました。

理由:

- Radix Slider の headless 操作が環境によって不安定だった
- セレクトなら Playwright から安定して値を変えられる
- UI は壊さず、手動操作用のスライダーもそのまま残せる

## Codex にやってほしいこと

優先順位順に書きます。

### 優先 1: Playwright の比較年数変更テストを安定化する

対象ファイル:

- `tests/e2e/app.spec.ts`
- `components/simulator/simulator-form.tsx`
- `components/ui/slider.tsx`

やってほしいこと:

- `can change inputs and switch chart tabs` を安定して通す
- 必要なら UI 側に `data-testid` を追加してよい
- 必要なら Playwright 側の selector を改善してよい
- 必要ならスライダーではなく、別のテストしやすい入力手段を追加してよいが、UI は極力壊さない

成功条件:

```bash
pnpm exec playwright test -g "can change inputs and switch chart tabs"
```

が通ること

### 優先 2: 共有URL作成を Playwright で自動化できるか再挑戦する

対象ファイル:

- `tests/e2e/app.spec.ts`
- `components/result/share-button.tsx`
- `lib/api.ts`

やってほしいこと:

- 共有URL作成の Playwright 自動テストを再度成立させられるか確認
- もし難しい場合は、Jest の `ShareButton` テストで十分と判断してもよい
- その場合は E2E の責務を README や docs に明文化してもよい

## 現在のテスト方針

暫定的には以下です。

- 計算ロジック: Jest
- 共有URL UI の成功/失敗表示: Jest + Testing Library
- 画面表示と単純なブラウザ確認: Playwright
- 実際のブラウザ操作の探索や確認: Playwright MCP

## 参考コマンド

```bash
pnpm test:unit
pnpm test:e2e
pnpm exec playwright test -g "can change inputs and switch chart tabs"
pnpm exec playwright test -g "home page renders simulator heading and share button"
```

## 補足

- Playwright MCP は使える状態です
- `.vscode/mcp.json` は追加済みです
- `docs/PLAYWRITE_MCP_GITHUB_COPILOT.md` に MCP の参考手順があります

## 一言まとめ

- Jest は通っている
- MCP 手動操作では共有URL作成・都市変更・年数変更・タブ切替まで確認済み
- ただし headless Playwright の自動操作は、共有URL作成と Radix Slider 操作がまだ不安定
- いま一番やるべきなのは `tests/e2e/app.spec.ts` の安定化
