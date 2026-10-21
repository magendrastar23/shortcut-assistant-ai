import { catalogue } from "../src/lib/intent-catalogue";

type ExpectedKind = "match" | "clarify" | "none";
type Case = {
  id: number;
  request: string;
  expectedKind: ExpectedKind;
  expectedDestinationId?: string;
  category: "core" | "unsupported-safety";
};

const cases: Case[] = [
  { id: 1, request: "I want to manage app permissions", expectedKind: "match", expectedDestinationId: "permissions", category: "core" },
  { id: 2, request: "Turn on Wi-Fi", expectedKind: "match", expectedDestinationId: "wifi", category: "core" },
  { id: 3, request: "I want to connect to Bluetooth", expectedKind: "match", expectedDestinationId: "bluetooth", category: "core" },
  { id: 4, request: "Stop apps from sending notifications", expectedKind: "match", expectedDestinationId: "notifications", category: "core" },
  { id: 5, request: "Show me battery settings", expectedKind: "match", expectedDestinationId: "battery", category: "core" },
  { id: 6, request: "I want to change my screen brightness", expectedKind: "match", expectedDestinationId: "display", category: "core" },
  { id: 7, request: "I want to change my phone wallpaper", expectedKind: "match", expectedDestinationId: "wallpaper", category: "core" },
  { id: 8, request: "I want to manage my installed apps", expectedKind: "match", expectedDestinationId: "apps", category: "core" },
  { id: 9, request: "I want to control mobile data", expectedKind: "match", expectedDestinationId: "mobile-data", category: "core" },
  { id: 10, request: "I want to change my phone language", expectedKind: "match", expectedDestinationId: "language", category: "core" },
  { id: 11, request: "I want to manage location access", expectedKind: "match", expectedDestinationId: "location", category: "core" },
  { id: 12, request: "Make my phone silent", expectedKind: "match", expectedDestinationId: "sound", category: "core" },
  { id: 13, request: "I want to change my password", expectedKind: "match", expectedDestinationId: "security", category: "core" },
  { id: 14, request: "Help me manage my phone", expectedKind: "clarify", category: "core" },
  { id: 15, request: "My phone isn't working properly", expectedKind: "clarify", category: "core" },
  { id: 16, request: "Open Instagram", expectedKind: "none", category: "unsupported-safety" },
  { id: 17, request: "Find a nearby restaurant", expectedKind: "none", category: "unsupported-safety" },
  { id: 18, request: "Play a song", expectedKind: "none", category: "unsupported-safety" },
];

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

if (!apiKey) {
  console.error("OPENAI_API_KEY is not configured. No live LLM evaluation was run.");
  process.exit(2);
}

const approved = catalogue.map((entry) => ({
  id: entry.id,
  intent: entry.intent,
  destination: entry.name,
}));

function extractText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  if (typeof response.output_text === "string") return payload.output_text;
  for (const item of response.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string" && content.text.trim()) return content.text;
    }
  }
  return "";
}

async function classify(request: string) {
  const instructions = [
    "You classify a user's Android settings intent.",
    "Return JSON only.",
    "You may only choose destinationId values from the approved catalogue.",
    "If the request is broad or ambiguous, return {\"kind\":\"clarify\"}.",
    "If it is unsupported, return {\"kind\":\"none\"}.",
    "For a clear supported request, return {\"kind\":\"match\",\"destinationId\":\"<approved id>\"}.",
    `Approved catalogue: ${JSON.stringify(approved)}`,
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

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const text = extractText(await response.json())
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const parsed = JSON.parse(text) as { kind?: unknown; destinationId?: unknown };
  if (parsed.kind === "clarify" || parsed.kind === "none") {
    return { kind: parsed.kind };
  }
  if (
    parsed.kind === "match" &&
    typeof parsed.destinationId === "string" &&
    approved.some((entry) => entry.id === parsed.destinationId)
  ) {
    return { kind: "match", destinationId: parsed.destinationId };
  }
  throw new Error("Invalid model response or destination outside the approved catalogue");
}

let passed = 0;
const rows: Array<Record<string, string | number | boolean>> = [];

for (const test of cases) {
  const started = Date.now();
  try {
    const actual = await classify(test.request);
    const durationMs = Date.now() - started;

    const pass =
      actual.kind === test.expectedKind &&
      (test.expectedKind !== "match" || actual.destinationId === test.expectedDestinationId);

    if (pass) passed += 1;

    rows.push({
      id: test.id,
      request: test.request,
      expected: test.expectedDestinationId ?? test.expectedKind,
      actual: actual.destinationId ?? actual.kind,
      pass,
      durationMs,
    });
  } catch (error) {
    rows.push({
      id: test.id,
      request: test.request,
      expected: test.expectedDestinationId ?? test.expectedKind,
      actual: error instanceof Error ? error.message : "Unknown error",
      pass: false,
      durationMs: Date.now() - started,
    });
  }
}

console.table(rows);
console.log(`Passed ${passed}/${cases.length} scenarios (${((passed / cases.length) * 100).toFixed(1)}%).`);

if (passed !== cases.length) process.exitCode = 1;
