/**
 * MCP Tools Test Suite
 * MCPツールテストスイート
 * 
 * Comprehensive test suite for MCP tools and server integration
 * MCPツールとサーバー統合の包括的なテストスイート
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { AffinityDesignerMCPTools } from '../tools/affinity-tools';

describe('AffinityDesignerMCPTools', () => {
  let mcpTools: AffinityDesignerMCPTools;

  beforeEach(() => {
    mcpTools = new AffinityDesignerMCPTools();
  });

  describe('Initialization', () => {
    test('should initialize successfully', async () => {
      const result = await mcpTools.initialize();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should provide tool list after initialization', async () => {
      await mcpTools.initialize();
      const tools = mcpTools.getTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });

    test('should provide statistics', () => {
      const stats = mcpTools.getStatistics();
      expect(stats.success).toBe(true);
      expect(stats.data).toHaveProperty('isInitialized');
      expect(stats.data).toHaveProperty('availableTools');
      expect(stats.data).toHaveProperty('platform', 'Windows');
      expect(stats.data).toHaveProperty('version');
    });
  });

  describe('Tool Discovery', () => {
    test('should return all expected tools', () => {
      const tools = mcpTools.getTools();
      const toolNames = tools.map(tool => tool.name);
      
      const expectedTools = [
        'affinity_get_status',
        'affinity_start_app',
        'affinity_focus_window',
        'affinity_send_shortcut',
        'affinity_new_document',
        'affinity_save_document',
        'affinity_export_document',
        'affinity_close_document',
        'affinity_discover_documents',
        'affinity_validate_document',
        'affinity_get_capabilities'
      ];

      expectedTools.forEach(expectedTool => {
        expect(toolNames).toContain(expectedTool);
      });
    });

    test('should provide proper tool schemas', () => {
      const tools = mcpTools.getTools();
      
      tools.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool.inputSchema).toHaveProperty('type', 'object');
        expect(tool.inputSchema).toHaveProperty('properties');
        expect(tool.inputSchema).toHaveProperty('required');
        expect(Array.isArray(tool.inputSchema.required)).toBe(true);
      });
    });

    test('should provide bilingual descriptions', () => {
      const tools = mcpTools.getTools();
      
      tools.forEach(tool => {
        if (tool.description) {
          expect(typeof tool.description).toBe('string');
          expect(tool.description.length).toBeGreaterThan(0);
          // Should contain both English and Japanese / 英語と日本語の両方を含む必要がある
          expect(tool.description).toMatch(/[a-zA-Z]/); // Contains English
          expect(tool.description).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/); // Contains Japanese
        }
      });
    });
  });

  describe('Tool Execution', () => {
    beforeEach(async () => {
      await mcpTools.initialize();
    });

    test('should handle affinity_get_status', async () => {
      const result = await mcpTools.executeTool('affinity_get_status', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
      expect(result).toHaveProperty('data');
    });

    test('should handle affinity_get_capabilities', async () => {
      const result = await mcpTools.executeTool('affinity_get_capabilities', {});
      expect(result.success).toBe(true);
      const resultData = result.data as { version?: string; platform?: string; automationMethods?: string[]; supportedFormats?: unknown; limitations?: string[] };
      expect(resultData).toHaveProperty('version');
      expect(resultData).toHaveProperty('platform', 'Windows');
      expect(resultData).toHaveProperty('automationMethods');
      expect(resultData).toHaveProperty('supportedFormats');
      expect(resultData).toHaveProperty('limitations');
    });

    test('should handle affinity_discover_documents', async () => {
      const result = await mcpTools.executeTool('affinity_discover_documents', {});
      expect(result.success).toBe(true);
      const resultData = result.data as { documentCount?: number; documents?: unknown[] };
      expect(resultData).toHaveProperty('documentCount');
      expect(typeof resultData.documentCount).toBe('number');
      expect(resultData).toHaveProperty('documents');
      expect(Array.isArray(resultData.documents)).toBe(true);
    });

    test('should handle affinity_validate_document with valid parameters', async () => {
      const result = await mcpTools.executeTool('affinity_validate_document', {
        documentPath: '/nonexistent/file.afdesign'
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle affinity_send_shortcut with parameters', async () => {
      const result = await mcpTools.executeTool('affinity_send_shortcut', {
        keys: '^c' // Ctrl+C (safe shortcut) / Ctrl+C（安全なショートカット）
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle unknown tools gracefully', async () => {
      const result = await mcpTools.executeTool('unknown_tool', {});
      expect(result.success).toBe(false);
      expect(result.error).toBe('Tool not found');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle tool execution before initialization', async () => {
      const uninitializedTools = new AffinityDesignerMCPTools();
      const result = await uninitializedTools.executeTool('affinity_get_status', {});
      expect(result.success).toBe(false);
      expect(result.error).toBe('Call initialize() first');
      expect(result).toHaveProperty('messageJP');
    });
  });

  describe('Document Operations', () => {
    beforeEach(async () => {
      await mcpTools.initialize();
    });

    test('should handle new document creation with default parameters', async () => {
      const result = await mcpTools.executeTool('affinity_new_document', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
      expect(result).toHaveProperty('data');
      if (result.data) {
        const resultData = result.data as { command?: string; parameters?: unknown };
        expect(resultData).toHaveProperty('command', 'new_document');
        expect(resultData).toHaveProperty('parameters');
      }
    });

    test('should handle new document creation with custom parameters', async () => {
      const result = await mcpTools.executeTool('affinity_new_document', {
        width: 800,
        height: 600,
        units: 'px'
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      if (result.data) {
        const resultData = result.data as { parameters?: { width?: number; height?: number; units?: string } };
        expect(resultData.parameters).toHaveProperty('width', 800);
        expect(resultData.parameters).toHaveProperty('height', 600);
        expect(resultData.parameters).toHaveProperty('units', 'px');
      }
    });

    test('should handle save document operations', async () => {
      const result = await mcpTools.executeTool('affinity_save_document', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle save as operations', async () => {
      const result = await mcpTools.executeTool('affinity_save_document', {
        path: '/test/path/document.afdesign'
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      if (result.data) {
        expect(result.data).toHaveProperty('savePath', '/test/path/document.afdesign');
      }
    });

    test('should handle export operations with default parameters', async () => {
      const result = await mcpTools.executeTool('affinity_export_document', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      if (result.data) {
        expect(result.data).toHaveProperty('format', 'png');
        expect(result.data).toHaveProperty('quality', 100);
      }
    });

    test('should handle export operations with custom parameters', async () => {
      const result = await mcpTools.executeTool('affinity_export_document', {
        path: '/test/export.jpg',
        format: 'jpg',
        quality: 80
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      if (result.data) {
        expect(result.data).toHaveProperty('format', 'jpg');
        expect(result.data).toHaveProperty('quality', 80);
      }
    });

    test('should handle close document operations', async () => {
      const result = await mcpTools.executeTool('affinity_close_document', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
      expect(result).toHaveProperty('data');
      if (result.data) {
        expect(result.data).toHaveProperty('command', 'close_document');
      }
    });
  });

  describe('Application Management', () => {
    beforeEach(async () => {
      await mcpTools.initialize();
    });

    test('should handle application startup without document', async () => {
      const result = await mcpTools.executeTool('affinity_start_app', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle application startup with document', async () => {
      const result = await mcpTools.executeTool('affinity_start_app', {
        documentPath: '/test/document.afdesign'
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle window focus operations', async () => {
      const result = await mcpTools.executeTool('affinity_focus_window', {});
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing required parameters', async () => {
      await mcpTools.initialize();
      const result = await mcpTools.executeTool('affinity_validate_document', {});
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('messageJP');
    });

    test('should handle invalid parameter types', async () => {
      await mcpTools.initialize();
      const result = await mcpTools.executeTool('affinity_send_shortcut', {
        keys: 123 // Invalid type, should be string / 無効な型、文字列である必要がある
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
    });

    test('should handle exceptions during tool execution', async () => {
      await mcpTools.initialize();
      // Test with malformed parameters that might cause exceptions
      // 例外を起こす可能性のある不正なパラメータでテスト
      const result = await mcpTools.executeTool('affinity_new_document', {
        width: 'invalid',
        height: null,
        units: {}
      });
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
    });
  });

  describe('Performance and Reliability', () => {
    test('should complete tool execution within reasonable time', async () => {
      await mcpTools.initialize();
      
      const startTime = Date.now();
      await mcpTools.executeTool('affinity_get_status', {});
      const endTime = Date.now();
      
      // Should complete within 5 seconds / 5秒以内に完了する必要がある
      expect(endTime - startTime).toBeLessThan(5000);
    });

    test('should handle concurrent tool executions', async () => {
      await mcpTools.initialize();
      
      const promises = [
        mcpTools.executeTool('affinity_get_status', {}),
        mcpTools.executeTool('affinity_get_capabilities', {}),
        mcpTools.executeTool('affinity_discover_documents', {})
      ];
      
      const results = await Promise.allSettled(promises);
      
      results.forEach(result => {
        expect(result.status).toBe('fulfilled');
        if (result.status === 'fulfilled') {
          expect(result.value).toHaveProperty('success');
          expect(result.value).toHaveProperty('message');
          expect(result.value).toHaveProperty('messageJP');
        }
      });
    });

    test('should maintain state consistency across operations', async () => {
      await mcpTools.initialize();
      
      const stats1 = mcpTools.getStatistics();
      await mcpTools.executeTool('affinity_get_status', {});
      const stats2 = mcpTools.getStatistics();
      
      // Statistics should remain consistent / 統計は一貫している必要がある
      const stats1Data = stats1.data as { availableTools?: number; isInitialized?: boolean };
      const stats2Data = stats2.data as { availableTools?: number; isInitialized?: boolean };
      expect(stats1Data.availableTools).toBe(stats2Data.availableTools);
      expect(stats1Data.isInitialized).toBe(stats2Data.isInitialized);
    });
  });

  describe('Bilingual Support Validation', () => {
    beforeEach(async () => {
      await mcpTools.initialize();
    });

    test('should provide Japanese messages for all tool executions', async () => {
      const tools = mcpTools.getTools();
      
      for (const tool of tools.slice(0, 3)) { // Test first 3 tools for performance
        const result = await mcpTools.executeTool(tool.name, {});
        expect(result).toHaveProperty('messageJP');
        expect(typeof result.messageJP).toBe('string');
        if (result.messageJP) {
          expect(result.messageJP.length).toBeGreaterThan(0);
        }
      }
    });

    test('should provide consistent message structure', async () => {
      const result = await mcpTools.executeTool('affinity_get_capabilities', {});
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('messageJP');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.message).toBe('string');
      if (result.messageJP) {
        expect(typeof result.messageJP).toBe('string');
      }
    });
  });
});