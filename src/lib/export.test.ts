import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadLeaderboardCsv, leaderboardToCsv } from "./export";

const entries = [
  { agentId: 'nova,"blue"', wins: 3, losses: 1, draws: 0, totalScore: 310 },
];

describe("leaderboardToCsv", () => {
  it("exports a stable aggregate-only schema with computed win rate", () => {
    const csv = leaderboardToCsv(entries);
    expect(csv.split("\n")[0]).toBe(
      "agent_id,wins,losses,draws,total_score,win_rate_percent",
    );
    expect(csv).toContain('"nova,""blue"""');
    expect(csv).toContain(",75");
  });

  it("handles empty history", () => {
    expect(leaderboardToCsv([]).split("\n")).toHaveLength(1);
  });
});

describe("downloadLeaderboardCsv", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does nothing without entries", () => {
    const createObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() });
    downloadLeaderboardCsv([]);
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("downloads and revokes the CSV URL", () => {
    const anchor = { href: "", download: "", click: vi.fn() };
    const createObjectURL = vi.fn(() => "blob:leaderboard");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("document", { createElement: vi.fn(() => anchor) });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    downloadLeaderboardCsv(entries);
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(anchor.download).toBe("gladiator-ai-leaderboard.csv");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:leaderboard");
  });
});
