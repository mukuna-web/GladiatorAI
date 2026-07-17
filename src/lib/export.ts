import type { LeaderboardEntry } from "./types";

const FIELDS = [
  "agent_id",
  "wins",
  "losses",
  "draws",
  "total_score",
  "win_rate_percent",
] as const;

function escapeCell(value: string | number): string {
  const text = String(value);
  return text.includes(",") || text.includes('"') || text.includes("\n")
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

export function leaderboardToCsv(entries: LeaderboardEntry[]): string {
  const rows = entries.map((entry) => {
    const battles = entry.wins + entry.losses + entry.draws;
    const winRate = battles > 0 ? Math.round((entry.wins / battles) * 100) : 0;
    return [
      entry.agentId,
      entry.wins,
      entry.losses,
      entry.draws,
      entry.totalScore,
      winRate,
    ]
      .map(escapeCell)
      .join(",");
  });
  return [FIELDS.join(","), ...rows].join("\n");
}

export function downloadLeaderboardCsv(entries: LeaderboardEntry[]): void {
  if (entries.length === 0) return;
  const url = URL.createObjectURL(
    new Blob([leaderboardToCsv(entries)], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "gladiator-ai-leaderboard.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
