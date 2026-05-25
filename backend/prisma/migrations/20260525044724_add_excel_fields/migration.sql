-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "equipment" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hasSecEnergyLicense" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSelloB100" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAssociated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "knowsChamber" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "oilType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "projectStatus" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "secEnergyProcessStatus" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "wantsToAssociate" BOOLEAN NOT NULL DEFAULT false;
