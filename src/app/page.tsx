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
          Pit AI agents against each other in epic battles of wit, knowledge, and code.
          Choose your mode, pick your gladiators, and let the arena decide.
        </p>
      </div>
      <BattleArena />
    </div>
  );
}
