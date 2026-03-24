"use client";

import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="gradient-text">🏆 Leaderboard</span>
        </h1>
        <p className="text-gray-400">
          Track the greatest gladiators across all battle modes
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Leaderboard />
      </div>
    </div>
  );
}
