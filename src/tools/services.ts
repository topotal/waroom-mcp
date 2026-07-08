import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createServicesTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_services',
    'サービスの一覧を取得します。',
    {
      page: z.number().int().min(1).optional().describe('取得するページ番号（1以上の整数）。デフォルト: 1'),
      per_page: z.number().int().min(1).max(100).optional().describe('1ページあたりの取得数（1-100）。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getServices(
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
            text: `サービス一覧の取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_get_service_architecture_context',
    '特定のサービスのアーキテクチャコンテキストを取得します。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getServiceArchitectureContext(params.service_name);
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
            text: `サービスアーキテクチャコンテキストの取得に失敗しました: ${error}`
          }]
        };
      }
    }
  );

  server.tool(
    'waroom_update_service_architecture_context',
    '特定のサービスのアーキテクチャコンテキストを更新します。既存のコンテキストがあれば更新し、無ければ新規作成されます。',
    {
      service_name: z.string().min(1).max(100).describe('サービス名'),
      blob: z.string().min(1).describe('アーキテクチャコンテキストの内容'),
    },
    async (params) => {
      try {
        const response = await waroomClient.updateServiceArchitectureContext(params.service_name, params.blob);
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
            text: `サービスアーキテクチャコンテキストの更新に失敗しました: ${error}`
          }]
        };
      }
    }
  );
};