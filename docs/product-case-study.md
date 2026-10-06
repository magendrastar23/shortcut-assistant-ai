# Product Case Study — Shortcut Assistant AI

## 1. Product discovery

### Observed user problem

Shortcut creation and Android navigation can require users to understand technical categories such as activities, intents, or system setting names. Users think in outcomes, not implementation terminology.

Example:
- User says: “I want to manage app permissions.”
- Product should translate that into a valid system destination rather than forcing the user to know the exact settings hierarchy.

## 2. Opportunity

Introduce a natural-language discovery path without replacing the existing Shortcut Maker structure.

The feature should help users:
- describe the outcome they want
- see what the system understood
- review a validated destination
- confirm before navigation

## 3. Solution ideation

Considered ideas:
1. Natural-language shortcut search
2. AI-powered direct navigation
3. AI intent suggestions
4. Voice-to-intent search

MVP decision:
- combine intent understanding and destination recommendation
- keep voice for a later phase
- keep automatic shortcut creation for a later phase

## 4. Prioritisation

The selected concept was prioritised for:
- user value
- problem fit
- AI value
- feasibility
- simplicity
- risk
- business value

## 5. MVP

Selected MVP concept: **AI Intent-to-Destination Assistant**

Flow:
1. User enters a natural-language request.
2. System interprets the request.
3. System matches only against an approved destination catalogue.
4. Ambiguous requests trigger clarification.
5. User reviews the destination.
6. User explicitly confirms.
7. Prototype shows simulated success.

## 6. MVP screens

- Screen 1 — Home
- Screen 2 — AI Understanding
- Screen 3 — Destination Result
- Screen 4 — Navigation Confirmation / Success

## 7. User stories

- US001 Natural-language input
- US002 Intent understanding
- US003 Intent suggestions
- US004 Destination identification
- US005 User review and confirmation
- US006 Direct navigation simulation
- US007 Low-confidence / no-match fallback
- US008 Voice input — later phase
- US009 Shortcut creation — later phase

## 8. Product principle

The AI should not act as an unrestricted agent. It should interpret user intent and recommend from a controlled set of valid destinations.

Core control pattern:

**User → AI interpretation → approved destination validation → user confirmation → action**

## 9. Prototype learning

The first prototype validated the user journey with Wi-Fi as the main mocked path.

A later test using:

“I want to manage app permissions”

still returned Wi-Fi, revealing that the UI flow was working but the intent understanding was not dynamic.

That finding led to Iteration 2:
- introduce local deterministic intent matching
- support multiple approved destinations
- add clarification for ambiguous requests
- add low-confidence handling for unsupported requests

## 10. Current limitation

The local matcher is a prototype baseline, not a real AI model.

Lovable credits were exhausted before the final Iteration 2 cleanup and complete 15-case validation were finished. This limitation is intentionally documented rather than hidden.
