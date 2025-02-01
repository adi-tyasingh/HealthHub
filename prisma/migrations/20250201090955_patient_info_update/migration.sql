/*
  Warnings:

  - You are about to drop the column `experience` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `doctors` table. All the data in the column will be lost.
  - The `patientData` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `history` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "experience",
DROP COLUMN "specialization",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "speciality" TEXT;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "patientData",
ADD COLUMN     "patientData" JSONB,
DROP COLUMN "history",
ADD COLUMN     "history" JSONB;
