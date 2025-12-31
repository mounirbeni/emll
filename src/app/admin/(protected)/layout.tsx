import { AdminSidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    try {
        await requireAdmin();
    } catch (error) {
        redirect("/admin/login");
    }

    return (
        <div className="flex bg-muted/20 min-h-screen">
            <div className="hidden md:block">
                <AdminSidebar />
            </div>
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
