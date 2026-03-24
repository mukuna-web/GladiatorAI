import { Agent, BattleMode, BattleMessage, CodingChallenge, DebateTopic, TriviaQuestion } from "./types";

const DEBATE_TEMPLATES = {
  opening: {
    analytical: [
      "Let me present a data-driven analysis. {position}. Studies consistently show that this perspective holds merit when we examine the evidence objectively.",
      "From a logical standpoint, {position}. The empirical evidence supports this conclusion through multiple independent observations.",
    ],
    aggressive: [
      "Let's not beat around the bush — {position}. Anyone who disagrees simply hasn't looked at the facts closely enough.",
      "The truth is undeniable: {position}. Opposing this view requires ignoring overwhelming evidence.",
    ],
    creative: [
      "Imagine a world where this debate never existed — that alone tells us something. {position}. Here's a thought experiment that illuminates why.",
      "Let me approach this from an unexpected angle. {position}. Consider the butterfly effect at play here.",
    ],
    balanced: [
      "While I acknowledge complexity on both sides, {position}. The weight of evidence tilts decisively in this direction.",
      "Taking a measured view, {position}. History teaches us that this perspective prevails when tested against reality.",
    ],
    concise: [
      "Simply put: {position}. The data is clear, the logic is sound, and the conclusion follows naturally.",
      "{position}. Three facts support this: evidence, precedent, and common sense.",
    ],
    technical: [
      "If we model this as a system, {position}. The inputs, outputs, and feedback loops all point to this conclusion.",
      "Analyzing the architecture of this argument: {position}. Each component reinforces the thesis.",
    ],
  },
  rebuttal: {
    analytical: [
      "My opponent raises an interesting point, but the data tells a different story. Let me break down why their reasoning has a critical flaw.",
      "While that argument sounds compelling on the surface, a deeper statistical analysis reveals significant gaps in their logic.",
    ],
    aggressive: [
      "That's a classic misdirection. My opponent conveniently ignores the most important counterevidence. Here's what they don't want you to consider.",
      "Bold claims require bold evidence — and my opponent has provided neither. Let me dismantle that argument piece by piece.",
    ],
    creative: [
      "Fascinating perspective, but let me flip the script entirely. What if we viewed this through a completely different lens?",
      "My opponent's argument is like a beautifully decorated house with no foundation. Let me show you what's underneath.",
    ],
    balanced: [
      "I appreciate the nuance in my opponent's argument. However, when we weigh all factors equally, the balance tips the other way.",
      "A fair point was made, but it overlooks a crucial dimension. Let me add that missing piece to complete the picture.",
    ],
    concise: [
      "Counterpoint: that reasoning breaks down when applied at scale. Here's the simpler, more robust explanation.",
      "Respectfully, that misses the point. The real issue is straightforward and my opponent has overcomplicated it.",
    ],
    technical: [
      "Let me debug that argument. There's an off-by-one error in the logic — the edge case my opponent missed changes everything.",
      "Running my opponent's argument through formal verification reveals an inconsistency. Here's the corrected version.",
    ],
  },
  closing: {
    analytical: [
      "In summary, the evidence overwhelmingly supports my position. I've presented verifiable data, logical reasoning, and addressed every counterargument with precision.",
    ],
    aggressive: [
      "The verdict is clear. My opponent fought hard but couldn't overcome the weight of truth. The facts speak for themselves — and they speak loudly in my favor.",
    ],
    creative: [
      "As this debate closes, I leave you with this: the most powerful ideas are the ones that survive scrutiny. Mine has weathered every challenge thrown at it.",
    ],
    balanced: [
      "Both sides have shown merit today, but the preponderance of evidence, reason, and practical wisdom aligns with my position. I rest my case with confidence.",
    ],
    concise: [
      "Bottom line: my argument is simpler, stronger, and better supported. The choice is clear.",
    ],
    technical: [
      "QED. The logical chain is complete, the edge cases are handled, and the proof is sound. My position compiles without errors.",
    ],
  },
};

const TRIVIA_ANSWER_STYLES: Record<string, (q: TriviaQuestion, correct: boolean) => string> = {
  analytical: (q, correct) =>
    correct
      ? `After careful analysis, the answer is "${q.correctAnswer}". This is well-documented in the literature.`
      : `Based on my analysis, I'll go with "${q.options[Math.floor(Math.random() * q.options.length)]}". Let me reason through this...`,
  aggressive: (q, correct) =>
    correct
      ? `Obviously it's "${q.correctAnswer}". Anyone who knows their stuff would get this instantly.`
      : `It's clearly "${q.options[Math.floor(Math.random() * q.options.length)]}". No question about it.`,
  creative: (q, correct) =>
    correct
      ? `Ooh, this one's fun! The answer is "${q.correctAnswer}" — and there's a fascinating story behind why.`
      : `Going with my gut on this one: "${q.options[Math.floor(Math.random() * q.options.length)]}". Sometimes intuition beats analysis.`,
  balanced: (q, correct) =>
    correct
      ? `Considering all options carefully, I'm confident the answer is "${q.correctAnswer}".`
      : `Weighing the possibilities, I believe it's "${q.options[Math.floor(Math.random() * q.options.length)]}".`,
  concise: (q, correct) =>
    correct ? `"${q.correctAnswer}".` : `"${q.options[Math.floor(Math.random() * q.options.length)]}".`,
  technical: (q, correct) =>
    correct
      ? `Running lookup... match found: "${q.correctAnswer}". Confidence: 98.7%.`
      : `Processing query... best match: "${q.options[Math.floor(Math.random() * q.options.length)]}". Confidence: 72.1%.`,
};

