# Prompt Compiler

A tool to compile and manage AI prompt templates with variables, conditionals, and loops. Create, organize, and reuse prompt templates efficiently.

## Features

- **Template compilation** – Variable substitution, conditionals (`{{#if}}` / `{{else}}`), and loops (`{{#each}}`)
- **Category management** – Organize templates by category (directory-based)
- **File-based storage** – Load from `.template`, `.txt`, `.md`, or YAML files
- **Export / import** – JSON and YAML for backup or sharing
- **API** – Use programmatically in Node.js

## Quick Start

### Install

```bash
npm install
```

### Run demo

```bash
npm run demo
```

### Basic usage

```javascript
const PromptCompiler = require('prompt-compiler');

const compiler = new PromptCompiler();

compiler.addTemplate('greeting', 'Hello {{name}}, welcome to {{topic}}!');

const result = compiler.compile('greeting', {
  name: 'Alice',
  topic: 'AI',
});

console.log(result);
// "Hello Alice, welcome to AI!"
```

## Project structure

```
prompt-compiler/
├── index.js              # Package entry (re-exports src)
├── src/
│   ├── index.js         # PromptCompiler class
│   ├── compiler.js      # Template compilation engine
│   ├── prompt-store.js  # Template storage and file I/O
│   └── demo.js          # Demo script
├── prompts/             # Default template directory
│   └── default/
├── tests/
├── scripts/
│   └── build.js         # Cross-platform build
└── README.md
```

## API

### `PromptCompiler` class

#### `constructor(config?)`

- `config.promptsDir` – Base directory for templates (default: `'./prompts'`)
- `config.defaultLocale` – Default locale (default: `'default'`)

#### `compile(templateName, variables?, options?)`

Compiles a template by name with the given variables.

- **templateName** (string) – Template name
- **variables** (object) – Key-value pairs for `{{name}}` substitution
- **options** (object) – e.g. `{ format: false }` to skip output formatting (preserve newlines)

Returns the compiled string. Throws if the template is not found.

#### `addTemplate(name, content, metadata?)`

Registers a template in memory. Use `save()` to persist to disk.

- **name** (string)
- **content** (string) – Template body with `{{var}}`, `{{#if}}`, `{{#each}}`, etc.
- **metadata** (object) – Optional `category`, `type`, etc.

#### `getTemplate(name)`

Returns the template object `{ name, category, content, type, metadata, ... }` or `undefined`.

#### `listTemplates()`

Returns an **array of template objects** (not just names).

#### `removeTemplate(name)`

Removes a template from the store.

#### `save()`

Writes all in-memory templates to the file system under `promptsDir`.

#### `export(format?)`

Exports all templates as a string. **format**: `'json'` (default) or `'yaml'`.

#### `import(data, format?)`

Imports templates from a string. **format**: `'json'` (default) or `'yaml'`.

---

### Template syntax

- **Variables**: `{{name}}` – replaced by `variables.name`
- **Conditionals**: `{{#if var}}...{{else}}...{{/if}}` – branch by truthiness of `variables.var`
- **Loops**: `{{#each key}}...{{this}}...{{/each}}` – `variables.key` must be an array; `{{this}}` is the current item

## Development

### Tests

```bash
npm test
```

### Lint and format

```bash
npm run lint
npm run format
```

### Build

```bash
npm run build
```

Produces a `dist/` folder with `index.js`, `src/`, and `package.json` for distribution.

## License

MIT

---

**Note:** `raycast-env.d.ts` is for optional Raycast extension integration and is gitignored in the default setup. Omit it from `.gitignore` if you use this repo as a Raycast extension.
