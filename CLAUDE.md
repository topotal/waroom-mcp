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

# サーバー実行（v0 API を使用）
node dist/main.js
```

## アーキテクチャ

このプロジェクトは Waroom v0 API に接続する Model Context Protocol (MCP) サーバーです。

### 主要コンポーネント

- `src/main.ts`: MCPサーバーのエントリーポイント。StdioTransportを使用してMCPサーバーを起動
- `src/WaroomClient.ts`: Waroom v0 API と通信するHTTPクライアント。axios ベース、認証ヘッダー管理
- `src/tools/`: MCP ツール定義
  - `incidents.ts`: インシデント関連のツール（作成、一覧取得、詳細取得、重要度・ステータス更新、メトリクス作成）
  - `postmortems.ts`: ポストモーテム関連のツール（一覧取得、作成、テンプレート取得）
  - `services.ts`: サービス関連のツール（一覧取得、アーキテクチャコンテキスト取得）
  - `labels.ts`: ラベル管理のツール（サービスラベル一覧取得、作成、更新、削除、インシデントラベル付与）
  - `runbooks.ts`: ランブック関連のツール（一覧取得、詳細取得、更新）
  - `actionItems.ts`: アクションアイテム関連のツール（一覧取得、作成、詳細取得、更新、削除）
  - `users.ts`: ユーザー関連のツール（一覧取得）

### 技術スタック

- TypeScript (ES2020, NodeNext modules)
- Model Context Protocol SDK
- axios (HTTP クライアント)
- zod (バリデーション)
- dotenv (環境変数管理)

### 環境変数

- `WAROOM_API_KEY`: Waroom API 認証キー（必須）

**設定済みMCPサーバー:**
- `notion`: Notion API との連携（Streamable HTTP）
- `sentry`: Sentry エラー監視・分析（Streamable HTTP）

**初回セットアップ:**
1. Claude Code を再起動してMCPサーバーを有効化
2. 各MCPサーバーでOAuth認証を行う（初回のみ）

### ビルド出力

- `dist/`: TypeScript コンパイル結果
- `dist/main.js`: 実行可能バイナリ（shebang 付き）

### MCP ツール

各ツールは日本語の説明とパラメータバリデーションを持つ：

- `waroom_create_incident`: インシデントの作成（サービス名、タイトル、重要度など指定）
- `waroom_get_incidents`: ページネーション対応のインシデント一覧
- `waroom_get_incident_details`: UUID による個別インシデント詳細（ステートドキュメント `state_document` を含む）
- `waroom_get_postmortems`: ページネーション対応のポストモーテム一覧
- `waroom_create_postmortem`: ポストモーテムの作成
- `waroom_get_postmortem_template`: ポストモーテムテンプレート取得
- `waroom_get_services`: サービス一覧取得
- `waroom_get_service_architecture_context`: 特定のサービスのアーキテクチャコンテキスト取得
- `waroom_update_service_architecture_context`: 特定のサービスのアーキテクチャコンテキスト更新（既存があれば更新、無ければ新規作成）
- `waroom_update_incident_severity`: インシデント重要度の更新
- `waroom_update_incident_status`: インシデントステータスの更新
- `waroom_create_incident_metrics`: インシデントメトリクスの作成（TTD/TTA/TTI/TTF/TTR更新）
- `waroom_get_service_labels`: 特定のサービスのラベル一覧を取得
- `waroom_create_service_label`: 特定のサービスに新しいラベルを作成
- `waroom_update_service_label`: 特定のサービスのラベルを更新
- `waroom_delete_service_label`: 特定のサービスのラベルを削除
- `waroom_update_incident_labels`: インシデントにラベルを付与または更新
- `waroom_get_runbooks`: ランブック一覧取得
- `waroom_get_runbook`: namespace による個別ランブック詳細
- `waroom_update_runbook`: ランブックの更新（内容・namespace の変更）
- `waroom_get_incident_action_items`: 特定のインシデントのアクションアイテム一覧を取得
- `waroom_create_incident_action_item`: 特定のインシデントにアクションアイテムを作成
- `waroom_get_incident_action_item`: アクションアイテムの詳細取得
- `waroom_update_incident_action_item`: アクションアイテムの更新（タイトル・ステータス・担当者）
- `waroom_delete_incident_action_item`: アクションアイテムの削除
- `waroom_get_users`: 組織のユーザー一覧を取得

### API エンドポイント

ベースURL: `https://api.app.waroom.com/api/v0`

