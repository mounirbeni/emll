"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ExportBookingsButton() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/bookings/export');
            if (!response.ok) throw new Error('Export failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Bookings exported successfully");
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl gap-2"
        >
            <Download className="h-4 w-4" />
            {loading ? "Exporting..." : "Export CSV"}
        </Button>
    );
}
