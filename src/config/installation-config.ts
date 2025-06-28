/**
 * Installation Configuration Management
 * インストール設定管理
 * 
 * This module handles configuration for Affinity Designer installation paths
 * and system-specific settings for automation.
 * このモジュールは、Affinity Designerインストールパスと
 * 自動化用システム固有設定を処理します。
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Interface for affinity install paths JSON structure
 * AffinityインストールパスJSON構造のインターフェース
 */
interface AffinityInstallPathsJson {
  windows: {
    affinityInstallPaths: string[];
  };
  macos: {
    affinityInstallPaths: string[];
  };
}

/**
 * Check if running in WSL (Windows Subsystem for Linux)
 * WSL（Windows Subsystem for Linux）で実行中かチェック
 */
function isWSL(): boolean {
  try {
    if (process.platform !== 'linux') {
      return false;
    }
    // Check for WSL version file or WSL environment
    // WSLバージョンファイルまたはWSL環境をチェック
    return fs.existsSync('/proc/version') && 
           fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
  } catch {
    return false;
  }
}

/**
 * Convert Windows path to WSL path
 * WindowsパスをWSLパスに変換
 */
function convertWindowsPathToWSL(windowsPath: string): string {
  if (!windowsPath || typeof windowsPath !== 'string') {
    return windowsPath;
  }
  
  // Convert C:\ to /mnt/c/, D:\ to /mnt/d/, etc.
  // C:\を/mnt/c/に、D:\を/mnt/d/に変換など
  const driveRegex = /^([A-Za-z]):\\/;
  const match = windowsPath.match(driveRegex);
  
  if (match) {
    const driveLetter = match[1].toLowerCase();
    const pathWithoutDrive = windowsPath.substring(3); // Remove "C:\"
    const unixPath = pathWithoutDrive.replace(/\\/g, '/');
    return `/mnt/${driveLetter}/${unixPath}`;
  }
  
  return windowsPath;
}

/**
 * Load affinity install paths from JSON file
 * JSONファイルからAffinityインストールパスを読み込み
 */
function loadAffinityInstallPaths(): { windows: string[]; macos: string[] } {
  let windowsPaths: string[] = [];
  let macOSPaths: string[] = [];
  
  try {
    const jsonPath = path.join(__dirname, '..', '..', 'affinity-install-paths.json');
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      const installPaths: AffinityInstallPathsJson = JSON.parse(jsonData);
      windowsPaths = installPaths.windows.affinityInstallPaths || [];
      macOSPaths = installPaths.macos.affinityInstallPaths || [];
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load affinity install paths from JSON, using defaults:', error);
    // eslint-disable-next-line no-console
    console.warn('JSONからAffinityインストールパスの読み込みに失敗、デフォルトを使用:', error);
  }
  
  // Fallback to hardcoded defaults if JSON loading fails
  // JSON読み込み失敗時はハードコードされたデフォルトにフォールバック
  if (windowsPaths.length === 0) {
    windowsPaths = [
      'C:\\Program Files\\Affinity\\Designer 2\\Designer.exe',
      'C:\\Program Files\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe',
      'C:\\Program Files (x86)\\Affinity\\Affinity Designer 2\\Affinity Designer 2.exe',
      'C:\\Program Files\\Affinity\\Affinity Designer\\Affinity Designer.exe',
      'C:\\Program Files (x86)\\Affinity\\Affinity Designer\\Affinity Designer.exe'
    ];
  }
  
  if (macOSPaths.length === 0) {
    macOSPaths = [
      '/Applications/Affinity Designer 2.app/Contents/MacOS/Affinity Designer 2',
      '/Applications/Affinity Designer.app/Contents/MacOS/Affinity Designer'
    ];
  }
  
  // If running in WSL, add converted WSL paths for Windows installations
  // WSLで実行中の場合、Windows インストール用の変換されたWSLパスを追加
  if (isWSL()) {
    const wslPaths = windowsPaths.map(convertWindowsPathToWSL);
    return {
      windows: [...windowsPaths, ...wslPaths],
      macos: macOSPaths
    };
  }
  
  return {
    windows: windowsPaths,
    macos: macOSPaths
  };
}

/**
 * Configuration interface for installation settings
 * インストール設定用設定インターフェース
 */
export interface InstallationConfig {
  readonly affinityInstallPaths: string[];
  readonly documentSearchPaths: string[];
  readonly timeouts: {
    readonly processStart: number;
    readonly commandExecution: number;
    readonly pollingInterval: number;
  };
  readonly processNames: string[];
  readonly retryAttempts: number;
  readonly platform: string;
}

/**
 * Default configuration for Windows systems
 * Windowsシステム用デフォルト設定
 */
function createDefaultWindowsConfig(): InstallationConfig {
  const installPaths = loadAffinityInstallPaths();
  return {
    affinityInstallPaths: installPaths.windows,
  documentSearchPaths: [
    path.join(os.homedir(), 'Documents'),
    path.join(os.homedir(), 'Desktop'),
    path.join(os.homedir(), 'Downloads'),
    path.join(os.homedir(), 'OneDrive', 'Documents'),
    path.join(os.homedir(), 'OneDrive', 'Desktop')
  ],
  timeouts: {
    processStart: 10000,
    commandExecution: 5000,
    pollingInterval: 1000
  },
  processNames: [
    'Affinity Designer*',
    'AffinityDesigner*',
    'Designer*'
  ],
    retryAttempts: 3,
    platform: 'win32'
  };
}

