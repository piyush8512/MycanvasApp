-- CreateTable
CREATE TABLE "user_canvas_layouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_canvas_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_folder_layouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_folder_layouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_canvas_layouts_userId_idx" ON "user_canvas_layouts"("userId");

-- CreateIndex
CREATE INDEX "user_canvas_layouts_fileId_idx" ON "user_canvas_layouts"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "user_canvas_layouts_userId_fileId_key" ON "user_canvas_layouts"("userId", "fileId");

-- CreateIndex
CREATE INDEX "user_folder_layouts_userId_idx" ON "user_folder_layouts"("userId");

-- CreateIndex
CREATE INDEX "user_folder_layouts_folderId_idx" ON "user_folder_layouts"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "user_folder_layouts_userId_folderId_key" ON "user_folder_layouts"("userId", "folderId");

-- AddForeignKey
ALTER TABLE "user_canvas_layouts" ADD CONSTRAINT "user_canvas_layouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_canvas_layouts" ADD CONSTRAINT "user_canvas_layouts_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_folder_layouts" ADD CONSTRAINT "user_folder_layouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_folder_layouts" ADD CONSTRAINT "user_folder_layouts_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
