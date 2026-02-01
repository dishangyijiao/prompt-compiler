#!/usr/bin/env node
/**
 * Prompt Compiler - Demo 功能
 * 演示工具的基本使用方法
 */

const PromptCompiler = require('./index');
const fs = require('fs');
const path = require('path');

console.log('🎯 Prompt Compiler - Demo');
console.log('=' . repeat(50));

// 创建编译器实例
const compiler = new PromptCompiler({
  promptsDir: './prompts'
});

// 添加一些示例提示词
console.log('\n📝 添加示例提示词...');

compiler.addTemplate('simple-prompt', `
你好 {{name}}，

今天我们来讨论关于 {{topic}} 的话题。

请分享你的见解！
`);

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

// 显示可用模板
console.log('\n📋 可用提示词模板：');
compiler.listTemplates().forEach(template => {
  console.log(`  - ${template.name} (${template.category})`);
});

// 编译示例
console.log('\n🔄 编译示例：');

// 示例1：简单变量替换
console.log('  1. 简单变量替换：');
const result1 = compiler.compile('simple-prompt', {
  name: '张三',
  topic: '人工智能'
});
console.log(result1);

console.log('-' . repeat(50));

// 示例2：条件和循环渲染
console.log('  2. 条件和循环渲染：');
const result2 = compiler.compile('expert-prompt', {
  isExpert: true,
  topic: '机器学习',
  points: ['监督学习', '无监督学习', '强化学习']
});
console.log(result2);

console.log('-' . repeat(50));

// 保存到文件系统
console.log('\n💾 保存到文件系统...');
compiler.save();

// 测试加载和导出
console.log('\n📦 导出和导入测试：');

const exportPath = path.join(__dirname, '../prompts/demo-export');
if (!fs.existsSync(exportPath)) {
  fs.mkdirSync(exportPath, { recursive: true });
}

const yamlExport = compiler.export('yaml');
fs.writeFileSync(path.join(exportPath, 'prompts.yaml'), yamlExport, 'utf8');

console.log('  ✅ YAML 导出成功');
console.log('  ✅ 数据保存位置：prompts/demo-export/prompts.yaml');

// 验证导出的内容
console.log('\n📄 导出的内容预览：');
console.log(yamlExport.substring(0, 200) + '...');

console.log('\n' + '=' . repeat(50));
console.log('🎉 Demo 完成！');
console.log('\n📚 下一步操作：');
console.log('   1. 查看 prompts/ 目录下的文件');
console.log('   2. 编辑 package.json 配置');
console.log('   3. 创建更多提示词模板');
console.log('   4. 运行测试：npm test');
