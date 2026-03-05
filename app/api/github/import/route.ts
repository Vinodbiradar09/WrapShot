import { getServerSession } from "next-auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface GithubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  created_at: string;
}

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        {
          message: "Not authenticated",
          success: false,
        },
        { status: 401 },
      );
    }
    const token = session.accessToken;

    // fetch the user details
    const resUser = await fetch(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const gitUser = await resUser.json();
    // store user to db
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

    // fetch repo details
    const resRepo = await fetch(
      `https://api.github.com/user/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const gitRepos: GithubRepo[] = await resRepo.json();
    // store repos to db
    // perform single transaction with upsert and create
    const upsertData = gitRepos.map((repo) =>
      db.repo.upsert({
        where: { repoId: repo.id.toString() },
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
      }),
    );
    await db.$transaction(upsertData);
    return NextResponse.json(
      {
        message: "github data is imported",
        success: true,
        repos: gitRepos.length,
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
