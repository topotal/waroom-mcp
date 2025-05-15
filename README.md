# Waroom MCP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![smithery badge](https://smithery.ai/badge/@topotal/waroom-mcp)](https://smithery.ai/server/@topotal/waroom-mcp)

> [!CAUTION]
> これはまだ実験的なプロジェクトであり、安定性やパフォーマンスは保証されていません。使用する際は注意してください。

このプロジェクトは、Waroom APIとインタラクションするためのModel Context Protocol (MCP) サーバーです。標準化されたプロトコルを使用して、Waroomから様々な情報を取得することができます。

## 概要

Waroom MCP サーバーは、Waroom APIエンドポイントに構造化された方法でアクセスする方法を提供します。インシデント情報やポストモーテム情報の取得など、さまざまな機能をサポートしています。

## 使用方法

サーバーを起動するには、必要な環境変数を設定してください：

```bash
export WAROOM_API_KEY=your_api_key
```

次に、以下のコマンドを実行します：

```bash
npx @topotal/waroom-mcp
```

これにより、MCPサーバーが起動し、定義されたツールを通じてWaroom APIとインタラクションできるようになります。

## Claude Desktop での使用

Claude Desktopでこの MCP サーバーを使用するには、手動で `npx @topotal/waroom-mcp` を実行する必要はありません。代わりに、Claude Desktop の設定ファイルに以下の設定を追加してください：

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

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

その後、通常通りClaude Desktopを起動してください。nodenvやnvmを使用している場合は、`npx`コマンドのフルパスを指定する必要があるかもしれません。

## 利用可能なツール

このModel Context Protocolサーバーは、以下のWaroom関連ツールを提供します：

### インシデント関連
- waroom_get_incidents: インシデントの一覧を取得
- waroom_get_incident_details: 特定のインシデントの詳細を取得

### ポストモーテム関連
- waroom_get_postmortems: ポストモーテムの一覧を取得

## デバッグ

まず、プロジェクトをビルドします：

```bash
npm install
npm run build
```

MCPサーバーはstdioを介して実行されるため、デバッグは困難な場合があります。最適なデバッグ体験のために、MCP Inspectorの使用を強くお勧めします。

以下のコマンドでnpmを介してMCP Inspectorを起動できます：

```bash
npx @modelcontextprotocol/inspector "./dist/main.js"
```

環境変数が適切に構成されていることを確認してください。

起動すると、Inspectorはブラウザでアクセスしてデバッグを開始できるURLを表示します。

## パブリッシュ

パッケージの新しいバージョンを公開するには、以下の手順に従います：

1. mainブランチから最新のコードをプル
   ```bash
   git checkout main
   git pull origin main
   ```

2. パッケージをビルド
   ```bash
   npm run build
   ```

3. npmに公開
   ```bash
   npm publish
   ```

4. 変更をリモートリポジトリにプッシュ
   ```bash
   git push origin main --tags
   ```

## 貢献

貢献は歓迎します！リポジトリをフォークし、改善やバグ修正のためにプルリクエストを提出してください。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細はLICENSEファイルを参照してください。
