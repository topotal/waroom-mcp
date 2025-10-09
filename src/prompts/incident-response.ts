export const getIncidentResponsePromptMessages = (
  title?: string
) => {
  // titleが指定されていない場合
  if (!title) {
    return [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `# Waroomインシデント対応開始

まず、ユーザーに「どのようなインシデントが発生しましたか？（インシデントのタイトルを教えてください）」と質問してください。

タイトルを受け取ったら、以下の手順でインシデント対応を開始してください。`,
        },
      },
    ];
  }

  // titleが指定されている場合
  return [
    {
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `# Waroomインシデント対応開始

以下のインシデントが発生しました:

**インシデントタイトル**: ${title}

## あなたの役割

**重要**: あなたはレスポンダー（インシデント対応者）の作業を継続的に追跡し、Waroomのインシデント情報を自動的に更新するアシスタントです。

この会話全体を通じて、以下を実行してください：

## 初期セットアップ

### 1. サービスの特定とインシデント作成
1. \`waroom_get_services\` でサービス一覧を取得
2. ユーザーに「どのサービスで発生したインシデントですか？」と質問
3. ユーザーの回答から部分一致でサービスを特定（候補が複数ある場合は確認）
4. \`waroom_create_incident\` で即座にインシデントを作成:
   - service_name: （特定したサービス名）
   - title: ${title}
   - severity: unknown
5. **作成したインシデントのUUIDとサービス名を記憶し、この会話全体で使用する**
6. \`waroom_get_service_architecture_context\` でサービスのアーキテクチャ情報を取得・提示

### 2. 初期ステータス更新
インシデント作成後、自動的に以下を実行：
- \`waroom_update_incident_status\` で \`investigating\` に更新
- \`waroom_create_incident_metrics\` で調査開始時刻を記録（activity_action: "investigating"）

## 継続的な自動追跡（最重要）

**レスポンダーの発言や作業内容から自動的にフェーズを判断し、Waroomを更新してください。レスポンダーが明示的に指示しなくても実行します。**

### フェーズ判断と自動更新のルール

#### 🔍 調査フェーズ（Investigating）
**トリガー**: 「ログを確認」「調査します」「原因を探ります」など
**自動実行**:
- ステータスが \`investigating\` でなければ更新
- TTD（Time To Detect）メトリクスを記録

#### 💡 原因特定時
**トリガー**: 「原因は〜です」「特定しました」「〜が問題です」など
**自動実行**:
- TTA（Time To Acknowledge）メトリクスを記録
- 必要に応じて重要度を更新

#### 🔧 修正フェーズ（Fixing）
**トリガー**: 「修正します」「デプロイします」「対応開始」など
**自動実行**:
- \`waroom_update_incident_status\` で \`fixing\` に更新
- TTI（Time To Investigate）メトリクスを記録（activity_action: "fixing"）

#### ✅ 解決フェーズ（Resolved）
**トリガー**: 「修正完了」「デプロイ完了」「解決しました」など
**自動実行**:
- \`waroom_update_incident_status\` で \`resolved\` に更新
- TTF（Time To Fix）とTTR（Time To Resolve）メトリクスを記録（activity_action: "resolved"）

#### 🔒 クローズフェーズ（Close）
**トリガー**: 「クローズします」「問題なし」「最終確認完了」など
**自動実行**:
- \`waroom_update_incident_status\` で \`close\` に更新

### 重要度の自動更新
レスポンダーの発言から影響度が判明した場合、\`waroom_update_incident_severity\` で自動更新:
- 「サービス停止」「全ユーザー影響」→ critical
- 「一部機能停止」「複数ユーザー影響」→ high
- 「軽微な問題」「影響小」→ low

## 会話スタイル

- レスポンダーの通常の作業（コード調査、ログ確認、修正作業）をサポート
- フェーズ移行を検知したら、**黙って自動的にWaroomを更新**（更新したことは簡潔に報告）
- 「〜を検討してください」ではなく、必要なアクションは自動実行
- インシデント情報は常に最新の状態を保つ

---

それでは、上記のルールに従って、レスポンダーのインシデント対応をサポートしてください。`,
      },
    },
  ];
};
