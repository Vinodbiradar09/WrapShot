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

export interface Props {
  username: string;
  avatarUrl: string | null;
}

export interface TopRepoFE {
  name: string;
  language: string | null;
  stars: number;
  forks: number;
  commits: number;
}

export interface MonthData {
  month: number;
  monthName: string;
  commits: number;
}

export interface LangData {
  language: string;
  commits: number;
  percentage: number;
}

export interface DayData {
  day: string;
  commits: number;
}

export interface YoYFE {
  commitsDelta: number;
  prsDelta: number;
  streakDelta: number;
}

export interface AISummaryFE {
  personalityType: string;
  personalityEmoji: string;
  personalityDescription: string;
  codeQualityScore: number;
  codeQualityLabel: string;
  strengths: { title: string; description: string; icon: string }[];
  improvements: { title: string; description: string }[];
  roastLine: string;
  complimentLine: string;
  yearSummary: string;
  funFacts: string[];
  yearRating: string;
  yearVibes: string;
}

export interface WrappedData {
  year: number;
  username: string;
  avatarUrl: string | null;
  totalCommits: number;
  totalPRs: number;
  mergedPRs: number;
  totalIssues: number;
  closedIssues: number;
  totalRepos: number;
  topLanguage: string | null;
  mostActiveMonth: number;
  longestStreak: number;
  totalAdditions: number;
  totalDeletions: number;
  developerScore: number;
  prMergeRate: number;
  issueCloseRate: number;
  monthlyHeatmap: MonthData[];
  languageBreakdown: LangData[];
  commitsByDayOfWeek: DayData[];
  topRepos: TopRepoFE[];
  yoy: YoYFE | null;
  aiSummary: AISummary | null;
}
