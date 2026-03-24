import { DebateTopic, TriviaQuestion, CodingChallenge } from "./types";

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    topic: "AI will replace most human jobs within 20 years",
    forPosition: "AI automation is accelerating exponentially and will transform the workforce",
    againstPosition: "Human creativity and adaptability will create new roles faster than AI replaces them",
  },
  {
    topic: "Social media does more harm than good",
    forPosition: "Social media fuels addiction, misinformation, and mental health crises",
    againstPosition: "Social media democratizes information and connects communities globally",
  },
  {
    topic: "Space colonization should be humanity's top priority",
    forPosition: "Earth's resources are finite — our survival depends on becoming multi-planetary",
    againstPosition: "We should fix Earth's problems before spending trillions on space",
  },
  {
    topic: "Privacy is more important than security",
    forPosition: "Without privacy, there can be no true freedom or democracy",
    againstPosition: "Security is the foundation upon which all other rights depend",
  },
  {
    topic: "Open source software is superior to proprietary software",
    forPosition: "Transparency, community, and freedom produce better, more secure software",
    againstPosition: "Proprietary models fund innovation and provide better support and reliability",
  },
  {
    topic: "Remote work is better than office work",
    forPosition: "Remote work increases productivity, flexibility, and work-life balance",
    againstPosition: "In-person collaboration drives innovation, mentorship, and company culture",
  },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "What programming language was created by Guido van Rossum in 1991?",
    correctAnswer: "Python",
    options: ["Java", "Python", "Ruby", "Perl"],
  },
  {
    question: "What does 'HTTP' stand for?",
    correctAnswer: "HyperText Transfer Protocol",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "HyperText Transmission Protocol", "High Transfer Text Protocol"],
  },
  {
    question: "Which company developed the React JavaScript library?",
    correctAnswer: "Facebook (Meta)",
    options: ["Google", "Facebook (Meta)", "Microsoft", "Apple"],
  },
  {
    question: "What is the time complexity of binary search?",
    correctAnswer: "O(log n)",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
  },
  {
    question: "What year was the first iPhone released?",
    correctAnswer: "2007",
    options: ["2005", "2006", "2007", "2008"],
  },
  {
    question: "Which data structure uses LIFO (Last In, First Out)?",
    correctAnswer: "Stack",
    options: ["Queue", "Stack", "Linked List", "Tree"],
  },
  {
    question: "What does SQL stand for?",
    correctAnswer: "Structured Query Language",
    options: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "Sequential Query Language"],
  },
  {
    question: "Who is known as the father of computer science?",
    correctAnswer: "Alan Turing",
    options: ["Alan Turing", "Charles Babbage", "John von Neumann", "Ada Lovelace"],
  },
  {
    question: "What port does HTTPS typically use?",
    correctAnswer: "443",
    options: ["80", "443", "8080", "3000"],
  },
  {
    question: "Which sorting algorithm has the best average-case time complexity?",
    correctAnswer: "Merge Sort — O(n log n)",
    options: ["Bubble Sort — O(n²)", "Merge Sort — O(n log n)", "Selection Sort — O(n²)", "Insertion Sort — O(n²)"],
  },
  {
    question: "What does API stand for?",
    correctAnswer: "Application Programming Interface",
    options: ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Interface", "Application Process Integration"],
  },
  {
    question: "Which protocol is used to send email?",
    correctAnswer: "SMTP",
    options: ["FTP", "SMTP", "HTTP", "SSH"],
  },
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    title: "Two Sum",
    description: "Given an array of integers and a target sum, return the indices of two numbers that add up to the target.",
    difficulty: "Easy",
    examples: "Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1] (because 2 + 7 = 9)",
  },
  {
    title: "Palindrome Check",
    description: "Write a function that checks if a given string is a palindrome, ignoring case and non-alphanumeric characters.",
    difficulty: "Easy",
    examples: 'Input: "A man, a plan, a canal: Panama"\nOutput: true',
  },
  {
    title: "FizzBuzz Variant",
    description: "Print numbers 1 to N. For multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', multiples of both print 'FizzBuzz'. Return the result as an array.",
    difficulty: "Easy",
    examples: 'Input: N = 5\nOutput: ["1", "2", "Fizz", "4", "Buzz"]',
  },
  {
    title: "Valid Parentheses",
    description: "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the input string has valid (properly nested) brackets.",
    difficulty: "Medium",
    examples: 'Input: "({[]})"\nOutput: true\n\nInput: "([)]"\nOutput: false',
  },
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    difficulty: "Medium",
    examples: 'Input: ["flower", "flow", "flight"]\nOutput: "fl"',
  },
  {
    title: "Matrix Spiral",
    description: "Given an m x n matrix, return all elements in spiral order (clockwise from top-left).",
    difficulty: "Hard",
    examples: "Input: [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]",
  },
];

export function getRandomDebateTopic(): DebateTopic {
  return DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
}

export function getRandomTriviaQuestions(count: number = 5): TriviaQuestion[] {
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomCodingChallenge(): CodingChallenge {
  return CODING_CHALLENGES[Math.floor(Math.random() * CODING_CHALLENGES.length)];
}
