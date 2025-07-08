import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createLabelsTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_service_labels',
    '特定のサービスのラベル一覧を取得します。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getServiceLabels(
          params.service_name,
          params.page || 1,
          params.per_page || 50
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
            text: `サービスラベル一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_create_service_label',
    '特定のサービスに新しいラベルを作成します。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
      name: z.string().min(1).max(100).describe('ラベル名'),
      color: z.string().regex(/^[0-9a-fA-F]{6}$/).describe('ラベルの色（6桁の16進数カラーコード、例: ff0000）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createServiceLabel(
          params.service_name,
          params.name,
          params.color
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
            text: `サービスラベルの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_service_label',
    '特定のサービスのラベルを更新します。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
      label_uuid: z.string().uuid().describe('更新するラベルのUUID'),
      name: z.string().min(1).max(100).describe('新しいラベル名'),
      color: z.string().regex(/^[0-9a-fA-F]{6}$/).describe('新しいラベルの色（6桁の16進数カラーコード、例: ff0000）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.updateServiceLabel(
          params.service_name,
          params.label_uuid,
          params.name,
          params.color
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
            text: `サービスラベルの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_delete_service_label',
    '特定のサービスのラベルを削除します。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
      label_uuid: z.string().uuid().describe('削除するラベルのUUID'),
    },
    async (params) => {
      try {
        const response = await waroomClient.deleteServiceLabel(
          params.service_name,
          params.label_uuid
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
            text: `サービスラベルの削除に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_incident_labels',
    'インシデントにラベルを付与または更新します。',
    {
      incident_uuid: z.string().uuid().describe('対象インシデントのUUID'),
      label_uuids: z.array(z.string().uuid()).describe('付与するラベルのUUID配列'),
    },
    async (params) => {
      try {
        const response = await waroomClient.updateIncidentLabels(
          params.incident_uuid,
          params.label_uuids
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
            text: `インシデントラベルの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};