- `POST /incidents`: インシデント作成
- `GET /incidents`: インシデント一覧（statusパラメータでフィルタリング可能）
- `GET /incidents/{uuid}`: インシデント詳細
- `GET /postmortems`: ポストモーテム一覧
- `POST /postmortems`: ポストモーテム作成
- `GET /postmortem_template`: ポストモーテムテンプレート取得
- `GET /services`: サービス一覧
- `GET /services/{name}/service_architecture_context`: 特定のサービスのアーキテクチャコンテキスト取得
- `PATCH /services/{name}/service_architecture_context`: 特定のサービスのアーキテクチャコンテキスト更新
- `PUT /incidents/{uuid}/severity`: インシデント重要度の更新
- `PUT /incidents/{uuid}/status`: インシデントステータスの更新
- `POST /incidents/{uuid}/metrics`: インシデントメトリクスの作成
- `GET /services/{service_name}/labels`: サービスのラベル一覧取得
- `POST /services/{service_name}/labels`: サービスのラベル作成
- `PATCH /services/{service_name}/labels/{uuid}`: サービスのラベル更新
- `DELETE /services/{service_name}/labels/{uuid}`: サービスのラベル削除
- `PATCH /incidents/{uuid}/labels`: インシデントのラベル付与/更新
- `GET /runbooks`: ランブック一覧
- `GET /runbooks/{namespace}`: ランブック詳細（namespace はスラッシュを含むパス）
- `PATCH /runbooks/{namespace}`: ランブック更新
- `GET /incidents/{uuid}/action_items`: インシデントのアクションアイテム一覧
- `POST /incidents/{uuid}/action_items`: インシデントのアクションアイテム作成
- `GET /incidents/{uuid}/action_items/{action_item_uuid}`: アクションアイテム詳細
- `PATCH /incidents/{uuid}/action_items/{action_item_uuid}`: アクションアイテム更新（title・status・assignee_nickname、null で解除）
- `DELETE /incidents/{uuid}/action_items/{action_item_uuid}`: アクションアイテム削除
- `GET /users`: 組織のユーザー一覧

## Claude Desktop での設定

### 公開パッケージ版
```json
{
  "mcpServers": {
    "waroom-mcp": {
      "command": "npx",
      "args": ["@topotal/waroom-mcp"],
      "env": {
        "WAROOM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 開発版（このリポジトリのコード）
```json
{
  "mcpServers": {
    "waroom-mcp": {
      "command": "node",
      "args": ["path/to/waroom-mcp/dist/main.js"],
      "env": {
        "WAROOM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**設定ファイルの場所:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

## トラブルシューティング

### ログの確認方法
Claude Desktop のログは以下の場所に保存されています：
- macOS: `~/Library/Logs/Claude/`
- Windows: `%APPDATA%/Claude/Logs/`

MCP サーバー固有のログファイル：
```bash
# waroom-mcp のログを確認
tail -f ~/Library/Logs/Claude/mcp-server-waroom-mcp.log

# 最新50行を確認
tail -50 ~/Library/Logs/Claude/mcp-server-waroom-mcp.log
```

### よくあるエラーと対処法

#### `spawn node ENOENT` エラー
**問題:** node コマンドのパスが見つからない  
**対処法:** Claude Desktop 設定で node の絶対パスを指定する

```bash
# node のパスを確認
which node
# 例: /usr/local/bin/node または ~/.anyenv/envs/nodenv/versions/x.x.x/bin/node
```

設定ファイルで `"command": "node"` を絶対パスに変更：
```json
"command": "/path/to/node"
```

#### `Method not found` エラー
**問題:** MCP サーバーが resources や prompts ハンドラーを実装していない  
**対処法:** これは正常な動作です（当サーバーはツール機能のみを提供）

#### API Key 関連エラー
**問題:** 環境変数 `WAROOM_API_KEY` が設定されていない  
**対処法:** Claude Desktop 設定の `env` セクションに正しい API キーを設定