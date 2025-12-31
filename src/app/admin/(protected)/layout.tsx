import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/authorization";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    try {
        await requireAdmin();
    } catch (error) {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden md:block w-64 border-r bg-white fixed h-full inset-y-0 z-50">
                <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64">
                <AdminHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
