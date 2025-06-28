/**
 * Windows Automation Module for Affinity Designer
 * Affinity Designer用Windows自動化モジュール
 *
 * This module provides Windows-specific automation capabilities for Affinity Designer,
 * porting the proven POC scripts into production TypeScript modules.
 * このモジュールは、Affinity Designer用のWindows固有の自動化機能を提供し、
 * 実証済みのPOCスクリプトを本番TypeScriptモジュールに移植します。
 */

import { spawn, exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs";
import { InstallationConfigManager } from "../config/installation-config";

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
  private static readonly LOG_PREFIX = "[Windows Process Manager]";
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

      return processArray.map((p) => ({
        id: p.Id,
        name: p.ProcessName,
        windowTitle: p.MainWindowTitle || undefined,
        windowHandle: p.MainWindowHandle || undefined,
        startTime: p.StartTime ? new Date(p.StartTime) : undefined,
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
        startTime: windowInfo.StartTime
          ? new Date(windowInfo.StartTime)
          : undefined,
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
  static async startApplication(
    documentPath?: string
  ): Promise<AutomationResult> {
    const installPath = this.findInstallationPath();

    if (!installPath) {
      return {
        success: false,
        message: "Affinity Designer installation not found",
        messageJP: "Affinity Designerのインストールが見つかりません",
        error: "No valid installation path found",
      };
    }

    try {
      const args = documentPath ? [`"${documentPath}"`] : [];
      const childProcess = spawn(installPath, args, {
        detached: true,
        stdio: "ignore",
      });

      childProcess.unref();

      // Wait for process to start / プロセス開始を待機
      const config = this.configManager.getConfig();
      await this.waitForProcess(config.timeouts.processStart);

      return {
        success: true,
        message: "Affinity Designer started successfully",
        messageJP: "Affinity Designerの開始に成功しました",
        data: {
          installPath,
          documentPath: documentPath || null,
          pid: childProcess.pid,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to start Affinity Designer",
        messageJP: "Affinity Designerの開始に失敗しました",
        error: error instanceof Error ? error.message : String(error),
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Windows UI Automation Manager
 * Windows UI自動化マネージャー
 */
export class WindowsUIAutomation {
  private static readonly LOG_PREFIX = "[Windows UI Automation]";

  /**
   * Send keyboard shortcut to active window
   * アクティブウィンドウにキーボードショートカットを送信
   */
  static async sendKeyboardShortcut(keys: string): Promise<AutomationResult> {
    try {
      // Escape special characters for SendKeys / SendKeys用に特殊文字をエスケープ
      const escapedKeys = this.escapeKeysForSendKeys(keys);

      const command = `
        Add-Type -AssemblyName System.Windows.Forms
        try {
          [System.Windows.Forms.SendKeys]::SendWait("${escapedKeys}")
          Write-Output "SUCCESS"
        } catch {
          Write-Output "ERROR: $($_.Exception.Message)"
        }
      `;

      const result = await execAsync(
        `powershell -NoProfile -Command "${command}"`
      );

      if (result.stdout.trim().startsWith("SUCCESS")) {
        // Small delay after sending keys / キー送信後の小さな遅延
        await this.delay(200);

        return {
          success: true,
          message: `Keyboard shortcut sent successfully: ${keys}`,
          messageJP: `キーボードショートカットの送信に成功: ${keys}`,
          data: { keys, escaped: escapedKeys },
        };
      } else {
        return {
          success: false,
          message: `PowerShell execution failed: ${result.stdout.trim()}`,
          messageJP: `PowerShell実行に失敗: ${result.stdout.trim()}`,
          error: result.stdout.trim(),
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to send keyboard shortcut: ${keys}`,
        messageJP: `キーボードショートカットの送信に失敗: ${keys}`,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Escape special characters for SendKeys
   * SendKeys用の特殊文字をエスケープ
   */
  private static escapeKeysForSendKeys(keys: string): string {
    // Handle special key combinations / 特殊キーの組み合わせを処理
    return keys
      .replace(/\+/g, "{+}")
      .replace(/\^/g, "{^}")
      .replace(/%/g, "{%}")
      .replace(/~/g, "{~}")
      .replace(/\(/g, "{(}")
      .replace(/\)/g, "{)}")
      .replace(/\[/g, "{[}")
      .replace(/\]/g, "{]}");
  }

  /**
   * Focus Affinity Designer window with enhanced retry logic
   * 強化された再試行ロジックでAffinity Designerウィンドウにフォーカス
   */
  static async focusAffinityWindow(maxRetries = 3): Promise<AutomationResult> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.attemptFocusWindow(attempt);

      if (result.success) {
        return {
          success: true,
          message: `Window focused successfully on attempt ${attempt}`,
          messageJP: `${attempt}回目の試行でウィンドウフォーカスに成功`,
          data: {
            ...(result.data || {}),
            attemptsUsed: attempt,
          },
        };
      }

      // If not the last attempt, wait before retrying / 最後の試行でない場合、再試行前に待機
      if (attempt < maxRetries) {
        await this.delay(500 * attempt); // Progressive delay / 段階的遅延
      }
    }

    return {
      success: false,
      message: `Failed to focus window after ${maxRetries} attempts`,
      messageJP: `${maxRetries}回の試行後にウィンドウフォーカスに失敗`,
      error: "All focus attempts failed",
    };
  }

  /**
   * Single attempt to focus window with comprehensive handling
   * 包括的な処理で単一のウィンドウフォーカス試行
   */
  private static async attemptFocusWindow(
    attemptNumber: number
  ): Promise<AutomationResult> {
    try {
      const processes = await WindowsProcessManager.findAffinityProcesses();
      const validProcesses = processes.filter(
        (p) => p.windowTitle && p.windowHandle && String(p.windowHandle) !== "0"
      );

      if (validProcesses.length === 0) {
        return {
          success: false,
          message: "No active Affinity Designer window found",
          messageJP: "アクティブなAffinity Designerウィンドウが見つかりません",
          error: "No valid window handle available",
        };
      }

      // Try the first valid process / 最初の有効なプロセスを試行
      const targetProcess = validProcesses[0];

      const command = `
        Add-Type @'
          using System;
          using System.Runtime.InteropServices;
          public class Win32 {
            [DllImport("user32.dll")] 
            public static extern bool SetForegroundWindow(IntPtr hWnd);
            [DllImport("user32.dll")] 
            public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
            [DllImport("user32.dll")] 
            public static extern bool IsWindow(IntPtr hWnd);
            [DllImport("user32.dll")] 
            public static extern IntPtr GetForegroundWindow();
            [DllImport("user32.dll")] 
            public static extern bool BringWindowToTop(IntPtr hWnd);
            [DllImport("user32.dll")] 
            public static extern bool SetActiveWindow(IntPtr hWnd);
            [DllImport("user32.dll")] 
            public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
            [DllImport("user32.dll")] 
            public static extern uint GetCurrentThreadId();
            [DllImport("user32.dll")] 
            public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);
          }
'@
        $hwnd = [IntPtr]${targetProcess.windowHandle}
        
        # Verify window handle is valid / ウィンドウハンドルが有効か検証
        if (-not [Win32]::IsWindow($hwnd)) {
          Write-Output "INVALID_HANDLE"
          exit
        }
        
        # Get current foreground window for comparison / 比較用に現在の前面ウィンドウを取得
        $currentFg = [Win32]::GetForegroundWindow()
        
        # If already focused, return success / 既にフォーカスされている場合は成功を返す
        if ($currentFg -eq $hwnd) {
          Write-Output "ALREADY_FOCUSED"
          exit
        }
        
        # Enhanced focus sequence / 強化されたフォーカスシーケンス
        try {
          # Step 1: Restore window if minimized / ステップ1：最小化されている場合はウィンドウを復元
          [Win32]::ShowWindow($hwnd, 9) | Out-Null  # SW_RESTORE
          Start-Sleep -Milliseconds 150
          
          # Step 2: Bring window to top / ステップ2：ウィンドウを最前面に
          [Win32]::BringWindowToTop($hwnd) | Out-Null
          Start-Sleep -Milliseconds 150
          
          # Step 3: Attach thread input for better control / ステップ3：より良い制御のためスレッド入力をアタッチ
          $targetProcessId = 0
          $targetThreadId = [Win32]::GetWindowThreadProcessId($hwnd, [ref]$targetProcessId)
          $currentThreadId = [Win32]::GetCurrentThreadId()
          
          if ($targetThreadId -ne $currentThreadId) {
            [Win32]::AttachThreadInput($currentThreadId, $targetThreadId, $true) | Out-Null
            Start-Sleep -Milliseconds 50
          }
          
          # Step 4: Set as active window / ステップ4：アクティブウィンドウとして設定
          [Win32]::SetActiveWindow($hwnd) | Out-Null
          Start-Sleep -Milliseconds 100
          
          # Step 5: Set as foreground window / ステップ5：前面ウィンドウとして設定
          $focusResult = [Win32]::SetForegroundWindow($hwnd)
          Start-Sleep -Milliseconds 200
          
          # Step 6: Detach thread input / ステップ6：スレッド入力をデタッチ
          if ($targetThreadId -ne $currentThreadId) {
            [Win32]::AttachThreadInput($currentThreadId, $targetThreadId, $false) | Out-Null
          }
          
          # Step 7: Verify focus was acquired / ステップ7：フォーカスが取得されたか検証
          Start-Sleep -Milliseconds 100
          $finalFg = [Win32]::GetForegroundWindow()
          
          if ($finalFg -eq $hwnd) {
            Write-Output "SUCCESS"
          } else {
            Write-Output "FOCUS_VERIFICATION_FAILED"
          }
          
        } catch {
          Write-Output "FOCUS_EXCEPTION: $($_.Exception.Message)"
        }
      `;

      const result = await execAsync(
        `powershell -NoProfile -Command "${command}"`
      );
      const output = result.stdout.trim();

      if (output === "SUCCESS" || output === "ALREADY_FOCUSED") {
        // Additional verification delay / 追加検証遅延
        await this.delay(200);

        // Final verification with independent check / 独立チェックによる最終検証
        const verificationResult = await this.verifyWindowFocus(
          String(targetProcess.windowHandle)
        );

        if (verificationResult) {
          return {
            success: true,
            message: "Window focus verified successfully",
            messageJP: "ウィンドウフォーカスの検証に成功",
            data: {
              windowHandle: targetProcess.windowHandle,
              windowTitle: targetProcess.windowTitle,
              processId: targetProcess.id,
              focusStatus: output,
            },
          };
        } else {
          return {
            success: false,
            message: "Focus appeared successful but verification failed",
            messageJP: "フォーカスは成功したように見えたが検証に失敗",
            error: "Post-focus verification failed",
          };
        }
      } else {
        return {
          success: false,
          message: `Focus attempt ${attemptNumber} failed: ${output}`,
          messageJP: `フォーカス試行${attemptNumber}回目が失敗: ${output}`,
          error: `PowerShell returned: ${output}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Exception in focus attempt ${attemptNumber}`,
        messageJP: `フォーカス試行${attemptNumber}回目で例外発生`,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Independent window focus verification
   * 独立したウィンドウフォーカス検証
   */
  private static async verifyWindowFocus(
    windowHandle: string
  ): Promise<boolean> {
    try {
      const command = `
        Add-Type @'
          using System;
          using System.Runtime.InteropServices;
          public class Win32 {
            [DllImport("user32.dll")] 
            public static extern IntPtr GetForegroundWindow();
            [DllImport("user32.dll")] 
            public static extern bool IsWindow(IntPtr hWnd);
          }
'@
        $hwnd = [IntPtr]${windowHandle}
        $fg = [Win32]::GetForegroundWindow()
        
        if ([Win32]::IsWindow($hwnd) -and $fg -eq $hwnd) {
          Write-Output "true"
        } else {
          Write-Output "false"
        }
      `;

      const result = await execAsync(
        `powershell -NoProfile -Command "${command}"`
      );
      return result.stdout.trim().toLowerCase() === "true";
    } catch {
      return false;
    }
  }

  /**
   * Execute PowerShell command with improved error handling
   * 改善されたエラーハンドリングでPowerShellコマンドを実行
   */
  static async executeCommand(
    command: string
  ): Promise<{ stdout: string; stderr: string; success: boolean }> {
    try {
      const result = await execAsync(
        `powershell -NoProfile -Command "${command}"`
      );
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        success: true,
      };
    } catch (error) {
      return {
        stdout: "",
        stderr: error instanceof Error ? error.message : String(error),
        success: false,
      };
    }
  }

  /**
   * Utility delay function
   * ユーティリティ遅延関数
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * File Operations Manager for Affinity Designer documents
 * Affinity Designerドキュメント用ファイル操作マネージャー
 */
export class FileOperationsManager {
  private static readonly LOG_PREFIX = "[File Operations Manager]";
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
            if (file.endsWith(".afdesign")) {
              const filePath = path.join(searchPath, file);
              const stats = fs.statSync(filePath);

              documents.push({
                path: filePath,
                name: file,
                size: stats.size,
                lastModified: stats.mtime,
                format: "afdesign",
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
        documents: documents.slice(0, 10), // Limit to first 10 for performance
      },
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
        message: "Document path is required",
        messageJP: "ドキュメントパスが必要です",
        error: "Empty path provided",
      };
    }

    if (!fs.existsSync(documentPath)) {
      return {
        success: false,
        message: "Document file does not exist",
        messageJP: "ドキュメントファイルが存在しません",
        error: "File not found",
      };
    }

    const extension = path.extname(documentPath).toLowerCase();
    const supportedFormats = [
      ".afdesign",
      ".psd",
      ".ai",
      ".svg",
      ".png",
      ".jpg",
      ".jpeg",
    ];

    if (!supportedFormats.includes(extension)) {
      return {
        success: false,
        message: `Unsupported file format: ${extension}`,
        messageJP: `サポートされていないファイル形式: ${extension}`,
        error: "Invalid file format",
      };
    }

    return {
      success: true,
      message: `Document path validated: ${documentPath}`,
      messageJP: `ドキュメントパスを検証しました: ${documentPath}`,
      data: {
        path: documentPath,
        extension,
        name: path.basename(documentPath),
      },
    };
  }
}

/**
 * Main Windows Automation Engine
 * メインWindows自動化エンジン
 */
export class WindowsAffinityAutomation {
  private static readonly LOG_PREFIX = "[Windows Affinity Automation]";
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
          message: "Affinity Designer installation not found",
          messageJP: "Affinity Designerのインストールが見つかりません",
          error: "Installation required",
        };
      }

      // Check current process status / 現在のプロセス状態をチェック
      const processes = await WindowsProcessManager.findAffinityProcesses();

      this.isInitialized = true;

      return {
        success: true,
        message: "Windows Affinity automation engine initialized",
        messageJP: "Windows Affinity自動化エンジンを初期化しました",
        data: {
          installPath,
          processCount: processes.length,
          engineVersion: "1.0.0",
          platform: "Windows",
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to initialize automation engine",
        messageJP: "自動化エンジンの初期化に失敗しました",
        error: error instanceof Error ? error.message : String(error),
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
        message: "Automation engine not initialized",
        messageJP: "自動化エンジンが初期化されていません",
        error: "Engine not ready",
      };
    }

    const processes = await WindowsProcessManager.findAffinityProcesses();
    const activeProcesses = processes.filter((p) => p.windowTitle);

    return {
      success: true,
      message: `Found ${processes.length} process(es), ${activeProcesses.length} with active window(s)`,
      messageJP: `${processes.length}個のプロセス、${activeProcesses.length}個のアクティブウィンドウを発見`,
      data: {
        totalProcesses: processes.length,
        activeWindows: activeProcesses.length,
        isInitialized: this.isInitialized,
        processes: processes.map((p) => ({
          id: p.id,
          name: p.name,
          hasWindow: !!p.windowTitle,
          windowTitle: p.windowTitle,
        })),
      },
    };
  }

  /**
   * Get automation capabilities
   * 自動化機能を取得
   */
  getCapabilities(): AutomationResult {
    return {
      success: true,
      message: "Windows Affinity Designer automation capabilities",
      messageJP: "Windows Affinity Designer自動化機能",
      data: {
        version: "1.0.0",
        platform: "Windows",
        automationMethods: [
          "keyboard_shortcuts",
          "window_management",
          "process_management",
          "file_operations",
        ],
        supportedFormats: {
          import: ["afdesign", "psd", "ai", "svg", "png", "jpg"],
          export: ["afdesign", "png", "jpg", "pdf", "svg", "eps"],
        },
        limitations: [
          "No official API access",
          "UI-dependent automation",
          "Application must be running",
          "Windows focus required for keyboard automation",
        ],
      },
    };
  }
}
