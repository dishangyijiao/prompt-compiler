const PromptCompiler = require('../src');

describe('PromptCompiler', () => {
  let compiler;

  beforeEach(() => {
    compiler = new PromptCompiler({
      promptsDir: './test-prompts'
    });
  });

  describe('初始化', () => {
    test('应该正确创建实例', () => {
      expect(compiler).toBeDefined();
      expect(typeof compiler.compile).toBe('function');
    });
  });

  describe('模板管理', () => {
    test('应该能够添加和获取模板', () => {
      const templateName = 'test-template';
      const templateContent = 'Hello {{name}}';
      
      compiler.addTemplate(templateName, templateContent);
      
      const template = compiler.getTemplate(templateName);
      expect(template).toBeDefined();
      expect(template.name).toBe(templateName);
      expect(template.content).toBe(templateContent);
    });

    test('应该能够列出所有模板', () => {
      compiler.addTemplate('template1', 'Content 1');
      compiler.addTemplate('template2', 'Content 2');
      
      const templates = compiler.listTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(2);
    });

    test('应该能够删除模板', () => {
      const templateName = 'delete-test';
      compiler.addTemplate(templateName, 'Content to delete');
      
      expect(compiler.getTemplate(templateName)).toBeDefined();
      compiler.removeTemplate(templateName);
      expect(compiler.getTemplate(templateName)).toBeUndefined();
    });
  });

  describe('编译功能', () => {
    test('应该能够编译简单变量', () => {
      compiler.addTemplate('simple', 'Hello {{name}}');
      
      const result = compiler.compile('simple', { name: '张三' });
      expect(result).toContain('张三');
    });

    test('应该能够渲染条件语句', () => {
      compiler.addTemplate('condition', `
{{#if isAdmin}}
管理员权限
{{else}}
普通用户
{{/if}}
      `);
      
      const adminResult = compiler.compile('condition', { isAdmin: true });
      expect(adminResult).toContain('管理员');
      
      const userResult = compiler.compile('condition', { isAdmin: false });
      expect(userResult).toContain('普通用户');
    });

    test('应该能够渲染循环', () => {
      compiler.addTemplate('loop', `
{{#each items}}
- {{this}}
{{/each}}
      `);
      
      const result = compiler.compile('loop', { 
        items: ['苹果', '香蕉', '橙子'] 
      });
      
      expect(result).toContain('苹果');
      expect(result).toContain('香蕉');
      expect(result).toContain('橙子');
    });
  });

  describe('文件系统操作', () => {
    test('应该能够保存和加载模板', () => {
      const templateName = 'save-test';
      const templateContent = 'Test content {{var}}';
      
      compiler.addTemplate(templateName, templateContent);
      compiler.save();
      
      // 创建新实例加载保存的模板
      const newCompiler = new PromptCompiler({
        promptsDir: './test-prompts'
      });
      
      const loadedTemplate = newCompiler.getTemplate(templateName);
      expect(loadedTemplate).toBeDefined();
      expect(loadedTemplate.content).toContain('Test content');
    });
  });

  describe('错误处理', () => {
    test('应该在模板不存在时抛出错误', () => {
      expect(() => {
        compiler.compile('non-existent-template');
      }).toThrow();
    });
  });
});
