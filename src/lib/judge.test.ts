import { afterEach, describe, expect, it, vi } from "vitest";

import { AGENTS } from "./agents";
import { getWinner, judgeCoding, judgeDebate, judgeTrivia, updateLeaderboard } from "./judge";

const [nova, blaze] = AGENTS;

describe("deterministic judging", () => {
  it("returns the same debate calculation for the same evidence", () => {
    expect(judgeDebate(nova, blaze)).toEqual(judgeDebate(nova, blaze));
  });

  it("is invariant to left/right slot assignment", () => {
    const forward = judgeDebate(nova, blaze);
    const reversed = judgeDebate(blaze, nova);

    expect(forward.agentAScore).toBe(reversed.agentBScore);
    expect(forward.agentBScore).toBe(reversed.agentAScore);
    expect(forward.breakdown.map((row) => row.agentA)).toEqual(
      reversed.breakdown.map((row) => row.agentB),
    );
  });

  it("calculates trivia accuracy and safely handles zero questions", () => {
    expect(judgeTrivia(4, 3, 5)).toMatchObject({
      agentAScore: 80,
      agentBScore: 60,
      breakdown: [
        { category: "Correct Answers", agentA: 4, agentB: 3, maxValue: 5 },
        { category: "Accuracy %", agentA: 80, agentB: 60, maxValue: 100 },
      ],
    });
    expect(judgeTrivia(0, 0, 0)).toMatchObject({ agentAScore: 0, agentBScore: 0 });
  });

  it("keeps coding calculations slot-invariant", () => {
    const forward = judgeCoding(nova, blaze, "optimal", "suboptimal");
    const reversed = judgeCoding(blaze, nova, "suboptimal", "optimal");
    expect(forward.agentAScore).toBe(reversed.agentBScore);
    expect(forward.agentBScore).toBe(reversed.agentAScore);
  });
});

describe("getWinner", () => {
  it("draws within the documented margin", () => {
    const result = getWinner(
      { agentAScore: 70, agentBScore: 68, breakdown: [] },
      nova,
      blaze,
    );
    expect(result.winnerId).toBeNull();
  });

  it.each([
    [75, 70, nova.id, "edges out"],
    [85, 70, nova.id, "defeats"],
    [95, 70, nova.id, "dominates"],
    [60, 75, blaze.id, "defeats"],
  ])("selects the winner for %s-%s", (a, b, winnerId, phrase) => {
    const result = getWinner({ agentAScore: a, agentBScore: b, breakdown: [] }, nova, blaze);
    expect(result.winnerId).toBe(winnerId);
    expect(result.verdict).toContain(phrase);
  });
});

describe("updateLeaderboard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns safely during server rendering", () => {
    expect(() =>
      updateLeaderboard(null, nova.id, blaze.id, {
        agentAScore: 70,
        agentBScore: 70,
        breakdown: [],
      }),
    ).not.toThrow();
  });

  it("creates, updates, and persists win/loss records", () => {
    let stored: string | null = null;
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => stored),
      setItem: vi.fn((_key: string, value: string) => { stored = value; }),
    });
    const score = { agentAScore: 80, agentBScore: 60, breakdown: [] };

    updateLeaderboard(nova.id, nova.id, blaze.id, score);
    updateLeaderboard(blaze.id, nova.id, blaze.id, score);
    updateLeaderboard(null, nova.id, blaze.id, score);

    const parsed = JSON.parse(stored ?? "{}");
    expect(parsed[nova.id]).toEqual({ wins: 1, losses: 1, draws: 1, totalScore: 240 });
    expect(parsed[blaze.id]).toEqual({ wins: 1, losses: 1, draws: 1, totalScore: 180 });
  });
});
