# Prompt Compiler — Areas for Improvement

This document lists improvements identified in the current open-source project. Items are grouped by area and ordered by impact.

---

## 1. Critical bugs

### 1.1 Demo is broken: `export` / `import` not exposed on `PromptCompiler`

- **Where:** `src/demo.js` line 84 calls `compiler.export('yaml')`, but `PromptCompiler` (in `src/index.js`) does not define `export` or `import`.
- **Impact:** `npm run demo` throws `TypeError: compiler.export is not a function`.
- **Fix:** Either expose `export` and `import` on `PromptCompiler` by delegating to `this.store.export()` / `this.store.import()`, or change the demo to use the store directly (e.g. for testing only).

### 1.2 Wrong `main` entry in `package.json`

- **Where:** `package.json` has `"main": "index.js"`. There is no `index.js` at the project root; the entry point is `src/index.js`.
- **Impact:** `require('prompt-compiler')` (or installing the package and importing it) fails.
- **Fix:** Set `"main": "src/index.js"` (or point to a built file such as `dist/index.js` if you add a proper build step).

### 1.3 `start` and `dev` scripts point to non-existent file

- **Where:** `"start": "node index.js"` and `"dev": "nodemon index.js"` reference root `index.js`, which does not exist.
- **Impact:** `npm start` and `npm run dev` fail.
- **Fix:** Point to the real entry (e.g. `"start": "node src/index.js"`, `"dev": "nodemon src/index.js"`) or to a CLI script if you add one.

---

## 2. Documentation and i18n

### 2.1 README and project description in Chinese only

- **Where:** `README.md` and `package.json` description are fully in Chinese.
- **Impact:** Harder for international contributors and users to understand and adopt the project.
- **Improvement:** Provide an English README (or bilingual: English first, Chinese second). Add an English `description` in `package.json` (e.g. short one-liner for npm/store).

### 2.2 README API docs don’t match implementation

- **Where:** README says “列出所有可用的模板” and describes `listTemplates()` as returning a list; JSDoc in `src/index.js` says `@returns {Array}` “模板名称列表”.
- **Reality:** `listTemplates()` returns an array of **template objects** (with `name`, `category`, `content`, etc.), not an array of names.
- **Improvement:** Update README and JSDoc to describe the actual return type (array of template objects). If you want a “names only” API, add something like `listTemplateNames()` and document it.

### 2.3 README references missing script

- **Where:** README “代码格式” section suggests `npm run format`.
- **Reality:** `package.json` has no `format` script.
- **Improvement:** Add a `format` script (e.g. Prettier) and optionally document it, or remove the section.

---

## 3. Code quality and API design

### 3.1 Compiler: `_format()` can mangle content

- **Where:** `src/compiler.js` `_format()` replaces `\n\s*\n` with `\n`, then `\s+` with a single space, then trims.
- **Impact:** Multiple newlines and intentional line breaks can be collapsed; punctuation spacing (e.g. “word. Next”) can change. May be too aggressive for general use.
- **Improvement:** Make formatting optional (e.g. `options.format: boolean`), or restrict to minimal cleanup (e.g. trim only), or document the current behavior as “aggressive formatting”.

### 3.2 Compiler: Loop body only supports `{{this}}`

- **Where:** `_renderLoops` only replaces `{{this}}` with the current item. No support for `{{name}}`, `{{id}}`, etc. when the item is an object.
- **Impact:** Users cannot use `{{#each users}}{{name}}{{/each}}`; they must use `{{this}}` for primitives or extend the engine.
- **Improvement:** Support object items by exposing the current item as variables (e.g. `{{this}}` and/or `{{name}}`, `{{id}}` when item is `{ name, id }`), and document the behavior.

### 3.3 Compiler: Order of operations and variable scope

- **Where:** `_replaceVariables` runs before `_renderConditions` and `_renderLoops`. So inside `{{#each items}}...{{/each}}`, any `{{variable}}` is already replaced by the top-level `variables` and cannot refer to the current item.
- **Improvement:** Document this (e.g. “only `{{this}}` is available inside `{{#each}}`”). If you add object support in loops (3.2), ensure loop-body variables are resolved in the right order.

### 3.4 No input validation

- **Where:** `compile(templateName, variables)`, `getTemplate(name)`, `addTemplate(name, template, metadata)` etc. do not validate types or empty strings.
- **Impact:** Empty `templateName` or invalid `variables` can lead to confusing errors or inconsistent behavior.
- **Improvement:** Add minimal checks (e.g. non-empty string for template names, `variables` is an object when used) and throw clear errors.

---

## 4. Storage and file system

### 4.1 Template name / path safety

- **Where:** Template names and categories are used to build file paths (e.g. `prompts/${category}/${name}.template`) without sanitization.
- **Impact:** Names or categories containing `..` or `/` could lead to path traversal; odd characters might cause issues on some filesystems.
- **Improvement:** Validate or sanitize `name` and `category` (e.g. reject `..` and path separators, or allow only safe characters).

### 4.2 Synchronous file I/O only

- **Where:** `prompt-store.js` uses `fs.readFileSync`, `fs.writeFileSync`, `fs.readdirSync`, etc.
- **Impact:** Can block the event loop when there are many or large files.
- **Improvement:** Consider async APIs (`fs.promises` or `fs.readFile`/`writeFile`/`readdir` with callbacks) and expose async methods (e.g. `loadAsync()`, `saveAsync()`), or document that the API is synchronous and intended for small datasets.

### 4.3 `PromptStore.save()` overwrites only by category + name

