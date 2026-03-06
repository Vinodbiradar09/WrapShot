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
