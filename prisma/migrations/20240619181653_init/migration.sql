/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `publication_date` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Users` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CategoriesOnNews" (
    "news_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("news_id", "category_id"),
    CONSTRAINT "CategoriesOnNews_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "News" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoriesOnNews_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Categories" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "Categories";
DROP TABLE "Categories";
ALTER TABLE "new_Categories" RENAME TO "Categories";
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_date" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    CONSTRAINT "News_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_News" ("author_id", "content", "id", "title") SELECT "author_id", "content", "id", "title" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE TABLE "new_Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Users" ("created_at", "email", "id", "name", "password") SELECT "created_at", "email", "id", "name", "password" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
