-- CreateTable
CREATE TABLE "localidades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "habitantes" INTEGER NOT NULL,
    "departamento" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "intendente" TEXT NOT NULL,
    "vinculo" TEXT,
    "empresas" TEXT,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ypf_stations" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ypf_stations_pkey" PRIMARY KEY ("id")
);
