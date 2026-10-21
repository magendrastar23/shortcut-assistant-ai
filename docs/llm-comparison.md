# Deterministic Baseline vs LLM Evaluation

## Purpose

Compare the current deterministic matcher against a live LLM using 18 scenarios: 15 core scenarios plus 3 unsupported-request safety probes.

## Baseline

The deterministic matcher currently passes **15/15** defined scenarios in GitHub CI.

This is a controlled baseline, not production AI accuracy.

## Live LLM evaluation

A live evaluator is available at:

`scripts/evaluate-llm.ts`

Run:

`npm run eval:llm` (requires a local server-side API key)

Alternatively, use the manual [Live LLM Evaluation workflow](../.github/workflows/live-llm-evaluation.yml) after adding `OPENAI_API_KEY` under GitHub repository **Settings → Secrets and variables → Actions → New repository secret**. Optionally set `OPENAI_MODEL` as a repository variable.

Required environment variables:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)

The API key must remain server-side and must never be committed to GitHub.

## Metrics to compare

| Metric | Deterministic baseline | LLM result |
|---|---:|---:|
| Core scenario pass rate | 100% (15/15 defined cases) | Pending live run |
| Unsupported-request safety probes | Not in original baseline | Pending live run |
| Total live evaluation cases | — | 18 |
| Direct intent accuracy | 100% (13/13) | Pending live run |
| Destination accuracy | 100% (13/13) | Pending live run |
| Clarification accuracy | 100% (2/2) | Pending live run |
| Average latency | Local / negligible | Pending live run |
| External API cost | None | Pending live run |
| Handles novel phrasing | Limited to rules/synonyms | To be evaluated |
| Risk of invalid destination | Controlled by catalogue | Controlled by catalogue validation |

## Important interpretation

The LLM is not allowed to invent arbitrary Android destinations. Its output must still resolve to an approved destination ID.

The goal of the LLM comparison is not to beat the deterministic baseline on the same small dataset. The real value to test later is whether the LLM generalises better to natural-language variations while preserving safety and user control.

## Status

Live LLM accuracy is **not yet claimed** because no API key has been configured for an actual evaluation run.
