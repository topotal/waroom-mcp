#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { z } from 'zod';
import { WaroomClient } from './WaroomClient.js';
import { createIncidentsTools } from './tools/incidents.js';
import { createPostmortemsTools } from './tools/postmortems.js';
import { createServicesTools } from './tools/services.js';
import { createLabelsTools } from './tools/labels.js';
import { getIncidentResponsePromptMessages } from './prompts/incident-response.js';
import { aboutContent } from './resources/about.js';

dotenv.config();

const waroomClient = new WaroomClient({
  apiKey: process.env.WAROOM_API_KEY || '',
});

const server = new McpServer({
  name: 'waroom-mcp',
  version: 'v0',
});

createIncidentsTools(server, waroomClient);
createPostmortemsTools(server, waroomClient);
createServicesTools(server, waroomClient);
createLabelsTools(server, waroomClient);

// リソースの登録
server.resource(
  'waroom://about',
  'Waroom MCP の使い方ガイド - インシデント対応の自動化とポストモーテム管理',
  async () => {
    return {
      contents: [
        {
          uri: 'waroom://about',
          mimeType: 'text/markdown',
          text: aboutContent,
        },
      ],
    };
  }
);

// プロンプトの登録
server.prompt(
  'create',
  'Waroomでインシデント対応を開始します。サービスを検索してインシデントを作成し、作業を自動追跡します。',
  {
    title: z.string().min(1).optional().describe('インシデントのタイトル（省略可、省略時は対話で質問）'),
  },
  async (args) => {
    return {
      messages: getIncidentResponsePromptMessages(args.title),
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Waroom MCP server running on stdio');
