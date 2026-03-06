import { getSession } from "@/app/types/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
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
        {
          message: "year is required",
          success: false,
        },
        { status: 400 },
      );
    }
    const since = new Date(`${year}-01-01T00:00:00Z`).toISOString();
    const until = new Date(`${year}-12-31T23:59:59Z`).toISOString();
    const token = session.accessToken;
    const user = await db.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      include: {
        repos: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "user not found",
          success: false,
        },
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
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&since=${since}&until=${until}&per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
            },
          },
        );

        if (!res.ok) {
          const status = res.status;
          if (status === 409 || status === 404) {
            hasMore = false;
            break;
          }
          throw new Error(`Github api error ${res.status} on ${repo.name}`);
        }
        const commits = await res.json();
        if (!Array.isArray(commits) || commits.length === 0) {
          hasMore = false;
          break;
        }
        const data = commits.map((commit) => ({
          commitSha: commit.sha as string,
          date: new Date(commit.commit.author.date as string),
          year,
          repoId: repo.id,
        }));

        if (data.length > 0) {
          await db.commit.createMany({
            data,
            skipDuplicates: true,
          });
          totalImported += data.length;
        }

        if (commits.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return NextResponse.json(
      {
        message: `commits are imported for${year}`,
        success: true,
        totalImported,
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
