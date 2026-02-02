const fs = require('fs');
const path = require('path');
const os = require('os');
const PromptCompiler = require('../src');

describe('PromptCompiler', () => {
  let compiler;
  let testPromptsDir;

  beforeEach(() => {
    testPromptsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prompt-compiler-test-'));
    compiler = new PromptCompiler({
      promptsDir: testPromptsDir,
    });
  });

  afterEach(() => {
    if (testPromptsDir && fs.existsSync(testPromptsDir)) {
      fs.rmSync(testPromptsDir, { recursive: true });
    }
  });

  describe('initialization', () => {
    test('creates instance with compile method', () => {
      expect(compiler).toBeDefined();
      expect(typeof compiler.compile).toBe('function');
    });
  });

  describe('template management', () => {
    test('adds and retrieves template', () => {
      const templateName = 'test-template';
      const templateContent = 'Hello {{name}}';

      compiler.addTemplate(templateName, templateContent);

      const template = compiler.getTemplate(templateName);
      expect(template).toBeDefined();
      expect(template.name).toBe(templateName);
      expect(template.content).toBe(templateContent);
    });

    test('lists all templates', () => {
      compiler.addTemplate('template1', 'Content 1');
      compiler.addTemplate('template2', 'Content 2');

      const templates = compiler.listTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(2);
    });

    test('removes template', () => {
      const templateName = 'delete-test';
      compiler.addTemplate(templateName, 'Content to delete');

      expect(compiler.getTemplate(templateName)).toBeDefined();
      compiler.removeTemplate(templateName);
      expect(compiler.getTemplate(templateName)).toBeUndefined();
    });
  });

  describe('compilation', () => {
    test('compiles simple variables', () => {
      compiler.addTemplate('simple', 'Hello {{name}}');

      const result = compiler.compile('simple', { name: '张三' });
      expect(result).toContain('张三');
    });

    test('renders conditional with {{#if}} and {{else}}', () => {
      compiler.addTemplate(
        'condition',
        `
{{#if isAdmin}}
管理员权限
{{else}}
普通用户
{{/if}}
      `
      );

      const adminResult = compiler.compile('condition', { isAdmin: true });
      expect(adminResult).toContain('管理员');

      const userResult = compiler.compile('condition', { isAdmin: false });
      expect(userResult).toContain('普通用户');
    });

    test('renders {{#each}} loop', () => {
      compiler.addTemplate(
        'loop',
        `
{{#each items}}
- {{this}}
{{/each}}
      `
      );

      const result = compiler.compile('loop', {
        items: ['苹果', '香蕉', '橙子'],
      });

      expect(result).toContain('苹果');
      expect(result).toContain('香蕉');
      expect(result).toContain('橙子');
    });

    test('preserves newlines when options.format is false', () => {
      compiler.addTemplate('multiline', 'Line one\n\nLine two\n{{name}}');
      const result = compiler.compile('multiline', { name: 'X' }, { format: false });
      expect(result).toContain('\n\n');
      expect(result).toContain('Line one');
      expect(result).toContain('Line two');
    });
  });

  describe('file system', () => {
    test('saves and loads templates from disk', () => {
      const templateName = 'save-test';
      const templateContent = 'Test content {{var}}';

      compiler.addTemplate(templateName, templateContent);
      compiler.save();

      const newCompiler = new PromptCompiler({
        promptsDir: testPromptsDir,
      });

      const loadedTemplate = newCompiler.getTemplate(templateName);
      expect(loadedTemplate).toBeDefined();
      expect(loadedTemplate.content).toContain('Test content');
    });
  });

  describe('export and import', () => {
    test('exports templates as JSON', () => {
      compiler.addTemplate('t1', 'Hello {{name}}');
      const json = compiler.export('json');
      expect(() => JSON.parse(json)).not.toThrow();
      const data = JSON.parse(json);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((t) => t.name === 't1')).toBe(true);
    });

    test('exports templates as YAML', () => {
      compiler.addTemplate('t2', 'World');
      const yaml = compiler.export('yaml');
      expect(typeof yaml).toBe('string');
      expect(yaml.length).toBeGreaterThan(0);
    });

    test('imports from JSON and compiles', () => {
      compiler.addTemplate('imported', 'Hi {{who}}');
      const json = compiler.export('json');
      const fresh = new PromptCompiler({ promptsDir: testPromptsDir });
      fresh.import(json, 'json');
      const result = fresh.compile('imported', { who: 'there' });
      expect(result).toContain('there');
    });
  });

  describe('error handling', () => {
    test('throws when template not found', () => {
      expect(() => {
        compiler.compile('non-existent-template');
      }).toThrow(/not found/);
    });
  });
});
