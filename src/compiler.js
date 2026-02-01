/**
 * Prompt Compiler - 编译引擎
 * 负责解析和编译提示词模板
 */

class Compiler {
  constructor(store) {
    this.store = store;
  }

  /**
   * 编译提示词模板
   * @param {string} templateName 模板名称
   * @param {Object} variables 变量替换对象
   * @param {Object} options 编译选项
   * @returns {string} 编译后的提示词
   */
  compile(templateName, variables = {}, options = {}) {
    const template = this.store.getTemplate(templateName);
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    let content = template.content;
    
    // 简单变量替换
    content = this._replaceVariables(content, variables);
    
    // 条件渲染
    content = this._renderConditions(content, variables);
    
    // 循环渲染
    content = this._renderLoops(content, variables);
    
    // 格式化输出
    content = this._format(content);

    return content;
  }

  /**
   * 变量替换
   */
  _replaceVariables(content, variables) {
    return content.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  }

  /**
   * 条件渲染
   */
  _renderConditions(content, variables) {
    // 支持 {{#if condition}} ... {{/if}} 语法
    return content.replace(
      /{{#if\s+(\w+)\s*}}([\s\S]*?){{\/if}}/g,
      (match, condition, body) => {
        return variables[condition] ? body : '';
      }
    );
  }

  /**
   * 循环渲染
   */
  _renderLoops(content, variables) {
    // 支持 {{#each array}} ... {{/each}} 语法
    return content.replace(
      /{{#each\s+(\w+)\s*}}([\s\S]*?){{\/each}}/g,
      (match, key, body) => {
        const array = variables[key];
        if (!Array.isArray(array)) {
          return '';
        }
        
        return array.map(item => {
          // 支持 {{this}} 表示当前项
          return body.replace(/{{\s*this\s*}}/g, item);
        }).join('');
      }
    );
  }

  /**
   * 格式化输出
   */
  _format(content) {
    return content
      .replace(/\n\s*\n/g, '\n') // 移除多余空行
      .trim() // 移除首尾空格
      .replace(/\s+/g, ' ') // 合并多个空格
      .replace(/\s*([.,!?])\s*/g, '$1 ') // 格式化标点符号
      .trim();
  }
}

module.exports = Compiler;
