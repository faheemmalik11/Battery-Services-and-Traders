import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})
const MAX_FILES = 5
async function uploadToCloudinary(buffer: Buffer): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'products',
                allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
            },
            (error, result) => {
                if (error || !result) reject(error)
                else resolve({ url: result.secure_url, publicId: result.public_id })
            }
        ).end(buffer)
    })
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files.length) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 })
        }
        if (files.length > MAX_FILES) {
            return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
        }

        const results = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)
                return uploadToCloudinary(buffer)
            })
        )

        return NextResponse.json({ uploads: results })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}