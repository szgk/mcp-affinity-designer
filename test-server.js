#!/usr/bin/env node

/**
 * Basic test script for MCP Affinity Designer Server
 * MCP Affinity Designerサーバー用基本テストスクリプト
 * 
 * This script tests the MCP server by sending sample requests and checking responses.
 * このスクリプトはサンプルリクエストを送信してレスポンスをチェックすることでMCPサーバーをテストします。
 */

const { spawn } = require('child_process');
const readline = require('readline');

// Test cases for the MCP server
// MCPサーバー用テストケース
const testCases = [
  {
    name: 'Initialize connection / 接続初期化',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    }
  },
  {
    name: 'List tools / ツール一覧',
    request: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }
  },
  {
    name: 'Get server info / サーバー情報取得',
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_server_info',
        arguments: {}
      }
    }
  },
  {
    name: 'Check Affinity Designer / Affinity Designerチェック',
    request: {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'check_affinity_designer',
        arguments: {}
      }
    }
  }
];

async function testMCPServer() {
  console.log('Starting MCP Affinity Designer Server test...');
  console.log('MCP Affinity Designerサーバーテストを開始...');
  console.log('='.repeat(50));

  // Start the MCP server / MCPサーバーを開始
  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let testIndex = 0;
  const responses = [];

  // Handle server output / サーバー出力を処理
  const rl = readline.createInterface({
    input: serverProcess.stdout,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    try {
      const response = JSON.parse(line);
      responses.push(response);
      
      console.log(`\n✓ Response ${responses.length}:`, JSON.stringify(response, null, 2));
      console.log(`✓ レスポンス ${responses.length}:`, JSON.stringify(response, null, 2));
      
      // Send next test case / 次のテストケースを送信
      if (testIndex < testCases.length) {
        setTimeout(() => sendNextTest(), 500);
      } else {
        // All tests completed / 全テスト完了
        setTimeout(() => {
          console.log('\n' + '='.repeat(50));
          console.log('All tests completed! / 全テスト完了！');
          console.log(`Total responses: ${responses.length} / 総レスポンス数: ${responses.length}`);
          serverProcess.kill();
          process.exit(0);
        }, 1000);
      }
    } catch (error) {
      console.log('Raw output:', line);
      console.log('生出力:', line);
    }
  });

  function sendNextTest() {
    if (testIndex < testCases.length) {
      const testCase = testCases[testIndex];
      console.log(`\n→ Sending: ${testCase.name}`);
      console.log(`→ 送信中: ${testCase.name}`);
      console.log('Request:', JSON.stringify(testCase.request, null, 2));
      console.log('リクエスト:', JSON.stringify(testCase.request, null, 2));
      
      serverProcess.stdin.write(JSON.stringify(testCase.request) + '\n');
      testIndex++;
    }
  }

  // Wait a moment for server to start, then begin tests
  // サーバー開始を少し待ってからテスト開始
  setTimeout(() => {
    sendNextTest();
  }, 1000);

  // Handle server errors / サーバーエラーを処理
  serverProcess.on('error', (error) => {
    console.error('Server error:', error);
    console.error('サーバーエラー:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    console.log(`\nServer exited with code: ${code}`);
    console.log(`サーバーが終了コード${code}で終了しました`);
    process.exit(code);
  });
}

// Handle script termination / スクリプト終了を処理
process.on('SIGINT', () => {
  console.log('\nTest interrupted / テスト中断');
  process.exit(0);
});

// Run the test / テストを実行
testMCPServer().catch((error) => {
  console.error('Test failed:', error);
  console.error('テスト失敗:', error);
  process.exit(1);
});