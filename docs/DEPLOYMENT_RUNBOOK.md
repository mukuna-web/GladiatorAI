# Deployment runbook

## Preflight

```bash
npm ci
npm run verify
npm audit --audit-level=moderate
```

Confirm there are no secrets, real prompts, model credentials, analytics scripts, or generated exports.

## Deploy and smoke test

Deploy the production build on a supported Node runtime behind HTTPS. Run one synthetic battle in each mode. Verify deterministic repeat scoring, abstention logic, named review, approval-only leaderboard writes, reset, CSV, and Print/PDF. Confirm browser storage and network behavior match `PRIVACY.md`.

## Rollback and incidents

Keep the previous known-good artifact. Roll back on a failed smoke test, slot-bias regression, review-gate bypass, or unexpected data transmission. Disable the deployment and investigate if real user or model content is introduced without review.
