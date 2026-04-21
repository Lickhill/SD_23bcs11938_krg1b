-- AlterTable
ALTER TABLE "users" ADD COLUMN     "wishlist" TEXT[] DEFAULT ARRAY[]::TEXT[];
