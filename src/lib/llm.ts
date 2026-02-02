/**
 * LLM API client for DeepSeek, Kimi, OpenAI, Anthropic, Gemini.
 * Uses OpenAI-compatible chat completions where available; Anthropic uses Messages API.
 */

const SYSTEM_PROMPT = `You are a prompt compiler. The user will give you text in any language (not necessarily English).

Do exactly two things in one response, in this exact Markdown format (no other text before or after):

## English Translation
First, translate the input into clear, natural, professional English. If the input is already in English, refine it for clarity and tone. Preserve intent; avoid literal or awkward phrasing. Output language must always be English.

## Optimized Prompt
Then, rewrite that English into a single LLM-ready prompt: instruction-style, concise, explicit, suitable for pasting into any AI tool. Do not include explanations or meta commentary in the prompt itself. Output only the prompt text under this heading.`;

export type LLMConfig = {
  provider?: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  chatPath?: string;
};

async function callOpenAICompatible(
  input: string,
  config: LLMConfig
): Promise<string> {
  const apiKey = config.apiKey.trim();
  const path = config.chatPath || "/v1/chat/completions";
  const url = config.baseUrl.replace(/\/$/, "") + path;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      throw new Error(
        "Invalid API key (401). Check that the key is correct, matches the selected provider, and has no extra spaces. Open Extension Preferences (⌘,) to fix."
      );
    }
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const content = data.choices?.[0]?.message?.content;
  if (content == null || content === "") {
    throw new Error("Empty response from model");
  }

  return content.trim();
}

async function callAnthropic(input: string, config: LLMConfig): Promise<string> {
  const apiKey = config.apiKey.trim();
  const url = "https://api.anthropic.com/v1/messages";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      throw new Error(
        "Invalid API key (401). Check that the key is correct and matches Anthropic. Open Extension Preferences (⌘,) to fix."
      );
    }
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const textBlock = data.content?.find((b) => b.type === "text");
  const content = textBlock?.text;
  if (content == null || content === "") {
    throw new Error("Empty response from model");
  }

  return content.trim();
}

export async function compilePrompt(
  input: string,
  config: LLMConfig
): Promise<string> {
  if (!config.apiKey?.trim()) {
    throw new Error("API key is empty. Set it in Extension Preferences (⌘,).");
  }

  if (config.provider === "anthropic") {
    return callAnthropic(input, config);
  }

  return callOpenAICompatible(input, config);
}
