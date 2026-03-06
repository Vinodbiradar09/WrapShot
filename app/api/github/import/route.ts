import { getSession } from "@/app/types/getSession";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GithubRepo } from "@/app/types/types";

export async function POST() {
  try {
    const session = await getSession();

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { message: "Not authenticated", success: false },
        { status: 401 }
      );
    }

    const token = session.accessToken;
    const resUser = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resUser.ok) {
      return NextResponse.json(
        { message: "Failed to fetch GitHub user", success: false },
        { status: 500 }
      );
    }

    const gitUser = await resUser.json();

    const user = await db.user.upsert({
      where: {
        githubId: gitUser.id.toString(),
      },
      update: {
        username: gitUser.login,
        avatarUrl: gitUser.avatar_url,
        followers: gitUser.followers,
        accessToken: token,
      },
      create: {
        githubId: gitUser.id.toString(),
        username: gitUser.login,
        avatarUrl: gitUser.avatar_url,
        followers: gitUser.followers,
        accessToken: token,
      },
    });

    let page = 1;
    const perPage = 100;
    let allRepos: GithubRepo[] = [];

    while (true) {
      const resRepo = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resRepo.ok) {
        throw new Error("Failed to fetch repos from GitHub");
      }

      const repos: GithubRepo[] = await resRepo.json();

      if (repos.length === 0) break;

      allRepos.push(...repos);
      page++;
    }

    const batchSize = 20;

    for (let i = 0; i < allRepos.length; i += batchSize) {
      const batch = allRepos.slice(i, i + batchSize);

      await Promise.all(
        batch.map((repo) =>
          db.repo.upsert({
            where: {
              repoId: repo.id.toString(),
            },
            update: {
              name: repo.name,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
            },
            create: {
              repoId: repo.id.toString(),
              name: repo.name,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              createdAt: new Date(repo.created_at),
              userId: user.id,
            },
          })
        )
      );
    }

    return NextResponse.json(
      {
        message: "GitHub data imported successfully",
        success: true,
        reposImported: allRepos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}