export const getIncidentResponsePromptMessages = (title: string) => {
  return [
    {
      role: 'user' as const,
      content: {
        type: 'resource' as const,
        resource: {
          uri: 'waroom://about',
          text: 'Waroom MCP の基本情報と使い方',
        },
      },
    },
    {
      role: 'user' as const,
      content: {
        type: 'text' as const,
        text: `# Waroomインシデント対応開始

以下のインシデントが発生しました:

**インシデントタイトル**: ${title}

上記リソースの「🚀 クイックスタート」セクションの「自動追跡の仕組み」に従って、インシデント対応を開始してください。

## 初期セットアップの手順

1. \`waroom_get_services\` でサービス一覧を取得
2. ユーザーに「どのサービスで発生したインシデントですか？」と質問
3. ユーザーの回答から部分一致でサービスを特定（候補が複数ある場合は確認）
4. \`waroom_create_incident\` で即座にインシデントを作成（severity: unknown）
5. 作成したインシデントのUUIDとサービス名を記憶
6. \`waroom_get_service_architecture_context\` でサービスのアーキテクチャ情報を取得・提示
7. 自動的に \`investigating\` ステータスに更新し、調査開始メトリクスを記録

この会話全体を通じて、リソースに記載された「自動追跡の仕組み」に基づいて、レスポンダーの作業内容から自動的にフェーズを判断し、Waroomのインシデント情報を継続的に更新してください。`,
      },
    },
  ];
};
