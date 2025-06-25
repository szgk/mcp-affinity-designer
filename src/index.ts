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

// Server instance / サーバーインスタンス
const server = new Server(
  {
    name: 'mcp-affinity-designer',
    version: '0.1.0',
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
  console.error(`[MCP Affinity Designer] Error in ${context}: ${message}`);
  console.error(`[MCP Affinity Designer] ${context}でエラー: ${message}`);
  
  return new McpError(
    ErrorCode.InternalError,
    `Failed to ${context}: ${message} / ${context}に失敗: ${message}`
  );
}

/**
 * List available tools
 * 利用可能なツールを一覧表示
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_server_info',
        description: 'Get information about the MCP Affinity Designer server / MCP Affinity Designerサーバーの情報を取得',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'check_affinity_designer',
        description: 'Check if Affinity Designer is installed and accessible / Affinity Designerがインストールされアクセス可能かチェック',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 * ツール呼び出しを処理
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name } = request.params;

    switch (name) {
      case 'get_server_info':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                name: 'MCP Affinity Designer Server',
                version: '0.1.0',
                description: 'MCP server for Affinity Designer automation',
                platform: process.platform,
                node_version: process.version,
                status: 'active',
                日本語名: 'MCP Affinity Designer サーバー',
                説明: 'Affinity Designer自動化用MCPサーバー',
                プラットフォーム: process.platform,
                ステータス: 'アクティブ'
              }, null, 2),
            },
          ],
        };

      case 'check_affinity_designer':
        // Basic check - in real implementation, this would check for Affinity Designer installation
        // 基本チェック - 実際の実装では、Affinity Designerのインストールをチェックします
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'checking',
                platform: process.platform,
                message: 'Affinity Designer detection not yet implemented',
                日本語メッセージ: 'Affinity Designer検出機能は未実装です',
                next_steps: [
                  'Implement Windows automation detection',
                  'Add COM/PowerShell integration',
                  'Test with actual Affinity Designer installation'
                ],
                次のステップ: [
                  'Windows自動化検出の実装',
                  'COM/PowerShell統合の追加',
                  '実際のAffinity Designerインストールでのテスト'
                ]
              }, null, 2),
            },
          ],
        };

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name} / 不明なツール: ${name}`
        );
    }
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
    
    console.error('[MCP Affinity Designer] Starting server...');
    console.error('[MCP Affinity Designer] サーバーを開始しています...');
    
    // Connect server to transport / サーバーをトランスポートに接続
    await server.connect(transport);
    
    console.error('[MCP Affinity Designer] Server started successfully');
    console.error('[MCP Affinity Designer] サーバーが正常に開始されました');
  } catch (error) {
    console.error('[MCP Affinity Designer] Failed to start server:', error);
    console.error('[MCP Affinity Designer] サーバーの開始に失敗:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown / 正常なシャットダウンを処理
process.on('SIGINT', async () => {
  console.error('[MCP Affinity Designer] Shutting down...');
  console.error('[MCP Affinity Designer] シャットダウン中...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('[MCP Affinity Designer] Shutting down...');
  console.error('[MCP Affinity Designer] シャットダウン中...');
  await server.close();
  process.exit(0);
});

// Start the server / サーバーを開始
if (require.main === module) {
  main().catch((error) => {
    console.error('[MCP Affinity Designer] Fatal error:', error);
    console.error('[MCP Affinity Designer] 致命的エラー:', error);
    process.exit(1);
  });
}