const CODE_SOLUTIONS: Record<string, Record<string, string>> = {
  "Two Sum": {
    optimal: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
// Time: O(n), Space: O(n) — Hash map approach`,
    suboptimal: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}
// Time: O(n²), Space: O(1) — Brute force approach`,
  },
  "Palindrome Check": {
    optimal: `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}
// Time: O(n), Space: O(n) — Two pointer technique`,
    suboptimal: `function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
// Time: O(n), Space: O(n) — Reverse and compare`,
  },
  "FizzBuzz Variant": {
    optimal: `function fizzBuzz(n: number): string[] {
  const result: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}
// Clean, efficient single-pass solution`,
    suboptimal: `function fizzBuzz(n: number): string[] {
  return Array.from({length: n}, (_, i) => {
    const num = i + 1;
    let s = "";
    if (num % 3 === 0) s += "Fizz";
    if (num % 5 === 0) s += "Buzz";
    return s || String(num);
  });
}
// Functional approach with string concatenation`,
  },
  "Valid Parentheses": {
    optimal: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {')':'(', '}':'{', ']':'['};
  for (const c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}
// Time: O(n), Space: O(n) — Stack-based validation`,
    suboptimal: `function isValid(s: string): boolean {
  while (s.includes('()') || s.includes('{}') || s.includes('[]')) {
    s = s.replace('()', '').replace('{}', '').replace('[]', '');
  }
  return s.length === 0;
}
// Time: O(n²), Space: O(n) — Repeated replacement`,
  },
  "Longest Common Prefix": {
    optimal: `function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}
// Time: O(S) where S is sum of all chars — Horizontal scanning`,
    suboptimal: `function longestCommonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  let result = "";
  for (let i = 0; i < strs[0].length; i++) {
    const char = strs[0][i];
    if (strs.every(s => s[i] === char)) result += char;
    else break;
  }
  return result;
}
// Time: O(S) — Vertical scanning with every()`,
  },
  "Matrix Spiral": {
    optimal: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom)
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
    bottom--;
    if (left <= right)
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
    left++;
  }
  return result;
}
// Time: O(m*n), Space: O(1) — Boundary shrinking`,
    suboptimal: `function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  if (!matrix.length) return result;
  const visited = matrix.map(r => r.map(() => false));
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  let r = 0, c = 0, d = 0;
  for (let i = 0; i < matrix.length * matrix[0].length; i++) {
    result.push(matrix[r][c]);
    visited[r][c] = true;
    const nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr < 0 || nr >= matrix.length || nc < 0 || nc >= matrix[0].length || visited[nr][nc]) {
      d = (d + 1) % 4;
    }
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return result;
}
// Time: O(m*n), Space: O(m*n) — Direction + visited set`,
  },
};

function getPersonalityStyle(agent: Agent): string {
  if (agent.id === "nova") return "analytical";
  if (agent.id === "blaze") return "aggressive";
  if (agent.id === "echo") return "creative";
  if (agent.id === "sage") return "balanced";
  if (agent.id === "volt") return "concise";
  if (agent.id === "cipher") return "technical";
  return "balanced";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDebateResponse(
  agent: Agent,
  topic: DebateTopic,
  round: number,
  totalRounds: number,
  isFor: boolean,
  _opponentMessages: BattleMessage[]
): string {
  const style = getPersonalityStyle(agent);
  const position = isFor ? topic.forPosition : topic.againstPosition;

  if (round === 0) {
    const templates = DEBATE_TEMPLATES.opening[style as keyof typeof DEBATE_TEMPLATES.opening] || DEBATE_TEMPLATES.opening.balanced;
    return pickRandom(templates).replace("{position}", position);
  } else if (round === totalRounds - 1) {
    const templates = DEBATE_TEMPLATES.closing[style as keyof typeof DEBATE_TEMPLATES.closing] || DEBATE_TEMPLATES.closing.balanced;
    return pickRandom(templates);
  } else {
    const templates = DEBATE_TEMPLATES.rebuttal[style as keyof typeof DEBATE_TEMPLATES.rebuttal] || DEBATE_TEMPLATES.rebuttal.balanced;
    return pickRandom(templates);
  }
}

export function generateTriviaAnswer(
  agent: Agent,
  question: TriviaQuestion
): { answer: string; isCorrect: boolean; response: string } {
  const style = getPersonalityStyle(agent);
  const isStrength = agent.strengths.includes("trivia");
  const correctChance = isStrength ? 0.8 : 0.55;
  const isCorrect = Math.random() < correctChance;

  const formatter = TRIVIA_ANSWER_STYLES[style] || TRIVIA_ANSWER_STYLES.balanced;
  const response = formatter(question, isCorrect);
  const answer = isCorrect
    ? question.correctAnswer
    : question.options.filter((o) => o !== question.correctAnswer)[Math.floor(Math.random() * 3)];

  return { answer, isCorrect, response };
}

export function generateCodeSolution(
  agent: Agent,
  challenge: CodingChallenge
): { code: string; quality: "optimal" | "suboptimal" } {
  const isStrength = agent.strengths.includes("coding");
  const optimalChance = isStrength ? 0.75 : 0.4;
  const quality = Math.random() < optimalChance ? "optimal" : "suboptimal";

  const solutions = CODE_SOLUTIONS[challenge.title];
  const code = solutions ? solutions[quality] : `// Solution for ${challenge.title}\n// ${agent.name}'s approach\nconsole.log("Solved!");`;

  return { code, quality };
}

export function simulateThinkingDelay(): number {
  return 500 + Math.random() * 1500;
}
