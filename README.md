# Prompt Compiler

一个用于编译和管理 AI 提示词的工具，让您可以更高效地创建、组织和重用提示词模板。

## 🌟 功能特点

- 📝 **提示词编译**：支持模板变量和条件渲染
- 🔄 **版本管理**：跟踪提示词的历史版本
- 📊 **分类管理**：按场景和功能分类组织提示词
- 🚀 **快速调用**：通过 API 或 CLI 快速访问提示词
- 📦 **导出功能**：支持多种格式的导出（JSON, YAML, Markdown）

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行 Demo

```bash
npm run demo
```

### 基本使用

```javascript
const { PromptCompiler } = require('./src');

// 创建编译器实例
const compiler = new PromptCompiler();

// 编译提示词
const result = compiler.compile('simple-prompt', {
  name: '张三',
  topic: '人工智能'
});

console.log(result);
```

## 📁 项目结构

```
prompt-compiler/
├── src/
│   ├── index.js          # 主入口文件
│   ├── compiler.js       # 编译器核心逻辑
│   ├── prompt-store.js   # 提示词存储
│   └── demo.js          # Demo 功能
├── prompts/             # 提示词目录
│   └── default/         # 默认提示词库
├── tests/               # 测试文件
└── README.md            # 项目文档
```

## 📖 API 文档

### PromptCompiler 类

#### `compile(templateName, variables)`

编译指定名称的提示词模板，替换变量。

**参数：**
- `templateName` (String): 提示词模板名称
- `variables` (Object): 变量对象

**返回：**
- `String`: 编译后的提示词

#### `addTemplate(name, template)`

添加新的提示词模板。

#### `getTemplate(name)`

获取提示词模板内容。

## 🎯 使用场景

### 1. 快速创建提示词

```javascript
compiler.addTemplate('simple-prompt', `
你好 {{name}}，

今天我们来讨论关于 {{topic}} 的话题。

请分享你的见解！
`);
```

### 2. 复杂逻辑支持

```javascript
compiler.addTemplate('advanced-prompt', `
{{#if isExpert}}
专家模式：深入分析 {{topic}}
{{else}}
基础模式：介绍 {{topic}}
{{/if}}

{{#each points}}
- {{this}}
{{/each}}
`);
```

## 🔧 开发

### 运行测试

```bash
npm test
```

### 代码格式

```bash
npm run format
```

## 📄 许可证

MIT License