- **Where:** Save writes `template.name` and `template.category` to the file system. In-memory templates added via `addTemplate` get `category: 'general'` by default.
- **Impact:** Multiple in-memory templates in `general` all go to `prompts/general/`; behavior is consistent but worth documenting. No overwrite protection (e.g. timestamps) is mentioned.
- **Improvement:** Document that `save()` overwrites files by category + name. Optionally add a “dry run” or “backup” option for safety.

---

## 5. Tests

### 5.1 Test descriptions and comments in Chinese

- **Where:** `tests/compiler.test.js` uses Chinese for `describe`/`test` strings and comments.
- **Improvement:** Use English for test descriptions and comments to align with an international open-source setup and with the rest of the improvement list.

### 5.2 No tests for `export` / `import`

- **Where:** `PromptStore` has `export(format)` and `import(data, format)` but there are no unit tests for them (and they are not exposed on `PromptCompiler`).
- **Improvement:** Add tests for `export`/`import` (on the store). After exposing them on `PromptCompiler`, add integration tests that use the public API.

### 5.3 File system tests use a real directory

- **Where:** Tests use `./test-prompts` (in `.gitignore`). They create real files and depend on `PromptCompiler` loading from that directory.
- **Impact:** Tests can leave artifacts; parallel or repeated runs could interfere; CI might need to ensure the directory is clean.
- **Improvement:** Use a temporary directory (e.g. `os.tmpdir()` or `jest` temp dir) in `beforeEach`/`afterEach`, or isolate tests so that `test-prompts` is cleared before/after.

---

## 6. Project structure and config

### 6.1 No LICENSE file

- **Where:** `package.json` has `"license": "MIT"` but there is no `LICENSE` file in the repo.
- **Impact:** Downstream users and automated tools expect a LICENSE file for clear legal use.
- **Improvement:** Add a root `LICENSE` file with the MIT text.

### 6.2 Leftover / inconsistent files

- **Where:** `raycast-env.d.ts` exists in the repo; the project is Node.js (no TypeScript or Raycast in `package.json`).
- **Improvement:** Remove `raycast-env.d.ts` if Raycast is not used, or add a short comment explaining why it’s there (e.g. for a separate Raycast extension that depends on this package).

### 6.3 Build script is minimal

- **Where:** `"build": "mkdir -p dist && cp -r src dist/ && cp package.json dist/"` only copies files; no bundling, no `main` adjustment for `dist`.
- **Impact:** After `npm run build`, `main` still points to `index.js` (root), so the built package is not usable as-is.
- **Improvement:** Either (a) set `main` to `src/index.js` and treat “build” as optional, or (b) make build output to `dist/` and set `"main": "dist/index.js"` (and use build to produce `dist/index.js` from `src/index.js`).

### 6.4 Missing common npm metadata

- **Where:** No `repository`, `bugs`, `homepage`, or `engines` in `package.json`.
- **Improvement:** Add at least `repository` (and preferably `bugs`, `homepage`). Optionally add `engines` (e.g. `"node": ">=14"`) to document supported Node versions.

---

## 7. Dependencies and tooling

### 7.1 No ESLint or Prettier

- **Where:** README mentions “代码格式” and implies a format script; the project has no ESLint or Prettier config or scripts.
- **Improvement:** Add `eslint` and `prettier` as devDependencies, add config files, and add scripts (e.g. `lint`, `format`) so contributors get consistent style.

### 7.2 Dependency versioning

- **Where:** Dependencies use caret ranges (e.g. `"yaml": "^2.3.4"`).
- **Improvement:** For reproducible installs, consider `package-lock.json` (you may already have it) and optionally document that contributors should use `npm ci`. No change strictly required if lockfile is committed.

---

## 8. Demo and examples

### 8.1 Demo writes outside a dedicated temp area

- **Where:** Demo creates `prompts/demo-export/` and writes `prompts.yaml` there.
- **Improvement:** Add `prompts/demo-export/` (or `test-prompts/`) to `.gitignore` if you don’t want to commit generated files, or document that the demo writes there.

### 8.2 No CLI

- **Where:** The library is used programmatically or via `demo.js`; there is no official CLI (e.g. `prompt-compiler compile hello --name=World`).
- **Improvement:** Optional: add a small CLI (e.g. in `bin/` or `src/cli.js`) and expose it via `package.json` `bin` for easier try-out and scripting.

---

## Summary table

| Priority   | Area              | Item                                                                 |
|-----------|-------------------|----------------------------------------------------------------------|
| Critical  | Bug               | Expose `export`/`import` on `PromptCompiler` or fix demo            |
| Critical  | Config            | Fix `main` in `package.json` (e.g. `src/index.js`)                  |
| Critical  | Config            | Fix `start` and `dev` scripts to use real entry file                |
| High      | Docs              | English README and package description                              |
| High      | Docs              | Align README/JSDoc with actual API (e.g. `listTemplates` return type) |
| High      | Code              | Optional formatting and/or document `_format()` behavior              |
| Medium    | Code              | Input validation for template names and variables                    |
| Medium    | Security          | Sanitize template names/categories used in file paths               |
| Medium    | Tests             | Add tests for export/import; use English; isolate file system       |
| Medium    | Project           | Add LICENSE file; remove or explain `raycast-env.d.ts`               |
| Low       | Project           | Add repository/homepage/bugs; optional ESLint/Prettier and CLI        |

If you want, the next step can be implementing the critical and high-priority items (e.g. fix `main`/scripts, expose `export`/`import`, and update README/description to English).
