/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shareToken]` on the table `folders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "file_collaborators" ADD COLUMN     "invitedBy" TEXT;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "isPubliclyShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicShareRole" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "shareTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "folder_collaborators" ADD COLUMN     "invitedBy" TEXT;

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "isPubliclyShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicShareRole" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "shareTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "files_shareToken_key" ON "files"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "folders_shareToken_key" ON "folders"("shareToken");
