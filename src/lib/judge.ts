import { Agent, BattleMode, BattleScore } from "./types";

function randomScore(base: number, variance: number): number {
  return Math.max(0, Math.min(100, Math.round(base + (Math.random() - 0.5) * variance)));
}

export function judgeDebate(
  agentA: Agent,
  agentB: Agent
): BattleScore {
  const aIsStrong = agentA.strengths.includes("debate");
  const bIsStrong = agentB.strengths.includes("debate");
  const aBase = aIsStrong ? 78 : 65;
  const bBase = bIsStrong ? 78 : 65;

  const categories = ["Persuasiveness", "Logic & Reasoning", "Rebuttal Quality"];
  const breakdown = categories.map((category) => ({
    category,
    agentA: randomScore(aBase, 20),
    agentB: randomScore(bBase, 20),
  }));

  return {
    agentAScore: Math.round(breakdown.reduce((s, b) => s + b.agentA, 0) / breakdown.length),
    agentBScore: Math.round(breakdown.reduce((s, b) => s + b.agentB, 0) / breakdown.length),
    breakdown,
  };
}

export function judgeTrivia(
  agentACorrect: number,
  agentBCorrect: number,
  totalQuestions: number
): BattleScore {
  const aScore = Math.round((agentACorrect / totalQuestions) * 100);
  const bScore = Math.round((agentBCorrect / totalQuestions) * 100);

  return {
    agentAScore: aScore,
    agentBScore: bScore,
    breakdown: [
      { category: "Correct Answers", agentA: agentACorrect, agentB: agentBCorrect },
      { category: "Accuracy %", agentA: aScore, agentB: bScore },
      { category: "Speed Bonus", agentA: randomScore(75, 30), agentB: randomScore(75, 30) },
    ],
  };
}

export function judgeCoding(
  agentA: Agent,
  agentB: Agent,
  qualityA: "optimal" | "suboptimal",
  qualityB: "optimal" | "suboptimal"
): BattleScore {
  const correctnessA = qualityA === "optimal" ? randomScore(92, 10) : randomScore(70, 15);
  const correctnessB = qualityB === "optimal" ? randomScore(92, 10) : randomScore(70, 15);
  const efficiencyA = qualityA === "optimal" ? randomScore(90, 10) : randomScore(55, 20);
  const efficiencyB = qualityB === "optimal" ? randomScore(90, 10) : randomScore(55, 20);
  const codeQualityA = agentA.strengths.includes("coding") ? randomScore(85, 15) : randomScore(65, 20);
  const codeQualityB = agentB.strengths.includes("coding") ? randomScore(85, 15) : randomScore(65, 20);

  const breakdown = [
    { category: "Correctness", agentA: correctnessA, agentB: correctnessB },
    { category: "Efficiency", agentA: efficiencyA, agentB: efficiencyB },
    { category: "Code Quality", agentA: codeQualityA, agentB: codeQualityB },
  ];

  return {
    agentAScore: Math.round(breakdown.reduce((s, b) => s + b.agentA, 0) / breakdown.length),
    agentBScore: Math.round(breakdown.reduce((s, b) => s + b.agentB, 0) / breakdown.length),
    breakdown,
  };
}

export function getWinner(
  score: BattleScore,
  agentA: Agent,
  agentB: Agent
): { winnerId: string | null; verdict: string } {
  const diff = score.agentAScore - score.agentBScore;

  if (Math.abs(diff) <= 3) {
    return { winnerId: null, verdict: "It's a draw! Both gladiators fought with equal prowess." };
  }

  const winner = diff > 0 ? agentA : agentB;
  const loser = diff > 0 ? agentB : agentA;
  const margin = Math.abs(diff);

  let intensity: string;
  if (margin > 20) intensity = "dominates";
  else if (margin > 10) intensity = "defeats";
  else intensity = "edges out";

  return {
    winnerId: winner.id,
    verdict: `${winner.emoji} ${winner.name} ${intensity} ${loser.emoji} ${loser.name} with a score of ${Math.max(score.agentAScore, score.agentBScore)} to ${Math.min(score.agentAScore, score.agentBScore)}!`,
  };
}

export function updateLeaderboard(
  winnerId: string | null,
  agentAId: string,
  agentBId: string,
  score: BattleScore
): void {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem("gladiator-leaderboard");
  const leaderboard: Record<string, { wins: number; losses: number; draws: number; totalScore: number }> =
    stored ? JSON.parse(stored) : {};

  if (!leaderboard[agentAId]) leaderboard[agentAId] = { wins: 0, losses: 0, draws: 0, totalScore: 0 };
  if (!leaderboard[agentBId]) leaderboard[agentBId] = { wins: 0, losses: 0, draws: 0, totalScore: 0 };

  leaderboard[agentAId].totalScore += score.agentAScore;
  leaderboard[agentBId].totalScore += score.agentBScore;

  if (winnerId === null) {
    leaderboard[agentAId].draws++;
    leaderboard[agentBId].draws++;
  } else if (winnerId === agentAId) {
    leaderboard[agentAId].wins++;
    leaderboard[agentBId].losses++;
  } else {
    leaderboard[agentBId].wins++;
    leaderboard[agentAId].losses++;
  }

  localStorage.setItem("gladiator-leaderboard", JSON.stringify(leaderboard));
}
