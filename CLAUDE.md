# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# 開発モード（TypeScript ウォッチモード）
npm run dev

# サーバー実行
npm start

# リンター実行
npm run lint

# MCP Inspector でデバッグ
npm run inspector
```

## アーキテクチャ

このプロジェクトは Waroom API に接続する Model Context Protocol (MCP) サーバーです。

### 主要コンポーネント

- `src/main.ts`: MCPサーバーのエントリーポイント。StdioTransportを使用してMCPサーバーを起動
- `src/WaroomClient.ts`: Waroom API と通信するHTTPクライアント。axios ベース、認証ヘッダー管理
- `src/tools/`: MCP ツール定義
  - `incidents.ts`: インシデント関連のツール（一覧取得、詳細取得）
  - `postmortems.ts`: ポストモーテム関連のツール（一覧取得）

### 技術スタック

- TypeScript (ES2020, NodeNext modules)
- Model Context Protocol SDK
- axios (HTTP クライアント)
- zod (バリデーション)
- dotenv (環境変数管理)

### 環境変数

- `WAROOM_API_KEY`: Waroom API 認証キー（必須）

### ビルド出力

- `dist/`: TypeScript コンパイル結果
- `dist/main.js`: 実行可能バイナリ（shebang 付き）

### MCP ツール

各ツールは日本語の説明とパラメータバリデーションを持つ：
- `waroom_get_incidents`: ページネーション対応のインシデント一覧
- `waroom_get_incident_details`: UUID による個別インシデント詳細
- `waroom_get_postmortems`: ページネーション対応のポストモーテム一覧

### API エンドポイント

デフォルトベースURL: `https://api.app.waroom.com/api/v0`
- `GET /incidents`: インシデント一覧
- `GET /incidents/{uuid}`: インシデント詳細
- `GET /postmortems`: ポストモーテム一覧