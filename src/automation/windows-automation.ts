/**
 * Windows Automation Module for Affinity Designer
 * Affinity Designer用Windows自動化モジュール
 * 
 * This module provides Windows-specific automation capabilities for Affinity Designer,
 * porting the proven POC scripts into production TypeScript modules.
 * このモジュールは、Affinity Designer用のWindows固有の自動化機能を提供し、
 * 実証済みのPOCスクリプトを本番TypeScriptモジュールに移植します。
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { InstallationConfigManager } from '../config/installation-config';

const execAsync = promisify(exec);

// Type definitions / 型定義
export interface AffinityProcess {
  readonly id: number;
  readonly name: string;
  readonly windowTitle?: string;
  readonly windowHandle?: number;
  readonly startTime?: Date;
}

export interface AutomationResult {
  readonly success: boolean;
  readonly message: string;
  readonly messageJP?: string;
  readonly data?: unknown;
  readonly error?: string;
}

export interface DocumentInfo {
  readonly path: string;
  readonly name: string;
  readonly size: number;
  readonly lastModified: Date;
  readonly format: string;
}

export interface WindowInfo {
  readonly processId: number;
  readonly processName: string;
  readonly windowTitle: string;
  readonly windowHandle: number;
  readonly startTime?: Date;
}

/**
 * Windows Process Manager for Affinity Designer
 * Affinity Designer用Windowsプロセスマネージャー
 */
export class WindowsProcessManager {
  private static readonly LOG_PREFIX = '[Windows Process Manager]';
  private static configManager = InstallationConfigManager.getInstance();

  /**
   * Find all running Affinity Designer processes
   * 実行中のAffinity Designerプロセスを全て検索
   */
  static async findAffinityProcesses(): Promise<AffinityProcess[]> {
    try {
      const config = this.configManager.getConfig();
      const processNames = config.processNames.join('", "');
      const command = `Get-Process -Name "${processNames}" -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, MainWindowTitle, MainWindowHandle, StartTime | ConvertTo-Json`;
      
      const { stdout } = await execAsync(`powershell -Command "${command}"`);
      
      if (!stdout.trim()) {
        return [];
      }
      
      const result = JSON.parse(stdout.trim());
      const processArray = Array.isArray(result) ? result : [result];
      
      return processArray.map(p => ({
        id: p.Id,
        name: p.ProcessName,
        windowTitle: p.MainWindowTitle || undefined,
        windowHandle: p.MainWindowHandle || undefined,
        startTime: p.StartTime ? new Date(p.StartTime) : undefined
      }));
      
    } catch (error) {
      // Silent failure for process detection / プロセス検出の静かな失敗
      return [];
    }
  }

  /**
   * Get detailed window information for a specific process
   * 特定のプロセスの詳細なウィンドウ情報を取得
   */
  static async getWindowInfo(processId: number): Promise<WindowInfo | null> {
    try {
      const command = `
        $process = Get-Process -Id ${processId} -ErrorAction SilentlyContinue
        if ($process -and $process.MainWindowHandle -ne 0) {
          @{
            ProcessId = $process.Id
            ProcessName = $process.ProcessName
            WindowTitle = $process.MainWindowTitle
            WindowHandle = $process.MainWindowHandle
            StartTime = $process.StartTime
          } | ConvertTo-Json
        }
      `;
      
      const { stdout } = await execAsync(`powershell -Command "${command}"`);
      
      if (!stdout.trim()) {
        return null;
      }
      
      const windowInfo = JSON.parse(stdout.trim());
      return {
        processId: windowInfo.ProcessId,
        processName: windowInfo.ProcessName,
        windowTitle: windowInfo.WindowTitle,
        windowHandle: windowInfo.WindowHandle,
        startTime: windowInfo.StartTime ? new Date(windowInfo.StartTime) : undefined
      };
      
    } catch (error) {
      // Silent failure for window info retrieval / ウィンドウ情報取得の静かな失敗
      return null;
    }
  }

  /**
   * Find the Affinity Designer installation path
   * Affinity Designerのインストールパスを検索
   */
  static findInstallationPath(): string | null {
    return this.configManager.findValidInstallationPath();
  }

