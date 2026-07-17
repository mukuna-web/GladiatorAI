# Fairness and counterfactual checks

The central counterfactual is slot invariance: for the same personas and simulated quality evidence, swapping A and B must swap their category and total scores without changing the values. Automated tests enforce this for debate and coding. Repeatability tests enforce identical judge output for identical inputs, and zero-evidence tests require safe abstention behavior.

Additional release checks should vary persona display name, emoji, color, message order, and left/right position while holding scoring inputs constant. None may affect the calculation. Any unexplained difference blocks release.

The configured strengths intentionally produce different priors, so this project is not evidence of model or demographic fairness. It contains no protected-class data and must not be repurposed to evaluate people. Engineering invariance tests are not a substitute for a validated fairness study.
