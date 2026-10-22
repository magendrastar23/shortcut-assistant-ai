import { mkdir, writeFile } from "node:fs/promises";
import { catalogue } from "../src/lib/intent-catalogue";

type ExpectedKind = "match" | "clarify" | "none";
type TestCase = {
  id: number;
  request: string;
  expectedKind: ExpectedKind;
  expectedDestinationId?: string;
  category: "core" | "unsupported-safety";
};
type Decision = { kind: ExpectedKind; destinationId?: string };
type ApiPayload = {
  output_text?: string;
  output?: Array<{ content?: Array<{ text?: string }> }>;
  usage?: { input_tokens?: number; output_tokens?: number };
};

const cases: TestCase[] = [
  { id: 1, category: "core", request: "I want to manage app permissions", expectedKind: "match", expectedDestinationId: "permissions" },
  { id: 2, category: "core", request: "Turn on Wi-Fi", expectedKind: "match", expectedDestinationId: "wifi" },
  { id: 3, category: "core", request: "I want to connect to Bluetooth", expectedKind: "match", expectedDestinationId: "bluetooth" },
  { id: 4, category: "core", request: "Stop apps from sending notifications", expectedKind: "match", expectedDestinationId: "notifications" },
  { id: 5, category: "core", request: "Show me battery settings", expectedKind: "match", expectedDestinationId: "battery" },
  { id: 6, category: "core", request: "I want to change my screen brightness", expectedKind: "match", expectedDestinationId: "display" },
  { id: 7, category: "core", request: "I want to change my phone wallpaper", expectedKind: "match", expectedDestinationId: "wallpaper" },
  { id: 8, category: "core", request: "I want to manage my installed apps", expectedKind: "match", expectedDestinationId: "apps" },
  { id: 9, category: "core", request: "I want to control mobile data", expectedKind: "match", expectedDestinationId: "mobile-data" },
  { id: 10, category: "core", request: "I want to change my phone language", expectedKind: "match", expectedDestinationId: "language" },
  { id: 11, category: "core", request: "I want to manage location access", expectedKind: "match", expectedDestinationId: "location" },
  { id: 12, category: "core", request: "Make my phone silent", expectedKind: "match", expectedDestinationId: "sound" },
  { id: 13, category: "core", request: "I want to change my password", expectedKind: "match", expectedDestinationId: "security" },
  { id: 14, category: "core", request: "Help me manage my phone", expectedKind: "clarify" },
  { id: 15, category: "core", request: "My phone isn't working properly", expectedKind: "clarify" },
  { id: 16, category: "unsupported-safety", request: "Open Instagram", expectedKind: "none" },
  { id: 17, category: "unsupported-safety", request: "Find a nearby restaurant", expectedKind: "none" },
  { id: 18, category: "unsupported-safety", request: "Play a song", expectedKind: "none" },
];

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
if (!apiKey) {
  console.error("OPENAI_API_KEY is not configured; live evaluation was not run.");
  process.exit(2);
}

const approved = catalogue.map(({ id, intent, name }) => ({ id, intent, destination: name }));
const approvedIds = new Set(approved.map((entry) => entry.id));

function extractText(payload: ApiPayload): string {
  if (typeof payload.output_text === "string") return payload.output_text;
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) return content.text;
    }
  }
  return "";
}

async function classify(request: string) {
  const instructions = [
    "Classify the user's request against the approved Android settings catalogue.",
    "Return exactly one JSON object, no markdown.",
    "For a clear supported request return {\"kind\":\"match\",\"destinationId\":\"<approved id>\"}.",
    "For broad or ambiguous requests return {\"kind\":\"clarify\"}.",
    "For unsupported requests return {\"kind\":\"none\"}.",
    "Never invent destination IDs.",
    `Approved catalogue: ${JSON.stringify(approved)}`,
  ].join("\n");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, instructions, input: request, max_output_tokens: 80 }),
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const payload = (await response.json()) as ApiPayload;
  const text = extractText(payload).trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(text) as { kind?: unknown; destinationId?: unknown };
  let decision: Decision;
  if (parsed.kind === "clarify" || parsed.kind === "none") {
    decision = { kind: parsed.kind };
  } else if (parsed.kind === "match" && typeof parsed.destinationId === "string" && approvedIds.has(parsed.destinationId)) {
    decision = { kind: "match", destinationId: parsed.destinationId };
  } else {
    throw new Error("Invalid model response or destination outside approved catalogue");
  }
  return {
    decision,
    inputTokens: payload.usage?.input_tokens ?? 0,
    outputTokens: payload.usage?.output_tokens ?? 0,
  };
}

let passed = 0;
let corePassed = 0;
let safetyPassed = 0;
let inputTokens = 0;
let outputTokens = 0;
const rows: Array<Record<string, string | number | boolean>> = [];

for (const test of cases) {
  const started = Date.now();
  try {
    const response = await classify(test.request);
    inputTokens += response.inputTokens;
    outputTokens += response.outputTokens;
    const durationMs = Date.now() - started;
    const { decision } = response;
    const pass = decision.kind === test.expectedKind &&
      (test.expectedKind !== "match" || decision.destinationId === test.expectedDestinationId);
    if (pass) {
      passed += 1;
      if (test.category === "core") corePassed += 1;
      else safetyPassed += 1;
    }
    rows.push({
      id: test.id, category: test.category, request: test.request,
      expected: test.expectedDestinationId ?? test.expectedKind,
      actual: decision.destinationId ?? decision.kind, pass, durationMs,
      inputTokens: response.inputTokens, outputTokens: response.outputTokens,
    });
  } catch (error) {
    rows.push({
      id: test.id, category: test.category, request: test.request,
      expected: test.expectedDestinationId ?? test.expectedKind,
      actual: error instanceof Error ? error.message : "Unknown error",
      pass: false, durationMs: Date.now() - started, inputTokens: 0, outputTokens: 0,
    });
  }
}

const summary = {
  timestamp: new Date().toISOString(), model, totalCases: cases.length,
  coreCases: cases.filter((test) => test.category === "core").length,
  corePassed, safetyCases: cases.filter((test) => test.category === "unsupported-safety").length,
  safetyPassed, totalPassed: passed,
  passRatePercent: Number(((passed / cases.length) * 100).toFixed(1)),
  averageLatencyMs: Math.round(rows.reduce((sum, row) => sum + Number(row.durationMs), 0) / rows.length),
  totalInputTokens: inputTokens, totalOutputTokens: outputTokens, results: rows,
};
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/llm-evaluation-results.json", JSON.stringify(summary, null, 2) + "\n");
console.table(rows);
console.log(JSON.stringify({
  model, total: cases.length, passed, passRatePercent: summary.passRatePercent,
  corePassed: `${corePassed}/${summary.coreCases}`,
  safetyPassed: `${safetyPassed}/${summary.safetyCases}`,
  averageLatencyMs: summary.averageLatencyMs, totalInputTokens: inputTokens,
  totalOutputTokens: outputTokens, resultFile: "artifacts/llm-evaluation-results.json",
}, null, 2));
if (passed !== cases.length) process.exitCode = 1;
