import { Suspense } from 'react'
import { adminService } from '@/services/admin.service'
import { AnalyticsClient } from './analytics-client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
    title: "Analytics | Admin Panel",
    description: "Platform performance metrics",
};

export default async function AnalyticsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/auth/login')
    }

    const range = (searchParams.range as '7d' | '30d' | '90d') || '30d'
    const data = await adminService.getAnalytics(range)

    return (
        <Suspense fallback={<AnalyticsLoading />}>
            <AnalyticsClient data={data} />
        </Suspense>
    )
}

function AnalyticsLoading() {
    return <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
    </div>
}
