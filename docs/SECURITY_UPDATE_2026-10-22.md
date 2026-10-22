# 2026-10-22 セキュリティ更新

## 更新内容

- Node.jsを24.22.1に更新。本番Dockerの全ステージと開発Dockerで統一。
- `.nvmrc` と `engines.node`（`>=24.22.1 <25`）を追加。
- pnpmを11.9.0に固定し、ローカルとDockerで統一。
- Next.js / eslint-config-nextを16.4.2、Node.js型定義を24系に更新。
- Tailwind CSSを4.3.3に更新し、関連するPostCSSとその他の間接依存を更新。
- `.dockerignore` を追加し、ホストの `node_modules`、`.next`、環境変数ファイルがビルドに混入することを防止。
- 本番ビルドの型チェックで見つかった既存テスト補助関数の重複プロパティを除去し、部分指定の型を修正。

## 検証結果

- Node.js 24.22.1 / pnpm 11.9.0でLint成功、単体テスト6件成功。
- 本番・開発Dockerイメージのビルド成功。ロックファイル固定で依存をインストール。
- 本番コンテナでNode.js 24.22.1 / Next.js 16.4.2を実測。
- 本番コンテナに対する既存のChromium E2Eテスト3件成功。
- 不正なPOSTリクエストが400を返すことを確認。実DBへの保存・取得は今回の検証対象外。
- `pnpm audit --prod --audit-level low`: 既知の脆弱性0件。
- 全依存の監査: 57件から2件に減少（High 1件、Moderate 1件）。残りは下記の開発依存のみ。

ホスト上のTurbopackビルドは、検証環境の内部通信用ポートの制限で実行できなかったため、本番用Docker内で標準の `pnpm build`（Turbopack・型チェックを含む）を実行した。

## 修正版の公開待ち

2026-10-22時点で、以下はnpmレジストリに修正版がなく、公式アドバイザリも修正版なしとしている。監査結果の修正候補を指定してもインストールできないため、未公開バージョンのoverrideや監査の除外設定は追加していない。

| パッケージ | 深刻度 | 依存経路 | 状況 |
| --- | --- | --- | --- |
| braces 3.0.3 | High | eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch | npm最新版も3.0.3。修正版未公開 |
| sprintf-js 1.0.3 | Moderate | Jest → babel-plugin-istanbul → @istanbuljs/load-nyc-config → js-yaml → argparse | npm最新版1.1.3も影響範囲。修正版未公開 |

いずれもロックファイル上では開発依存経由でのみ含まれる。修正版の公開後に依存元を更新し、全依存の監査を再実施する。

## 参考

- [Node.js 2026年10月のセキュリティ更新](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [Next.js 16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2)
- [braces: GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
- [sprintf-js: GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)
