import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const publicId = searchParams.get('publicId')

        if (!publicId) {
            return NextResponse.json({ error: 'No publicId provided' }, { status: 400 })
        }

        const result = await cloudinary.uploader.destroy(publicId)

        return NextResponse.json({ success: result.result === 'ok' })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}