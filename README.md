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

## 品質チェック

```bash
pnpm build
pnpm lint
```

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
