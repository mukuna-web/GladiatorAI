"use client";

import BattleArena from "@/components/BattleArena";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-3">
          <span className="gradient-text">⚔️ GladiatorAI</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Run local, template-driven agent battle simulations with transparent scores.
          Choose a mode, inspect the evidence, and review every result before it reaches the leaderboard.
        </p>
      </div>
      <BattleArena />
    </div>
  );
}
