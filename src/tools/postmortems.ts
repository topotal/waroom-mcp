import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createPostmortemsTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_postmortems',
    'ポストモーテムの一覧を取得します。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getPostmortems(
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
            text: `ポストモーテム一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_create_postmortem',
    'ポストモーテムを作成します。',
    {
      title: z.string().min(1).max(255).describe('ポストモーテムのタイトル（1-255文字）'),
      blob: z.string().min(1).describe('ポストモーテムの内容（詳細な分析や対策を記述）'),
      incident_uuids: z.array(z.string().uuid()).min(1).describe('関連するインシデントのUUID配列（最低1つ必要）'),
      status: z.enum(['draft', 'published', 'archived']).optional().describe('ポストモーテムのステータス（draft, published, archived）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createPostmortem(
          params.title,
          params.blob,
          params.incident_uuids,
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
            text: `ポストモーテムの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};
