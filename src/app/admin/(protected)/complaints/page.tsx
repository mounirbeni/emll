import { Suspense } from "react";
import { supportService } from "@/services/support.service";
import { ComplaintsClient } from "./complaints-client";
import { requireAdmin } from "@/app/actions/admin-actions"; // Import from actions or just use session check?
// Actually requireAdmin is not exported from admin-actions.ts, it's internal helper.
// I should use standard layout protection (which is usually sufficient if layout uses middleware/session check).
// But for data fetching I should check session or use "use server" actions? 
// No, this is a Server Component, I can just fetch data directly if I am sure it's protected.
// Apps in (protected) layout are protected.
import Loading from "./loading";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Support Requests | Admin Panel",
    description: "Manage customer support requests and inquiries",
};

export default async function ComplaintsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect("/auth/login"); // Or 403
    }

    // Fetch data directly on server
    const requests = await supportService.getAllRequests();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support Requests</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and respond to customer inquiries and support tickets.
                </p>
            </div>

            <Suspense fallback={<Loading />}>
                <ComplaintsClient initialRequests={requests} />
            </Suspense>
        </div>
    );
}
