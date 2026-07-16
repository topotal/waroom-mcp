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
import { createActionItemsTools } from './tools/actionItems.js';
import { createUsersTools } from './tools/users.js';
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
}, {
  instructions: `このサーバーは Waroom を用いたインシデント対応・ポストモーテム管理のためのものです。

障害・エラー・アラート・サービス停止など、インシデント対応と判断できる場面では Waroom ツールを積極的に使ってください。特に次を意識してください：

- 対応の起点として、まず \`waroom_create_incident\` でのインシデント登録を提案する（既存インシデントが対象なら \`waroom_get_incident_details\` で状況を把握する）。
- 調査・原因特定・復旧といったフェーズの進行に合わせて、\`waroom_update_incident_status\` / \`waroom_update_incident_severity\` / \`waroom_create_incident_metrics\` で記録を継続的に更新する。
- 対応が落ち着いたら \`waroom_get_postmortem_template\` と \`waroom_create_postmortem\` でポストモーテム作成を促す。

より詳しい自動追跡の手順は \`/create\`・\`/respond\` プロンプトと \`waroom://about\` リソースを参照してください。`,
});

createIncidentsTools(server, waroomClient);
createPostmortemsTools(server, waroomClient);
createServicesTools(server, waroomClient);
createLabelsTools(server, waroomClient);
createRunbooksTools(server, waroomClient);
createActionItemsTools(server, waroomClient);
createUsersTools(server, waroomClient);

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
