import { getSession } from "@/app/types/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized user", success: false },
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

    const yearStart = new Date(`${year}-01-01T00:00:00Z`).getTime();
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
      // Track if we've gone past the target year window — stop early
      let pastWindow = false;

      while (hasMore && !pastWindow) {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/pulls?state=all&sort=created&direction=desc&per_page=100&page=${page}`,
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

        const prs = await res.json();

        if (!Array.isArray(prs) || prs.length === 0) {
          hasMore = false;
          break;
        }

        const filtered = prs.filter((pr) => {
          const prTime = new Date(pr.created_at).getTime();
          // If a PR is before our window, everything after (older) will also be before
          if (prTime < yearStart) {
            pastWindow = true;
          }
          return prTime >= yearStart && prTime <= yearEnd;
        });

        const data = filtered.map((pr) => ({
          prNumber: pr.number as number,
          createdAt: new Date(pr.created_at as string),
          merged: pr.merged_at !== null,
          year,
          repoId: repo.id,
        }));

        if (data.length > 0) {
          await db.pullRequest.createMany({ data, skipDuplicates: true });
          totalImported += data.length;
        }

        if (prs.length < 100 || pastWindow) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return NextResponse.json(
      {
        message: `PRs imported for ${year}`,
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
