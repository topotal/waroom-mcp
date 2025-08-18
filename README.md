# Waroom MCP

[![npm version](https://badge.fury.io/js/@topotal%2Fwaroom-mcp.svg)](https://badge.fury.io/js/@topotal%2Fwaroom-mcp)

> [!CAUTION]
> これはまだ実験的なプロジェクトであり、安定性やパフォーマンスは保証されていません。使用する際は注意してください。

このプロジェクトは、Waroom APIとインタラクションするためのModel Context Protocol (MCP) サーバーです。標準化されたプロトコルを使用して、Waroomから様々な情報を取得することができます。

## 概要

Waroom MCP サーバーは、Waroom APIエンドポイントに構造化された方法でアクセスする方法を提供します。インシデント情報やポストモーテム情報の取得など、さまざまな機能をサポートしています。


## セットアップ

### Claude Code での使用

```bash
claude mcp add waroom-mcp --env WAROOM_API_KEY=your-api-key -- npx @topotal/waroom-mcp
```

> [!NOTE]
> nodenv や nvm を使用している場合は、`npx` のフルパスを指定してください。

### Claude Desktop での使用

設定ファイルに以下を追加してください：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "waroom-mcp": {
      "command": "npx",
      "args": ["@topotal/waroom-mcp"],
      "env": {
        "WAROOM_API_KEY": "your-api-key"
      }
    }
  }
}
```

設定後、Claude Desktop を再起動すると Waroom の各種機能が利用できるようになります。

## 利用可能なツール

このModel Context Protocolサーバーは、以下のWaroom関連ツールを提供します：

### インシデント関連
- `waroom_create_incident`: インシデントの作成（サービス名、タイトル、重要度など指定）
- `waroom_get_incidents`: ページネーション対応のインシデント一覧
- `waroom_get_incident_details`: UUID による個別インシデント詳細
- `waroom_update_incident_severity`: インシデント重要度の更新
- `waroom_update_incident_status`: インシデントステータスの更新
- `waroom_create_incident_metrics`: インシデントメトリクスの作成（TTD/TTA/TTI/TTF/TTR更新）
- `waroom_update_incident_labels`: インシデントにラベルを付与または更新

### ポストモーテム関連
- `waroom_get_postmortems`: ページネーション対応のポストモーテム一覧
- `waroom_create_postmortem`: ポストモーテムの作成
- `waroom_get_postmortem_template`: ポストモーテムテンプレート取得

### サービス関連
- `waroom_get_services`: サービス一覧取得
- `waroom_get_service_architecture_context`: 特定のサービスのアーキテクチャコンテキスト取得

### ラベル管理
- `waroom_get_service_labels`: 特定のサービスのラベル一覧を取得
- `waroom_create_service_label`: 特定のサービスに新しいラベルを作成
- `waroom_update_service_label`: 特定のサービスのラベルを更新
- `waroom_delete_service_label`: 特定のサービスのラベルを削除
