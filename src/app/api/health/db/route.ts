import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const start = Date.now()
        // Try a simple query
        await prisma.$queryRaw`SELECT 1`
        const duration = Date.now() - start

        return NextResponse.json({
            status: 'connected',
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV
            }
        })
    } catch (error: any) {
        console.error('Database Connection Error:', error)
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}
