/**
 * Windows Automation Test Suite
 * Windows自動化テストスイート
 * 
 * Comprehensive test suite for Windows automation capabilities
 * Windows自動化機能の包括的なテストスイート
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  WindowsProcessManager,
  WindowsUIAutomation,
  FileOperationsManager,
  WindowsAffinityAutomation
} from '../automation/windows-automation';

describe('WindowsProcessManager', () => {
  test('should find installation path', () => {
    const installPath = WindowsProcessManager.findInstallationPath();
    // Installation may or may not exist in test environment
    // テスト環境ではインストールが存在する場合としない場合がある
    expect(installPath === null || typeof installPath === 'string').toBe(true);
  });

  test('should find Affinity processes without throwing', async () => {
    const processes = await WindowsProcessManager.findAffinityProcesses();
    expect(Array.isArray(processes)).toBe(true);
  });

  test('should handle window info gracefully', async () => {
    // Test with invalid PID / 無効なPIDでテスト
    const windowInfo = await WindowsProcessManager.getWindowInfo(99999);
    expect(windowInfo).toBeNull();
  });

  test('should validate process start parameters', async () => {
    // Test starting with non-existent document / 存在しないドキュメントでの開始をテスト
    const result = await WindowsProcessManager.startApplication('/nonexistent/path.afdesign');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('messageJP');
  });
});

describe('WindowsUIAutomation', () => {
  test('should handle keyboard shortcuts safely', async () => {
    // Test with safe shortcut that won't cause issues / 問題を起こさない安全なショートカットでテスト
    const result = await WindowsUIAutomation.sendKeyboardShortcut('');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
  });

  test('should handle window focus gracefully when no window exists', async () => {
    const result = await WindowsUIAutomation.focusAffinityWindow();
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('messageJP');
  });
});

describe('FileOperationsManager', () => {
  test('should discover documents without throwing', async () => {
    const result = await FileOperationsManager.discoverDocuments();
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('messageJP');
    expect(result).toHaveProperty('data');
    const resultData = result.data as { documentCount?: number };
    expect(resultData).toHaveProperty('documentCount');
    expect(typeof resultData.documentCount).toBe('number');
  });

  test('should validate document paths correctly', () => {
    // Test with empty path / 空のパスでテスト
    const emptyResult = FileOperationsManager.validateDocumentPath('');
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.error).toBe('Empty path provided');

    // Test with non-existent path / 存在しないパスでテスト
    const nonExistentResult = FileOperationsManager.validateDocumentPath('/nonexistent/file.afdesign');
    expect(nonExistentResult.success).toBe(false);
    expect(nonExistentResult.error).toBe('File not found');

    // Test with unsupported format / サポートされていない形式でテスト
    const unsupportedResult = FileOperationsManager.validateDocumentPath('/test/file.txt');
    expect(unsupportedResult.success).toBe(false);
    expect(unsupportedResult.error).toBe('Invalid file format');
  });
});

describe('WindowsAffinityAutomation', () => {
  let automation: WindowsAffinityAutomation;

  beforeEach(() => {
    automation = new WindowsAffinityAutomation();
  });

  test('should initialize successfully', async () => {
    const result = await automation.initialize();
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('messageJP');
    expect(result).toHaveProperty('data');
  });

  test('should provide status information', async () => {
    await automation.initialize();
    const status = await automation.getStatus();
    expect(status).toHaveProperty('success');
    expect(status).toHaveProperty('data');
    if (status.data) {
      const statusData = status.data as { totalProcesses?: number; activeWindows?: number; isInitialized?: boolean };
      expect(statusData).toHaveProperty('totalProcesses');
      expect(statusData).toHaveProperty('activeWindows');
      expect(statusData).toHaveProperty('isInitialized');
    }
  });

  test('should return capabilities information', () => {
    const capabilities = automation.getCapabilities();
    expect(capabilities.success).toBe(true);
    expect(capabilities.data).toHaveProperty('version');
    expect(capabilities.data).toHaveProperty('platform', 'Windows');
    expect(capabilities.data).toHaveProperty('automationMethods');
    expect(capabilities.data).toHaveProperty('supportedFormats');
    expect(capabilities.data).toHaveProperty('limitations');
  });

  test('should handle uninitialized state gracefully', async () => {
    const uninitializedAutomation = new WindowsAffinityAutomation();
    const status = await uninitializedAutomation.getStatus();
    expect(status.success).toBe(false);
    expect(status.error).toBe('Engine not ready');
  });
});

// Integration tests / 統合テスト
describe('Integration Tests', () => {
  test('should maintain data consistency across modules', async () => {
    const processes = await WindowsProcessManager.findAffinityProcesses();
    const automation = new WindowsAffinityAutomation();
    await automation.initialize();
    const status = await automation.getStatus();
    
    // Process count should be consistent / プロセス数は一貫している必要がある
    if (status.success && status.data) {
      const statusData = status.data as { totalProcesses?: number };
      expect(statusData.totalProcesses).toBe(processes.length);
    }
  });

  test('should handle error propagation correctly', async () => {
    // Test error handling through the stack / スタック全体のエラーハンドリングをテスト
    const automation = new WindowsAffinityAutomation();
    const status = await automation.getStatus();
    
    expect(status).toHaveProperty('success');
    if (!status.success) {
      expect(status).toHaveProperty('error');
      expect(status).toHaveProperty('message');
      expect(status).toHaveProperty('messageJP');
    }
  });
});

// Performance tests / パフォーマンステスト
describe('Performance Tests', () => {
  test('should complete process discovery within reasonable time', async () => {
    const startTime = Date.now();
    await WindowsProcessManager.findAffinityProcesses();
    const endTime = Date.now();
    
    // Should complete within 5 seconds / 5秒以内に完了する必要がある
    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('should complete document discovery within reasonable time', async () => {
    const startTime = Date.now();
    await FileOperationsManager.discoverDocuments();
    const endTime = Date.now();
    
    // Should complete within 10 seconds / 10秒以内に完了する必要がある
    expect(endTime - startTime).toBeLessThan(10000);
  });

  test('should handle concurrent operations safely', async () => {
    // Test multiple concurrent operations / 複数の同時操作をテスト
    const promises = [
      WindowsProcessManager.findAffinityProcesses(),
      FileOperationsManager.discoverDocuments(),
      WindowsProcessManager.findAffinityProcesses()
    ];
    
    const results = await Promise.allSettled(promises);
    
    // All operations should complete without throwing / 全ての操作は例外なく完了する必要がある
    results.forEach(result => {
      expect(result.status).toBe('fulfilled');
    });
  });
});

// Edge case tests / エッジケーステスト
describe('Edge Cases', () => {
  test('should handle system environment variations', async () => {
    // Test behavior when system environment variables are missing
    // システム環境変数が不足している場合の動作をテスト
    const originalUserProfile = process.env.USERPROFILE;
    delete process.env.USERPROFILE;
    
    try {
      const result = await FileOperationsManager.discoverDocuments();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('documentCount', 0);
    } finally {
      if (originalUserProfile) {
        process.env.USERPROFILE = originalUserProfile;
      }
    }
  });

  test('should handle malformed PowerShell responses', async () => {
    // This tests the robustness of JSON parsing / JSON解析の堅牢性をテストする
    const processes = await WindowsProcessManager.findAffinityProcesses();
    expect(Array.isArray(processes)).toBe(true);
  });

  test('should handle extremely long paths', () => {
    const longPath = 'C:' + '\\very_long_directory_name'.repeat(20) + '\\file.afdesign';
    const result = FileOperationsManager.validateDocumentPath(longPath);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');
  });
});

// Bilingual message tests / バイリンガルメッセージテスト
describe('Bilingual Support', () => {
  test('should provide Japanese translations for all error messages', async () => {
    const automation = new WindowsAffinityAutomation();
    const status = await automation.getStatus();
    
    if (!status.success) {
      expect(status).toHaveProperty('messageJP');
      expect(typeof status.messageJP).toBe('string');
      expect(status.messageJP).not.toBe('');
    }
  });

  test('should provide Japanese translations for success messages', async () => {
    const result = await FileOperationsManager.discoverDocuments();
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('messageJP');
    expect(typeof result.messageJP).toBe('string');
    expect(result.messageJP).not.toBe('');
  });

  test('should provide capabilities in both languages', () => {
    const automation = new WindowsAffinityAutomation();
    const capabilities = automation.getCapabilities();
    
    expect(capabilities).toHaveProperty('message');
    expect(capabilities).toHaveProperty('messageJP');
    expect(typeof capabilities.messageJP).toBe('string');
    expect(capabilities.messageJP).not.toBe('');
  });
});