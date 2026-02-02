# Raycast Extension Publication Checklist — Prompt Compiler

Use this list before submitting to the Raycast Store. Items marked **[DONE]** are already in place; complete the rest.

---

## 1. Extension icon (required)

- **[ ] Replace placeholder icon**  
  Current `assets/icon.png` is 1×1 px. Raycast requires **512×512 px PNG** that looks good in light and dark themes.  
  - Use [Raycast icon generator](https://icon.ray.so/) or the [Figma icon template](https://www.figma.com/community/file/1030764827259035122/Extensions-Icon-Template).  
  - Extensions using the default Raycast icon are rejected.

---

## 2. Screenshots (recommended)

- **[ ] Add 3–6 Store screenshots**  
  - Size: **2000×1250 px**, aspect ratio **16:10**, format **PNG**.  
  - In Raycast: set **Window Capture** hotkey in Advanced Preferences (e.g. ⌘⇧⌥+M).  
  - Open the **Compile Prompt** command, press the hotkey, tick **Save to Metadata**.  
  - Use a consistent background with good contrast; no sensitive data.  
  - See [Prepare an Extension for Store — Screenshots](https://developers.raycast.com/basics/prepare-an-extension-for-store#screenshots).

---

## 3. Metadata and configuration

- **[DONE]** `package.json`: `author` set (ensure **dishangyijiao** is your Raycast account username).  
- **[DONE]** `license`: `"MIT"`.  
- **[DONE]** `keywords` and command `keywords` added for discoverability.  
- **[DONE]** `platforms`: `["macOS"]`.  
- **[DONE]** `categories`: e.g. Productivity, Developer Tools.  
- **[DONE]** `package-lock.json` present; use `npm` (no yarn/pnpm for publish).  
- **[ ] Third-party terms**: Confirm your use of DeepSeek, Kimi, OpenAI, Anthropic, and Gemini complies with each provider’s terms of service and API usage policies.

---

## 4. Version history

- **[DONE]** `CHANGELOG.md` in project root with format `## [Title] - {PR_MERGE_DATE}` and bullet points.  
- **[ ]** For future releases: add new entries at the top; keep title in square brackets and use `{PR_MERGE_DATE}` or YYYY-MM-DD.

---

## 5. Build and lint

- **[ ] Run distribution build**: `npm run build` — must complete without errors (run locally in your extension directory).  
- **[ ] Run lint**: `npm run lint` (and `npm run fix-lint` if needed).  
- **[ ]** Open the built extension in Raycast and test: form → compile → result → clipboard and “Compile Another”; test invalid API key and “Open Extension Preferences.”

---

## 6. README and media

- **[DONE]** README describes setup, providers, API key, and optional model.  
- **[DONE]** `media/` folder present; use it for any images linked from README. Store screenshots are added via Window Capture + “Save to Metadata,” not necessarily as files in `media/`.

---

## 7. Publish

- **[ ]** Run `npm run publish` when ready (opens a PR in `raycast/extensions`).  
- **[ ]** If you have upstream changes, run `npx @raycast/api@latest pull-contributions` first.  
- **[ ]** After merge, extension goes live in the [Raycast Store](https://raycast.com/store). Share via Manage Extensions → select extension → ⌘⌥. to copy link.

---

## Quick reference

| Item              | Status / Action                                      |
|-------------------|------------------------------------------------------|
| Icon 512×512 PNG  | Replace current 1×1 placeholder                      |
| Screenshots       | 3–6 × 2000×1250 PNG via Window Capture + Metadata   |
| Author            | Must match Raycast username                         |
| CHANGELOG.md      | Present; use `{PR_MERGE_DATE}` for release date    |
| npm run build     | Run and fix any errors before submitting            |
| Third-party ToS   | Confirm compliance for all LLM providers            |
