import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createIncidentsTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_create_incident',
    'インシデントを作成します。',
    {
      service_name: z.string().min(1).describe('サービス名またはサービスID'),
      title: z.string().min(1).max(255).describe('インシデントのタイトル（1-255文字）'),
      severity: z.enum(['critical', 'high', 'low', 'info', 'unknown']).describe('重要度（critical, high, low, info, unknown）'),
      description: z.string().optional().describe('インシデントの説明（オプション）'),
      experimental: z.boolean().default(false).describe('実験的なインシデントかどうか（デフォルト: false）'),
      is_private: z.boolean().default(false).describe('プライベートインシデントかどうか（デフォルト: false）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createIncident(
          params.service_name,
          params.title,
          params.severity,
          params.description,
          params.experimental,
          params.is_private
        );
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデントの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_get_incidents',
    'インシデントの一覧を取得します。各種フィルター条件を指定できます。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
      service_names: z.array(z.string().min(1)).min(1).optional().describe('フィルタリング対象のサービス名の配列'),
      status: z.enum(['resolved', 'close', 'detected', 'investigating', 'fixing']).optional().describe('インシデントステータス（resolved, close, detected, investigating, fixing）'),
      root_cause: z.enum(['unspecified', 'code_bug', 'configuration_error', 'deployment_failure', 'infrastructure_failure', 'operational_failure', 'third_party_outage', 'other']).optional().describe('根本原因'),
      severities: z.array(z.enum(['critical', 'high', 'low', 'info', 'unknown'])).min(1).optional().describe('重要度の配列（critical, high, low, info, unknown）'),
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('開始日（YYYY-MM-DD形式 例: 2023-01-01）'),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('終了日（YYYY-MM-DD形式 例: 2023-12-31）'),
      includes_experimental: z.boolean().optional().describe('実験的なインシデントを含めるかどうか'),
      label_names: z.array(z.string().min(1)).min(1).optional().describe('フィルタリング対象のラベル名の配列'),
      commander_id: z.number().int().positive().optional().describe('コマンダーのID（正の整数）'),
    },
    async (params) => {
      try {
        const { page = 1, per_page = 50, ...filters } = params;
        const response = await waroomClient.getIncidents(page, per_page, filters);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデント一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_get_incident_details',
    '特定のインシデントの詳細情報を取得します。',
    {
      incident_uuid: z.string().uuid().describe('取得するインシデントのUUID'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getIncidentDetails(params.incident_uuid);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデント詳細の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_incident_severity',
    'インシデントの重要度を更新します。',
    {
      incident_uuid: z.string().uuid().describe('更新するインシデントのUUID'),
      severity: z.enum(['critical', 'high', 'low', 'info', 'unknown']).describe('新しい重要度（critical, high, low, info, unknown）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.updateIncidentSeverity(params.incident_uuid, params.severity);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデント重要度の更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_incident_status',
    'インシデントのステータスを更新します。',
    {
      incident_uuid: z.string().uuid().describe('更新するインシデントのUUID'),
      status: z.enum(['detected', 'investigating', 'fixing', 'resolved', 'close']).describe('新しいステータス（detected, investigating, fixing, resolved, close）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.updateIncidentStatus(params.incident_uuid, params.status);
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデントステータスの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_create_incident_metrics',
    'インシデントメトリクスを作成します。レスポンス活動を記録し、TTD/TTA/TTI/TTF/TTRを更新します。',
    {
      incident_uuid: z.string().uuid().describe('対象インシデントのUUID'),
      activity_action: z.enum(['detected', 'investigating', 'fixing', 'resolved', 'close', 'triggered', 'critical', 'high', 'low', 'info', 'unknown', 'unspecified', 'code_bug', 'configuration_error', 'deployment_failure', 'infrastructure_failure', 'operational_failure', 'third_party_outage', 'other']).describe('活動アクション（status: detected/investigating/fixing/resolved/close/triggered, severity: critical/high/low/info/unknown, root_cause: unspecified/code_bug/configuration_error/deployment_failure/infrastructure_failure/operational_failure/third_party_outage/other）'),
      triggered_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)$/).describe('実行時刻（ISO 8601形式、例: 2023-01-01T12:00:00Z）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createIncidentMetrics(
          params.incident_uuid,
          params.activity_action,
          params.triggered_at
        );
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `インシデントメトリクスの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};
