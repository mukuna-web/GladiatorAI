export type BattleMode = "debate" | "trivia" | "coding";

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  color: string;
  strengths: BattleMode[];
}

export interface BattleMessage {
  agentId: string;
  content: string;
  round: number;
  timestamp: number;
}

export interface TriviaQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface CodingChallenge {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examples: string;
}

export interface DebateTopic {
  topic: string;
  forPosition: string;
  againstPosition: string;
}

export interface BattleScore {
  agentAScore: number;
  agentBScore: number;
  breakdown: { category: string; agentA: number; agentB: number }[];
}

export interface BattleResult {
  id: string;
  mode: BattleMode;
  agentA: Agent;
  agentB: Agent;
  winnerId: string | null;
  score: BattleScore;
  messages: BattleMessage[];
  timestamp: number;
}

export interface LeaderboardEntry {
  agentId: string;
  wins: number;
  losses: number;
  draws: number;
  totalScore: number;
}
