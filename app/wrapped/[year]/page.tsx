import { getSession } from "@/app/types/getSession";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import {
  WrappedData,
  MonthData,
  LangData,
  DayData,
  TopRepoFE,
} from "@/app/types/types";
import WrappedClient from "@/components/wrapped/WrappedClient";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Wrapped" };

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  params: Promise<{ year: string }>;
}

export default async function WrappedPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/");

  const { year: yearStr } = await params;
  const year = parseInt(yearStr);
  if (isNaN(year)) notFound();

  const userId = session.user.id;

  const stats = await db.yearlyStats.findUnique({
    where: { userId_year: { userId, year } },
  });
  if (!stats) notFound();
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { username: true, avatarUrl: true },
  });
  if (!user) redirect("/");

  const userRepos = await db.repo.findMany({
    where: { userId },
    select: { id: true, name: true, language: true, stars: true, forks: true },
  });
  const userRepoIds = userRepos.map((r) => r.id);

  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const commits = await db.commit.findMany({
    where: {
      repoId: { in: userRepoIds },
      date: { gte: startDate, lte: endDate },
    },
    select: { date: true, repoId: true },
  });

  const monthlyCounts = Array(12).fill(0);
  const dayCounts = Array(7).fill(0);
  for (const c of commits) {
    const d = new Date(c.date);
    monthlyCounts[d.getMonth()]++;
    dayCounts[d.getDay()]++;
  }
  const monthlyHeatmap: MonthData[] = monthlyCounts.map((count, i) => ({
    month: i + 1,
    monthName: MONTH_NAMES[i],
    commits: count,
  }));
  const commitsByDayOfWeek: DayData[] = dayCounts.map((count, i) => ({
    day: DAY_NAMES[i],
    commits: count,
  }));

  const langMap: Record<string, number> = {};
  for (const r of userRepos) {
    if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
  }
  const totalLangCount = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
  const languageBreakdown: LangData[] = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([language, count]) => ({
      language,
      commits: count,
      percentage: Math.round((count / totalLangCount) * 100),
    }));

  const repoCommitMap: Record<string, number> = {};
  for (const c of commits) {
    repoCommitMap[c.repoId] = (repoCommitMap[c.repoId] ?? 0) + 1;
  }
  const topRepos: TopRepoFE[] = Object.entries(repoCommitMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([repoId, count]) => {
      const repo = userRepos.find((r) => r.id === repoId);
      return {
        name: repo?.name ?? "unknown",
        language: repo?.language ?? null,
        stars: repo?.stars ?? 0,
        forks: repo?.forks ?? 0,
        commits: count,
      };
    });

  const prevStats = await db.yearlyStats.findUnique({
    where: { userId_year: { userId, year: year - 1 } },
  });
  const yoy = prevStats
    ? {
        commitsDelta: stats.totalCommits - prevStats.totalCommits,
        prsDelta: stats.totalPRs - prevStats.totalPRs,
        streakDelta: stats.longestStreak - prevStats.longestStreak,
      }
    : null;

  const aiSummary = stats.aiSummary
    ? (() => {
        try {
          return JSON.parse(stats.aiSummary);
        } catch {
          return null;
        }
      })()
    : null;

  const data: WrappedData = {
    year,
    username: user.username,
    avatarUrl: user.avatarUrl,
    totalCommits: stats.totalCommits,
    totalPRs: stats.totalPRs,
    mergedPRs: stats.mergedPRs,
    totalIssues: stats.totalIssues,
    closedIssues: stats.closedIssues,
    totalRepos: stats.totalRepos,
    topLanguage: stats.topLanguage,
    mostActiveMonth: stats.mostActiveMonth,
    longestStreak: stats.longestStreak,
    totalAdditions: stats.totalAdditions ?? 0,
    totalDeletions: stats.totalDeletions ?? 0,
    developerScore: Math.min(
      100,
      Math.round(
        (stats.totalCommits / 10) * 0.4 +
          (stats.mergedPRs / Math.max(stats.totalPRs, 1)) * 100 * 0.3 +
          stats.longestStreak * 0.3,
      ),
    ),
    prMergeRate:
      stats.totalPRs > 0
        ? Math.round((stats.mergedPRs / stats.totalPRs) * 100)
        : 0,
    issueCloseRate:
      stats.totalIssues > 0
        ? Math.round((stats.closedIssues / stats.totalIssues) * 100)
        : 0,
    monthlyHeatmap,
    languageBreakdown,
    commitsByDayOfWeek,
    topRepos,
    yoy,
    aiSummary,
  };

  return <WrappedClient data={data} year={year} />;
}
