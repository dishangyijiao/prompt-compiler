# PR 流程说明

## 创建 PR 的步骤

### 1. 初始化项目（已完成）

```bash
# 创建仓库
gh repo create prompt-compiler --private --description "Prompt Compiler"

# 克隆仓库
git clone https://github.com/dishangyijiao/prompt-compiler.git
cd prompt-compiler

# 初始化项目结构
npm init -y

# 安装依赖
npm install yaml jest nodemon --save
```

### 2. 创建功能分支

```bash
# 创建并切换到 demo 功能分支
git checkout -b feature/demo-functionality

# 设置 git 身份
git config user.name "dishangyijiao"
git config user.email "dishangyijiao@example.com"
```

### 3. 实现功能（已完成）

已创建的核心文件：
- `src/index.js` - 主入口文件
- `src/compiler.js` - 编译引擎
- `src/prompt-store.js` - 存储管理
- `src/demo.js` - Demo 功能
- `tests/compiler.test.js` - 测试文件
- `prompts/default/hello.template` - 示例模板
- `README.md` - 项目文档
- `package.json` - 配置文件

### 4. 代码质量检查

```bash
# 运行测试
npm test

# 检查代码格式
npm run format

# 运行 Demo
npm run demo
```

### 5. 提交更改

```bash
# 添加所有文件
git add .

# 提交到本地仓库
git commit -m "feat: 实现 Prompt Compiler Demo 功能" -m "
主要功能：
- 实现了提示词编译引擎，支持变量替换、条件渲染和循环渲染
- 实现了提示词存储管理，支持文件系统存储
- 创建了完整的 Demo 功能，展示工具的使用方法
- 编写了全面的测试用例
- 提供了详细的 API 文档

解决的问题：
- 简化了 AI 提示词的创建和管理过程
- 提供了可复用的提示词模板系统
- 支持快速编译和格式化提示词内容
"
```

### 6. 推送并创建 PR

```bash
# 推送到远程仓库
git remote set-url origin https://github.com/dishangyijiao/prompt-compiler.git
git push -u origin feature/demo-functionality

# 创建 PR
gh pr create --base main --head feature/demo-functionality --title "实现 Prompt Compiler Demo 功能" --body "## 功能概述

实现了一个完整的 AI 提示词管理和编译工具，包含以下核心功能：

### 🎯 主要功能

1. **提示词编译引擎**
   - 支持模板变量替换 (`{{variable}}`)
   - 支持条件渲染 (`{{#if condition}} ... {{/if}}`)
   - 支持循环渲染 (`{{#each array}} ... {{/each}}`)

2. **提示词存储管理**
   - 文件系统存储
   - 支持文本文件和 YAML 格式
   - 自动加载和保存

3. **API 接口**
   - `compile()` - 编译提示词
   - `addTemplate()` - 添加模板
   - `getTemplate()` - 获取模板
   - `listTemplates()` - 列出所有模板

4. **导出导入功能**
   - 支持 JSON 和 YAML 格式导出

### 📦 项目架构

- **核心引擎**：JavaScript ES6+
- **模板解析**：自定义模板引擎
- **文件管理**：Node.js 文件系统 API
- **序列化**：支持 JSON 和 YAML
- **测试框架**：Jest

### 🚀 使用方法

```javascript
const { PromptCompiler } = require('./src');
const compiler = new PromptCompiler();

compiler.addTemplate('simple-prompt', '你好 {{name}}');
const result = compiler.compile('simple-prompt', { name: '张三' });
```

### 📊 测试覆盖

已编写完整的测试用例，覆盖：
- 初始化和基本功能
- 模板管理（添加、获取、删除）
- 编译功能（变量替换、条件渲染、循环渲染）
- 文件系统操作
- 错误处理

### 📝 文档

- `README.md` - 详细的使用说明
- `PR-Demo.md` - PR 功能说明
- `PR-Process.md` - PR 流程说明
"
```

### 7. 合并 PR

```bash
# 查看 PR 信息
gh pr view

# 检查 CI 状态
gh pr checks

# 合并 PR（需要审查通过）
gh pr merge
```

### 8. 发布版本

```bash
# 检查状态
git status

# 更新版本号
npm version 1.0.0

# 推送更新
git push origin main --tags

# 创建发布版本
gh release create v1.0.0 --title "v1.0.0 - Prompt Compiler Demo" --notes "
## 功能特性

- 实现了提示词编译引擎
- 支持变量替换、条件渲染、循环渲染
- 支持文件系统存储
- 提供了完整的 Demo 功能
- 包含详细的 API 文档
"
```

## 自动化流程建议

### GitHub Actions 配置

创建 `.github/workflows/ci.yml`：

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, feature/*]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm install
    - run: npm test
```

### 代码质量工具

```json
// .eslintrc.js
{
  "extends": ["eslint:recommended"],
  "env": { "node": true, "jest": true },
  "parserOptions": { "ecmaVersion": "latest" }
}
```

## 监控和维护

```bash
# 查看 PR 状态
gh pr list

# 查看合并历史
git log --oneline

# 检查分支
git branch -a
```
