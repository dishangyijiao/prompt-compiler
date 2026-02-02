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

    content = this._replaceVariables(content, variables);
    content = this._renderConditions(content, variables);
    content = this._renderLoops(content, variables);

    const formatOutput = options.format !== false;
    content = this._format(content, formatOutput);

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
   * Condition rendering: {{#if var}}...{{else}}...{{/if}}
   */
  _renderConditions(content, variables) {
    return content.replace(
      /{{#if\s+(\w+)\s*}}([\s\S]*?){{\/if}}/g,
      (match, condition, body) => {
        const truthy = Boolean(variables[condition]);
        const elseIndex = body.indexOf('{{else}}');
        if (elseIndex === -1) {
          return truthy ? body : '';
        }
        const ifPart = body.slice(0, elseIndex).trim();
        const elsePart = body.slice(elseIndex + 8).trim();
        return truthy ? ifPart : elsePart;
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
   * Format output: trim and collapse excessive whitespace while preserving newlines
   * @param {string} content - Raw compiled content
   * @param {boolean} [enabled=true] - If false, only trim; do not collapse spaces
   */
  _format(content, enabled = true) {
    let out = content.trim();
    if (!enabled) {
      return out;
    }
    out = out
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .split('\n')
      .map((line) =>
        line
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\s*([.,!?])\s*/g, '$1 ')
          .trim()
      )
      .join('\n')
      .trim();
    return out;
  }
}

module.exports = Compiler;
