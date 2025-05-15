import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WaroomClient } from '../WaroomClient.js';
import { z } from 'zod';

export const createIncidentsTools = (server: McpServer, waroomClient: WaroomClient) => {
  server.tool(
    'waroom_get_incidents',
    'インシデントの一覧を取得します。',
    {
      page: z.number().min(1).optional().describe('取得するページ番号。デフォルト: 1'),
      per_page: z.number().min(1).max(100).optional().describe('1ページあたりの取得数。デフォルト: 50'),
    },
    async (params) => {
      try {
        const response = await waroomClient.getIncidents(
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
      incident_uuid: z.string().describe('取得するインシデントのUUID'),
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
};
