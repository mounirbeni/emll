import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Wishlist toggle.
 *
 * The `wishlist` String[] already existed on User and was surfaced by
 * /api/dashboard/stats, but nothing could ever write to it — the heart buttons
 * were inert and the sidebar linked to a page that did not exist.
 */

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wishlist: true },
    });

    return NextResponse.json({ wishlist: user?.wishlist ?? [] });
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let experienceId: unknown;
    try {
        ({ experienceId } = await request.json());
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (typeof experienceId !== "string" || experienceId.trim() === "") {
        return NextResponse.json({ error: "experienceId is required" }, { status: 400 });
    }

    // Only allow saving experiences that actually exist.
    const experience = await prisma.experience.findUnique({
        where: { id: experienceId },
        select: { id: true },
    });
    if (!experience) {
        return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { wishlist: true },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const current = user.wishlist ?? [];
    const saved = current.includes(experienceId);
    const wishlist = saved
        ? current.filter((id) => id !== experienceId)
        : [...current, experienceId];

    await prisma.user.update({
        where: { id: session.user.id },
        data: { wishlist },
    });

    return NextResponse.json({ saved: !saved, wishlist });
}
