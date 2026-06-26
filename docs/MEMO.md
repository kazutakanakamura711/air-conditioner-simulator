# Docker起動時の詰まりポイントメモ

## 1. Dockerデーモン未起動

- エラー: `Cannot connect to the Docker daemon`
- 対応: Docker Desktopを起動してから再実行。

## 2. env_file参照エラー（.env.local未作成）

- `docker-compose.yml` で `.env.local` を参照しているため、ファイル未作成だと起動時に失敗する。
- 対応: まず `.env.local` を作成（値は空でも可）。

## 3. pnpm install が Docker build 中に失敗

- エラー: `ERR_PNPM_IGNORED_BUILDS`（`sharp`, `unrs-resolver`）
- 背景: pnpmのバージョン/設定差異でビルドスクリプトがブロックされた。
- 対応:
  - `Dockerfile` で pnpmを `pnpm@9` に固定。
  - `pnpm-workspace.yaml` に `packages` を定義（`- .`）。
  - 必要に応じて build script policy を調整。

## 4. Docker buildのCOPY順序の注意

- `pnpm install` 前に、pnpmが参照する設定ファイルをCOPYしておかないと設定が効かない。
- 対応: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` を install 前にCOPY。

## 5. 最終確認

- `docker compose up --build` 成功後、Next.jsが `http://localhost:3000` で起動することを確認。
