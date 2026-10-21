# Shortcut Assistant AI

A mobile-first product prototype exploring how natural-language intent can help users reach Android settings without knowing technical terminology.

## Problem

Users often know what they want to do, but may not know the exact Android setting name or where to find it. This prototype adds an AI-assisted discovery path to the existing Shortcut Maker-style experience while keeping the user in control.

## Product flow

User request → intent interpretation → approved destination catalogue → clarification when needed → user review → confirmation → simulated success.

## Current implementation

- Screen 1: Home with natural-language shortcut search
- Screen 2: AI Understanding
- Screen 3: Destination Result
- Screen 4: Navigation Confirmation / Success
- Existing Settings path preserved
- Server-side LLM intent interpretation when configured
- Local deterministic fallback when no API key/model is available
- Approved catalogue of supported destinations
- Ambiguous requests trigger clarification
- Unsupported requests do not invent destinations
- No real Android action is executed

## Supported destination catalogue

1. Wi-Fi Settings
2. Bluetooth Settings
3. App Permissions
4. Notification Settings
5. Battery Settings
6. Display Settings
7. Wallpaper Settings
8. App Management
9. Mobile Data / Network Settings
10. Language Settings
11. Location Settings
12. Sound / Do Not Disturb Settings
13. Security Settings

## Responsible AI / GRC decisions

The prototype keeps AI within a controlled boundary:

- AI interprets intent but cannot invent system destinations.
- Destinations must come from the approved catalogue.
- Ambiguous requests require clarification.
- User confirmation is mandatory before proceeding.
- Nothing is opened automatically.
- No unnecessary device or personal data is collected in this prototype.

## Evaluation

The 15-case deterministic baseline is automated in CI and currently passes 15/15 defined scenarios. This baseline should not be presented as production LLM accuracy. A server-side LLM resolver is available for comparative testing when an API key is configured. The live evaluator includes three additional unsupported-request safety probes.

See:
- [docs/evaluation.md](docs/evaluation.md)
- [docs/product-case-study.md](docs/product-case-study.md)
- [docs/responsible-ai.md](docs/responsible-ai.md)

## Current status

The four-screen MVP journey is preserved in this repository. The deterministic matcher has been build-validated and evaluated in GitHub CI. The next stage is comparative evaluation of the optional server-side LLM resolver against the deterministic baseline.

## Tech

- React
- TypeScript
- TanStack Start / Router
- Tailwind CSS
- Lucide icons

## Origin

This is an independent product case study and prototype. It is not an official feature of Shortcut Maker and does not claim production integration with Android system settings or a live AI model.

## Optional live AI configuration

Copy `.env.example` to your local environment and provide `OPENAI_API_KEY` on the **server only**. The client never receives the key. If the model call fails, returns invalid output, or is not configured, the app falls back to the approved local matcher.
