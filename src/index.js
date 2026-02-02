/**
 * Prompt Compiler - 主入口文件
 * 用于管理和编译 AI 提示词的工具
 */

const Compiler = require('./compiler');
const PromptStore = require('./prompt-store');

class PromptCompiler {
  constructor(config = {}) {
    this.config = {
      promptsDir: config.promptsDir || './prompts',
      defaultLocale: config.defaultLocale || 'default',
      ...config
    };
    
    this.store = new PromptStore(this.config.promptsDir);
    this.compiler = new Compiler(this.store);
  }

  /**
   * 编译提示词
   * @param {string} templateName 提示词模板名称
   * @param {Object} variables 变量替换对象
   * @param {Object} options 编译选项
   * @returns {string} 编译后的提示词
   */
  compile(templateName, variables = {}, options = {}) {
    return this.compiler.compile(templateName, variables, options);
  }

  /**
   * 添加提示词模板
   * @param {string} name 模板名称
   * @param {string} template 模板内容
   * @param {Object} metadata 元数据
   */
  addTemplate(name, template, metadata = {}) {
    this.store.addTemplate(name, template, metadata);
  }

  /**
   * 获取提示词模板
   * @param {string} name 模板名称
   * @returns {Object} 模板信息
   */
  getTemplate(name) {
    return this.store.getTemplate(name);
  }

  /**
   * 列出所有可用的模板
   * @returns {Array} 模板名称列表
   */
  listTemplates() {
    return this.store.listTemplates();
  }

  /**
   * 删除提示词模板
   * @param {string} name 模板名称
   */
  removeTemplate(name) {
    this.store.removeTemplate(name);
  }

  /**
   * Save all templates to the file system
   */
  save() {
    this.store.save();
  }

  /**
   * Export all templates as JSON or YAML
   * @param {string} [format='json'] - 'json' or 'yaml'
   * @returns {string} Serialized template data
   */
  export(format = 'json') {
    return this.store.export(format);
  }

  /**
   * Import templates from JSON or YAML string
   * @param {string} data - Serialized template data
   * @param {string} [format='json'] - 'json' or 'yaml'
   */
  import(data, format = 'json') {
    this.store.import(data, format);
  }
}

module.exports = PromptCompiler;
module.exports.Compiler = Compiler;
module.exports.PromptStore = PromptStore;
