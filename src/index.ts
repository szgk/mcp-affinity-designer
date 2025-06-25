#!/usr/bin/env node

/**
 * MCP Affinity Designer Server
 * MCPサーバー Affinity Designer統合
 * 
 * Main entry point for the MCP server that provides Affinity Designer automation capabilities.
 * Affinity Designer自動化機能を提供するMCPサーバーのメインエントリーポイント。
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { AffinityDesignerMCPTools } from './tools/affinity-tools';

// Constants / 定数
const SERVER_NAME = 'mcp-affinity-designer';
const SERVER_VERSION = '0.1.0';
const JSON_INDENT_SPACES = 2;
const LOG_PREFIX = '[MCP Affinity Designer]';

// Initialize MCP tools / MCPツールを初期化
const affinityTools = new AffinityDesignerMCPTools();
let isToolsInitialized = false;

// Server instance / サーバーインスタンス
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Error handler for MCP operations
 * MCP操作用エラーハンドラー
 */
function handleError(error: unknown, context: string): McpError {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} Error in ${context}: ${message}`);
  console.error(`${LOG_PREFIX} ${context}でエラー: ${message}`);
  
  return new McpError(
    ErrorCode.InternalError,
    `Failed to ${context}: ${message} / ${context}に失敗: ${message}`
  );
}

/**
 * Initialize tools if not already done
 * ツールがまだ初期化されていない場合は初期化
 */
async function ensureToolsInitialized(): Promise<void> {
  if (!isToolsInitialized) {
    try {
      const result = await affinityTools.initialize();
      if (result.success) {
        isToolsInitialized = true;
        console.error(`${LOG_PREFIX} Tools initialized successfully`);
        console.error(`${LOG_PREFIX} ツールの初期化に成功しました`);
      } else {
        console.error(`${LOG_PREFIX} Tool initialization failed: ${result.error}`);
        console.error(`${LOG_PREFIX} ツール初期化失敗: ${result.error}`);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Tool initialization error:`, error);
      console.error(`${LOG_PREFIX} ツール初期化エラー:`, error);
    }
  }
}

/**
 * List available tools
 * 利用可能なツールを一覧表示
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  await ensureToolsInitialized();
  
  // Get all available tools from the affinity tools handler
  // アフィニティツールハンドラーから利用可能な全ツールを取得
  const affinityToolsList = affinityTools.getTools();
  
  // Add server management tools / サーバー管理ツールを追加
  const serverTools = [
    {
      name: 'get_server_info',
      description: 'Get information about the MCP Affinity Designer server / MCP Affinity Designerサーバーの情報を取得',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    }
  ];

  return {
    tools: [...serverTools, ...affinityToolsList],
  };
});

/**
 * Handle tool calls
 * ツール呼び出しを処理
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // Ensure tools are initialized / ツールが初期化されていることを確認
    await ensureToolsInitialized();

    // Handle server management tools / サーバー管理ツールを処理
    if (name === 'get_server_info') {
      const statistics = affinityTools.getStatistics();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              name: 'MCP Affinity Designer Server',
              version: SERVER_VERSION,
              description: 'MCP server for Affinity Designer automation',
              platform: process.platform,
              node_version: process.version,
              status: 'active',
              tools_initialized: isToolsInitialized,
              available_tools: (statistics.data as { availableTools?: number })?.availableTools || 0,
              日本語名: 'MCP Affinity Designer サーバー',
              説明: 'Affinity Designer自動化用MCPサーバー',
              プラットフォーム: process.platform,
              ステータス: 'アクティブ',
              ツール初期化: isToolsInitialized,
              利用可能ツール数: (statistics.data as { availableTools?: number })?.availableTools || 0
            }, null, JSON_INDENT_SPACES),
          },
        ],
      };
    }

    // Handle Affinity Designer automation tools / Affinity Designer自動化ツールを処理
    const result = await affinityTools.executeTool(name, args || {});
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            message: result.message,
            messageJP: result.messageJP,
            data: result.data,
            error: result.error
          }, null, JSON_INDENT_SPACES),
        },
      ],
    };

  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw handleError(error, `execute tool ${request.params.name} / ツール${request.params.name}実行`);
  }
});

/**
 * Start the server
 * サーバーを開始
 */
async function main() {
  try {
    // Create stdio transport / stdio トランスポートを作成
    const transport = new StdioServerTransport();
    
    console.error(`${LOG_PREFIX} Starting server...`);
    console.error(`${LOG_PREFIX} サーバーを開始しています...`);
    
    // Connect server to transport / サーバーをトランスポートに接続
    await server.connect(transport);
    
    console.error(`${LOG_PREFIX} Server started successfully`);
    console.error(`${LOG_PREFIX} サーバーが正常に開始されました`);
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to start server:`, error);
    console.error(`${LOG_PREFIX} サーバーの開始に失敗:`, error);
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 * 正常なシャットダウンを処理
 */
async function gracefulShutdown() {
  console.error(`${LOG_PREFIX} Shutting down...`);
  console.error(`${LOG_PREFIX} シャットダウン中...`);
  await server.close();
  process.exit(0);
}

// Handle graceful shutdown signals / 正常なシャットダウンシグナルを処理
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server / サーバーを開始
if (require.main === module) {
  main().catch((error) => {
    console.error(`${LOG_PREFIX} Fatal error:`, error);
    console.error(`${LOG_PREFIX} 致命的エラー:`, error);
    process.exit(1);
  });
}