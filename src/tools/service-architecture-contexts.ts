import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { WaroomClient } from '../WaroomClient.js';

export function createServiceArchitectureContextsTools(server: McpServer, waroomClient: WaroomClient) {
  server.tool(
    'waroom_get_service_architecture_contexts',
    'サービスアーキテクチャコンテキストの一覧を取得します。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getServiceArchitectureContexts(
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
            text: `サービスアーキテクチャコンテキスト一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_create_service_architecture_context',
    'サービスアーキテクチャコンテキストを作成します。',
    {
      service_name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/).describe('サービス名（1-100文字、英数字・アンダースコア・ハイフンのみ）'),
      blob: z.string().min(1).describe('アーキテクチャコンテキストの内容（サービスのアーキテクチャ情報やドキュメント）'),
    },
    async (params) => {
      try {
        const response = await waroomClient.createServiceArchitectureContext(
          params.service_name,
          params.blob
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
            text: `サービスアーキテクチャコンテキストの作成に失敗しました: ${error}`
          }]
        };
      }
    }
  );
}