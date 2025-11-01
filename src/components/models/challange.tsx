export interface Challenge {
    id: number;
    title: string;
    description: string;
    task: string;
    starterCode: string;
    solution: string;
    testCases: { input?: any; expectedOutput: string }[];
    hints: string[];
    category: "for" | "while" | "range" | "nested";
  }