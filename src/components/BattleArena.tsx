"use client";

import { useState, useCallback } from "react";
import { Agent, BattleMode, BattleMessage, BattleScore } from "@/lib/types";
import { AGENTS, getRandomAgents } from "@/lib/agents";
import { getRandomDebateTopic, getRandomTriviaQuestions, getRandomCodingChallenge } from "@/lib/topics";
import {
  generateDebateResponse,
  generateTriviaAnswer,
  generateCodeSolution,
  simulateThinkingDelay,
} from "@/lib/mock-engine";
import { judgeDebate, judgeTrivia, judgeCoding, getWinner, updateLeaderboard } from "@/lib/judge";
import AgentCard from "./AgentCard";
import JudgePanel from "./JudgePanel";
import ModeSelector from "./ModeSelector";

type Phase = "select-mode" | "select-agents" | "battle" | "results";

export default function BattleArena() {
  const [phase, setPhase] = useState<Phase>("select-mode");
  const [mode, setMode] = useState<BattleMode | null>(null);
  const [agentA, setAgentA] = useState<Agent | null>(null);
  const [agentB, setAgentB] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [thinking, setThinking] = useState<string | null>(null);
  const [score, setScore] = useState<BattleScore | null>(null);
  const [verdict, setVerdict] = useState<string>("");
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [battleInfo, setBattleInfo] = useState<string>("");

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleModeSelect = (m: BattleMode) => {
    setMode(m);
    setPhase("select-agents");
  };

  const handleAgentSelect = (agent: Agent) => {
    if (!agentA) {
      setAgentA(agent);
    } else if (agent.id !== agentA.id) {
      setAgentB(agent);
    }
  };

  const handleRandomAgents = () => {
    const [a, b] = getRandomAgents();
    setAgentA(a);
    setAgentB(b);
  };

  const startBattle = useCallback(async () => {
    if (!mode || !agentA || !agentB) return;
    setPhase("battle");
    setMessages([]);

    if (mode === "debate") {
      await runDebate(agentA, agentB);
    } else if (mode === "trivia") {
      await runTrivia(agentA, agentB);
    } else {
      await runCoding(agentA, agentB);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, agentA, agentB]);

  async function runDebate(a: Agent, b: Agent) {
    const topic = getRandomDebateTopic();
    setBattleInfo(`Topic: "${topic.topic}"`);

    const totalRounds = 3;
    const allMessages: BattleMessage[] = [];

    for (let round = 0; round < totalRounds; round++) {
      // Agent A (FOR)
      setThinking(a.id);
      await sleep(simulateThinkingDelay());
      const responseA = generateDebateResponse(a, topic, round, totalRounds, true, allMessages);
      const msgA: BattleMessage = { agentId: a.id, content: responseA, round, timestamp: Date.now() };
      allMessages.push(msgA);
      setMessages([...allMessages]);
      setThinking(null);

      await sleep(300);

      // Agent B (AGAINST)
      setThinking(b.id);
      await sleep(simulateThinkingDelay());
      const responseB = generateDebateResponse(b, topic, round, totalRounds, false, allMessages);
      const msgB: BattleMessage = { agentId: b.id, content: responseB, round, timestamp: Date.now() };
      allMessages.push(msgB);
      setMessages([...allMessages]);
      setThinking(null);

      await sleep(300);
    }

    const battleScore = judgeDebate(a, b);
    finishBattle(battleScore, a, b);
  }

  async function runTrivia(a: Agent, b: Agent) {
    const questions = getRandomTriviaQuestions(5);
    setBattleInfo("Trivia Challenge — 5 Questions");

    const allMessages: BattleMessage[] = [];
    let aCorrect = 0;
    let bCorrect = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qMsg: BattleMessage = {
        agentId: "system",
        content: `**Q${i + 1}:** ${q.question}`,
        round: i,
        timestamp: Date.now(),
      };
      allMessages.push(qMsg);
      setMessages([...allMessages]);
      await sleep(800);

      setThinking(a.id);
      await sleep(simulateThinkingDelay());
      const ansA = generateTriviaAnswer(a, q);
      if (ansA.isCorrect) aCorrect++;
      const msgA: BattleMessage = {
        agentId: a.id,
        content: `${ansA.response} ${ansA.isCorrect ? "✅" : "❌"}`,
        round: i,
        timestamp: Date.now(),
      };
      allMessages.push(msgA);
      setMessages([...allMessages]);
      setThinking(null);

      setThinking(b.id);
      await sleep(simulateThinkingDelay());
      const ansB = generateTriviaAnswer(b, q);
      if (ansB.isCorrect) bCorrect++;
      const msgB: BattleMessage = {
        agentId: b.id,
        content: `${ansB.response} ${ansB.isCorrect ? "✅" : "❌"}`,
        round: i,
        timestamp: Date.now(),
      };
      allMessages.push(msgB);
      setMessages([...allMessages]);
      setThinking(null);

      await sleep(400);
    }

    const battleScore = judgeTrivia(aCorrect, bCorrect, 5);
    finishBattle(battleScore, a, b);
  }

  async function runCoding(a: Agent, b: Agent) {
    const challenge = getRandomCodingChallenge();
    setBattleInfo(`Coding: ${challenge.title} (${challenge.difficulty})`);

    const allMessages: BattleMessage[] = [];

    const challengeMsg: BattleMessage = {
      agentId: "system",
      content: `**${challenge.title}** (${challenge.difficulty})\n\n${challenge.description}\n\n\`\`\`\n${challenge.examples}\n\`\`\``,
      round: 0,
      timestamp: Date.now(),
    };
    allMessages.push(challengeMsg);
    setMessages([...allMessages]);
    await sleep(1000);

    setThinking(a.id);
    await sleep(simulateThinkingDelay() * 2);
    const solA = generateCodeSolution(a, challenge);
    const msgA: BattleMessage = {
      agentId: a.id,
      content: `\`\`\`typescript\n${solA.code}\n\`\`\``,
      round: 0,
      timestamp: Date.now(),
    };
    allMessages.push(msgA);
    setMessages([...allMessages]);
    setThinking(null);

    await sleep(500);

    setThinking(b.id);
    await sleep(simulateThinkingDelay() * 2);
    const solB = generateCodeSolution(b, challenge);
    const msgB: BattleMessage = {
      agentId: b.id,
      content: `\`\`\`typescript\n${solB.code}\n\`\`\``,
      round: 0,
      timestamp: Date.now(),
    };
    allMessages.push(msgB);
    setMessages([...allMessages]);
    setThinking(null);

    const battleScore = judgeCoding(a, b, solA.quality, solB.quality);
    finishBattle(battleScore, a, b);
  }

  function finishBattle(battleScore: BattleScore, a: Agent, b: Agent) {
    const result = getWinner(battleScore, a, b);
    setScore(battleScore);
    setVerdict(result.verdict);
    setWinnerId(result.winnerId);
    updateLeaderboard(result.winnerId, a.id, b.id, battleScore);
    setPhase("results");
  }

  function resetBattle() {
    setPhase("select-mode");
    setMode(null);
    setAgentA(null);
    setAgentB(null);
    setMessages([]);
    setScore(null);
    setVerdict("");
    setWinnerId(null);
    setBattleInfo("");
    setThinking(null);
  }

  return (
    <div className="space-y-8">
      {/* Phase: Select Mode */}
      {phase === "select-mode" && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Choose Your Battle Mode</h2>
          <p className="text-gray-400 text-center mb-8">Select how your gladiators will compete</p>
          <ModeSelector selected={mode} onSelect={handleModeSelect} />
        </div>
      )}

      {/* Phase: Select Agents */}
      {phase === "select-agents" && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Choose Your Gladiators
          </h2>
          <p className="text-gray-400 text-center mb-2">
            {!agentA ? "Select the first combatant" : !agentB ? "Select the second combatant" : "Ready to battle!"}
          </p>
          <div className="text-center mb-6">
            <button
              onClick={handleRandomAgents}
              className="text-sm text-arena-neon hover:text-white transition-colors"
            >
              🎲 Random matchup
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={agent.id === agentA?.id || agent.id === agentB?.id}
                onClick={() => handleAgentSelect(agent)}
                showStats
              />
            ))}
          </div>

          {agentA && agentB && (
            <div className="flex flex-col items-center gap-4 animate-slide-up">
              <div className="flex items-center gap-6">
                <AgentCard agent={agentA} side="left" />
                <span className="text-3xl font-bold text-arena-accent">VS</span>
                <AgentCard agent={agentB} side="right" />
              </div>
              <button
                onClick={startBattle}
                className="px-8 py-3 bg-gradient-to-r from-arena-accent to-orange-600 text-white font-bold rounded-xl hover:opacity-90 transition-all animate-pulse-glow"
              >
                ⚔️ Start Battle
              </button>
              <button onClick={resetBattle} className="text-sm text-gray-500 hover:text-gray-300">
                ← Change mode
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase: Battle */}
      {(phase === "battle" || phase === "results") && agentA && agentB && (
        <div className="animate-fade-in">
          {/* Battle Header */}
          <div className="flex items-center justify-between mb-4">
            <AgentCard agent={agentA} side="left" />
            <div className="text-center px-4">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                {mode === "debate" ? "🎙️ Debate" : mode === "trivia" ? "🧩 Trivia" : "💻 Coding"}
              </div>
              <div className="text-arena-accent font-bold text-sm">{battleInfo}</div>
              {phase === "battle" && (
                <div className="mt-2">
                  <div className="w-24 h-1 bg-arena-border rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-arena-accent animate-pulse rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
              )}
            </div>
            <AgentCard agent={agentB} side="right" />
          </div>

          {/* Messages */}
          <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto pr-2">
            {messages.map((msg, i) => {
              const isSystem = msg.agentId === "system";
              const isAgentA = msg.agentId === agentA.id;
              const agent = isAgentA ? agentA : agentB;

              if (isSystem) {
                return (
                  <div key={i} className="text-center py-4 animate-fade-in">
                    <div className="inline-block px-6 py-3 rounded-xl bg-arena-border/50 text-gray-300 text-sm whitespace-pre-wrap">
                      <FormattedContent content={msg.content} />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`flex gap-3 animate-slide-up ${isAgentA ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}` }}
                  >
                    {agent.emoji}
                  </div>
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-xl text-sm text-gray-200 ${
                      isAgentA ? "bg-white/5 rounded-tl-none" : "bg-white/5 rounded-tr-none"
                    }`}
                  >
                    <div className="text-[10px] font-bold mb-1" style={{ color: agent.color }}>
                      {agent.name}
                    </div>
                    <div className="whitespace-pre-wrap">
                      <FormattedContent content={msg.content} />
                    </div>
                  </div>
                </div>
              );
            })}

            {thinking && (
              <div className={`flex gap-3 animate-fade-in ${thinking === agentA?.id ? "" : "flex-row-reverse"}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{
                    backgroundColor: `${(thinking === agentA?.id ? agentA : agentB)?.color}20`,
                    border: `1px solid ${(thinking === agentA?.id ? agentA : agentB)?.color}`,
                  }}
                >
                  {(thinking === agentA?.id ? agentA : agentB)?.emoji}
                </div>
                <div className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 text-sm">
                  <div className="flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {phase === "results" && score && (
            <div className="space-y-4">
              <JudgePanel
                agentA={agentA}
                agentB={agentB}
                score={score}
                verdict={verdict}
                winnerId={winnerId}
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={startBattle}
                  className="px-6 py-2.5 bg-arena-accent text-black font-bold rounded-xl hover:bg-arena-accent/90 transition-all"
                >
                  ⚔️ Rematch
                </button>
                <button
                  onClick={resetBattle}
                  className="px-6 py-2.5 border border-arena-border text-gray-300 rounded-xl hover:bg-white/5 transition-all"
                >
                  New Battle
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```|\*\*[\s\S]*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^typescript\n/, "").replace(/^\w+\n/, "");
          return (
            <pre key={i} className="bg-black/40 rounded-lg p-3 mt-2 mb-2 text-xs overflow-x-auto font-mono">
              <code>{code}</code>
            </pre>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
