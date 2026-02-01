# PR: 实现 Prompt Compiler Demo 功能

## 概述

这是一个为 `prompt-compiler` 仓库创建的 PR，实现了一个完整的 AI 提示词管理和编译工具的基础功能。

## 功能特性

### 🎯 核心功能

1. **提示词编译引擎**
   - 支持模板变量替换 (`{{variable}}`)
   - 支持条件渲染 (`{{#if condition}} ... {{/if}}`)
   - 支持循环渲染 (`{{#each array}} ... {{/each}}`)
   - 智能格式化输出

2. **提示词存储管理**
   - 文件系统存储
   - 支持文本文件和 YAML 格式
   - 目录结构管理
   - 自动加载和保存

3. **API 接口**
   - `compile()` - 编译提示词
   - `addTemplate()` - 添加模板
   - `getTemplate()` - 获取模板
   - `listTemplates()` - 列出所有模板
   - `removeTemplate()` - 删除模板
   - `save()` - 保存到文件

4. **导出导入功能**
   - 支持 JSON 格式导出
   - 支持 YAML 格式导出
   - 导入功能

### 📦 项目结构

```
prompt-compiler/
├── src/
│   ├── index.js          # 主入口文件
│   ├── compiler.js       # 编译引擎
│   ├── prompt-store.js   # 存储管理
│   └── demo.js          # Demo 功能
├── prompts/             # 提示词存储目录
├── tests/               # 测试文件
└── README.md            # 项目文档
```

### 🚀 快速开始

#### 安装依赖

```bash
npm install
```

#### 运行 Demo

```bash
npm run demo
```

#### 运行测试

```bash
npm test
```

### 📝 使用示例

#### 简单变量替换

```javascript
const { PromptCompiler } = require('./src');
const compiler = new PromptCompiler();

compiler.addTemplate('simple-prompt', `
你好 {{name}}，

今天我们来讨论关于 {{topic}} 的话题。
`);

const result = compiler.compile('simple-prompt', {
  name: '张三',
  topic: '人工智能'
});
```

#### 条件和循环渲染

```javascript
compiler.addTemplate('expert-prompt', `
{{#if isExpert}}
专家模式：深入分析 {{topic}}
{{else}}
基础模式：介绍 {{topic}}
{{/if}}

{{#each points}}
- {{this}}
{{/each}}
`);

const result = compiler.compile('expert-prompt', {
  isExpert: true,
  topic: '机器学习',
  points: ['监督学习', '无监督学习', '强化学习']
});
```

### 📊 技术架构

- **核心引擎**：JavaScript ES6+
- **模板解析**：自定义模板引擎
- **文件管理**：Node.js 文件系统 API
- **序列化**：支持 JSON 和 YAML
- **测试框架**：Jest
- **开发工具**：ESLint, Prettier

### 🎨 设计原则

1. **简单易用**：API 设计直观，学习成本低
2. **可扩展性**：支持插件和自定义格式
3. **高性能**：内存中处理，速度快
4. **可靠性**：完整的测试覆盖
5. **安全性**：本地处理，无需网络请求

### 🚧 未来计划

1. **UI 界面**：添加图形用户界面
2. **远程仓库**：支持同步到云端存储
3. **协作功能**：多人协作管理
4. **AI 优化**：添加自动优化功能
5. **API 服务**：提供 RESTful API

### 📄 许可证

MIT License
