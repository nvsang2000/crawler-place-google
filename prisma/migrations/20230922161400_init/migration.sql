-- CreateTable
CREATE TABLE "place" (
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "googleMapLink" TEXT,
    "displayName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "website" TEXT,
    "address" TEXT NOT NULL,
    "linkProfile" JSONB,
    "googleVerified" BOOLEAN DEFAULT false,
    "googleActived" BOOLEAN DEFAULT false,
    "categories" JSONB,
    "thumbnailUrl" TEXT,
    "imagesUrl" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "place_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_google_map_key" ON "place"("googleMapLink");

-- CreateIndex
CREATE UNIQUE INDEX "Place_phone_key" ON "place"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Place_address_key" ON "place"("address");
