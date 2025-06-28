#!/usr/bin/env node

/**
 * Manual testing script for Affinity Designer MCP commands
 * Affinity Designer MCPコマンドの手動テストスクリプト
 */

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const path = require('path');

const COMMANDS = {
  status: 'affinity_get_status',
  start: 'affinity_start_app',
  focus: 'affinity_focus_window',
  new: 'affinity_new_document',
  save: 'affinity_save_document',
  export: 'affinity_export_document',
  close: 'affinity_close_document',
  shortcut: 'affinity_send_shortcut'
};

async function executeCommand(commandName, args = {}) {
  let client;
  try {
    console.log(`[Test] Executing command: ${commandName}`);
    console.log(`[Test] コマンドを実行中: ${commandName}`);
    
    // Use TypeScript source directly via tsx
    // tsx経由でTypeScriptソースを直接使用
    const projectRoot = path.resolve(__dirname, '..');
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', path.join(projectRoot, 'src/index.ts')],
      cwd: projectRoot
    });
    
    client = new Client({
      name: 'test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });
    
    await client.connect(transport);
    
    const result = await client.callTool({
      name: commandName,
      arguments: args
    });
    
    console.log(`[Test] Result / 結果:`);
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error(`[Test] Error / エラー:`, error);
    return null;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function main() {
  const command = process.argv[2];
  const argsString = process.argv[3];
  
  if (!command) {
    console.log(`
Usage / 使用方法:
  npm run test:cmd <command> [arguments]
  
Available commands / 利用可能なコマンド:
  status              - Get Affinity Designer status / ステータス取得
  start               - Start Affinity Designer / アプリ起動
  focus               - Focus window / ウィンドウフォーカス
  new                 - Create new document / 新規ドキュメント作成
  save                - Save document / ドキュメント保存
  export              - Export document / ドキュメントエクスポート
  close               - Close document / ドキュメントクローズ
  shortcut            - Send keyboard shortcut / キーボードショートカット送信

Examples / 例:
  npm run test:cmd status
  npm run test:cmd start
  npm run test:cmd new "{\"width\":512,\"height\":512,\"units\":\"px\"}"
  npm run test:cmd shortcut "{\"keys\":\"^n\"}"
  npm run test:cmd export "{\"path\":\"test.png\",\"format\":\"png\"}"

For Windows Command Prompt / Windowsコマンドプロンプト用:
  npm run test:cmd new "{""width"":512,""height"":512,""units"":""px""}"
`);
    return;
  }
  
  const mcpCommand = COMMANDS[command];
  if (!mcpCommand) {
    console.error(`[Test] Unknown command: ${command}`);
    console.error(`[Test] 不明なコマンド: ${command}`);
    return;
  }
  
  let args = {};
  if (argsString) {
    try {
      args = JSON.parse(argsString);
    } catch (error) {
      console.error(`[Test] Invalid JSON arguments: ${argsString}`);
      console.error(`[Test] 無効なJSON引数: ${argsString}`);
      return;
    }
  }
  
  await executeCommand(mcpCommand, args);
}

// Handle special preset commands / 特別なプリセットコマンドを処理
async function handlePresets() {
  const preset = process.argv[2];
  
  switch (preset) {
    case 'create512':
      console.log('[Test] Creating 512x512 document...');
      console.log('[Test] 512x512ドキュメントを作成中...');
      await executeCommand(COMMANDS.start);
      await sleep(5000);
      await executeCommand(COMMANDS.focus);
      await sleep(1000);
      await executeCommand(COMMANDS.new, { width: 512, height: 512, units: 'px' });
      break;
      
    case 'create1024':
      console.log('[Test] Creating 1024x1024 document...');
      console.log('[Test] 1024x1024ドキュメントを作成中...');
      await executeCommand(COMMANDS.start);
      await sleep(5000);
      await executeCommand(COMMANDS.new, { width: 1024, height: 1024, units: 'px' });
      break;
      
    case 'fulltest':
      console.log('[Test] Running full test sequence...');
      console.log('[Test] 完全テストシーケンスを実行中...');
      await executeCommand(COMMANDS.status);
      await executeCommand(COMMANDS.start);
      await sleep(5000);
      await executeCommand(COMMANDS.status);
      await executeCommand(COMMANDS.focus);
      await executeCommand(COMMANDS.new, { width: 800, height: 600 });
      break;
      
    default:
      await main();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (require.main === module) {
  handlePresets().catch(console.error);
}