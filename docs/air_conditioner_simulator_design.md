# エアコンコスト比較シミュレーター 設計ドキュメント

## 1. プロジェクト概要

### プロジェクト名

`air-conditioner-simulator`

### アプリ概要

2台のエアコン機種（安価モデルと省エネモデル）を比較し、電気代・本体価格を含めた累積コストを長期でシミュレートするWebアプリ。

### 目的

- 個人利用（自分のエアコン選びに使う）
- ポートフォリオとして公開
- シミュレーション結果をURLで共有できる

### 対応外

- ユーザー認証（将来の拡張候補）
- 機種データのDB管理（ユーザーが手動入力）

---

## 2. 技術スタック

| レイヤー               | 技術                           | 備考                     |
| ---------------------- | ------------------------------ | ------------------------ |
| フロントエンド         | Next.js 16（App Router）       | 最新安定版 16.2.x        |
| バックエンド           | Next.js API Routes             | 同一リポジトリ内で完結   |
| DB                     | Supabase（PostgreSQL）         | JSONB保存                |
| スタイリング           | TailwindCSS + shadcn/ui        |                          |
| グラフ                 | Recharts                       | Next.jsとの相性が良い    |
| パッケージマネージャー | pnpm                           | 高速・ディスク効率が良い |
| 開発環境               | Docker + Docker Compose        | Node.js 24.18.0で固定    |
| デプロイ               | Railway（Docker）または Vercel | 後述                     |

---

## 3. 開発環境構成（Docker）

### ディレクトリ構成

```
air-conditioner-simulator/
  Dockerfile
  Dockerfile.dev
  docker-compose.yml
  .dockerignore
  .env.local           ← Supabaseキーなど（gitignore対象）
  .env.example         ← 環境変数のテンプレート
  package.json
  pnpm-lock.yaml
  ...
```

### Dockerfile

```dockerfile
FROM node:24.18.0-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24.18.0-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24.18.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Dockerfile.dev

```dockerfile
FROM node:24.18.0-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]
```

### docker-compose.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    env_file:
      - .env.local
```

### 起動コマンド

```bash
docker compose up        # 起動
docker compose up --build  # Dockerfile変更後の再ビルド
docker compose down      # 停止
```

---

## 4. デプロイ方針

### 第一候補：Railway（Dockerデプロイ）

GitHubリポジトリと連携し、`Dockerfile` を使ってデプロイ。
コンテナをそのまま本番で動かすことができる。

```
GitHub push → Railway が自動ビルド・デプロイ
費用：月$5〜（スリープなし）
```

### 代替：Vercel（切り替え簡単）

Dockerを使わずNext.jsプロジェクトとして直接デプロイ。
コードは一切変更不要で、Vercelに接続するだけで動く。

```
GitHub push → Vercel が自動デプロイ
費用：無料枠で十分
```

### 方針

まずRailwayでDockerデプロイを試す。
うまくいかなければVercelに切り替える（コード変更なし）。

---

## 5. 機能一覧

### 5-1. シミュレーション機能（メイン）

ユーザーが以下のパラメータを入力し、グラフと数値で結果を表示する。

**入力パラメータ**

| 項目             | 詳細                                   |
| ---------------- | -------------------------------------- |
| モデルA 本体価格 | 円（手動入力）                         |
| モデルA APF      | カタログ値を手動入力                   |
| モデルA 冷房能力 | kW（任意・畳数目安表示用）             |
| モデルB 本体価格 | 同上                                   |
| モデルB APF      | 同上                                   |
| モデルB 冷房能力 | 同上                                   |
| 電気代単価       | 円/kWh（デフォルト：31円）             |
| 使用都市         | 主要都市から選択（後述）               |
| 使用月           | 月ごとにON/OFFをチェックボックスで選択 |
| 平日使用時間     | 開始時刻〜終了時刻                     |
| 休日使用時間     | 開始時刻〜終了時刻                     |
| 比較年数         | 1〜20年                                |

**出力（結果表示）**

- 年間電気代（モデルA / モデルB）
- 年間電気代の差額
- 本体価格差
- 損益分岐点（何年目に逆転するか）
- 比較年数終了時点の累積節約額
- 累積コスト推移グラフ（折れ線）
- 月別電気代グラフ（棒グラフ）

