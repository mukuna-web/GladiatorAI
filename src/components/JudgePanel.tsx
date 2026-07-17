"use client";

import { useState } from "react";

import { Agent, BattleAssessment, BattleScore } from "@/lib/types";

interface JudgePanelProps {
  agentA: Agent;
  agentB: Agent;
  score: BattleScore;
  verdict: string;
  winnerId: string | null;
  assessment: BattleAssessment;
  onReview: (reviewer: string, decision: "approved" | "changes_requested") => void;
}

export default function JudgePanel({ agentA, agentB, score, verdict, winnerId, assessment, onReview }: JudgePanelProps) {
  const [reviewer, setReviewer] = useState("");
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
                  style={{
                    width: `${Math.min(100, (item.agentA / (item.maxValue ?? 100)) * 100)}%`,
                    backgroundColor: agentA.color,
                  }}
                />
              </div>
              <div className="flex-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (item.agentB / (item.maxValue ?? 100)) * 100)}%`,
                    backgroundColor: agentB.color,
                  }}
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

      <div className="mt-6 border-t border-arena-border pt-4">
        <div className="text-xs text-gray-400 mb-1">{assessment.reason ?? assessment.explanation}</div>
        <div className="text-xs text-gray-500 mb-3">
          Evidence: {assessment.evidenceCount}/{assessment.minimumEvidence} minimum · Review: {assessment.reviewStatus}
        </div>
        {assessment.status === "ready" && assessment.reviewStatus === "needs_review" && (
          <div className="flex flex-wrap gap-2">
            <input
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
              placeholder="Reviewer name"
              className="flex-1 min-w-40 rounded-lg border border-arena-border bg-black/30 px-3 py-2 text-xs text-white"
            />
            <button onClick={() => onReview(reviewer, "approved")} className="rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">
              Approve result
            </button>
            <button onClick={() => onReview(reviewer, "changes_requested")} className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              Flag correction
            </button>
            <button onClick={() => window.print()} className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
              Print / PDF
            </button>
          </div>
        )}
        {assessment.status === "ready" && assessment.reviewStatus !== "needs_review" && assessment.review && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 text-xs text-gray-400">
              Decision recorded by {assessment.review.reviewer}: {assessment.review.decision.replace("_", " ")}
            </div>
            <button onClick={() => window.print()} className="rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300">
              Print / PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
