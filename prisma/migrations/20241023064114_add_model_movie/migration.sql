-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalId" TEXT NOT NULL DEFAULT '',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
