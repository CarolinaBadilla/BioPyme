-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "hogares" INTEGER DEFAULT 0,
ADD COLUMN     "mujeres" INTEGER DEFAULT 0,
ADD COLUMN     "poblacionCalle" INTEGER DEFAULT 0,
ADD COLUMN     "poblacionTotal" INTEGER DEFAULT 0,
ADD COLUMN     "poblacionViviendasColectivas" INTEGER DEFAULT 0,
ADD COLUMN     "poblacionViviendasParticulares" INTEGER DEFAULT 0,
ADD COLUMN     "totalViviendas" INTEGER DEFAULT 0,
ADD COLUMN     "varones" INTEGER DEFAULT 0,
ADD COLUMN     "viviendasColectivas" INTEGER DEFAULT 0,
ADD COLUMN     "viviendasParticulares" INTEGER DEFAULT 0,
ADD COLUMN     "viviendasParticularesMoradores" INTEGER DEFAULT 0;
