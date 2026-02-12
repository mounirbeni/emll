-- AlterEnum: Add new values to PaymentStatus
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'PENDING_VERIFICATION';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CASH_ON_ARRIVAL';

-- AlterEnum: Add BANK_TRANSFER to PaymentMethod
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'BANK_TRANSFER';

-- AlterTable: Add transactionId and proofImageUrl to Payment
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "transactionId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "proofImageUrl" TEXT;
