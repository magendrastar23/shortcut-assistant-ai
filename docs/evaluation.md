# AI Evaluation Plan

## Objective

Determine whether the system correctly understands natural-language requests and identifies the intended approved Android destination.

## Metrics

- Intent Correct?
- Destination Correct?
- Confidence
- Clarification Required?
- Final Result

## Planned test set

| # | User request | Expected intent | Expected destination / behaviour |
|---|---|---|---|
| 1 | I want to manage app permissions | Manage App Permissions | App Permissions |
| 2 | Turn on Wi-Fi | Manage Wi-Fi | Wi-Fi Settings |
| 3 | I want to connect to Bluetooth | Manage Bluetooth | Bluetooth Settings |
| 4 | Stop apps from sending notifications | Manage Notifications | Notification Settings |
| 5 | Show me battery settings | Manage Battery | Battery Settings |
| 6 | I want to change my screen brightness | Manage Display | Display Settings |
| 7 | I want to change my phone wallpaper | Manage Wallpaper | Wallpaper Settings |
| 8 | I want to manage my installed apps | Manage Apps | App Management |
| 9 | I want to control mobile data | Manage Mobile Data | Mobile Data / Network Settings |
| 10 | I want to change my phone language | Manage Language | Language Settings |
| 11 | I want to manage location access | Manage Location | Location Settings |
| 12 | Make my phone silent | Manage Sound / Do Not Disturb | Sound / Do Not Disturb Settings |
| 13 | I want to change my password | Manage Security | Security Settings |
| 14 | Help me manage my phone | Ambiguous | Clarification required |
| 15 | My phone isn’t working properly | Ambiguous | Clarification required |

## First observed result

Test Case 1 was run against the Wi-Fi-only prototype.

Input:
“I want to manage app permissions”

Actual result:
- intent: Manage Wi-Fi
- destination: Wi-Fi Settings

Result:
- Intent Correct: No
- Destination Correct: No
- Clarification: No
- Final Result: Fail — prototype limitation

## Evaluation status

The full 15-case run has not yet been completed.

Iteration 2 added deterministic local matching to make the dataset meaningful, but final cleanup and full validation were interrupted when Lovable credits ran out.

No accuracy percentage should be claimed until the full dataset is executed against a stable build.
