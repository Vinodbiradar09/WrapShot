/*
  Warnings:

  - Added the required column `year` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Commit_year_idx" ON "Commit"("year");
