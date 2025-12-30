import { z } from "zod";

// Set default AUTH_SECRET for development if not provided
if (!process.env.AUTH_SECRET && process.env.NODE_ENV !== "production") {
    process.env.AUTH_SECRET = "dev-secret-key-change-in-production-min-32-chars-required";
}

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXTAUTH_URL: z.string().url().optional(), // Optional for Vercel
    AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
