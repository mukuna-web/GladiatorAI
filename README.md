# GladiatorAI

GladiatorAI is a local, template-driven simulation for exploring evaluation, abstention, human review, and counterfactual testing in agent-style workflows. Six fictional personas compete in debate, trivia, and coding demos; the application exposes category scores and requires named approval before a result affects the leaderboard.

Despite the name, this repository does not call an LLM or evaluate real autonomous agents. Responses come from local templates and sample solutions, while some simulated outcomes are randomly selected. The judge is deterministic and intentionally simple.

## Engineering highlights

- Three interactive simulation modes and six configurable toy personas.
- Deterministic category calculations with documented per-mode totals.
- Left/right slot counterfactual tests for debate and coding judges.
- Minimum-evidence abstention; abstained battles cannot be approved.
- Named reviewer approval or correction workflow.
- Leaderboard updates only after approval.
- Local-only browser storage with reset controls.
- Aggregate CSV export and browser Print/PDF.
- CI, 80%+ coverage gates, dependency audit, runbook, and reviewer training.

This is an educational demo, not a benchmark, hiring system, model evaluation, or scientific comparison. The displayed rhetoric is not analyzed by the debate judge, sample coding solutions are not executed, and persona strengths are hand-authored priors.

## Quick start

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Run the complete gate with:

```bash
npm run verify
npm audit --audit-level=moderate
```

## How scoring works

- Debate categories start from a documented base associated with the persona's configured strength; a stable hash of persona ID and category supplies a bounded deterministic variation.
- Trivia accuracy is `round(correct / total × 100)`; zero questions safely produces zero instead of `NaN`.
- Coding categories combine the simulated solution-quality label with the persona's configured coding strength.
- Debate and coding totals are the rounded arithmetic mean of displayed category values.
- Trivia totals are the rounded correct-answer percentage; the raw correct-answer row is supporting evidence.
- Scores within three points are a draw.
- Fewer than the required evidence items causes abstention.

Swapping the same two personas between A and B slots must swap—not alter—their calculated scores. Tests enforce this property.

## Human review and exports

The reviewer inspects the synthetic messages, category breakdown, formula, and evidence count. Approval records the result in `localStorage`; requesting a correction does not. Leaderboard CSV contains fictional agent ID and aggregate statistics only. Print/PDF is handled by the browser.

## Documentation

- [Privacy](PRIVACY.md)
- [Reviewer training](docs/REVIEWER_TRAINING.md)
- [Deployment runbook](docs/DEPLOYMENT_RUNBOOK.md)
- [Fairness and counterfactual checks](docs/FAIRNESS_AND_COUNTERFACTUALS.md)
- [Outcome metrics](docs/METRICS.md)
- [Security policy](SECURITY.md)

## License

MIT. See [LICENSE](LICENSE).
