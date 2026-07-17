import { describe, expect, it } from "vitest";

import { assessBattle, reviewBattleAssessment } from "./assessment";

const score = {
  agentAScore: 80,
  agentBScore: 70,
  breakdown: [{ category: "Correctness", agentA: 80, agentB: 70 }],
};

describe("assessBattle", () => {
  it("abstains when there is insufficient battle evidence", () => {
    const report = assessBattle(score, 1, 2);
    expect(report.status).toBe("abstained");
    expect(report.reviewStatus).toBe("not_reviewable");
  });

  it("explains the calculation and requires review", () => {
    const report = assessBattle(score, 3, 2, "coding");
    expect(report.status).toBe("ready");
    expect(report.explanation).toContain("arithmetic mean");
    expect(report.reviewStatus).toBe("needs_review");
  });

  it("explains trivia totals as accuracy rather than a category mean", () => {
    const report = assessBattle(score, 3, 2, "trivia");
    expect(report.explanation).toContain("correct answers / total questions");
    expect(report.explanation).not.toContain("arithmetic mean");
  });
});

describe("reviewBattleAssessment", () => {
  it("records a named decision without changing evidence", () => {
    const report = assessBattle(score, 3, 2);
    const reviewed = reviewBattleAssessment(report, {
      reviewer: "Morgan",
      decision: "approved",
    });
    expect(reviewed.reviewStatus).toBe("approved");
    expect(reviewed.evidenceCount).toBe(report.evidenceCount);
  });

  it("accepts only one decision for a battle assessment", () => {
    const report = assessBattle(score, 3, 2);
    const reviewed = reviewBattleAssessment(report, {
      reviewer: "Morgan",
      decision: "approved",
    });
    expect(() =>
      reviewBattleAssessment(reviewed, {
        reviewer: "Taylor",
        decision: "changes_requested",
      }),
    ).toThrow(/already/i);
  });

  it("rejects unnamed and abstained reviews", () => {
    const ready = assessBattle(score, 3, 2);
    const abstained = assessBattle(score, 0, 2);
    expect(() =>
      reviewBattleAssessment(ready, { reviewer: " ", decision: "approved" }),
    ).toThrow(/reviewer/i);
    expect(() =>
      reviewBattleAssessment(abstained, { reviewer: "Morgan", decision: "approved" }),
    ).toThrow(/abstained/i);
  });
});
