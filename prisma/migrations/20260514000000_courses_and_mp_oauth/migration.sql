-- AlterTable
ALTER TABLE "AdminConfig" ADD COLUMN     "mpAccessToken" TEXT,
ADD COLUMN     "mpAccountEmail" TEXT,
ADD COLUMN     "mpAccountNickname" TEXT,
ADD COLUMN     "mpConnectedAt" TIMESTAMP(3),
ADD COLUMN     "mpLiveMode" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mpPublicKey" TEXT,
ADD COLUMN     "mpRefreshToken" TEXT,
ADD COLUMN     "mpTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "mpUserId" TEXT;

-- CreateTable
CREATE TABLE "CourseFile" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseFile_workshopId_idx" ON "CourseFile"("workshopId");

-- AddForeignKey
ALTER TABLE "CourseFile" ADD CONSTRAINT "CourseFile_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