/**
 * Default configuration for macOS systems (placeholder for future implementation)
 * macOSシステム用デフォルト設定（将来の実装用プレースホルダー）
 */
function createDefaultMacOSConfig(): InstallationConfig {
  const installPaths = loadAffinityInstallPaths();
  return {
    affinityInstallPaths: installPaths.macos,
  documentSearchPaths: [
    path.join(os.homedir(), 'Documents'),
    path.join(os.homedir(), 'Desktop'),
    path.join(os.homedir(), 'Downloads')
  ],
  timeouts: {
    processStart: 10000,
    commandExecution: 5000,
    pollingInterval: 1000
  },
  processNames: [
    'Affinity Designer*',
    'Designer*'
  ],
    retryAttempts: 3,
    platform: 'darwin'
  };
}

/**
 * Configuration Manager for Installation Settings
 * インストール設定用設定マネージャー
 */
export class InstallationConfigManager {
  private static instance: InstallationConfigManager;
  private config: InstallationConfig;
  private customConfigPath?: string;

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  /**
   * Get singleton instance / シングルトンインスタンスを取得
   */
  static getInstance(): InstallationConfigManager {
    if (!InstallationConfigManager.instance) {
      InstallationConfigManager.instance = new InstallationConfigManager();
    }
    return InstallationConfigManager.instance;
  }

  /**
   * Get default configuration for current platform
   * 現在のプラットフォーム用デフォルト設定を取得
   */
  private getDefaultConfig(): InstallationConfig {
    switch (process.platform) {
      case 'win32':
        return createDefaultWindowsConfig();
      case 'darwin':
        return createDefaultMacOSConfig();
      default: {
        // Fallback to Windows config for unsupported platforms
        // サポートされていないプラットフォームではWindows設定にフォールバック
        const fallbackConfig = createDefaultWindowsConfig();
        return { ...fallbackConfig, platform: process.platform };
      }
    }
  }

  /**
   * Get current configuration / 現在の設定を取得
   */
  getConfig(): InstallationConfig {
    return { ...this.config };
  }

  /**
   * Load configuration from file / ファイルから設定を読み込み
   */
  async loadConfigFromFile(configPath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(configPath)) {
        return false;
      }

      const configData = fs.readFileSync(configPath, 'utf8');
      const loadedConfig = JSON.parse(configData) as Partial<InstallationConfig>;
      
      // Merge with default config / デフォルト設定とマージ
      this.config = {
        ...this.getDefaultConfig(),
        ...loadedConfig
      };

