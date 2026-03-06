import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/app/types/getSession";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          message: "Unauthorized User",
          success: false,
        },
        { status: 401 },
      );
    }
    const body = await req.json();
    const year = body.year;
    if (!year || typeof year !== "number") {
      return NextResponse.json(
        { message: "Valid year is required", success: false },
        { status: 400 },
      );
    }
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        repos: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }
    const repoIds = user.repos.map((repo: { id: string }) => repo.id);
    // fetch all data's such as commits , prs , issue parallel
    const [commits, prs, issues] = await Promise.all([
      db.commit.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { date: true, repoId: true, additions: true, deletions: true },
      }),
      db.pullRequest.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { merged: true },
      }),
      db.issue.findMany({
        where: { repoId: { in: repoIds }, year },
        select: { closed: true },
      }),
    ]);
    const totalCommits = commits.length;
    const totalPRs = prs.length;
    const mergedPRs = prs.filter((pr) => pr.merged).length;
    const totalIssues = issues.length;
    const closedIssues = issues.filter((issue) => issue.closed).length;

    // repos which are active this year
    const activeRepoIds = new Set(commits.map((c) => c.repoId));
    const totalRepos = activeRepoIds.size;
    // top language
    const activeRepos = user.repos.filter((repo) => activeRepoIds.has(repo.id));
    const langCount: Record<string, number> = {};
    for (const rep of activeRepos) {
      if (rep.language) {
        langCount[rep.language] = (langCount[rep.language] ?? 0) + 1;
      }
    }
    const topLanguage =
      Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    //most active month
    const monthCount: Record<number, number> = {};
    for (const commit of commits) {
      const month = new Date(commit.date).getMonth() + 1; // 1-indexed
      monthCount[month] = (monthCount[month] ?? 0) + 1;
    }
    const mostActiveMonth =
      Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // longest commit streak
    const commitDays = [
      ...new Set(
        commits.map((c) => {
          const d = new Date(c.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }),
      ),
    ].sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;
    for (const dayStr of commitDays) {
      const day = new Date(dayStr);
      if (prevDate) {
        const diff =
          (day.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      if (currentStreak > longestStreak) longestStreak = currentStreak;
      prevDate = day;
    }
    const totalAdditions = commits.reduce(
      (sum, c) => sum + (c.additions ?? 0),
      0,
    );
    const totalDeletions = commits.reduce(
      (sum, c) => sum + (c.deletions ?? 0),
      0,
    );
    const stats = await db.yearlyStats.upsert({
      where: {
        userId_year: { userId: user.id, year },
      },
      update: {
        totalCommits,
        totalPRs,
        mergedPRs,
        totalIssues,
        closedIssues,
        totalRepos,
        topLanguage,
        mostActiveMonth: mostActiveMonth ? Number(mostActiveMonth) : null,
        longestStreak,
        totalAdditions,
        totalDeletions,
      },
      create: {
        userId: user.id,
        year,
        totalCommits,
        totalPRs,
        mergedPRs,
        totalIssues,
        closedIssues,
        totalRepos,
        topLanguage,
        mostActiveMonth: mostActiveMonth ? Number(mostActiveMonth) : null,
        longestStreak,
        totalAdditions,
        totalDeletions,
      },
    });
    return NextResponse.json(
      {
        message: `stats generated for ${year}`,
        success: true,
        stats,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
