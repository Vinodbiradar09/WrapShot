-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "githubId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "followers" INTEGER,
    "accessToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repo" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PullRequest" (
    "id" TEXT NOT NULL,
    "prNumber" INTEGER NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "merged" BOOLEAN NOT NULL,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "repoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearlyStats" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "totalCommits" INTEGER NOT NULL,
    "totalPRs" INTEGER NOT NULL,
    "totalRepos" INTEGER NOT NULL,
    "topLanguage" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "YearlyStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "Repo_repoId_key" ON "Repo"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "Commit_commitSha_key" ON "Commit"("commitSha");

-- CreateIndex
CREATE INDEX "Commit_repoId_idx" ON "Commit"("repoId");

-- CreateIndex
CREATE INDEX "PullRequest_repoId_idx" ON "PullRequest"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_repoId_prNumber_key" ON "PullRequest"("repoId", "prNumber");

-- CreateIndex
CREATE INDEX "Issue_repoId_idx" ON "Issue"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_repoId_issueNumber_key" ON "Issue"("repoId", "issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "YearlyStats_userId_year_key" ON "YearlyStats"("userId", "year");

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YearlyStats" ADD CONSTRAINT "YearlyStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
