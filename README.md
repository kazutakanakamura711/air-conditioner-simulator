# air-conditioner-simulator

エアコンの安価モデルと省エネモデルを比較し、年間電気代と累積コストを可視化するシミュレーターです。

## 主な機能

- 2モデルの本体価格 / APF / 冷房能力を入力して比較
- 都市ごとの平均気温データを使って月別電気代を推定
- 平日・休日それぞれの1日あたり使用時間を指定
- 累積コスト比較（折れ線）と月別電気代比較（棒グラフ）を表示
- 損益分岐年の目安を表示

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Supabase (PostgreSQL)
- pnpm
- Docker / Docker Compose

## 必要環境

- Node.js 24系（推奨）
- pnpm
- Docker Desktop（Docker利用時）

## セットアップ

1. 依存関係をインストール

```bash
pnpm install
```

2. 必要なら環境変数を用意

```bash
cp .env.example .env.local
```

`.env.local` がなくても Docker 起動自体は可能ですが、APIを使う場合は Supabase の接続情報が必要です。

## Phase 2: Supabase APIセットアップ

1. `.env.local` に Supabase 環境変数を設定

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Supabase 側で `simulations` テーブルを作成

```sql
CREATE TABLE simulations (
	id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	params      JSONB NOT NULL,
	created_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
	expires_at  TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '30 days'
);

CREATE INDEX idx_simulations_expires_at ON simulations (expires_at);
```

実装済みAPI:

- `POST /api/simulations`
- `GET /api/simulations/[id]`

## ローカル起動（pnpm）

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開いてください。

## Docker起動

```bash
docker compose up --build
```

停止:

```bash
docker compose down
```

依存関係やキャッシュを含めて再作成したい場合:

```bash
docker compose down -v
docker compose up --build
```

## Railway 本番デプロイ

本番環境では `Dockerfile` を使います。

### 前提

- `next.config.ts` は `output: "standalone"` を有効にしています
- 依存関係のインストールからビルド、本番起動までを Docker で完結します

### Railway 側の設定

1. Railway で GitHub リポジトリを接続
2. Dockerfile の指定を `Dockerfile` に設定
3. 必要な環境変数を Railway の Variables に登録
4. デプロイ後、`http://localhost:3000` 相当の公開URLで動作確認

### 本番用 Dockerfile

- [Dockerfile](/Users/kazutakanakamura/dev/personal/products/air-conditioner-simulator/Dockerfile)

## 品質チェック

```bash
pnpm build
pnpm lint
```

## テスト

単体テストは Jest、E2E は Playwright を使用します。

```bash
pnpm test
pnpm test:unit
pnpm test:e2e
```

Playwright のブラウザが未インストールの場合は、最初に以下を実行してください。

```bash
pnpm exec playwright install chromium
```

### 確認済みの E2E

以下のシナリオは Playwright で確認済みです。

- ホーム画面にシミュレーターの見出しと共有ボタンが表示される
- ホーム画面で結果サマリーカードが表示される
- 入力値を変更してグラフタブを切り替えられる

### スクリーンショット

ローカル起動した画面のスクリーンショットをプロジェクト内に保存しています。

- [docs/screenshots/aircon-home.png](/Users/kazutakanakamura/dev/personal/products/air-conditioner-simulator/docs/screenshots/aircon-home.png)

## Playwright MCP

GitHub Copilot からブラウザ操作や E2E テスト生成を行いたい場合は Playwright MCP を利用できます。

最初に VS Code 用の MCP 設定ファイルとして `.vscode/mcp.json` を配置しています。

ブラウザバイナリが未インストールの場合は以下を実行してください。

```bash
pnpm exec playwright install chromium
```

VS Code を再起動後、Copilot Chat の Agent Mode で以下のように指示できます。

```text
Playwright MCPを使って http://localhost:3000 を開いて、
画面を確認しながら E2E テストコードを生成して
```

```text
Playwright MCPを使って http://localhost:3000 を開いて、
共有URL作成ボタンの動作を確認して
```

詳細な設定手順は以下を参照してください。

- `docs/PLAYWRITE_MCP_GITHUB_COPILOT.md`

## ディレクトリ構成（主要）

```text
app/
	page.tsx
	layout.tsx
components/
	simulator/
	result/
lib/
	calc.ts
	cityData.ts
	supabase-server.ts
	api.ts
types/
	simulation.ts
docs/
	air_conditioner_simulator_design.md
```

## トラブルシュート

### Module not found: Can't resolve 'recharts'

依存が古いコンテナボリュームに残っている可能性があります。以下を実行して再作成してください。

```bash
docker compose down -v
docker compose up --build
```

ローカル実行時は `pnpm install` を再実行してから `pnpm dev` を試してください。

`new row violates row-level security policy ... (42501)` が出る場合は、`.env.local` の `SUPABASE_SERVICE_ROLE_KEY` が `service_role` ではなく `anon` になっている可能性が高いです。
