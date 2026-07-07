import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createRunbooksTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_runbooks',
    'ランブックの一覧を取得します。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getRunbooks(
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
            text: `ランブック一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_get_runbook',
    'ランブックの詳細を取得します。namespace で指定します。',
    {
      namespace: z.string().min(1).describe('ランブックの namespace（スラッシュを含むパス形式。例: /payments/db-failover）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getRunbook(params.namespace);
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
            text: `ランブックの取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_runbook',
    'ランブックを更新します。namespace で対象を指定し、内容（blob）や namespace を変更できます。',
    {
      namespace: z.string().min(1).describe('更新対象のランブックの namespace（スラッシュを含むパス形式。例: /payments/db-failover）'),
      blob: z.string().min(1).optional().describe('ランブックの新しい内容'),
      new_namespace: z.string().min(1).optional().describe('変更後の namespace（namespace を変更する場合のみ指定）'),
    },
    async (params) => {
      try {
        if (!params.blob && !params.new_namespace) {
          return {
            content: [{
              type: 'text',
              text: 'blob または new_namespace のいずれかを指定してください。'
            }]
          };
        }
        const updates: { namespace?: string; blob?: string } = {};
        if (params.blob) updates.blob = params.blob;
        if (params.new_namespace) updates.namespace = params.new_namespace;

        const response = await waroomClient.updateRunbook(params.namespace, updates);
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
            text: `ランブックの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};
