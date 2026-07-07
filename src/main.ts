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
import { createRunbooksTools } from './tools/runbooks.js';
import { getIncidentResponsePromptMessages } from './prompts/incident-response.js';
import { getIncidentRespondPromptMessages } from './prompts/incident-respond.js';
import { aboutContent } from './resources/about.js';

dotenv.config();

const waroomClient = new WaroomClient({
  apiKey: process.env.WAROOM_API_KEY || '',
  ...(process.env.WAROOM_BASE_URL && { baseUrl: process.env.WAROOM_BASE_URL }),
});

const server = new McpServer({
  name: 'waroom-mcp',
  version: 'v0',
});

createIncidentsTools(server, waroomClient);
createPostmortemsTools(server, waroomClient);
createServicesTools(server, waroomClient);
createLabelsTools(server, waroomClient);
createRunbooksTools(server, waroomClient);

// リソースの登録
server.resource(
  'Waroom MCP の使い方ガイド - インシデント対応の自動化とポストモーテム管理',
  'waroom://about',
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
    title: z.string().min(1).describe('インシデントのタイトル'),
  },
  async (args) => {
    return {
      messages: getIncidentResponsePromptMessages(args.title),
    };
  }
);

server.prompt(
  'respond',
  '既存のWaroomインシデントに対して対応を開始します。インシデントのUUIDまたはURLを指定してください。',
  {
    incident: z.string().min(1).describe('インシデントのUUIDまたはURL'),
  },
  async (args) => {
    return {
      messages: getIncidentRespondPromptMessages(args.incident),
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Waroom MCP server running on stdio');
