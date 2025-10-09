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

## スラッシュコマンド（Claude Code）

Claude Code では、以下のスラッシュコマンドを使用してインシデント対応を効率化できます。

### `/mcp__waroom_mcp__create`

インシデント対応を開始し、作業内容を自動追跡するスラッシュコマンドです。

#### 使い方

```bash
# タイトル指定あり
/mcp__waroom_mcp__create "データベース接続エラー"

# タイトル指定なし（対話で質問）
/mcp__waroom_mcp__create
```

#### 主な機能

- **サービスの自動検索**: サービス一覧から対話的に選択
- **インシデントの自動作成**: 重要度 `unknown` で自動作成
- **作業の自動追跡**: レスポンダーの発言から自動的にフェーズを判断し、Waroomを更新
  - 調査開始 → `investigating` + TTD記録
  - 原因特定 → TTA記録
  - 修正開始 → `fixing` + TTI記録
  - 修正完了 → `resolved` + TTF/TTR記録
- **継続的な更新**: 会話全体でインシデント情報を最新状態に保持

#### 使用シーン

レスポンダーがClaude Codeでインシデント対応作業（コード調査、ログ確認、修正作業）を進める際に、自動的にWaroomのインシデント情報を更新し、記録を残すことができます。明示的に指示しなくても、作業内容から自動判断して適切なステータスやメトリクスを更新します。

### `/mcp__waroom_mcp__respond`

既存のインシデントに対して対応を開始するスラッシュコマンドです。

#### 使い方

```bash
# UUID を指定
/mcp__waroom_mcp__respond "12345678-1234-1234-1234-123456789abc"

# URL を指定（UUID は自動抽出されます）
/mcp__waroom_mcp__respond "https://app.waroom.com/incidents/12345678-1234-1234-1234-123456789abc"
```

#### 主な機能

- **自動インシデント取得**: 指定された UUID または URL からインシデント詳細を取得
- **自動サービス情報取得**: サービスのアーキテクチャコンテキストを取得・提示
- **自動ステータス更新**: `detected` の場合は `investigating` に自動更新
- **作業の自動追跡**: `/create` と同様に、作業内容から自動的にフェーズを判断してWaroomを更新
- **継続的な更新**: 会話全体でインシデント情報を最新状態に保持

#### 使用シーン

既にWaroomでインシデントが作成されている場合に、そのインシデントに対して対応を開始する際に使用します。Slackの通知やメールに記載されたインシデントURLをそのまま貼り付けるだけで、すぐに対応を開始できます。

#### `/create` との違い

- `/create`: サービス選択 → インシデント作成 → 対応開始
- `/respond`: インシデント取得 → 対応開始（インシデント作成はスキップ）

## リソース

### `waroom://about`

Waroom MCP の詳細な使い方ガイドです。インシデント対応の自動化、ポストモーテム管理、実際の使用シーン、トラブルシューティングなど、包括的な情報を提供します。

#### アクセス方法

Claude Code または Claude Desktop で以下のように参照できます：

```
@waroom:waroom://about
```

#### 含まれる内容

- **クイックスタート**: 即座にインシデント対応を開始する方法
- **自動追跡の仕組み**: 作業内容からフェーズを自動判断する機能の詳細
- **実際の使用シーン**: 障害発生時、過去のインシデント調査、ポストモーテム作成の具体例
- **便利な使い方**: 自然言語での指示、継続的な会話での更新
- **利用可能なツール**: 全機能の詳細説明
- **環境設定**: セットアップ手順
- **トラブルシューティング**: よくある問題と解決方法
