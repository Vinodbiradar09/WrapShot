export interface GitHubProfile {
  id: number;
  login: string;
  avatar_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
}

export interface WrappedStats {
  totalCommits: number;
  totalPRs: number;
  mergedPRs: number;
  totalIssues: number;
  closedIssues: number;
  totalRepos: number;
  topLanguage: string | null;
  mostActiveMonth: number | null;
  longestStreak: number | null;
  totalAdditions: number | null;
  totalDeletions: number | null;
  prMergeRate: number;
  issueCloseRate: number;
  developerScore: number;
}

export interface TopRepo {
  name: string;
  language: string | null;
  commits: number;
  stars: number;
}

export interface YoY {
  commitsDelta: number;
  prsDelta: number;
  commitsGrowthPct: number | null;
}

export interface AISummary {
  personalityType: string;
  personalityEmoji: string;
  personalityDescription: string;
  codeQualityScore: number;
  codeQualityLabel: string;
  strengths: Strength[];
  improvements: Improvement[];
  roastLine: string;
  complimentLine: string;
  yearSummary: string;
  funFacts: string[];
  yearRating: string;
  yearVibes: string;
}

interface Strength {
  title: string;
  description: string;
  icon: string;
}

interface Improvement {
  title: string;
  description: string;
  icon: string;
}

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}
