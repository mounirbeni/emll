import { NextResponse } from 'next/server';
import { bookingRepository } from '@/repositories/booking.repository';
import { adminService } from '@/services/admin.service';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function GET() {
    try {
        // Require admin authentication
        await requireAdmin();

        const [stats, alerts, urgentStats, topServices] = await Promise.all([
            adminService.getDailyStats(),
            adminService.getAdminAlerts(),
            adminService.getUrgentStats(),
            adminService.getTopServices()
        ]);

        return successResponse({
            stats,
            alerts,
            urgentStats,
            topServices
        });

    } catch (error) {
        return errorResponse(error);
    }
}