### 5-2. 共有機能

- 「結果を共有」ボタン押下で入力パラメータをDBに保存
- UUID形式のIDを発行し、共有URLを生成
  - 例：`https://yourapp.com/result/abc123`
- 共有URLにアクセスすると同じパラメータでシミュレーターが復元される
- 保存データは**30日で自動削除**（expires_atで管理）

### 5-3. 都市選択

以下の主要都市から選択可能。各都市の月別平均気温データを内部に保持。

```ts
export const cityData = {
  sapporo: {
    name: "札幌",
    temps: [
      -3.6, -3.1, 0.6, 7.1, 12.4, 16.7, 20.5, 22.3, 18.1, 11.8, 4.9, -0.9,
    ],
  },
  sendai: {
    name: "仙台",
    temps: [1.6, 2.0, 4.9, 10.3, 15.0, 18.5, 22.2, 24.2, 20.7, 15.2, 9.4, 4.5],
  },
  tokyo: {
    name: "東京",
    temps: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6],
  },
  nagoya: {
    name: "名古屋",
    temps: [4.5, 5.2, 8.7, 14.4, 18.9, 22.7, 26.4, 27.8, 24.1, 18.1, 12.2, 7.0],
  },
  osaka: {
    name: "大阪",
    temps: [6.0, 6.3, 9.4, 15.1, 19.7, 23.5, 27.4, 28.8, 25.0, 19.0, 13.6, 8.6],
  },
  hiroshima: {
    name: "広島",
    temps: [5.2, 6.0, 9.1, 14.7, 19.3, 23.0, 27.1, 28.2, 24.4, 18.3, 12.5, 7.5],
  },
  matsuyama: {
    name: "松山",
    temps: [6.0, 6.5, 9.5, 14.6, 19.0, 22.7, 26.9, 27.8, 24.3, 18.7, 13.3, 8.4],
  },
  fukuoka: {
    name: "福岡",
    temps: [
      6.6, 7.4, 10.4, 15.1, 19.4, 23.0, 27.2, 28.1, 24.4, 19.2, 13.8, 8.9,
    ],
  },
  naha: {
    name: "那覇",
    temps: [
      17.0, 17.1, 18.9, 21.4, 24.0, 26.8, 28.9, 28.7, 27.6, 25.2, 22.1, 18.7,
    ],
  },
};
```

---

## 6. 計算ロジック

### 6-1. 月別電気代の計算

```
月別電気代(円) = 月別消費電力量(kWh) × 電気代単価(円/kWh)

月別消費電力量(kWh) = 冷暖房負荷(kW) / APF × 1日あたり使用時間(h) × 稼働日数(日)
```

### 6-2. 冷暖房負荷の推定

月平均気温から簡易推定。

```
冷房モード（気温 > 24℃）:
  負荷(kW) = 0.5 + (平均気温 - 24) × 0.08

暖房モード（気温 < 15℃）:
  負荷(kW) = 0.4 + (15 - 平均気温) × 0.06

中間（15℃ ≤ 気温 ≤ 24℃）:
  負荷(kW) = 0.2（軽微な運転）
```

※ APFは冷暖房共通の単一値を使用（カタログ記載値に準拠）

### 6-3. 1日あたり使用時間

```
平日使用時間 × 平日日数 + 休日使用時間 × 休日日数
---------------------------------------------------
月の総日数

※ 平日：月〜金（単純に5/7で計算、祝日カレンダーは考慮しない）
```

### 6-4. 使用月のON/OFF

チェックがOFFの月は消費電力量 = 0 として計算。

### 6-5. 時刻の表現

時刻は0〜47の整数で表現（24以降が翌日）。

```
例：17時開始 → 17
   翌2時終了 → 26
   使用時間  → 26 - 17 = 9時間
```

### 6-6. 累積コスト

```
累積コスト(n年後) = 本体価格 + 年間電気代 × n
```

損益分岐点 = モデルAとモデルBの累積コストが逆転する年。

---

## 7. DB設計

### テーブル：simulations

```sql
CREATE TABLE simulations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  params      JSONB NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at  TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '30 days'
);

-- 期限切れデータ削除用インデックス
CREATE INDEX idx_simulations_expires_at ON simulations (expires_at);
```

