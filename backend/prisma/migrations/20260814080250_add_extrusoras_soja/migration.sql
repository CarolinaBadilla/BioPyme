-- CreateTable
CREATE TABLE "extrusoras_soja" (
    "id" SERIAL NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extrusoras_soja_pkey" PRIMARY KEY ("id")
);
