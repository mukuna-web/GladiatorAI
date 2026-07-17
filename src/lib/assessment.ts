import type { BattleAssessment, BattleMode, BattleScore } from "./types";

export interface BattleReviewInput {
  reviewer: string;
  decision: "approved" | "changes_requested";
  notes?: string;
}

export function assessBattle(
  score: BattleScore,
  evidenceCount: number,
  minimumEvidence = 2,
  mode?: BattleMode,
): BattleAssessment {
  const explanation = mode === "trivia"
    ? "Trivia totals equal round(correct answers / total questions × 100). The breakdown shows the underlying count and accuracy percentage."
    : mode === "debate" || mode === "coding"
      ? "Each displayed total is the rounded arithmetic mean of its category scores. Category values are deterministic functions of the toy persona configuration and simulated outcome evidence."
      : "Debate and coding totals use the rounded arithmetic mean of category scores; trivia totals use the rounded correct-answer percentage.";
  if (evidenceCount < minimumEvidence || score.breakdown.length === 0) {
    return {
      status: "abstained",
      reviewStatus: "not_reviewable",
      evidenceCount,
      minimumEvidence,
      explanation,
      reason: `Insufficient evidence: ${evidenceCount} observed items; at least ${minimumEvidence} are required.`,
    };
  }
  return {
    status: "ready",
    reviewStatus: "needs_review",
    evidenceCount,
    minimumEvidence,
    explanation,
  };
}

export function reviewBattleAssessment(
  assessment: BattleAssessment,
  input: BattleReviewInput,
): BattleAssessment {
  if (assessment.status === "abstained") {
    throw new Error("abstained battle findings cannot be reviewed as a result");
  }
  if (assessment.reviewStatus !== "needs_review") {
    throw new Error("a review decision has already been recorded");
  }
  if (!input.reviewer.trim()) {
    throw new Error("a reviewer identity is required");
  }
  return {
    ...assessment,
    reviewStatus: input.decision,
    review: {
      reviewer: input.reviewer.trim(),
      decision: input.decision,
      notes: input.notes?.trim() ?? "",
      reviewedAt: new Date().toISOString(),
    },
  };
}
