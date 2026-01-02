import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { requireAdmin } from '@/lib/authorization'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function signCloudinaryParams(params: Record<string, string | number | undefined>, apiSecret: string) {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && `${v}`.length > 0)
    .map(([k, v]) => [k, `${v}`] as const)
    .sort(([a], [b]) => a.localeCompare(b))

  const toSign = entries.map(([k, v]) => `${k}=${v}`).join('&')
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex')
}

export async function GET() {
  try {
    await requireAdmin()

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary env vars are missing' },
        { status: 500 }
      )
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = 'blog'

    const signature = signCloudinaryParams(
      {
        folder,
        timestamp,
        upload_preset: uploadPreset,
      },
      apiSecret
    )

    return NextResponse.json({
      cloudName,
      apiKey,
      uploadPreset,
      timestamp,
      folder,
      signature,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create Cloudinary signature' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary env vars are missing' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const folder = typeof body.folder === 'string' ? body.folder : 'services'

    const timestamp = Math.floor(Date.now() / 1000)

    const signature = signCloudinaryParams(
      {
        folder,
        timestamp,
        upload_preset: uploadPreset,
      },
      apiSecret
    )

    return NextResponse.json({
      cloudName,
      apiKey,
      uploadPreset,
      timestamp,
      folder,
      signature,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create Cloudinary signature' },
      { status: 500 }
    )
  }
}
