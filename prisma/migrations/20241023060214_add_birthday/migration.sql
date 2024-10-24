/*
  Warnings:

  - Added the required column `birthday` to the `author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "author" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
