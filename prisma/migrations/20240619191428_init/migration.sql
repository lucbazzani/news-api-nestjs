/*
  Warnings:

  - You are about to drop the `CategoriesOnNews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategoriesOnNews";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CategoriesToNews" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoriesToNews_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoriesToNews_B_fkey" FOREIGN KEY ("B") REFERENCES "News" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToNews_AB_unique" ON "_CategoriesToNews"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToNews_B_index" ON "_CategoriesToNews"("B");
