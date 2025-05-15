#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { WaroomClient } from './WaroomClient.js';
import { createIncidentsTools } from './tools/incidents.js';
import { createPostmortemsTools } from './tools/postmortems.js';

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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Waroom MCP server running on stdio');
