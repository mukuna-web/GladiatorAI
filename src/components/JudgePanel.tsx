"use client";

import { Agent, BattleScore } from "@/lib/types";

interface JudgePanelProps {
  agentA: Agent;
  agentB: Agent;
  score: BattleScore;
  verdict: string;
  winnerId: string | null;
}

export default function JudgePanel({ agentA, agentB, score, verdict, winnerId }: JudgePanelProps) {
  return (
    <div className="rounded-xl border border-arena-border bg-arena-card p-6 animate-slide-up">
      <div className="text-center mb-6">
        <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-2">⚖️ Judge&apos;s Verdict</h3>
        <p className="text-xl font-bold text-white">{verdict}</p>
      </div>

      <div className="space-y-3">
        {score.breakdown.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: agentA.color }}>{item.agentA}</span>
              <span className="text-gray-400">{item.category}</span>
              <span style={{ color: agentB.color }}>{item.agentB}</span>
            </div>
            <div className="flex gap-1 h-2">
              <div className="flex-1 bg-gray-800 rounded-full overflow-hidden flex justify-end">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.agentA}%`, backgroundColor: agentA.color }}
                />
              </div>
              <div className="flex-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${item.agentB}%`, backgroundColor: agentB.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-arena-border pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: agentA.color }}>
            {score.agentAScore}
          </div>
          <div className="text-xs text-gray-500">{agentA.name}</div>
        </div>
        <div className="text-center">
          <div className="text-3xl">
            {winnerId === null ? "🤝" : winnerId === agentA.id ? "👈" : "👉"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: agentB.color }}>
            {score.agentBScore}
          </div>
          <div className="text-xs text-gray-500">{agentB.name}</div>
        </div>
      </div>
    </div>
  );
}
