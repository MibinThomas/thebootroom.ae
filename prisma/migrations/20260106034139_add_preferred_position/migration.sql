-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companySector" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "managerEmail" TEXT NOT NULL,
    "managerPhone" TEXT NOT NULL,
    "captainName" TEXT NOT NULL,
    "captainEmail" TEXT NOT NULL,
    "captainPhone" TEXT NOT NULL,
    "logoUrl" TEXT,
    "brandGuidelinesUrl" TEXT,
    "teamPhotoUrl" TEXT,
    "ticketUrl" TEXT,
    "attendance" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jerseySize" TEXT NOT NULL,
    "preferredPosition" TEXT NOT NULL,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
