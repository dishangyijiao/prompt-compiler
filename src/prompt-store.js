/**
 * Prompt Compiler - 提示词存储
 * 负责管理提示词模板的存储和加载
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

class PromptStore {
  constructor(baseDir = './prompts') {
    this.baseDir = baseDir;
    this.templates = new Map();
    this._loadFromDirectory();
  }

  /**
   * 从目录加载提示词模板
   */
  _loadFromDirectory() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    const dirs = fs.readdirSync(this.baseDir);
    
    dirs.forEach(dir => {
      const dirPath = path.join(this.baseDir, dir);
      
      if (fs.statSync(dirPath).isDirectory()) {
        this._loadTemplatesFromDir(dirPath);
      }
    });
  }

  /**
   * 从子目录加载模板
   */
  _loadTemplatesFromDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      
      if (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.template')) {
        this._loadTemplateFile(filePath);
      } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        this._loadYamlFile(filePath);
      }
    });
  }

  /**
   * 加载文本模板文件
   */
  _loadTemplateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const name = path.basename(filePath, path.extname(filePath));
    const category = path.basename(path.dirname(filePath));
    
    this.templates.set(name, {
      name,
      category,
      content,
      type: 'text',
      metadata: {},
      filePath,
      lastModified: fs.statSync(filePath).mtime
    });
  }

  /**
   * 加载 YAML 文件
   */
  _loadYamlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = YAML.parse(content);
    
    if (data.prompts) {
      data.prompts.forEach(prompt => {
        this.templates.set(prompt.name, {
          name: prompt.name,
          category: prompt.category || 'general',
          content: prompt.content,
          type: prompt.type || 'text',
          metadata: prompt.metadata || {},
          filePath,
          lastModified: fs.statSync(filePath).mtime
        });
      });
    }
  }

  /**
   * 获取所有模板
   */
  listTemplates() {
    return Array.from(this.templates.values());
  }

  /**
   * 获取模板
   */
  getTemplate(name) {
    return this.templates.get(name);
  }

  /**
   * 添加模板
   */
  addTemplate(name, content, metadata = {}) {
    this.templates.set(name, {
      name,
      category: metadata.category || 'general',
      content,
      type: metadata.type || 'text',
      metadata,
      filePath: null,
      lastModified: new Date()
    });
  }

  /**
   * 移除模板
   */
  removeTemplate(name) {
    this.templates.delete(name);
  }

  /**
   * 保存模板到文件
   */
  save() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }

    this.templates.forEach(template => {
      const categoryDir = path.join(this.baseDir, template.category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }

      const fileName = `${template.name}.template`;
      const filePath = path.join(categoryDir, fileName);
      
      fs.writeFileSync(filePath, template.content, 'utf8');
    });
  }

  /**
   * 导出所有模板
   */
  export(format = 'json') {
    const templates = Array.from(this.templates.values());
    
    if (format === 'json') {
      return JSON.stringify(templates, null, 2);
    } else if (format === 'yaml') {
      return YAML.stringify({
        prompts: templates
      });
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * 导入模板
   */
  import(data, format = 'json') {
    let templates;
    
    if (format === 'json') {
      templates = JSON.parse(data);
    } else if (format === 'yaml') {
      const parsed = YAML.parse(data);
      templates = parsed.prompts || [];
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    templates.forEach(template => {
      this.templates.set(template.name, template);
    });
  }
}

module.exports = PromptStore;
