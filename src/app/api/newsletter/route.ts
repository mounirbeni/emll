import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Upsert to handle duplicates gracefully
        const subscriber = await prisma.newsletterSubscriber.upsert({
            where: { email },
            update: { active: true },
            create: { email },
        });

        return NextResponse.json({ success: true, subscriber }, { status: 201 });
    } catch (error) {
        console.error("Newsletter error:", error);
        return NextResponse.json(
            { error: "Failed to subscribe" },
            { status: 500 }
        );
    }
}