      this.customConfigPath = configPath;
      return true;

    } catch (error) {
      console.error('Failed to load configuration:', error);
      console.error('設定の読み込みに失敗:', error);
      return false;
    }
  }

  /**
   * Save current configuration to file / 現在の設定をファイルに保存
   */
  async saveConfigToFile(configPath: string): Promise<boolean> {
    try {
      const configData = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(configPath, configData, 'utf8');
      this.customConfigPath = configPath;
      return true;

    } catch (error) {
      console.error('Failed to save configuration:', error);
      console.error('設定の保存に失敗:', error);
      return false;
    }
  }

  /**
   * Update installation paths / インストールパスを更新
   */
  updateInstallationPaths(paths: string[]): void {
    this.config = {
      ...this.config,
      affinityInstallPaths: [...paths]
    };
  }

  /**
   * Add custom installation path / カスタムインストールパスを追加
   */
  addInstallationPath(installPath: string): void {
    if (!this.config.affinityInstallPaths.includes(installPath)) {
      this.config = {
        ...this.config,
        affinityInstallPaths: [...this.config.affinityInstallPaths, installPath]
      };
    }
  }

  /**
   * Update document search paths / ドキュメント検索パスを更新
   */
  updateDocumentSearchPaths(paths: string[]): void {
    this.config = {
      ...this.config,
      documentSearchPaths: [...paths]
    };
  }

  /**
   * Add custom document search path / カスタムドキュメント検索パスを追加
   */
  addDocumentSearchPath(searchPath: string): void {
    if (!this.config.documentSearchPaths.includes(searchPath)) {
      this.config = {
        ...this.config,
        documentSearchPaths: [...this.config.documentSearchPaths, searchPath]
      };
    }
  }

  /**
   * Update timeout settings / タイムアウト設定を更新
   */
  updateTimeouts(timeouts: Partial<InstallationConfig['timeouts']>): void {
    this.config = {
      ...this.config,
      timeouts: {
        ...this.config.timeouts,
        ...timeouts
      }
    };
  }

  /**
   * Reset to default configuration / デフォルト設定にリセット
   */
  resetToDefault(): void {
    this.config = this.getDefaultConfig();
    this.customConfigPath = undefined;
  }

  /**
   * Validate current configuration / 現在の設定を検証
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate installation paths / インストールパスを検証
    if (!Array.isArray(this.config.affinityInstallPaths) || this.config.affinityInstallPaths.length === 0) {
      errors.push('Installation paths must be a non-empty array / インストールパスは空でない配列である必要があります');
    }

    // Validate document search paths / ドキュメント検索パスを検証
    if (!Array.isArray(this.config.documentSearchPaths) || this.config.documentSearchPaths.length === 0) {
      errors.push('Document search paths must be a non-empty array / ドキュメント検索パスは空でない配列である必要があります');
    }

    // Validate timeouts / タイムアウトを検証
    const { processStart, commandExecution, pollingInterval } = this.config.timeouts;
    if (processStart <= 0 || commandExecution <= 0 || pollingInterval <= 0) {
      errors.push('All timeout values must be positive numbers / 全てのタイムアウト値は正の数である必要があります');
    }

    // Validate retry attempts / 再試行回数を検証
    if (this.config.retryAttempts < 0) {
      errors.push('Retry attempts must be non-negative / 再試行回数は非負の数である必要があります');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Find valid installation path / 有効なインストールパスを検索
   */
  findValidInstallationPath(): string | null {
    for (const installPath of this.config.affinityInstallPaths) {
      if (fs.existsSync(installPath)) {
        return installPath;
      }
    }
    return null;
  }

  /**
   * Get accessible document search paths / アクセス可能なドキュメント検索パスを取得
   */
  getAccessibleDocumentPaths(): string[] {
    return this.config.documentSearchPaths.filter(searchPath => {
      try {
        return fs.existsSync(searchPath) && fs.statSync(searchPath).isDirectory();
      } catch {
        return false;
      }
    });
  }

  /**
   * Get configuration summary / 設定サマリーを取得
   */
  getConfigSummary(): {
    platform: string;
    installPathsCount: number;
    validInstallPath: string | null;
    documentPathsCount: number;
    accessibleDocumentPaths: number;
    hasCustomConfig: boolean;
  } {
    return {
      platform: this.config.platform,
      installPathsCount: this.config.affinityInstallPaths.length,
      validInstallPath: this.findValidInstallationPath(),
      documentPathsCount: this.config.documentSearchPaths.length,
      accessibleDocumentPaths: this.getAccessibleDocumentPaths().length,
      hasCustomConfig: !!this.customConfigPath
    };
  }

  /**
   * Create default configuration file / デフォルト設定ファイルを作成
   */
  static async createDefaultConfigFile(configPath: string): Promise<boolean> {
    try {
      const configManager = new InstallationConfigManager();
      const defaultConfig = configManager.getDefaultConfig();
      
      const configData = JSON.stringify(defaultConfig, null, 2);
      fs.writeFileSync(configPath, configData, 'utf8');
      
      return true;

    } catch (error) {
      console.error('Failed to create default configuration file:', error);
      console.error('デフォルト設定ファイルの作成に失敗:', error);
      return false;
    }
  }

  /**
   * Auto-detect Affinity Designer installations / Affinity Designerインストールを自動検出
   */
  async autoDetectInstallations(): Promise<string[]> {
    const detectedPaths: string[] = [];
    
    if (process.platform === 'win32') {
      // Common Windows installation locations / 一般的なWindowsインストール場所
      const commonPaths = [
        'C:\\Program Files\\Affinity',
        'C:\\Program Files (x86)\\Affinity'
      ];

      for (const basePath of commonPaths) {
        try {
          if (fs.existsSync(basePath)) {
            const subdirs = fs.readdirSync(basePath);
            for (const subdir of subdirs) {
              if (subdir.toLowerCase().includes('designer')) {
                const exePaths = [
                  path.join(basePath, subdir, `${subdir}.exe`),
                  path.join(basePath, subdir, 'Affinity Designer.exe'),
                  path.join(basePath, subdir, 'Affinity Designer 2.exe')
                ];
                
                for (const exePath of exePaths) {
                  if (fs.existsSync(exePath)) {
                    detectedPaths.push(exePath);
                  }
                }
              }
            }
          }
        } catch {
          // Silent failure for inaccessible directories / アクセスできないディレクトリの静かな失敗
        }
      }
    }

    // Add detected paths to configuration / 検出されたパスを設定に追加
    for (const detectedPath of detectedPaths) {
      this.addInstallationPath(detectedPath);
    }

    return detectedPaths;
  }

  /**
   * Reload affinity install paths from JSON file
   * JSONファイルからAffinityインストールパスを再読み込み
   */
  reloadAffinityInstallPaths(): boolean {
    try {
      const installPaths = loadAffinityInstallPaths();
      const platformPaths = process.platform === 'win32' ? installPaths.windows : installPaths.macos;
      
      this.config = {
        ...this.config,
        affinityInstallPaths: platformPaths
      };
      
      return true;
    } catch (error) {
      console.error('Failed to reload affinity install paths:', error);
      console.error('Affinityインストールパスの再読み込みに失敗:', error);
      return false;
    }
  }
}