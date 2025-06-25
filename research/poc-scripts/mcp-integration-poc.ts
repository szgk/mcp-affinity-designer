#!/usr/bin/env node

/**
 * MCP Integration Proof of Concept for Affinity Designer
 * Affinity Designer用MCP統合概念実証
 * 
 * This TypeScript module demonstrates how to integrate Affinity Designer automation
 * into the MCP server architecture.
 * このTypeScriptモジュールは、Affinity Designer自動化をMCPサーバーアーキテクチャに
 * 統合する方法を実証します。
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

// Types for Affinity Designer automation / Affinity Designer自動化用タイプ
interface AffinityProcess {
  id: number;
  name: string;
  windowTitle?: string;
  windowHandle?: number;
  startTime?: Date;
}

interface AutomationResult {
  success: boolean;
  message: string;
  messageJP?: string;
  data?: any;
  error?: string;
}

interface DocumentInfo {
  path: string;
  name: string;
  size: number;
  lastModified: Date;
  format: string;
}

/**
 * Affinity Designer Automation Engine
 * Affinity Designer自動化エンジン
 */
export class AffinityDesignerAutomation {
  private processes: AffinityProcess[] = [];
  private isMonitoring = false;
  
  /**
   * Initialize the automation engine
   * 自動化エンジンを初期化
   */
  async initialize(): Promise<AutomationResult> {
    try {
      await this.refreshProcessList();
      
      return {
        success: true,
        message: 'Affinity Designer automation engine initialized',
        messageJP: 'Affinity Designer自動化エンジンを初期化しました',
        data: {
          processCount: this.processes.length,
          engineVersion: '1.0.0-poc'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to initialize automation engine',
        messageJP: '自動化エンジンの初期化に失敗しました',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Refresh the list of Affinity Designer processes
   * Affinity Designerプロセスリストを更新
   */
  async refreshProcessList(): Promise<void> {
    try {
      const command = `Get-Process -Name "*Affinity*", "*Designer*" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, MainWindowTitle, MainWindowHandle, StartTime | ConvertTo-Json`;
      
      const { stdout } = await execAsync(`powershell -Command "${command}"`);
      
      if (stdout.trim()) {
        const result = JSON.parse(stdout.trim());
        const processArray = Array.isArray(result) ? result : [result];
        
        this.processes = processArray.map(p => ({
          id: p.Id,
          name: p.ProcessName,
          windowTitle: p.MainWindowTitle || undefined,
          windowHandle: p.MainWindowHandle || undefined,
          startTime: p.StartTime ? new Date(p.StartTime) : undefined
        }));
      } else {
        this.processes = [];
      }
    } catch (error) {
      this.processes = [];
    }
  }
  
  /**
   * Get current Affinity Designer status
   * 現在のAffinity Designerステータスを取得
   */
  async getStatus(): Promise<AutomationResult> {
    await this.refreshProcessList();
    
    const activeProcesses = this.processes.filter(p => p.windowTitle);
    
    return {
      success: true,
      message: `Found ${this.processes.length} process(es), ${activeProcesses.length} with active window(s)`,
      messageJP: `${this.processes.length}個のプロセス、${activeProcesses.length}個のアクティブウィンドウを発見`,
      data: {
        totalProcesses: this.processes.length,
        activeWindows: activeProcesses.length,
        processes: this.processes.map(p => ({
          id: p.id,
          name: p.name,
          hasWindow: !!p.windowTitle,
          windowTitle: p.windowTitle
        }))
      }
    };
  }
  
  /**
   * Start Affinity Designer if not running
   * 実行中でない場合はAffinity Designerを開始
   */
  async startApplication(documentPath?: string): Promise<AutomationResult> {
    // Check if already running / 既に実行中かチェック
    await this.refreshProcessList();
    
    if (this.processes.length > 0) {
      return {
        success: true,
        message: 'Affinity Designer is already running',
        messageJP: 'Affinity Designerは既に実行中です',
        data: {
          processCount: this.processes.length
        }
      };
    }
    
    // Try to start application / アプリケーションの開始を試行
    const installPaths = [
      'C:\\Program Files\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe',
      'C:\\Program Files (x86)\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe',
      'C:\\Program Files\\Affinity\\Affinity Designer\\Affinity Designer.exe'
    ];
    
    for (const installPath of installPaths) {
      if (fs.existsSync(installPath)) {
        try {
          const args = documentPath ? [`"${documentPath}"`] : [];
          const childProcess = spawn(installPath, args, { 
            detached: true,
            stdio: 'ignore'
          });
          
          childProcess.unref();
          
          // Wait for process to start / プロセス開始を待機
          await this.waitForProcess(3000);
          
          return {
            success: true,
            message: 'Affinity Designer started successfully',
            messageJP: 'Affinity Designerの開始に成功しました',
            data: {
              installPath,
              documentPath: documentPath || null,
              pid: childProcess.pid
            }
          };
        } catch (error) {
          continue;
        }
      }
    }
    
    return {
      success: false,
      message: 'Could not start Affinity Designer - installation not found',
      messageJP: 'Affinity Designerを開始できませんでした - インストールが見つかりません',
      error: 'No valid installation path found'
    };
  }
  
  /**
   * Execute automation command
   * 自動化コマンドを実行
   */
  async executeCommand(command: string, parameters: any = {}): Promise<AutomationResult> {
    await this.refreshProcessList();
    
    if (this.processes.length === 0) {
      return {
        success: false,
        message: 'No Affinity Designer process found',
        messageJP: 'Affinity Designerプロセスが見つかりません',
        error: 'Application not running'
      };
    }
    
    try {
      switch (command.toLowerCase()) {
        case 'new_document':
          return await this.newDocument(parameters);
          
        case 'save_document':
          return await this.saveDocument(parameters);
          
        case 'export_document':
          return await this.exportDocument(parameters);
          
        case 'close_document':
          return await this.closeDocument();
          
        default:
          return {
            success: false,
            message: `Unknown command: ${command}`,
            messageJP: `未知のコマンド: ${command}`,
            error: 'Command not recognized'
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Command execution failed: ${command}`,
        messageJP: `コマンド実行失敗: ${command}`,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Create new document
   * 新しいドキュメントを作成
   */
  private async newDocument(parameters: any): Promise<AutomationResult> {
    const { width = 1920, height = 1080, units = 'px' } = parameters;
    
    // Send Ctrl+N to create new document / Ctrl+Nで新しいドキュメントを作成
    await this.sendKeyboardShortcut('^n');
    
    return {
      success: true,
      message: 'New document command sent',
      messageJP: '新しいドキュメントコマンドを送信しました',
      data: {
        command: 'new_document',
        parameters: { width, height, units }
      }
    };
  }
  
  /**
   * Save current document
   * 現在のドキュメントを保存
   */
  private async saveDocument(parameters: any): Promise<AutomationResult> {
    const { path: savePath, format = 'afdesign' } = parameters;
    
    if (savePath) {
      // Send Ctrl+Shift+S for Save As / Save As用にCtrl+Shift+Sを送信
      await this.sendKeyboardShortcut('^+s');
    } else {
      // Send Ctrl+S for Save / Save用にCtrl+Sを送信
      await this.sendKeyboardShortcut('^s');
    }
    
    return {
      success: true,
      message: 'Save document command sent',
      messageJP: 'ドキュメント保存コマンドを送信しました',
      data: {
        command: 'save_document',
        savePath: savePath || 'current location',
        format
      }
    };
  }
  
  /**
   * Export current document
   * 現在のドキュメントをエクスポート
   */
  private async exportDocument(parameters: any): Promise<AutomationResult> {
    const { path: exportPath, format = 'png', quality = 100 } = parameters;
    
    // Send Ctrl+Alt+Shift+S for Export / Export用にCtrl+Alt+Shift+Sを送信
    await this.sendKeyboardShortcut('^%+s');
    
    return {
      success: true,
      message: 'Export document command sent',
      messageJP: 'ドキュメントエクスポートコマンドを送信しました',
      data: {
        command: 'export_document',
        exportPath: exportPath || 'user specified',
        format,
        quality
      }
    };
  }
  
  /**
   * Close current document
   * 現在のドキュメントを閉じる
   */
  private async closeDocument(): Promise<AutomationResult> {
    // Send Ctrl+W to close document / ドキュメントを閉じるためにCtrl+Wを送信
    await this.sendKeyboardShortcut('^w');
    
    return {
      success: true,
      message: 'Close document command sent',
      messageJP: 'ドキュメントを閉じるコマンドを送信しました',
      data: {
        command: 'close_document'
      }
    };
  }
  
  /**
   * Send keyboard shortcut using PowerShell
   * PowerShellを使用してキーボードショートカットを送信
   */
  private async sendKeyboardShortcut(keys: string): Promise<void> {
    const command = `
      Add-Type -AssemblyName System.Windows.Forms
      [System.Windows.Forms.SendKeys]::SendWait("${keys}")
    `;
    
    await execAsync(`powershell -Command "${command}"`);
    
    // Small delay after sending keys / キー送信後の小さな遅延
    await this.delay(500);
  }
  
  /**
   * Wait for Affinity Designer process to appear
   * Affinity Designerプロセスの出現を待機
   */
  private async waitForProcess(timeoutMs: number): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      await this.refreshProcessList();
      if (this.processes.length > 0) {
        return;
      }
      await this.delay(500);
    }
  }
  
  /**
   * Utility delay function
   * ユーティリティ遅延関数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Discover Affinity Designer documents
   * Affinity Designerドキュメントを発見
   */
  async discoverDocuments(): Promise<AutomationResult> {
    const searchPaths = [
      path.join(process.env.USERPROFILE || '', 'Documents'),
      path.join(process.env.USERPROFILE || '', 'Desktop'),
      path.join(process.env.USERPROFILE || '', 'Downloads')
    ];
    
    const documents: DocumentInfo[] = [];
    
    for (const searchPath of searchPaths) {
      try {
        if (fs.existsSync(searchPath)) {
          const files = fs.readdirSync(searchPath);
          
          for (const file of files) {
            if (file.endsWith('.afdesign')) {
              const filePath = path.join(searchPath, file);
              const stats = fs.statSync(filePath);
              
              documents.push({
                path: filePath,
                name: file,
                size: stats.size,
                lastModified: stats.mtime,
                format: 'afdesign'
              });
            }
          }
        }
      } catch (error) {
        // Skip inaccessible directories / アクセスできないディレクトリをスキップ
      }
    }
    
    return {
      success: true,
      message: `Found ${documents.length} Affinity Designer document(s)`,
      messageJP: `${documents.length}個のAffinity Designerドキュメントを発見しました`,
      data: {
        documentCount: documents.length,
        documents: documents.slice(0, 10) // Limit to first 10 for performance
      }
    };
  }
  
  /**
   * Get automation capabilities
   * 自動化機能を取得
   */
  getCapabilities(): AutomationResult {
    return {
      success: true,
      message: 'Affinity Designer automation capabilities',
      messageJP: 'Affinity Designer自動化機能',
      data: {
        version: '1.0.0-poc',
        platform: 'Windows',
        supportedCommands: [
          'new_document',
          'save_document', 
          'export_document',
          'close_document'
        ],
        supportedFormats: {
          import: ['afdesign', 'psd', 'ai', 'svg', 'png', 'jpg'],
          export: ['afdesign', 'png', 'jpg', 'pdf', 'svg', 'eps']
        },
        automationMethods: [
          'keyboard_shortcuts',
          'window_management',
          'file_operations'
        ],
        limitations: [
          'No official API access',
          'UI-dependent automation',
          'Application must be running'
        ]
      }
    };
  }
}

/**
 * MCP Tool Implementation Example
 * MCPツール実装例
 */
export class AffinityDesignerMCPTools {
  private automation: AffinityDesignerAutomation;
  
  constructor() {
    this.automation = new AffinityDesignerAutomation();
  }
  
  /**
   * Initialize MCP tools
   * MCPツールを初期化
   */
  async initialize(): Promise<void> {
    await this.automation.initialize();
  }
  
  /**
   * Get available MCP tools
   * 利用可能なMCPツールを取得
   */
  getTools() {
    return [
      {
        name: 'affinity_get_status',
        description: 'Get Affinity Designer application status / Affinity Designerアプリケーションステータスを取得',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_start_app',
        description: 'Start Affinity Designer application / Affinity Designerアプリケーションを開始',
        inputSchema: {
          type: 'object',
          properties: {
            documentPath: {
              type: 'string',
              description: 'Optional path to document to open / 開くドキュメントへのオプションパス'
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_execute_command',
        description: 'Execute Affinity Designer automation command / Affinity Designer自動化コマンドを実行',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'Command to execute / 実行するコマンド',
              enum: ['new_document', 'save_document', 'export_document', 'close_document']
            },
            parameters: {
              type: 'object',
              description: 'Command parameters / コマンドパラメータ'
            }
          },
          required: ['command']
        }
      },
      {
        name: 'affinity_discover_documents',
        description: 'Discover Affinity Designer documents on system / システム上のAffinity Designerドキュメントを発見',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_get_capabilities',
        description: 'Get automation capabilities and limitations / 自動化機能と制限を取得',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ];
  }
  
  /**
   * Execute MCP tool
   * MCPツールを実行
   */
  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'affinity_get_status':
        return await this.automation.getStatus();
        
      case 'affinity_start_app':
        return await this.automation.startApplication(args.documentPath);
        
      case 'affinity_execute_command':
        return await this.automation.executeCommand(args.command, args.parameters || {});
        
      case 'affinity_discover_documents':
        return await this.automation.discoverDocuments();
        
      case 'affinity_get_capabilities':
        return this.automation.getCapabilities();
        
      default:
        throw new Error(`Unknown tool: ${name} / 未知のツール: ${name}`);
    }
  }
}

// Export for module use / モジュール使用用にエクスポート
export default {
  AffinityDesignerAutomation,
  AffinityDesignerMCPTools
};

// CLI test if run directly / 直接実行時のCLIテスト
if (require.main === module) {
  async function testPOC() {
    console.log('🎨 MCP Integration POC Test');
    console.log('🎨 MCP統合概念実証テスト');
    console.log(''.padEnd(40, '='));
    
    const automation = new AffinityDesignerAutomation();
    
    try {
      console.log('\n1. Initializing automation engine...');
      console.log('1. 自動化エンジンを初期化中...');
      const initResult = await automation.initialize();
      console.log(JSON.stringify(initResult, null, 2));
      
      console.log('\n2. Getting application status...');
      console.log('2. アプリケーションステータスを取得中...');
      const statusResult = await automation.getStatus();
      console.log(JSON.stringify(statusResult, null, 2));
      
      console.log('\n3. Discovering documents...');
      console.log('3. ドキュメントを発見中...');
      const documentsResult = await automation.discoverDocuments();
      console.log(JSON.stringify(documentsResult, null, 2));
      
      console.log('\n4. Getting capabilities...');
      console.log('4. 機能を取得中...');
      const capabilitiesResult = automation.getCapabilities();
      console.log(JSON.stringify(capabilitiesResult, null, 2));
      
      console.log('\n✅ POC test completed successfully');
      console.log('✅ 概念実証テストが正常に完了しました');
      
    } catch (error) {
      console.error('\n❌ POC test failed:', error);
      console.error('❌ 概念実証テスト失敗:', error);
      process.exit(1);
    }
  }
  
  testPOC();
}