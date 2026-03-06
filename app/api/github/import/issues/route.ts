import { getSession } from "@/app/types/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized User", success: false },
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

    const since = new Date(`${year}-01-01T00:00:00Z`).toISOString();
    const yearEnd = new Date(`${year}-12-31T23:59:59Z`).getTime();

    const token = session.accessToken;

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

    const username = user.username;
    let totalImported = 0;

    for (const repo of user.repos) {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/issues?state=all&since=${since}&per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          },
        );

        if (!res.ok) {
          const status = res.status;
          if (status === 404 || status === 410) {
            hasMore = false;
            break;
          }
          throw new Error(`github api error: ${status} on ${repo.name}`);
        }

        const issues = await res.json();

        if (!Array.isArray(issues) || issues.length === 0) {
          hasMore = false;
          break;
        }

        const filtered = issues
          .filter((issue) => !issue.pull_request) // exclude PRs from issues endpoint
          .filter((issue) => {
            const createdTime = new Date(issue.created_at).getTime();
            // Only issues created within the target year
            return createdTime <= yearEnd;
          });

        const data = filtered.map((issue) => ({
          issueNumber: issue.number as number,
          createdAt: new Date(issue.created_at as string),
          closed: issue.closed_at !== null,
          year,
          repoId: repo.id,
        }));

        if (data.length > 0) {
          await db.issue.createMany({ data, skipDuplicates: true });
          totalImported += data.length;
        }

        if (issues.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return NextResponse.json(
      {
        message: `Issues imported for ${year}`,
        success: true,
        totalImported,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}
