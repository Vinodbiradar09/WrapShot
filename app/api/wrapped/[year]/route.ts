import { getSession } from "@/app/types/getSession";
import { Repo } from "@/app/types/types";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ year: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized user", success: false },
        { status: 401 },
      );
    }

    const yearStr = await params;
    const year = parseInt(yearStr.year);
    if (isNaN(year) || year < 2000 || year > new Date().getFullYear()) {
      return NextResponse.json(
        { message: "Invalid year", success: false },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { repos: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }

    // check stats exist for this year
    const yearlyStats = await db.yearlyStats.findUnique({
      where: { userId_year: { userId: user.id, year } },
    });

    if (!yearlyStats) {
      return NextResponse.json(
        {
          message: `no stats found for ${year}. run /api/stats/generate first.`,
          success: false,
        },
        { status: 404 },
      );
    }

    const repoIds = user.repos.map((r: Repo) => r.id);

    // fetch all year-scoped data in parallel
    const [commits, prs, issues, prevYearStats] = await Promise.all([
      db.commit.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { date: true, repoId: true },
        orderBy: { date: "asc" },
      }),
      db.pullRequest.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { merged: true, repoId: true },
      }),
      db.issue.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { closed: true, repoId: true },
      }),
      // year-over-year comparison
      db.yearlyStats.findUnique({
        where: { userId_year: { userId: user.id, year: year - 1 } },
      }),
    ]);

    // monthly commit heatmap (12 buckets)
    const monthlyCommits: number[] = Array(12).fill(0);
    for (const commit of commits) {
      const month = new Date(commit.date).getMonth(); // 0-indexed
      monthlyCommits[month]++;
    }

    const monthlyHeatmap = monthlyCommits.map((count, index) => ({
      month: index + 1, // 1-indexed for display
      monthName: new Date(year, index, 1).toLocaleString("en-US", {
        month: "short",
      }),
      commits: count,
    }));

    // top repos by commit count
    const commitsByRepo: Record<string, number> = {};
    for (const commit of commits) {
      commitsByRepo[commit.repoId] = (commitsByRepo[commit.repoId] ?? 0) + 1;
    }

    const topRepos = user.repos
      .filter((repo: Repo) => commitsByRepo[repo.id] != null)
      .map((repo: Repo) => ({
        id: repo.id,
        name: repo.name,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        commits: commitsByRepo[repo.id] ?? 0,
        prs: prs.filter((p) => p.repoId === repo.id).length,
        issues: issues.filter((i) => i.repoId === repo.id).length,
      }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 5);

    // Language breakdown
    const activeRepoIds = new Set(Object.keys(commitsByRepo));
    const langCommits: Record<string, number> = {};
    for (const repo of user.repos) {
      if (repo.language && activeRepoIds.has(repo.id)) {
        langCommits[repo.language] =
          (langCommits[repo.language] ?? 0) + (commitsByRepo[repo.id] ?? 0);
      }
    }
    const totalLangCommits = Object.values(langCommits).reduce(
      (a, b) => a + b,
      0,
    );
    const languageBreakdown = Object.entries(langCommits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([language, count]) => ({
        language,
        commits: count,
        percentage:
          totalLangCommits > 0
            ? Math.round((count / totalLangCommits) * 100)
            : 0,
      }));

    // pr and issue rates
    const prMergeRate =
      yearlyStats.totalPRs > 0
        ? Math.round((yearlyStats.mergedPRs / yearlyStats.totalPRs) * 100)
        : 0;

    const issueCloseRate =
      yearlyStats.totalIssues > 0
        ? Math.round((yearlyStats.closedIssues / yearlyStats.totalIssues) * 100)
        : 0;

    // day-of-week distribution
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCount: number[] = Array(7).fill(0);
    for (const commit of commits) {
      const day = new Date(commit.date).getDay();
      dayCount[day]++;
    }
    const commitsByDayOfWeek = dayCount.map((count, index) => ({
      day: dayNames[index],
      commits: count,
    }));

    // year-over-year deltas
    const yoy = prevYearStats
      ? {
          commitsDelta: yearlyStats.totalCommits - prevYearStats.totalCommits,
          prsDelta: yearlyStats.totalPRs - prevYearStats.totalPRs,
          reposDelta: yearlyStats.totalRepos - prevYearStats.totalRepos,
          commitsGrowthPct:
            prevYearStats.totalCommits > 0
              ? Math.round(
                  ((yearlyStats.totalCommits - prevYearStats.totalCommits) /
                    prevYearStats.totalCommits) *
                    100,
                )
              : null,
        }
      : null;

    // developer score (0-100, fun metric)
    const score = Math.min(
      100,
      Math.round(
        Math.min(yearlyStats.totalCommits / 3, 30) + // up to 30 pts (300 commits = max)
          Math.min(yearlyStats.totalPRs * 2, 20) + // up to 20 pts
          Math.min(prMergeRate * 0.2, 20) + // up to 20 pts
          Math.min((yearlyStats.longestStreak ?? 0) * 0.5, 15) + // up to 15 pts
          Math.min(yearlyStats.totalRepos, 15), // up to 15 pts
      ),
    );

    // assemble full wrapped payload
    const wrapped = {
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        followers: user.followers,
      },
      year,
      stats: {
        totalCommits: yearlyStats.totalCommits,
        totalPRs: yearlyStats.totalPRs,
        mergedPRs: yearlyStats.mergedPRs,
        totalIssues: yearlyStats.totalIssues,
        closedIssues: yearlyStats.closedIssues,
        totalRepos: yearlyStats.totalRepos,
        topLanguage: yearlyStats.topLanguage,
        mostActiveMonth: yearlyStats.mostActiveMonth,
        longestStreak: yearlyStats.longestStreak,
        totalAdditions: yearlyStats.totalAdditions,
        totalDeletions: yearlyStats.totalDeletions,
        prMergeRate,
        issueCloseRate,
        developerScore: score,
      },
      charts: {
        monthlyHeatmap,
        languageBreakdown,
        commitsByDayOfWeek,
      },
      topRepos,
      yoy,
      aiSummary: yearlyStats.aiSummary
        ? (JSON.parse(yearlyStats.aiSummary) as object)
        : null,
    };

    return NextResponse.json({ success: true, data: wrapped }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}
