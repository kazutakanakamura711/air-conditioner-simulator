# Playwright MCP × GitHub Copilot 設定手順

## 概要

Playwright MCPを使うと、GitHub Copilotに自然言語で指示するだけでブラウザを自動操作できる。
テストコードを自分で書かなくても、Copilotがセレクターの特定・操作・コード生成まで行ってくれる。

---

## 事前準備

- VS Code がインストールされていること
- GitHub Copilot 拡張機能が有効になっていること
- Node.js 18以上がインストールされていること（`node --version` で確認）

---

## 設定手順

### Step 1. ブラウザバイナリのインストール

```bash
npx playwright install chromium
```

### Step 2. `.vscode/mcp.json` を作成

プロジェクトルートに `.vscode/mcp.json` を作成して以下を記載する。

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

### Step 3. VS Code を再起動

設定を反映させるためにVS Codeを再起動する。

### Step 4. 動作確認

1. VS Code の Copilot Chat を開く（`Cmd+Ctrl+I`）
2. **Agent Mode** に切り替える
3. 「Configure Tools」をクリック
4. `microsoft/playwright-mcp` が一覧に表示されていればOK

---

## 使い方

Copilot Chat（Agent Mode）で以下のように自然言語で指示するだけ。

### 基本操作の例

```
Playwright MCPを使って https://demoqa.com/text-box を開いて、
フォームにテスト用の値を入力してSubmitし、結果が表示されることを確認して
```

```
Playwright MCPを使って http://localhost:3000 を開いて、
ログインフォームに入力してSubmitし、ダッシュボードに遷移することを確認するテストコードを生成して
```

### テストコード生成の例

```
Playwright MCPを使って http://localhost:3000 のログインページを開いて、
実際のDOMを確認しながらE2Eテストコードを tests/login.spec.ts に生成して
```

> ⚠️ **注意**: 必ず冒頭に「Playwright MCP を使って」と明示する。
> 指定しないと Copilot が Bash コマンドで実行しようとすることがある。

---

## 従来の方法との違い

| 項目 | 従来（コードを書く） | Playwright MCP |
|------|------------------|----------------|
| セレクター特定 | 自分でDevToolsで調べる | Copilotが自動で特定 |
| テストコード | 自分で書く | 自然言語で指示するだけ |
| エラー調査 | 自分でデバッグ | Copilotがスクリーンショットを見て原因特定 |

---

## トラブルシューティング

### MCPが認識されない場合

```bash
# Chromiumが正しくインストールされているか確認
npx playwright install chromium

# VS Codeを完全に再起動してから再試行
```

### ブラウザが起動しない場合

`.vscode/mcp.json` の内容を確認して、`type: "stdio"` が記載されているか確認する。

---

## 参考

- [Playwright MCP 公式リポジトリ](https://github.com/microsoft/playwright-mcp)
- [VS Code MCP設定ドキュメント](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
