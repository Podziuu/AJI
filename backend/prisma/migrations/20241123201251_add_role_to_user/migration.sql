-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WORKER', 'CLIENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';
