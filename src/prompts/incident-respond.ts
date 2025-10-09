import { extractIncidentUuid } from '../utils/extractIncidentUuid.js';

export const getIncidentRespondPromptMessages = (incident: string) => {
  const incidentUuid = extractIncidentUuid(incident);

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
        text: `# Waroomインシデント対応開始（既存インシデント）

既存のインシデントに対して対応を開始します:

**インシデント識別子**: ${incident}

上記リソースの「🚀 クイックスタート」セクションの「自動追跡の仕組み」に従って、インシデント対応を開始してください。

## 初期セットアップの手順

1. \`waroom_get_incident_details\` でインシデント詳細を取得（UUID: ${incidentUuid}）
2. インシデント情報（タイトル、重要度、ステータス、サービス名など）を確認・提示
3. \`waroom_get_service_architecture_context\` でサービスのアーキテクチャ情報を取得・提示
4. 現在のステータスが \`detected\` の場合、自動的に \`investigating\` ステータスに更新し、調査開始メトリクスを記録

この会話全体を通じて、リソースに記載された「自動追跡の仕組み」に基づいて、レスポンダーの作業内容から自動的にフェーズを判断し、Waroomのインシデント情報を継続的に更新してください。`,
      },
    },
  ];
};
