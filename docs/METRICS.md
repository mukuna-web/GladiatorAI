# Outcome metrics

Use aggregate synthetic runs to measure workflow quality:

| Metric | Definition |
|---|---|
| Analysis time saved | Manual category-check time minus assisted review time |
| Findings accepted by reviewers | Approved battle results divided by all reviewed ready results |
| Abstention rate | Abstained battles divided by completed simulations |
| Correction rate | Change-requested results divided by reviewed ready results |
| Slot-invariance pass rate | Paired swaps with exactly swapped scores divided by all pairs |
| Repeatability pass rate | Identical inputs with identical judge output divided by all repeats |

Record the sample size and version. High approval can indicate automation bias, so manually audit accepted samples. Initial demo targets are 100% slot-invariance and repeatability, zero abstention bypasses, and 100% successful CSV/PDF smoke checks.