### paramsのJSONB構造

```json
{
  "modelA": {
    "price": 50000,
    "apf": 4.5,
    "coolingKw": 2.2
  },
  "modelB": {
    "price": 120000,
    "apf": 6.5,
    "coolingKw": 2.2
  },
  "settings": {
    "unitPrice": 31,
    "city": "matsuyama",
    "activeMonths": [1, 2, 3, 6, 7, 8, 9, 12],
    "weekdayStart": 17,
    "weekdayEnd": 26,
    "weekendStart": 10,
    "weekendEnd": 26,
    "years": 10
  }
}
```

---

## 8. API設計

### Next.js API Routes

#### POST /api/simulations

シミュレーションパラメータを保存し、共有URLのIDを返す。

`app/api/simulations/route.ts`

**リクエスト**

```json
{
  "params": { ...上記JSON構造... }
}
```

**レスポンス**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://yourapp.com/result/550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-07-08T00:00:00Z"
}
```

#### GET /api/simulations/[id]

IDからパラメータを取得。

`app/api/simulations/[id]/route.ts`

**レスポンス**

```json
{
  "id": "550e8400-...",
  "params": { ...JSON構造... },
  "createdAt": "2026-06-08T00:00:00Z",
  "expiresAt": "2026-07-08T00:00:00Z"
}
```

※ 期限切れの場合は404を返す

### セキュリティ

- SupabaseのキーはAPI Routes内の環境変数にのみ置く
- フロントからSupabaseへの直接アクセスは行わない
- `.env.local` は `.gitignore` に必ず追加する

---

## 9. フロントエンド 画面構成

```
/                   トップ（シミュレーター本体）
/result/[id]        共有URL（パラメータ復元して表示）
```

### コンポーネント構成

```
app/
  page.tsx                       トップページ
  api/
    simulations/
      route.ts                   POST /api/simulations
    simulations/[id]/
      route.ts                   GET /api/simulations/[id]
  result/[id]/
    page.tsx                     共有ページ

components/
  simulator/
    simulator-form.tsx           入力フォーム全体
    model-input.tsx              モデルA/Bの入力カード
    city-select.tsx              都市選択
    month-selector.tsx           使用月チェックボックス
    time-range-picker.tsx        使用時間選択（平日・休日）
  result/
    result-cards.tsx             サマリーカード（年間電気代など）
    cumulative-chart.tsx         累積コストグラフ（折れ線）
    monthly-chart.tsx            月別電気代グラフ（棒グラフ）
    share-button.tsx             共有ボタン＋URLコピー

lib/
  calc.ts                        計算ロジック（純粋関数）
  cityData.ts                    都市別月別気温データ
  api.ts                         API Routesクライアント

types/
  simulation.ts                  型定義（SimulationParams など）
```

---

## 10. 環境変数

```bash
# .env.example（リポジトリに含める）
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` はサーバー側（API Routes）のみで使用。
`NEXT_PUBLIC_` プレフィックスのない変数はブラウザに露出しない。

---

## 11. 開発フェーズ

### Phase 1：フロントのみで動くシミュレーター

- Docker + pnpm の開発環境構築
- 入力フォーム実装
- 計算ロジック実装（`lib/calc.ts`）
- グラフ表示（Recharts）
- APIなし・ローカルのみで完結

### Phase 2：バックエンド実装

- Supabase プロジェクト作成・テーブル作成
- API Routes（POST/GET /api/simulations）実装
- 環境変数設定

### Phase 3：共有機能をフロントに統合

- 「結果を共有」ボタン実装
- `/result/[id]` ページ実装（パラメータ復元）
- URLコピー機能

### Phase 4：仕上げ・公開

- レスポンシブ対応の最終調整
  - スマホ表示での余白・グラフ見切れを微調整
- OGP設定（共有時のSNSプレビュー）
- Railwayへのデプロイ（Docker）
- うまくいかなければVercelへ切り替え
- ポートフォリオへの掲載

---

## 12. 将来の拡張候補（やりたくなったら）

- ログイン機能（Supabase Auth）＋マイページ（履歴一覧・無期限保存）
- 電気料金プランの選択（従量制・時間帯別など）
- PDF出力（比較結果レポート）
- 機種データDB管理（Admin画面）
