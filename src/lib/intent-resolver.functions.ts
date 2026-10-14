import { createServerFn } from "@tanstack/react-start";

import { catalogue, matchIntent, type MatchResult } from "./intent-catalogue";

type LlmDecision =
  | { kind: "match"; destinationId: string }
  | { kind: "clarify" }
  | { kind: "none" };

export type IntentResolution = {
  result: MatchResult;
  source: "llm" | "local_fallback";
};

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  if (typeof response.output_text === "string") return response.output_text;

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) {
        return content.text;
      }
    }
  }

  return "";
}

export function parseLlmDecision(text: string): LlmDecision | null {
  const cleaned = text
    .trim()
    .replace(/^\`\`\`(?:json)?/i, "")
    .replace(/\`\`\`$/, "")
    .trim();

  try {
    const value = JSON.parse(cleaned) as Partial<LlmDecision>;
    if (value.kind === "clarify" || value.kind === "none") return { kind: value.kind };
    if (
      value.kind === "match" &&
      typeof value.destinationId === "string" &&
      catalogue.some((entry) => entry.id === value.destinationId)
    ) {
      return { kind: "match", destinationId: value.destinationId };
    }
  } catch {
    return null;
  }

  return null;
}

async function resolveWithOpenAI(request: string): Promise<MatchResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const destinations = catalogue.map((entry) => ({
    id: entry.id,
    intent: entry.intent,
    destination: entry.name,
  }));

  const instructions = [
    "You classify a user's Android settings intent.",
    "Return JSON only.",
    "You may only choose destinationId values from the approved catalogue.",
    "If the request is broad or ambiguous, return {\"kind\":\"clarify\"}.",
    "If it is unsupported, return {\"kind\":\"none\"}.",
    "For a clear supported request, return {\"kind\":\"match\",\"destinationId\":\"<approved id>\"}.",
    `Approved catalogue: ${JSON.stringify(destinations)}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: request,
      max_output_tokens: 80,
    }),
  });

  if (!response.ok) return null;

  const text = extractResponseText(await response.json());
  const decision = parseLlmDecision(text);
  if (!decision) return null;

  if (decision.kind === "clarify") return { kind: "clarify" };
  if (decision.kind === "none") return { kind: "none" };

  const entry = catalogue.find((item) => item.id === decision.destinationId);
  return entry ? { kind: "match", entry } : null;
}

export const interpretIntent = createServerFn({ method: "POST" })
  .validator((data: { request: string }) => ({
    request: data.request.trim().slice(0, 500),
  }))
  .handler(async ({ data }): Promise<IntentResolution> => {
    try {
      const llmResult = await resolveWithOpenAI(data.request);
      if (llmResult) return { result: llmResult, source: "llm" };
    } catch (error) {
      console.error("LLM intent resolution failed; using local fallback.", error);
    }

    return { result: matchIntent(data.request), source: "local_fallback" };
  });
