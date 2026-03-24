"use client";

import { BattleMode } from "@/lib/types";

interface ModeSelectorProps {
  selected: BattleMode | null;
  onSelect: (mode: BattleMode) => void;
}

const MODES: { mode: BattleMode; label: string; emoji: string; desc: string }[] = [
  { mode: "debate", label: "Debate", emoji: "🎙️", desc: "Agents argue for & against a topic. Judged on persuasiveness, logic, and rebuttal." },
  { mode: "trivia", label: "Trivia", emoji: "🧩", desc: "5 rapid-fire questions. Both agents answer simultaneously. Speed & accuracy matter." },
  { mode: "coding", label: "Coding", emoji: "💻", desc: "A coding challenge is presented. Agents produce solutions judged on correctness & efficiency." },
];

export default function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MODES.map(({ mode, label, emoji, desc }) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          className={`p-6 rounded-xl border text-left transition-all duration-300 group ${
            selected === mode
              ? "border-arena-accent bg-arena-accent/10 shadow-lg shadow-arena-accent/20"
              : "border-arena-border bg-arena-card hover:border-gray-600 hover:bg-arena-card/80"
          }`}
        >
          <div className="text-3xl mb-3">{emoji}</div>
          <h3 className={`font-bold text-lg mb-1 ${selected === mode ? "text-arena-accent" : "text-white"}`}>
            {label}
          </h3>
          <p className="text-sm text-gray-400">{desc}</p>
        </button>
      ))}
    </div>
  );
}
