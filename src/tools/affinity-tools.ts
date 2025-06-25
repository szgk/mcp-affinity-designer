/**
 * MCP Tools for Affinity Designer Integration
 * Affinity Designer統合用MCPツール
 * 
 * This module defines the MCP tools that provide automation capabilities
 * for Affinity Designer through the Model Context Protocol.
 * このモジュールは、Model Context Protocolを通じてAffinity Designerの
 * 自動化機能を提供するMCPツールを定義します。
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { 
  WindowsAffinityAutomation,
  WindowsProcessManager,
  WindowsUIAutomation,
  FileOperationsManager,
  AutomationResult
} from '../automation/windows-automation';

/**
 * MCP Tool Handler for Affinity Designer automation
 * Affinity Designer自動化用MCPツールハンドラー
 */
export class AffinityDesignerMCPTools {
  private automation: WindowsAffinityAutomation;
  private isInitialized = false;

  constructor() {
    this.automation = new WindowsAffinityAutomation();
  }

  /**
   * Initialize the MCP tools
   * MCPツールを初期化
   */
  async initialize(): Promise<AutomationResult> {
    const result = await this.automation.initialize();
    if (result.success) {
      this.isInitialized = true;
    }
    return result;
  }

  /**
   * Get all available MCP tools
   * 利用可能な全MCPツールを取得
   */
  getTools(): Tool[] {
    return [
      {
        name: 'affinity_get_status',
        description: 'Get Affinity Designer application status and running processes / Affinity Designerアプリケーションステータスと実行中プロセスを取得',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_start_app',
        description: 'Start Affinity Designer application with optional document / オプションのドキュメントでAffinity Designerアプリケーションを開始',
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
        name: 'affinity_focus_window',
        description: 'Focus the Affinity Designer window / Affinity Designerウィンドウにフォーカス',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_send_shortcut',
        description: 'Send keyboard shortcut to Affinity Designer / Affinity Designerにキーボードショートカットを送信',
        inputSchema: {
          type: 'object',
          properties: {
            keys: {
              type: 'string',
              description: 'Keyboard shortcut keys (e.g., "^n" for Ctrl+N) / キーボードショートカットキー（例：Ctrl+Nの場合"^n"）'
            }
          },
          required: ['keys']
        }
      },
      {
        name: 'affinity_new_document',
        description: 'Create new document in Affinity Designer / Affinity Designerで新しいドキュメントを作成',
        inputSchema: {
          type: 'object',
          properties: {
            width: {
              type: 'number',
              description: 'Document width in pixels / ドキュメントの幅（ピクセル）',
              default: 1920
            },
            height: {
              type: 'number',
              description: 'Document height in pixels / ドキュメントの高さ（ピクセル）',
              default: 1080
            },
            units: {
              type: 'string',
              description: 'Document units (px, in, cm, mm) / ドキュメント単位（px、in、cm、mm）',
              default: 'px'
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_save_document',
        description: 'Save current document / 現在のドキュメントを保存',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Optional save path for Save As / Save As用のオプション保存パス'
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_export_document',
        description: 'Export current document / 現在のドキュメントをエクスポート',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Export file path / エクスポートファイルパス'
            },
            format: {
              type: 'string',
              description: 'Export format (png, jpg, pdf, svg) / エクスポート形式（png、jpg、pdf、svg）',
              enum: ['png', 'jpg', 'pdf', 'svg'],
              default: 'png'
            },
            quality: {
              type: 'number',
              description: 'Export quality (1-100) / エクスポート品質（1-100）',
              minimum: 1,
              maximum: 100,
              default: 100
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_close_document',
        description: 'Close current document / 現在のドキュメントを閉じる',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
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
        name: 'affinity_validate_document',
        description: 'Validate document path and format / ドキュメントパスと形式を検証',
        inputSchema: {
          type: 'object',
          properties: {
            documentPath: {
              type: 'string',
              description: 'Path to document file / ドキュメントファイルへのパス'
            }
          },
          required: ['documentPath']
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
   * Execute an MCP tool
   * MCPツールを実行
   */
  async executeTool(name: string, args: Record<string, unknown>): Promise<AutomationResult> {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'MCP tools not initialized',
        messageJP: 'MCPツールが初期化されていません',
        error: 'Call initialize() first'
      };
    }

    try {
      switch (name) {
        case 'affinity_get_status':
          return await this.automation.getStatus();

        case 'affinity_start_app':
          return await WindowsProcessManager.startApplication(args.documentPath as string | undefined);

        case 'affinity_focus_window':
          return await WindowsUIAutomation.focusAffinityWindow();

        case 'affinity_send_shortcut':
          return await WindowsUIAutomation.sendKeyboardShortcut(args.keys as string);

        case 'affinity_new_document':
          return await this.handleNewDocument(args);

        case 'affinity_save_document':
          return await this.handleSaveDocument(args);

        case 'affinity_export_document':
          return await this.handleExportDocument(args);

        case 'affinity_close_document':
          return await this.handleCloseDocument();

        case 'affinity_discover_documents':
          return await FileOperationsManager.discoverDocuments();

        case 'affinity_validate_document':
          return FileOperationsManager.validateDocumentPath(args.documentPath as string);

        case 'affinity_get_capabilities':
          return this.automation.getCapabilities();

        default:
          return {
            success: false,
            message: `Unknown tool: ${name}`,
            messageJP: `未知のツール: ${name}`,
            error: 'Tool not found'
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Tool execution failed: ${name}`,
        messageJP: `ツール実行失敗: ${name}`,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Handle new document creation
   * 新しいドキュメント作成を処理
   */
  private async handleNewDocument(args: Record<string, unknown>): Promise<AutomationResult> {
    const { width = 1920, height = 1080, units = 'px' } = args;

    // Ensure Affinity Designer is running / Affinity Designerが実行中であることを確認
    const status = await this.automation.getStatus();
    const statusData = status.data as { totalProcesses?: number };
    if (!status.success || !statusData?.totalProcesses) {
      const startResult = await WindowsProcessManager.startApplication();
      if (!startResult.success) {
        return startResult;
      }
      // Wait a moment for application to load / アプリケーションの読み込みを少し待つ
      await this.delay(3000);
    }

    // Focus window and send new document shortcut / ウィンドウにフォーカスして新しいドキュメントショートカットを送信
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);
    
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^n');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'New document creation command sent',
      messageJP: '新しいドキュメント作成コマンドを送信しました',
      data: {
        command: 'new_document',
        parameters: { width, height, units }
      }
    };
  }

  /**
   * Handle document saving
   * ドキュメント保存を処理
   */
  private async handleSaveDocument(args: Record<string, unknown>): Promise<AutomationResult> {
    const { path: savePath } = args;

    // Focus window / ウィンドウにフォーカス
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Send appropriate save shortcut / 適切な保存ショートカットを送信
    const shortcutKeys = savePath ? '^+s' : '^s'; // Ctrl+Shift+S for Save As, Ctrl+S for Save
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut(shortcutKeys);
    
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Save document command sent',
      messageJP: 'ドキュメント保存コマンドを送信しました',
      data: {
        command: 'save_document',
        savePath: savePath || 'current location',
        shortcut: shortcutKeys
      }
    };
  }

  /**
   * Handle document export
   * ドキュメントエクスポートを処理
   */
  private async handleExportDocument(args: Record<string, unknown>): Promise<AutomationResult> {
    const { path: exportPath, format = 'png', quality = 100 } = args;

    // Focus window / ウィンドウにフォーカス
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Send export shortcut / エクスポートショートカットを送信
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^%+s'); // Ctrl+Alt+Shift+S
    
    if (!shortcutResult.success) {
      return shortcutResult;
    }

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
   * Handle document closing
   * ドキュメントクローズを処理
   */
  private async handleCloseDocument(): Promise<AutomationResult> {
    // Focus window / ウィンドウにフォーカス
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Send close shortcut / クローズショートカットを送信
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^w'); // Ctrl+W
    
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Close document command sent',
      messageJP: 'ドキュメントクローズコマンドを送信しました',
      data: {
        command: 'close_document'
      }
    };
  }

  /**
   * Utility delay function
   * ユーティリティ遅延関数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get tool execution statistics
   * ツール実行統計を取得
   */
  getStatistics(): AutomationResult {
    return {
      success: true,
      message: 'MCP tool execution statistics',
      messageJP: 'MCPツール実行統計',
      data: {
        isInitialized: this.isInitialized,
        availableTools: this.getTools().length,
        platform: 'Windows',
        version: '1.0.0'
      }
    };
  }
}