  /**
   * Start Affinity Designer application
   * Affinity Designerアプリケーションを開始
   */
  static async startApplication(documentPath?: string): Promise<AutomationResult> {
    const installPath = this.findInstallationPath();
    
    if (!installPath) {
      return {
        success: false,
        message: 'Affinity Designer installation not found',
        messageJP: 'Affinity Designerのインストールが見つかりません',
        error: 'No valid installation path found'
      };
    }

    try {
      const args = documentPath ? [`"${documentPath}"`] : [];
      const childProcess = spawn(installPath, args, {
        detached: true,
        stdio: 'ignore'
      });

      childProcess.unref();

      // Wait for process to start / プロセス開始を待機
      const config = this.configManager.getConfig();
      await this.waitForProcess(config.timeouts.processStart);

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
      return {
        success: false,
        message: 'Failed to start Affinity Designer',
        messageJP: 'Affinity Designerの開始に失敗しました',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Wait for Affinity Designer process to appear
   * Affinity Designerプロセスの出現を待機
   */
  private static async waitForProcess(timeoutMs: number): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const processes = await this.findAffinityProcesses();
      if (processes.length > 0) {
        return;
      }
      const config = this.configManager.getConfig();
      await this.delay(config.timeouts.pollingInterval);
    }
  }

  /**
   * Utility delay function
   * ユーティリティ遅延関数
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Windows UI Automation Manager
 * Windows UI自動化マネージャー
 */
export class WindowsUIAutomation {
  private static readonly LOG_PREFIX = '[Windows UI Automation]';

  /**
   * Send keyboard shortcut to active window
   * アクティブウィンドウにキーボードショートカットを送信
   */
  static async sendKeyboardShortcut(keys: string): Promise<AutomationResult> {
    try {
      const command = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("${keys}")
      `;
      
      await execAsync(`powershell -Command "${command}"`);
      
      // Small delay after sending keys / キー送信後の小さな遅延
      await this.delay(500);
      
      return {
        success: true,
        message: `Keyboard shortcut sent: ${keys}`,
        messageJP: `キーボードショートカットを送信: ${keys}`,
        data: { keys }
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to send keyboard shortcut: ${keys}`,
        messageJP: `キーボードショートカットの送信に失敗: ${keys}`,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Focus Affinity Designer window
   * Affinity Designerウィンドウにフォーカス
   */
  static async focusAffinityWindow(): Promise<AutomationResult> {
    try {
      const processes = await WindowsProcessManager.findAffinityProcesses();
      const activeProcess = processes.find(p => p.windowTitle && p.windowHandle);
      
      if (!activeProcess || !activeProcess.windowHandle) {
        return {
          success: false,
          message: 'No active Affinity Designer window found',
          messageJP: 'アクティブなAffinity Designerウィンドウが見つかりません',
          error: 'No window to focus'
        };
      }
      
      const command = `
        Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 {
          [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
          [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        }'
        $hwnd = [IntPtr]${activeProcess.windowHandle}
        [Win32]::ShowWindow($hwnd, 9)
        [Win32]::SetForegroundWindow($hwnd)
      `;
      
      await execAsync(`powershell -Command "${command}"`);
      
      return {
        success: true,
        message: 'Affinity Designer window focused',
        messageJP: 'Affinity Designerウィンドウにフォーカスしました',
        data: {
          processId: activeProcess.id,
          windowTitle: activeProcess.windowTitle
        }
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'Failed to focus Affinity Designer window',
        messageJP: 'Affinity Designerウィンドウのフォーカスに失敗',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Utility delay function
   * ユーティリティ遅延関数
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * File Operations Manager for Affinity Designer documents
 * Affinity Designerドキュメント用ファイル操作マネージャー
 */
export class FileOperationsManager {
  private static readonly LOG_PREFIX = '[File Operations Manager]';
  private static configManager = InstallationConfigManager.getInstance();

  /**
   * Discover Affinity Designer documents on the system
   * システム上のAffinity Designerドキュメントを発見
   */
  static async discoverDocuments(): Promise<AutomationResult> {
    const documents: DocumentInfo[] = [];
    const searchPaths = this.configManager.getAccessibleDocumentPaths();
    
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
        // Silent failure for inaccessible paths / アクセスできないパスの静かな失敗
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
   * Validate document path and format
   * ドキュメントパスと形式を検証
   */
  static validateDocumentPath(documentPath: string): AutomationResult {
    if (!documentPath) {
      return {
        success: false,
        message: 'Document path is required',
        messageJP: 'ドキュメントパスが必要です',
        error: 'Empty path provided'
      };
    }

    if (!fs.existsSync(documentPath)) {
      return {
        success: false,
        message: 'Document file does not exist',
        messageJP: 'ドキュメントファイルが存在しません',
        error: 'File not found'
      };
    }

    const extension = path.extname(documentPath).toLowerCase();
    const supportedFormats = ['.afdesign', '.psd', '.ai', '.svg', '.png', '.jpg', '.jpeg'];
    
    if (!supportedFormats.includes(extension)) {
      return {
        success: false,
        message: `Unsupported file format: ${extension}`,
        messageJP: `サポートされていないファイル形式: ${extension}`,
        error: 'Invalid file format'
      };
    }

    return {
      success: true,
      message: `Document path validated: ${documentPath}`,
      messageJP: `ドキュメントパスを検証しました: ${documentPath}`,
      data: {
        path: documentPath,
        extension,
        name: path.basename(documentPath)
      }
    };
  }
}

/**
 * Main Windows Automation Engine
 * メインWindows自動化エンジン
 */
export class WindowsAffinityAutomation {
  private static readonly LOG_PREFIX = '[Windows Affinity Automation]';
  private isInitialized = false;

  /**
   * Initialize the automation engine
   * 自動化エンジンを初期化
   */
  async initialize(): Promise<AutomationResult> {
    try {
      // Check if Affinity Designer is installed / Affinity Designerがインストールされているかチェック
      const installPath = WindowsProcessManager.findInstallationPath();
      if (!installPath) {
        return {
          success: false,
          message: 'Affinity Designer installation not found',
          messageJP: 'Affinity Designerのインストールが見つかりません',
          error: 'Installation required'
        };
      }

      // Check current process status / 現在のプロセス状態をチェック
      const processes = await WindowsProcessManager.findAffinityProcesses();
      
      this.isInitialized = true;
      
      return {
        success: true,
        message: 'Windows Affinity automation engine initialized',
        messageJP: 'Windows Affinity自動化エンジンを初期化しました',
        data: {
          installPath,
          processCount: processes.length,
          engineVersion: '1.0.0',
          platform: 'Windows'
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
   * Get current automation status
   * 現在の自動化ステータスを取得
   */
  async getStatus(): Promise<AutomationResult> {
    if (!this.isInitialized) {
      return {
        success: false,
        message: 'Automation engine not initialized',
        messageJP: '自動化エンジンが初期化されていません',
        error: 'Engine not ready'
      };
    }

    const processes = await WindowsProcessManager.findAffinityProcesses();
    const activeProcesses = processes.filter(p => p.windowTitle);
    
    return {
      success: true,
      message: `Found ${processes.length} process(es), ${activeProcesses.length} with active window(s)`,
      messageJP: `${processes.length}個のプロセス、${activeProcesses.length}個のアクティブウィンドウを発見`,
      data: {
        totalProcesses: processes.length,
        activeWindows: activeProcesses.length,
        isInitialized: this.isInitialized,
        processes: processes.map(p => ({
          id: p.id,
          name: p.name,
          hasWindow: !!p.windowTitle,
          windowTitle: p.windowTitle
        }))
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
      message: 'Windows Affinity Designer automation capabilities',
      messageJP: 'Windows Affinity Designer自動化機能',
      data: {
        version: '1.0.0',
        platform: 'Windows',
        automationMethods: [
          'keyboard_shortcuts',
          'window_management', 
          'process_management',
          'file_operations'
        ],
        supportedFormats: {
          import: ['afdesign', 'psd', 'ai', 'svg', 'png', 'jpg'],
          export: ['afdesign', 'png', 'jpg', 'pdf', 'svg', 'eps']
        },
        limitations: [
          'No official API access',
          'UI-dependent automation',
          'Application must be running',
          'Windows focus required for keyboard automation'
        ]
      }
    };
  }
}