'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

export function CloudinaryUpload() {
    const [imageUrl, setImageUrl] = useState<string>('')

    return (
        <div className="max-w-md space-y-4 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Test Cloudinary Upload</h3>

            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(result) => {
                    // @ts-ignore
                    setImageUrl(result.info?.secure_url)
                }}
            >
                {({ open }) => (
                    <button
                        onClick={() => open()}
                        className="w-full bg-blue-500 text-white p-2 rounded"
                    >
                        Upload Image
                    </button>
                )}
            </CldUploadWidget>

            {imageUrl && (
                <div className="mt-4">
                    <img src={imageUrl} alt="Uploaded" className="rounded border" />
                    <input
                        value={imageUrl}
                        readOnly
                        className="w-full mt-2 p-1 text-sm border rounded"
                    />
                </div>
            )}
        </div>
    )
}