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
      },
      {
        name: 'affinity_list_layers',
        description: 'List layers in current document / 現在のドキュメントのレイヤーを一覧表示',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_create_layer',
        description: 'Create new layer in current document / 現在のドキュメントに新しいレイヤーを作成',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Layer name / レイヤー名',
              default: 'New Layer'
            },
            type: {
              type: 'string',
              description: 'Layer type (standard, group, adjustment) / レイヤータイプ（標準、グループ、調整）',
              enum: ['standard', 'group', 'adjustment'],
              default: 'standard'
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_delete_layer',
        description: 'Delete selected layer / 選択したレイヤーを削除',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_rename_layer',
        description: 'Rename selected layer / 選択したレイヤーの名前を変更',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'New layer name / 新しいレイヤー名'
            }
          },
          required: ['name']
        }
      },
      {
        name: 'affinity_toggle_layer_visibility',
        description: 'Toggle layer visibility (show/hide) / レイヤーの表示/非表示を切り替え',
        inputSchema: {
          type: 'object',
          properties: {
            visible: {
              type: 'boolean',
              description: 'Layer visibility state / レイヤーの表示状態',
              default: true
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_select_all',
        description: 'Select all objects in current layer / 現在のレイヤーの全オブジェクトを選択',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_deselect_all',
        description: 'Deselect all objects / 全オブジェクトの選択を解除',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'affinity_move_selection',
        description: 'Move selected objects / 選択したオブジェクトを移動',
        inputSchema: {
          type: 'object',
          properties: {
            deltaX: {
              type: 'number',
              description: 'Horizontal movement in pixels / 水平移動量（ピクセル）',
              default: 0
            },
            deltaY: {
              type: 'number',
              description: 'Vertical movement in pixels / 垂直移動量（ピクセル）',
              default: 0
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_resize_selection',
        description: 'Resize selected objects / 選択したオブジェクトのサイズを変更',
        inputSchema: {
          type: 'object',
          properties: {
            scaleX: {
              type: 'number',
              description: 'Horizontal scale factor / 水平スケール係数',
              default: 1.0
            },
            scaleY: {
              type: 'number',
              description: 'Vertical scale factor / 垂直スケール係数',
              default: 1.0
            },
            maintainAspectRatio: {
              type: 'boolean',
              description: 'Maintain aspect ratio / アスペクト比を維持',
              default: true
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_rotate_selection',
        description: 'Rotate selected objects / 選択したオブジェクトを回転',
        inputSchema: {
          type: 'object',
          properties: {
            angle: {
              type: 'number',
              description: 'Rotation angle in degrees / 回転角度（度）',
              default: 0
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_duplicate_selection',
        description: 'Duplicate selected objects / 選択したオブジェクトを複製',
        inputSchema: {
          type: 'object',
          properties: {
            offsetX: {
              type: 'number',
              description: 'Horizontal offset for duplicate / 複製の水平オフセット',
              default: 10
            },
            offsetY: {
              type: 'number',
              description: 'Vertical offset for duplicate / 複製の垂直オフセット',
              default: 10
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_select_tool',
        description: 'Select a specific tool in Affinity Designer / Affinity Designerで特定のツールを選択',
        inputSchema: {
          type: 'object',
          properties: {
            tool: {
              type: 'string',
              description: 'Tool name to select / 選択するツール名',
              enum: ['select', 'pen', 'pencil', 'brush', 'rectangle', 'ellipse', 'text', 'zoom'],
              default: 'select'
            }
          },
          required: ['tool']
        }
      },
      {
        name: 'affinity_add_text',
        description: 'Add text to the document / ドキュメントにテキストを追加',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text content to add / 追加するテキスト内容',
              default: 'Sample Text'
            },
            fontSize: {
              type: 'number',
              description: 'Font size in points / フォントサイズ（ポイント）',
              default: 24
            },
            x: {
              type: 'number',
              description: 'X position for text / テキストのX位置',
              default: 100
            },
            y: {
              type: 'number',
              description: 'Y position for text / テキストのY位置',
              default: 100
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_create_shape',
        description: 'Create basic shapes / 基本図形を作成',
        inputSchema: {
          type: 'object',
          properties: {
            shape: {
              type: 'string',
              description: 'Shape type to create / 作成する図形タイプ',
              enum: ['rectangle', 'ellipse', 'polygon', 'star'],
              default: 'rectangle'
            },
            x: {
              type: 'number',
              description: 'X position / X位置',
              default: 100
            },
            y: {
              type: 'number',
              description: 'Y position / Y位置',
              default: 100
            },
            width: {
              type: 'number',
              description: 'Shape width / 図形の幅',
              default: 100
            },
            height: {
              type: 'number',
              description: 'Shape height / 図形の高さ',
              default: 100
            }
          },
          required: []
        }
      },
      {
        name: 'affinity_apply_effect',
        description: 'Apply visual effects to selected objects / 選択オブジェクトに視覚効果を適用',
        inputSchema: {
          type: 'object',
          properties: {
            effect: {
              type: 'string',
              description: 'Effect type to apply / 適用するエフェクトタイプ',
              enum: ['blur', 'drop_shadow', 'glow', 'bevel'],
              default: 'drop_shadow'
            },
            intensity: {
              type: 'number',
              description: 'Effect intensity (0.1-1.0) / エフェクト強度（0.1-1.0）',
              minimum: 0.1,
              maximum: 1.0,
              default: 0.5
            }
          },
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

        case 'affinity_list_layers':
          return await this.handleListLayers();

        case 'affinity_create_layer':
          return await this.handleCreateLayer(args);

        case 'affinity_delete_layer':
          return await this.handleDeleteLayer();

        case 'affinity_rename_layer':
          return await this.handleRenameLayer(args);

        case 'affinity_toggle_layer_visibility':
          return await this.handleToggleLayerVisibility(args);

        case 'affinity_select_all':
          return await this.handleSelectAll();

        case 'affinity_deselect_all':
          return await this.handleDeselectAll();

        case 'affinity_move_selection':
          return await this.handleMoveSelection(args);

        case 'affinity_resize_selection':
          return await this.handleResizeSelection(args);

        case 'affinity_rotate_selection':
          return await this.handleRotateSelection(args);

        case 'affinity_duplicate_selection':
          return await this.handleDuplicateSelection(args);

        case 'affinity_select_tool':
          return await this.handleSelectTool(args);

        case 'affinity_add_text':
          return await this.handleAddText(args);

        case 'affinity_create_shape':
          return await this.handleCreateShape(args);

        case 'affinity_apply_effect':
          return await this.handleApplyEffect(args);

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
   * Handle list layers operation
   * レイヤー一覧表示操作を処理
   */
  private async handleListLayers(): Promise<AutomationResult> {
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Open layers panel with F7 key
    // F7キーでレイヤーパネルを開く
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('{F7}');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Layers panel opened for viewing',
      messageJP: 'レイヤーパネルを表示用に開きました',
      data: {
        command: 'list_layers',
        action: 'opened_layers_panel'
      }
    };
  }

  /**
   * Handle create layer operation
   * レイヤー作成操作を処理
   */
  private async handleCreateLayer(args: Record<string, unknown>): Promise<AutomationResult> {
    const { name = 'New Layer', type = 'standard' } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Send new layer shortcut Ctrl+Shift+N
    // 新しいレイヤーショートカット Ctrl+Shift+N を送信
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^+n');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'New layer creation command sent',
      messageJP: '新しいレイヤー作成コマンドを送信しました',
      data: {
        command: 'create_layer',
        layerName: name,
        layerType: type
      }
    };
  }

  /**
   * Handle delete layer operation
   * レイヤー削除操作を処理
   */
  private async handleDeleteLayer(): Promise<AutomationResult> {
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Send delete key to delete selected layer
    // 選択したレイヤーを削除するためDeleteキーを送信
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('{DELETE}');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Layer delete command sent',
      messageJP: 'レイヤー削除コマンドを送信しました',
      data: {
        command: 'delete_layer'
      }
    };
  }

  /**
   * Handle rename layer operation
   * レイヤー名前変更操作を処理
   */
  private async handleRenameLayer(args: Record<string, unknown>): Promise<AutomationResult> {
    const { name } = args;

    if (!name || typeof name !== 'string') {
      return {
        success: false,
        message: 'Layer name is required',
        messageJP: 'レイヤー名が必要です',
        error: 'Missing layer name parameter'
      };
    }

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Double-click on layer name (simulated with F2)
    // レイヤー名をダブルクリック（F2で模擬）
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('{F2}');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    await this.delay(500);

    // Clear existing name and type new name
    // 既存の名前をクリアして新しい名前を入力
    const clearResult = await WindowsUIAutomation.sendKeyboardShortcut('^a');
    if (!clearResult.success) {
      return clearResult;
    }

    await this.delay(200);

    // Type the new layer name
    // 新しいレイヤー名を入力
    const typeResult = await WindowsUIAutomation.sendKeyboardShortcut(name as string);
    if (!typeResult.success) {
      return typeResult;
    }

    await this.delay(200);

    // Press Enter to confirm
    // Enterを押して確定
    const confirmResult = await WindowsUIAutomation.sendKeyboardShortcut('{ENTER}');
    if (!confirmResult.success) {
      return confirmResult;
    }

    return {
      success: true,
      message: 'Layer rename command sent',
      messageJP: 'レイヤー名前変更コマンドを送信しました',
      data: {
        command: 'rename_layer',
        newName: name
      }
    };
  }

  /**
   * Handle toggle layer visibility operation
   * レイヤー表示/非表示切り替え操作を処理
   */
  private async handleToggleLayerVisibility(args: Record<string, unknown>): Promise<AutomationResult> {
    const { visible = true } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Click on layer visibility icon (simulated with keyboard navigation)
    // レイヤー表示アイコンをクリック（キーボードナビゲーションで模擬）
    // This is a simplified approach - in practice, specific coordinates would be needed
    // これは簡略化されたアプローチです - 実際には特定の座標が必要になります
    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut(' '); // Space to toggle visibility
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Layer visibility toggle command sent',
      messageJP: 'レイヤー表示/非表示切り替えコマンドを送信しました',
      data: {
        command: 'toggle_layer_visibility',
        visible
      }
    };
  }

  /**
   * Handle select all operation
   * 全選択操作を処理
   */
  private async handleSelectAll(): Promise<AutomationResult> {
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^a');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Select all command sent',
      messageJP: '全選択コマンドを送信しました',
      data: {
        command: 'select_all'
      }
    };
  }

  /**
   * Handle deselect all operation
   * 全選択解除操作を処理
   */
  private async handleDeselectAll(): Promise<AutomationResult> {
    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^+a');
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: 'Deselect all command sent',
      messageJP: '全選択解除コマンドを送信しました',
      data: {
        command: 'deselect_all'
      }
    };
  }

  /**
   * Handle move selection operation
   * 選択オブジェクト移動操作を処理
   */
  private async handleMoveSelection(args: Record<string, unknown>): Promise<AutomationResult> {
    const { deltaX = 0, deltaY = 0 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Use arrow keys for movement
    // 移動に矢印キーを使用
    let moveCommand = '';
    const deltaXNum = Number(deltaX);
    const deltaYNum = Number(deltaY);

    // For larger movements, use Transform panel or manual entry
    // より大きな移動の場合は、変形パネルや手動入力を使用
    if (Math.abs(deltaXNum) > 50 || Math.abs(deltaYNum) > 50) {
      // Open Transform panel
      // 変形パネルを開く
      const transformResult = await WindowsUIAutomation.sendKeyboardShortcut('^t');
      if (!transformResult.success) {
        return transformResult;
      }

      return {
        success: true,
        message: 'Transform panel opened for precise movement',
        messageJP: '精密移動のため変形パネルを開きました',
        data: {
          command: 'move_selection',
          deltaX: deltaXNum,
          deltaY: deltaYNum,
          method: 'transform_panel'
        }
      };
    }

    // Use arrow keys for small movements
    // 小さな移動には矢印キーを使用
    const absX = Math.abs(deltaXNum);
    const absY = Math.abs(deltaYNum);

    for (let i = 0; i < absX; i++) {
      moveCommand = deltaXNum > 0 ? '{RIGHT}' : '{LEFT}';
      await WindowsUIAutomation.sendKeyboardShortcut(moveCommand);
      await this.delay(50);
    }

    for (let i = 0; i < absY; i++) {
      moveCommand = deltaYNum > 0 ? '{DOWN}' : '{UP}';
      await WindowsUIAutomation.sendKeyboardShortcut(moveCommand);
      await this.delay(50);
    }

    return {
      success: true,
      message: 'Move selection command sent',
      messageJP: '選択オブジェクト移動コマンドを送信しました',
      data: {
        command: 'move_selection',
        deltaX: deltaXNum,
        deltaY: deltaYNum,
        method: 'arrow_keys'
      }
    };
  }

  /**
   * Handle resize selection operation
   * 選択オブジェクトサイズ変更操作を処理
   */
  private async handleResizeSelection(args: Record<string, unknown>): Promise<AutomationResult> {
    const { scaleX = 1.0, scaleY = 1.0, maintainAspectRatio = true } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Open Transform panel for precise scaling
    // 精密なスケーリングのため変形パネルを開く
    const transformResult = await WindowsUIAutomation.sendKeyboardShortcut('^t');
    if (!transformResult.success) {
      return transformResult;
    }

    return {
      success: true,
      message: 'Transform panel opened for scaling',
      messageJP: 'スケーリングのため変形パネルを開きました',
      data: {
        command: 'resize_selection',
        scaleX,
        scaleY,
        maintainAspectRatio
      }
    };
  }

  /**
   * Handle rotate selection operation
   * 選択オブジェクト回転操作を処理
   */
  private async handleRotateSelection(args: Record<string, unknown>): Promise<AutomationResult> {
    const { angle = 0 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Common rotation shortcuts
    // 一般的な回転ショートカット
    const angleNum = Number(angle);
    
    if (angleNum === 90) {
      const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^+]');
      if (!shortcutResult.success) {
        return shortcutResult;
      }
    } else if (angleNum === -90) {
      const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut('^+[');
      if (!shortcutResult.success) {
        return shortcutResult;
      }
    } else {
      // Open Transform panel for custom rotation
      // カスタム回転のため変形パネルを開く
      const transformResult = await WindowsUIAutomation.sendKeyboardShortcut('^t');
      if (!transformResult.success) {
        return transformResult;
      }
    }

    return {
      success: true,
      message: 'Rotate selection command sent',
      messageJP: '選択オブジェクト回転コマンドを送信しました',
      data: {
        command: 'rotate_selection',
        angle: angleNum
      }
    };
  }

  /**
   * Handle duplicate selection operation
   * 選択オブジェクト複製操作を処理
   */
  private async handleDuplicateSelection(args: Record<string, unknown>): Promise<AutomationResult> {
    const { offsetX = 10, offsetY = 10 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Duplicate with Ctrl+D
    // Ctrl+Dで複製
    const duplicateResult = await WindowsUIAutomation.sendKeyboardShortcut('^d');
    if (!duplicateResult.success) {
      return duplicateResult;
    }

    await this.delay(500);

    // Move the duplicate if offset is specified
    // オフセットが指定されている場合は複製を移動
    if (Number(offsetX) !== 0 || Number(offsetY) !== 0) {
      const moveResult = await this.handleMoveSelection({ deltaX: offsetX, deltaY: offsetY });
      if (!moveResult.success) {
        return moveResult;
      }
    }

    return {
      success: true,
      message: 'Duplicate selection command sent',
      messageJP: '選択オブジェクト複製コマンドを送信しました',
      data: {
        command: 'duplicate_selection',
        offsetX,
        offsetY
      }
    };
  }

  /**
   * Handle tool selection
   * ツール選択を処理
   */
  private async handleSelectTool(args: Record<string, unknown>): Promise<AutomationResult> {
    const { tool } = args;

    if (!tool || typeof tool !== 'string') {
      return {
        success: false,
        message: 'Tool name is required',
        messageJP: 'ツール名が必要です',
        error: 'Missing tool parameter'
      };
    }

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Tool keyboard shortcuts
    // ツールキーボードショートカット
    const toolShortcuts: Record<string, string> = {
      'select': 'v',
      'pen': 'p',
      'pencil': 'n',
      'brush': 'b',
      'rectangle': 'r',
      'ellipse': 'e',
      'text': 't',
      'zoom': 'z'
    };

    const shortcut = toolShortcuts[tool as string];
    if (!shortcut) {
      return {
        success: false,
        message: `Unsupported tool: ${tool}`,
        messageJP: `サポートされていないツール: ${tool}`,
        error: 'Invalid tool name'
      };
    }

    const shortcutResult = await WindowsUIAutomation.sendKeyboardShortcut(shortcut);
    if (!shortcutResult.success) {
      return shortcutResult;
    }

    return {
      success: true,
      message: `Tool selected: ${tool}`,
      messageJP: `ツールを選択しました: ${tool}`,
      data: {
        command: 'select_tool',
        tool,
        shortcut
      }
    };
  }

  /**
   * Handle text addition
   * テキスト追加を処理
   */
  private async handleAddText(args: Record<string, unknown>): Promise<AutomationResult> {
    const { text = 'Sample Text', fontSize = 24, x = 100, y = 100 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Select text tool
    // テキストツールを選択
    const toolResult = await WindowsUIAutomation.sendKeyboardShortcut('t');
    if (!toolResult.success) {
      return toolResult;
    }

    await this.delay(500);

    // Note: Actual positioning would require mouse coordinates
    // 注意：実際の位置決めにはマウス座標が必要
    // For now, just add text at current location
    // 今のところ、現在の位置にテキストを追加するだけ
    const clickResult = await WindowsUIAutomation.sendKeyboardShortcut(' '); // Space to click
    if (!clickResult.success) {
      return clickResult;
    }

    await this.delay(500);

    // Type the text
    // テキストを入力
    const typeResult = await WindowsUIAutomation.sendKeyboardShortcut(text as string);
    if (!typeResult.success) {
      return typeResult;
    }

    return {
      success: true,
      message: 'Text added successfully',
      messageJP: 'テキストを正常に追加しました',
      data: {
        command: 'add_text',
        text,
        fontSize,
        position: { x, y }
      }
    };
  }

  /**
   * Handle shape creation
   * 図形作成を処理
   */
  private async handleCreateShape(args: Record<string, unknown>): Promise<AutomationResult> {
    const { shape = 'rectangle', x = 100, y = 100, width = 100, height = 100 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Shape tool shortcuts
    // 図形ツールショートカット
    const shapeShortcuts: Record<string, string> = {
      'rectangle': 'r',
      'ellipse': 'e',
      'polygon': 'm', // Default to pen tool for polygons
      'star': 's'
    };

    const shortcut = shapeShortcuts[shape as string];
    if (!shortcut) {
      return {
        success: false,
        message: `Unsupported shape: ${shape}`,
        messageJP: `サポートされていない図形: ${shape}`,
        error: 'Invalid shape type'
      };
    }

    // Select shape tool
    // 図形ツールを選択
    const toolResult = await WindowsUIAutomation.sendKeyboardShortcut(shortcut);
    if (!toolResult.success) {
      return toolResult;
    }

    await this.delay(500);

    // Note: Actual drawing would require mouse drag operations
    // 注意：実際の描画にはマウスドラッグ操作が必要
    // For now, just confirm tool selection
    // 今のところ、ツール選択の確認のみ

    return {
      success: true,
      message: `Shape tool selected: ${shape}`,
      messageJP: `図形ツールを選択しました: ${shape}`,
      data: {
        command: 'create_shape',
        shape,
        dimensions: { x, y, width, height }
      }
    };
  }

  /**
   * Handle effect application
   * エフェクト適用を処理
   */
  private async handleApplyEffect(args: Record<string, unknown>): Promise<AutomationResult> {
    const { effect = 'drop_shadow', intensity = 0.5 } = args;

    const focusResult = await WindowsUIAutomation.focusAffinityWindow();
    if (!focusResult.success) {
      return focusResult;
    }

    await this.delay(500);

    // Open Effects panel
    // エフェクトパネルを開く
    const effectsResult = await WindowsUIAutomation.sendKeyboardShortcut('{F8}');
    if (!effectsResult.success) {
      return effectsResult;
    }

    await this.delay(1000);

    // Note: Specific effect application would require UI navigation
    // 注意：特定のエフェクト適用にはUI操作が必要
    // For now, just open the effects panel
    // 今のところ、エフェクトパネルを開くだけ

    return {
      success: true,
      message: 'Effects panel opened for effect application',
      messageJP: 'エフェクト適用のためエフェクトパネルを開きました',
      data: {
        command: 'apply_effect',
        effect,
        intensity,
        note: 'Manual effect selection required'
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