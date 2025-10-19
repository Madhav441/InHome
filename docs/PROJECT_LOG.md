# Project Log (source of truth)

Use this document to coordinate across humans and AI agents. Keep entries short, dated, and link to PRs/commits.

## Conventions
- Always update relevant docs when code changes (README, docs/*.md, infra/*.md, CI config).
- Prefer small entries: What changed, Why, Impact, Next.
- Tag entries with `[code]`, `[docs]`, `[infra]`, `[ci]`, `[plan]` as needed.

## Template
```
### [YYYY-MM-DD] Title [tags]
- What: One-sentence summary.
- Why: Reason for change.
- Impact: User-visible effects or risks.
- Next: Immediate next steps or follow-ups.
- Links: PR/commit/issues.
```

## Active TODOs
- Keep high-signal TODOs here (3-7 items max). Move completed items to the log.

- [ ] Replace stubbed Apple MDM handlers in `@inhome/platform-api` with real persistence + APNs push.
- [ ] Implement Family Controls guardian/child apps and portal rule sync service.
- [ ] Wire Configurator helper CLI into a parent-facing wizard in the portal.

## Log
- Add newest entries at the top.

### [2025-10-19] Apple home tracks, API scaffolding, Configurator helper [docs][code][infra]
- What: Documented three Apple enrollment tracks, added API stubs under `@inhome/platform-api`, and shipped the Configurator helper script plus CI/doc updates.
- Why: Clarify the consumer-safe paths customers can legally use and unblock backend work for manual + supervised enrollments.
- Impact: Portal, CLI, and docs now provide authoritative guidance; engineering has scaffolds for `/apple/*` endpoints and a repeatable Configurator flow.
- Next: Implement real APNs push + persistence, build the Family Controls apps, and surface the wizard inside the web portal.
- Links: n/a (local changes).

