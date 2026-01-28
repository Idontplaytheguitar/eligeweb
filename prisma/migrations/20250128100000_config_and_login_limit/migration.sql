-- AlterTable
ALTER TABLE "AdminConfig" ADD COLUMN "notifyOnContact" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "AdminConfig" ADD COLUMN "notifyOnBooking" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "AdminConfig" ADD COLUMN "emailSenderName" TEXT;
ALTER TABLE "AdminConfig" ADD COLUMN "whatsappDefaultMessage" TEXT;
ALTER TABLE "AdminConfig" ADD COLUMN "contactAutoReplyEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AdminConfig" ADD COLUMN "contactAutoReplyText" TEXT;
ALTER TABLE "AdminConfig" ADD COLUMN "absenceNoticeEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AdminConfig" ADD COLUMN "absenceNoticeText" TEXT;

-- CreateTable
CREATE TABLE "AdminLoginAttempt" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminLoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminLoginAttempt_ipHash_key" ON "AdminLoginAttempt"("ipHash");
