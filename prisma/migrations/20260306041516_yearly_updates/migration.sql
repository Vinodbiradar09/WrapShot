-- AlterTable
ALTER TABLE "YearlyStats" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "closedIssues" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longestStreak" INTEGER,
ADD COLUMN     "mergedPRs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mostActiveMonth" INTEGER,
ADD COLUMN     "totalAdditions" INTEGER,
ADD COLUMN     "totalDeletions" INTEGER,
ADD COLUMN     "totalIssues" INTEGER NOT NULL DEFAULT 0;
