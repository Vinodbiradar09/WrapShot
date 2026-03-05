import { getServerSession } from "next-auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
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
    if (!year) {
      return NextResponse.json(
        { message: "year is required", success: false },
        { status: 400 },
      );
    }
    const token = session.accessToken;
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
          message: "user not found",
          success: false,
        },
        { status: 404 },
      );
    }
    const username = user.username;
    for (const repo of user.repos) {
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/issues?state=all&per_page=100&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const issues = await res.json();
        if (!Array.isArray(issues) || issues.length === 0) {
          hasMore = false;
          break;
        }
        const filtered = issues
          .filter((issue) => !issue.pull_request) // remove PRs
          .filter((issue) => {
            const issueYear = new Date(issue.created_at).getFullYear();
            return issueYear === year;
          });
        const data = filtered.map((issue) => ({
          issueNumber: issue.number,
          createdAt: new Date(issue.created_at),
          closed: issue.closed_at !== null,
          year: year,
          repoId: repo.id,
        }));

        if (data.length > 0) {
          await db.issue.createMany({
            data,
            skipDuplicates: true,
          });
        }
        page++;
      }
    }
    return NextResponse.json(
      {
        message: `Issues imported for ${year}`,
        success: true,
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
