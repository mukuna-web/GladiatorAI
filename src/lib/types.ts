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
  breakdown: { category: string; agentA: number; agentB: number; maxValue?: number }[];
}

export interface BattleAssessment {
  status: "ready" | "abstained";
  reviewStatus: "needs_review" | "not_reviewable" | "approved" | "changes_requested";
  evidenceCount: number;
  minimumEvidence: number;
  explanation: string;
  reason?: string;
  review?: {
    reviewer: string;
    decision: "approved" | "changes_requested";
    notes: string;
    reviewedAt: string;
  };
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
