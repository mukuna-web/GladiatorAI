"use client";

import { Agent } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
  selected?: boolean;
  onClick?: () => void;
  showStats?: boolean;
  score?: number;
  side?: "left" | "right";
}

export default function AgentCard({ agent, selected, onClick, showStats, score, side }: AgentCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border p-4 transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-arena-accent bg-arena-accent/10 shadow-lg shadow-arena-accent/20 scale-105"
          : "border-arena-border bg-arena-card hover:border-gray-600"
      } ${side === "left" ? "text-left" : side === "right" ? "text-right" : "text-center"}`}
    >
      <div className={`flex items-center gap-3 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}` }}
        >
          {agent.emoji}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg" style={{ color: agent.color }}>
            {agent.name}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">{agent.personality}</p>
        </div>
      </div>
      {showStats && (
        <div className="mt-3 flex flex-wrap gap-1">
          {agent.strengths.map((s) => (
            <span
              key={s}
              className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
            >
              {s}
            </span>
          ))}
        </div>
      )}
      {score !== undefined && (
        <div
          className="mt-3 text-3xl font-bold animate-fade-in"
          style={{ color: agent.color }}
        >
          {score}
        </div>
      )}
    </div>
  );
}
