import { describe, expect, it } from "vitest";

import { catalogue } from "./intent-catalogue";
import { parseLlmDecision } from "./intent-resolver.functions";

describe("parseLlmDecision", () => {
  it("accepts each approved destination ID", () => {
    for (const entry of catalogue) {
      expect(
        parseLlmDecision(JSON.stringify({ kind: "match", destinationId: entry.id })),
      ).toEqual({ kind: "match", destinationId: entry.id });
    }
  });

  it("rejects a destination ID outside the approved catalogue", () => {
    expect(
      parseLlmDecision(JSON.stringify({ kind: "match", destinationId: "run-arbitrary-command" })),
    ).toBeNull();
  });

  it("accepts clarification and unsupported decisions", () => {
    expect(parseLlmDecision('{"kind":"clarify"}')).toEqual({ kind: "clarify" });
    expect(parseLlmDecision('{"kind":"none"}')).toEqual({ kind: "none" });
  });

  it("accepts a JSON code fence", () => {
    expect(parseLlmDecision(' ```json\n{"kind":"clarify"}\n``` ')).toEqual({
      kind: "clarify",
    });
  });

  it("rejects malformed or incomplete JSON", () => {
    expect(parseLlmDecision("not json")).toBeNull();
    expect(parseLlmDecision('{"kind":"match"}')).toBeNull();
    expect(parseLlmDecision('{"kind":"unexpected"}')).toBeNull();
  });
});
