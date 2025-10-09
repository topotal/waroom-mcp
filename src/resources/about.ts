export const aboutContent = `# Waroom MCP について

## Waroom MCP とは？

Waroom MCP (Model Context Protocol) サーバーは、**インシデント対応とポストモーテム管理に特化した開発者向けツール**です。Claude Code や Claude Desktop などのコーディングエージェントと連携し、障害対応の記録を自動化します。

このリモート MCP サーバーは Waroom API への橋渡しとして機能し、開発者のインシデント対応ワークフローを最適化します。

## 詳細情報

- **GitHub**: <https://github.com/topotal/waroom-mcp>
- **npm パッケージ**: <https://www.npmjs.com/package/@topotal/waroom-mcp>
- **問題報告**: <https://github.com/topotal/waroom-mcp/issues>

## 🚀 クイックスタート

### インシデント対応を開始する

障害が発生したら、スラッシュコマンドを使って即座にインシデント対応を開始できます：

\`\`\`
/mcp__waroom_mcp__create "データベース接続エラー"
\`\`\`

このコマンドは以下を自動的に実行します：
1. **サービスの選択**: 利用可能なサービス一覧から対話的に選択
2. **インシデントの作成**: 重要度 \`unknown\` で自動作成
3. **作業の自動追跡**: あなたの発言内容から作業フェーズを自動判断

### 自動追跡の仕組み

Waroom MCP の最大の特徴は、**明示的な指示なしに作業内容を自動判断**することです：

#### 調査フェーズ
「ログを確認します」「エラーの原因を調べています」といった発言を検出すると：
- ステータスを \`investigating\` に更新
- TTD (Time To Detection) を記録

#### 原因特定フェーズ
「原因が特定できました」「\`database.js:45\` でタイムアウトしています」といった発言を検出すると：
- TTA (Time To Acknowledgement) を記録

#### 修正フェーズ
「修正を開始します」「コードを修正しています」といった発言を検出すると：
- ステータスを \`fixing\` に更新
- TTI (Time To Investigation) を記録

#### 解決フェーズ
「修正が完了しました」「デプロイしました」といった発言を検出すると：
- ステータスを \`resolved\` に更新
- TTF (Time To Fix) と TTR (Time To Resolution) を記録

### インシデントの検索と確認

\`\`\`
# 最近のインシデント一覧を確認
「最近のインシデントを見せて」

# 特定のインシデントの詳細を確認
「インシデント <UUID> の詳細を教えて」

# 未解決のインシデントを確認
「未解決のインシデントはありますか？」
\`\`\`

## 📊 実際の使用シーン

### シーン1: 障害発生時の対応

\`\`\`
ユーザー: アラートが来た。データベース接続エラーみたい

あなた: /mcp__waroom_mcp__create "データベース接続エラー"

Claude: インシデントを作成しました（UUID: xxx-xxx）
        どのサービスですか？ 1) api-server 2) web-app ...

あなた: 1

Claude: api-server のインシデントを作成しました。
        調査を開始してください。

あなた: ログを確認します
        → 自動的に investigating に更新、TTD を記録

あなた: connection_pool.go:123 でコネクションプールが枯渇していました
        → 自動的に TTA を記録

あなた: プールサイズを増やします
        → 自動的に fixing に更新、TTI を記録

あなた: 修正してデプロイしました
        → 自動的に resolved に更新、TTF/TTR を記録
\`\`\`

### シーン2: 過去のインシデント調査

\`\`\`
あなた: 先週の重大インシデントを見せて

Claude: [インシデント一覧を表示]

あなた: このインシデント（UUID: xxx）の詳細を教えて

Claude: [詳細情報を表示: 原因、影響範囲、対応時間など]

あなた: 同じようなインシデントは他にもある？

Claude: [類似インシデントを検索・表示]
\`\`\`

### シーン3: ポストモーテム作成

\`\`\`
あなた: このインシデント（UUID: xxx）のポストモーテムを作成して

Claude: [テンプレートを取得して下書きを作成]
        以下の内容でよろしいですか？

あなた: はい、作成してください

Claude: ポストモーテムを作成しました。
        URL: https://app.waroom.com/postmortems/yyy
\`\`\`

## 💡 便利な使い方

### 自然言語での指示

Waroom MCP は自然言語での指示を理解します：

- **インシデント作成**: 「データベースエラーのインシデントを作成して」
- **ステータス更新**: 「インシデントを調査中に変更して」
- **重要度変更**: 「このインシデントは重大なので severity を critical に変更して」
- **ラベル付与**: 「database ラベルを付けて」

### 継続的な会話での更新

一度インシデント対応を開始すると、会話全体を通じてインシデント情報が最新状態に保たれます。明示的に「更新して」と言わなくても、作業内容から自動的に判断して更新します。

### サービスとラベルの管理

\`\`\`
# サービス一覧の確認
「サービス一覧を見せて」

# サービスのアーキテクチャ情報取得
「api-server のアーキテクチャ情報を教えて」

# ラベルの作成
「api-server に database ラベルを作成して」

# インシデントにラベルを付与
「このインシデントに database と critical のラベルを付けて」
\`\`\`

## 🛠 利用可能なツール

Waroom MCP は以下の機能を提供します：

### インシデント管理
- \`waroom_create_incident\`: インシデントの作成
- \`waroom_get_incidents\`: インシデント一覧の取得（ページネーション対応）
- \`waroom_get_incident_details\`: 個別インシデントの詳細取得
- \`waroom_update_incident_severity\`: 重要度の更新
- \`waroom_update_incident_status\`: ステータスの更新
- \`waroom_create_incident_metrics\`: メトリクス（TTD/TTA/TTI/TTF/TTR）の記録
- \`waroom_update_incident_labels\`: ラベルの付与・更新

### ポストモーテム管理
- \`waroom_get_postmortems\`: ポストモーテム一覧の取得
- \`waroom_create_postmortem\`: ポストモーテムの作成
- \`waroom_get_postmortem_template\`: テンプレートの取得

### サービス管理
- \`waroom_get_services\`: サービス一覧の取得
- \`waroom_get_service_architecture_context\`: アーキテクチャ情報の取得

### ラベル管理
- \`waroom_get_service_labels\`: サービスのラベル一覧取得
- \`waroom_create_service_label\`: ラベルの作成
- \`waroom_update_service_label\`: ラベルの更新
- \`waroom_delete_service_label\`: ラベルの削除

### スラッシュコマンド（Claude Code 専用）
- \`/mcp__waroom_mcp__create\`: インシデント対応の開始と自動追跡

## ⚙️ 環境設定

### Claude Code での使用

\`\`\`bash
claude mcp add waroom-mcp --env WAROOM_API_KEY=your-api-key -- npx @topotal/waroom-mcp
\`\`\`

> **注意**: nodenv や nvm を使用している場合は、\`npx\` のフルパスを指定してください。

### Claude Desktop での使用

設定ファイルに以下を追加：

**macOS**: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
**Windows**: \`%APPDATA%\\Claude\\claude_desktop_config.json\`

\`\`\`json
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
\`\`\`

設定後、Claude Desktop を再起動すると Waroom の機能が利用できるようになります。

## 🔧 トラブルシューティング

### ログの確認方法

Claude Desktop のログは以下の場所に保存されています：

- **macOS**: \`~/Library/Logs/Claude/\`
- **Windows**: \`%APPDATA%/Claude/Logs/\`

Waroom MCP 固有のログを確認：

\`\`\`bash
# macOS の場合
tail -f ~/Library/Logs/Claude/mcp-server-waroom-mcp.log

# 最新50行を確認
tail -50 ~/Library/Logs/Claude/mcp-server-waroom-mcp.log
\`\`\`

### よくあるエラーと対処法

#### \`spawn node ENOENT\` エラー

**問題**: node コマンドのパスが見つからない
**対処法**: Claude Desktop 設定で node の絶対パスを指定

\`\`\`bash
# node のパスを確認
which node
# 例: /usr/local/bin/node
\`\`\`

設定ファイルで \`"command": "node"\` を絶対パスに変更：

\`\`\`json
"command": "/usr/local/bin/node",
"args": ["/path/to/node_modules/.bin/waroom-mcp"]
\`\`\`

#### API Key 関連エラー

**問題**: 環境変数 \`WAROOM_API_KEY\` が設定されていない
**対処法**: Claude Desktop 設定の \`env\` セクションに正しい API キーを設定

**API キーの取得方法**:
1. Waroom にログイン
2. 設定ページから API キーを発行
3. 設定ファイルに貼り付け

#### \`Method not found\` エラー

**問題**: MCP サーバーが特定のハンドラーを実装していない
**対処法**: これは一部の機能（resources や prompts）が未実装の場合に発生する正常な動作です

### 開発者向け

プロジェクトをローカルで開発する場合：

\`\`\`bash
# リポジトリをクローン
git clone https://github.com/topotal/waroom-mcp.git
cd waroom-mcp

# 依存関係をインストール
npm install

# ビルド
npm run build

# MCP Inspector でデバッグ
npm run inspector
\`\`\`

Claude Desktop で開発版を使用する場合は、設定ファイルで \`node\` と \`dist/main.js\` の絶対パスを指定してください。

## 📚 さらに詳しく

- **GitHub リポジトリ**: <https://github.com/topotal/waroom-mcp>
- **Issue 報告**: <https://github.com/topotal/waroom-mcp/issues>
- **npm パッケージ**: <https://www.npmjs.com/package/@topotal/waroom-mcp>

---

*インシデント対応を始めましょう！\`/mcp__waroom_mcp__create\` コマンドまたは「インシデントを作成して」と話しかけてください。*
`;
