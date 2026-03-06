import { WrappedStats, TopRepo, YoY } from "@/app/types/types";
export function buildPrompt(
  username: string,
  year: number,
  stats: WrappedStats,
  topRepos: TopRepo[],
  yoy: YoY | null,
): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const activeMonth = stats.mostActiveMonth
    ? monthNames[stats.mostActiveMonth - 1]
    : "unknown";

  const topRepoList = topRepos
    .slice(0, 3)
    .map(
      (r, i) =>
        `  ${i + 1}. "${r.name}" (${r.commits} commits, ${r.stars} ⭐, language: ${r.language ?? "unknown"})`,
    )
    .join("\n");

  const yoyLine = yoy
    ? `Compared to last year: ${yoy.commitsDelta >= 0 ? "+" : ""}${yoy.commitsDelta} commits (${yoy.commitsGrowthPct != null ? `${yoy.commitsGrowthPct >= 0 ? "+" : ""}${yoy.commitsGrowthPct}% growth` : "no prior data"}), ${yoy.prsDelta >= 0 ? "+" : ""}${yoy.prsDelta} PRs.`
    : "No prior year data available for comparison.";

  return `
You are a witty, sharp, deeply technical developer analyst creating a "GitHub Wrapped" card — like Spotify Wrapped but for code.

Analyze the following GitHub stats for the developer "${username}" for the year ${year} and return a JSON object.

=== STATS ===
- Total Commits: ${stats.totalCommits}
- Total PRs: ${stats.totalPRs} (${stats.mergedPRs} merged, ${stats.prMergeRate}% merge rate)
- Total Issues: ${stats.totalIssues} (${stats.closedIssues} closed, ${stats.issueCloseRate}% close rate)
- Active Repos: ${stats.totalRepos}
- Top Language: ${stats.topLanguage ?? "unknown"}
- Most Active Month: ${activeMonth}
- Longest Commit Streak: ${stats.longestStreak ?? 0} days
- Lines Added: ${stats.totalAdditions ?? "N/A"}
- Lines Deleted: ${stats.totalDeletions ?? "N/A"}
- Developer Score: ${stats.developerScore}/100

=== TOP REPOS ===
${topRepoList || "  No repos with commits this year."}

=== YEAR OVER YEAR ===
${yoyLine}

=== INSTRUCTIONS ===
Return ONLY a raw JSON object — no markdown, no backticks, no explanation.
The JSON must exactly match this TypeScript interface:

{
  "personalityType": string,          // Creative developer archetype title (e.g. "The Midnight Architect", "The Open Source Evangelist", "The Refactor Wizard")
  "personalityEmoji": string,         // Single emoji matching the archetype
  "personalityDescription": string,   // Exactly 2 sentences describing this archetype with personality and wit
  "codeQualityScore": number,         // Integer 0-100 based on PR merge rate, issue close rate, streak, and commit volume
  "codeQualityLabel": string,         // Short label: one of "Needs Work", "Getting There", "Solid", "Production-Grade", "Elite"
  "strengths": [                      // Exactly 3 items
    {
      "title": string,                // 2-4 word strength title
      "description": string,          // 1 sentence explanation referencing actual numbers
      "icon": string                  // Single relevant emoji
    }
  ],
  "improvements": [                   // Exactly 2 items
    {
      "title": string,
      "description": string,          // 1 sentence, constructive and kind
      "icon": string
    }
  ],
  "roastLine": string,                // One sharp, funny roast sentence. Reference specific numbers. Max 20 words.
  "complimentLine": string,           // One genuine, enthusiastic hype sentence. Max 20 words.
  "yearSummary": string,              // Exactly 3 sentences narrating the developer's ${year} journey with specific stats woven in
  "funFacts": [string, string, string], // 3 quirky, specific fun facts derived directly from the numbers
  "yearRating": string,               // Format: "X.X / 10" (be generous but honest, base on developerScore)
  "yearVibes": string                 // 2-5 word vibe phrase with emoji (e.g. "Senior Dev Energy 🔥", "Caffeine-Fueled Grind 💻")
}

Be witty, specific, and make the developer feel seen. Reference their actual numbers. Avoid generic platitudes.
`.trim();
}
