"use client";

import { useEffect, useState } from "react";
import { AGENTS } from "@/lib/agents";
import type { LeaderboardEntry } from "@/lib/types";
import { downloadLeaderboardCsv } from "@/lib/export";

type LeaderboardData = LeaderboardEntry;

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardData[]>([]);
  const [sortBy, setSortBy] = useState<"wins" | "totalScore">("wins");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  function loadData() {
    const stored = localStorage.getItem("gladiator-leaderboard");
    if (!stored) {
      setData([]);
      return;
    }
    const parsed = JSON.parse(stored);
    const entries: LeaderboardData[] = Object.entries(parsed).map(([agentId, stats]) => ({
      agentId,
      ...(stats as Omit<LeaderboardData, "agentId">),
    }));
    setData(entries);
  }

  function resetLeaderboard() {
    localStorage.removeItem("gladiator-leaderboard");
    setData([]);
  }

  const sorted = [...data].sort((a, b) =>
    sortBy === "wins" ? b.wins - a.wins : b.totalScore - a.totalScore
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("wins")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              sortBy === "wins"
                ? "bg-arena-accent text-black font-bold"
                : "bg-arena-card text-gray-400 hover:text-white"
            }`}
          >
            Sort by Wins
          </button>
          <button
            onClick={() => setSortBy("totalScore")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              sortBy === "totalScore"
                ? "bg-arena-accent text-black font-bold"
                : "bg-arena-card text-gray-400 hover:text-white"
            }`}
          >
            Sort by Score
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadLeaderboardCsv(sorted)} className="px-3 py-1.5 rounded-lg text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">Export CSV</button>
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg text-sm bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all">Print / PDF</button>
          <button
            onClick={resetLeaderboard}
            className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-4">🏟️</div>
          <p>No battles fought yet. Enter the arena to begin!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry, i) => {
            const agent = AGENTS.find((a) => a.id === entry.agentId);
            if (!agent) return null;
            const total = entry.wins + entry.losses + entry.draws;
            const winRate = total > 0 ? Math.round((entry.wins / total) * 100) : 0;

            return (
              <div
                key={entry.agentId}
                className="flex items-center gap-4 p-4 rounded-xl border border-arena-border bg-arena-card hover:bg-arena-card/80 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 text-center">
                  {i === 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : i === 1 ? (
                    <span className="text-2xl">🥈</span>
                  ) : i === 2 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="text-gray-500 font-bold">#{i + 1}</span>
                  )}
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}` }}
                >
                  {agent.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold" style={{ color: agent.color }}>
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {total} battles &middot; {winRate}% win rate
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400 font-bold">{entry.wins}</div>
                    <div className="text-[10px] text-gray-500">W</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-bold">{entry.losses}</div>
                    <div className="text-[10px] text-gray-500">L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 font-bold">{entry.draws}</div>
                    <div className="text-[10px] text-gray-500">D</div>
                  </div>
                  <div className="text-center pl-2 border-l border-arena-border">
                    <div className="text-arena-accent font-bold">{entry.totalScore}</div>
                    <div className="text-[10px] text-gray-500">PTS</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
