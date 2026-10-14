# AI Evaluation Plan

## Objective

Determine whether the system correctly understands natural-language requests and identifies the intended approved Android destination.

## Evaluation scope

This result applies to the **deterministic local intent-matching prototype**, not to a production LLM or live AI model.

The evaluation verifies:
- intent classification
- destination selection from the approved catalogue
- ambiguity handling
- CI stability

## Automated evaluation result

GitHub Actions CI run **#6** completed successfully on 14-Oct-2026.

Pipeline:
- Install dependencies: Passed
- Lint: Passed
- 15-case intent evaluation: Passed
- Build: Passed

### Result summary

| Metric | Result |
|---|---:|
| Total scenarios | 15 |
| Passed scenarios | 15 |
| Failed scenarios | 0 |
| Overall scenario pass rate | 100% |
| Direct supported requests | 13 / 13 passed |
| Ambiguous requests | 2 / 2 correctly triggered clarification |

### Direct intent and destination accuracy

For the 13 supported destination cases:
- Intent accuracy: **13 / 13 = 100%**
- Destination accuracy: **13 / 13 = 100%**

### Clarification accuracy

For the 2 intentionally ambiguous cases:
- Correct clarification behaviour: **2 / 2 = 100%**

## Test set

| # | User request | Expected intent | Expected destination / behaviour | Result |
|---|---|---|---|---|
| 1 | I want to manage app permissions | Manage App Permissions | App Permissions | Pass |
| 2 | Turn on Wi-Fi | Manage Wi-Fi | Wi-Fi Settings | Pass |
| 3 | I want to connect to Bluetooth | Manage Bluetooth | Bluetooth Settings | Pass |
| 4 | Stop apps from sending notifications | Manage Notifications | Notification Settings | Pass |
| 5 | Show me battery settings | Manage Battery | Battery Settings | Pass |
| 6 | I want to change my screen brightness | Manage Display | Display Settings | Pass |
| 7 | I want to change my phone wallpaper | Manage Wallpaper | Wallpaper Settings | Pass |
| 8 | I want to manage my installed apps | Manage Apps | App Management | Pass |
| 9 | I want to control mobile data | Manage Mobile Data | Mobile Data / Network Settings | Pass |
| 10 | I want to change my phone language | Manage Language | Language Settings | Pass |
| 11 | I want to manage location access | Manage Location | Location Settings | Pass |
| 12 | Make my phone silent | Manage Sound / Do Not Disturb | Sound / Do Not Disturb Settings | Pass |
| 13 | I want to change my password | Manage Security | Security Settings | Pass |
| 14 | Help me manage my phone | Ambiguous | Clarification required | Pass |
| 15 | My phone isn’t working properly | Ambiguous | Clarification required | Pass |

## Earlier prototype learning

Before the local matcher was introduced, Test Case 1:

“I want to manage app permissions”

incorrectly returned:
- intent: Manage Wi-Fi
- destination: Wi-Fi Settings

That failure showed that the original prototype validated the UX flow but not dynamic intent understanding.

Iteration 2 replaced that Wi-Fi-only behaviour with the controlled local matcher and approved destination catalogue.

## Interpretation

The 100% result should be interpreted carefully.

It demonstrates that the **rule-based prototype correctly handles the defined 15-scenario evaluation dataset**.

It does **not** prove:
- production AI accuracy
- generalisation to unrestricted natural-language inputs
- robustness across all Android devices
- real Android deep-link execution
- live-user adoption or business impact

## Next evaluation stage

A future model-enabled version should compare:
1. deterministic baseline
2. LLM/API intent interpretation
3. invalid or unsupported destination rate
4. clarification quality
5. latency
6. cost per request
7. real user task-completion rate
