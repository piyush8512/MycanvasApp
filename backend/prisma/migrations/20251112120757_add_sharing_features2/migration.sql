/*
  Warnings:

  - A unique constraint covering the columns `[userId,folderId]` on the table `shared_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,fileId]` on the table `shared_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shared_items_userId_folderId_key" ON "shared_items"("userId", "folderId");

-- CreateIndex
CREATE UNIQUE INDEX "shared_items_userId_fileId_key" ON "shared_items"("userId", "fileId");
