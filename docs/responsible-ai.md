# Responsible AI and GRC Assessment

## Governance

- Product owns the feature behaviour.
- Engineering owns implementation controls.
- The approved destination catalogue is the source of valid destinations.
- The interpretation layer cannot independently invent system destinations.

## Key risks

- Misunderstanding the user's intent
- Returning the wrong destination
- Inventing a destination
- Overconfidence on ambiguous requests
- Automatic unintended actions
- API or model failure in a future AI-enabled version
- Unnecessary collection or retention of user queries

## Controls

- Approved destination catalogue
- User review before proceeding
- Mandatory confirmation
- Clarification for ambiguous requests
- Low-confidence / no-match fallback
- No automatic action in the prototype
- Data minimisation

## Human in the loop

User → interpretation → recommendation → validation → user confirmation → simulated action.

## Compliance considerations before production

A production version should assess:
- whether search queries are sent to a third-party AI provider
- storage and retention of user queries
- user consent and privacy requirements
- target-market privacy laws
- Android platform rules
- applicable AI regulations

This case study does not claim legal or regulatory compliance.
