/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `work_schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `work_schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `work_schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `workScheduleId` on the `work_schedule_days` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `work_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `work_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `work_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `work_schedules` table. All the data in the column will be lost.
  - Added the required column `day_of_week` to the `work_schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `work_schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `work_schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_schedule_id` to the `work_schedule_days` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `work_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `work_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `work_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `work_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "work_schedule_days" DROP CONSTRAINT "work_schedule_days_workScheduleId_fkey";

-- AlterTable
ALTER TABLE "work_schedule_days" DROP COLUMN "dayOfWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "workScheduleId",
ADD COLUMN     "day_of_week" INTEGER NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL,
ADD COLUMN     "work_schedule_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "work_schedules" DROP COLUMN "createdAt",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "work_schedule_id" TEXT,
    "project_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserWorkSchedules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserWorkSchedules_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_UserWorkSchedules_B_index" ON "_UserWorkSchedules"("B");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_schedules" ADD CONSTRAINT "work_schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_schedule_days" ADD CONSTRAINT "work_schedule_days_work_schedule_id_fkey" FOREIGN KEY ("work_schedule_id") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorkSchedules" ADD CONSTRAINT "_UserWorkSchedules_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWorkSchedules" ADD CONSTRAINT "_UserWorkSchedules_B_fkey" FOREIGN KEY ("B") REFERENCES "work_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
