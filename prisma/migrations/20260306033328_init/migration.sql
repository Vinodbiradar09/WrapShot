-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "additions" INTEGER,
ADD COLUMN     "author" TEXT,
ADD COLUMN     "deletions" INTEGER;
