import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createUsersTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_users',
    '組織のユーザー一覧を取得します。アクションアイテムの担当者指定などに使う nickname を確認できます。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getUsers(
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
            text: `ユーザー一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};
