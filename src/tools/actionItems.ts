import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createActionItemsTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_incident_action_items',
    '特定のインシデントのアクションアイテム一覧を取得します。',
    {
      incident_uuid: z.string().uuid().describe('インシデントのUUID'),
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getIncidentActionItems(
          params.incident_uuid,
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
            text: `アクションアイテム一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_create_incident_action_item',
    '特定のインシデントに新しいアクションアイテムを作成します。',
    {
      incident_uuid: z.string().uuid().describe('インシデントのUUID'),
      title: z.string().min(1).describe('アクションアイテムのタイトル'),
      status: z.enum(['open', 'closed', 'skipped']).optional().describe('アクションアイテムのステータス。デフォルト: open'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createIncidentActionItem(
          params.incident_uuid,
          params.title,
          params.status
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
            text: `アクションアイテムの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_get_incident_action_item',
    '特定のインシデントのアクションアイテム詳細を取得します。',
    {
      incident_uuid: z.string().uuid().describe('インシデントのUUID'),
      action_item_uuid: z.string().uuid().describe('アクションアイテムのUUID'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getIncidentActionItem(
          params.incident_uuid,
          params.action_item_uuid
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
            text: `アクションアイテムの取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_incident_action_item',
    '特定のインシデントのアクションアイテムを更新します。タイトル・ステータス（完了・スキップ等）・担当者を変更できます。',
    {
      incident_uuid: z.string().uuid().describe('インシデントのUUID'),
      action_item_uuid: z.string().uuid().describe('アクションアイテムのUUID'),
      title: z.string().min(1).optional().describe('アクションアイテムの新しいタイトル'),
      status: z.enum(['open', 'closed', 'skipped']).optional().describe('アクションアイテムの新しいステータス（open: 未対応, closed: 完了, skipped: スキップ）'),
      assignee_nickname: z.string().min(1).nullable().optional().describe('担当者の nickname（waroom_get_users で取得可能）。null を指定するとアサインを解除'),
    },
    async (params) => {
      try {
        const updates: { title?: string; status?: string; assignee_nickname?: string | null } = {};
        if (params.title !== undefined) updates.title = params.title;
        if (params.status !== undefined) updates.status = params.status;
        if (params.assignee_nickname !== undefined) updates.assignee_nickname = params.assignee_nickname;

        if (Object.keys(updates).length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'title、status、assignee_nickname のいずれかを指定してください。'
            }]
          };
        }

        const response = await waroomClient.updateIncidentActionItem(
          params.incident_uuid,
          params.action_item_uuid,
          updates
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
            text: `アクションアイテムの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_delete_incident_action_item',
    '特定のインシデントのアクションアイテムを削除します。',
    {
      incident_uuid: z.string().uuid().describe('インシデントのUUID'),
      action_item_uuid: z.string().uuid().describe('アクションアイテムのUUID'),
    },
    async (params) => {
      try {
        await waroomClient.deleteIncidentActionItem(
          params.incident_uuid,
          params.action_item_uuid
        );
        return {
          content: [{
            type: 'text',
            text: 'アクションアイテムを削除しました。'
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `アクションアイテムの削除に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};
