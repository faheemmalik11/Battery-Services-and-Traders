'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Product, CreateProductInput } from '../types'

interface ExistingImage {
    url: string
    publicId: string
}

interface ProductFormProps {
    initialData?: Product
    onSubmit: (data: CreateProductInput, newImageFiles: File[], removedPublicIds: string[]) => Promise<void>
    isLoading: boolean
}

const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm'

function getPublicIdFromUrl(url: string): string {
    // extracts "products/abc123" from a cloudinary url
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i)
    return match ? match[1] : url
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const router = useRouter()

    const [existingImages, setExistingImages] = useState<ExistingImage[]>(
        initialData?.images?.map((url) => ({
            url,
            publicId: getPublicIdFromUrl(url),
        })) ?? []
    )
    const [newFiles, setNewFiles] = useState<File[]>([])
    const [newPreviews, setNewPreviews] = useState<string[]>([])
    const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (!selected.length) return

        setNewFiles((prev) => [...prev, ...selected])
        setNewPreviews((prev) => [
            ...prev,
            ...selected.map((f) => URL.createObjectURL(f)),
        ])

        // reset input so same file can be re-selected if removed
        e.target.value = ''
    }

    const removeExisting = (index: number) => {
        const removed = existingImages[index]
        setRemovedPublicIds((prev) => [...prev, removed.publicId])
        setExistingImages((prev) => prev.filter((_, i) => i !== index))
    }

    const removeNew = (index: number) => {
        URL.revokeObjectURL(newPreviews[index])
        setNewFiles((prev) => prev.filter((_, i) => i !== index))
        setNewPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)

        const data: CreateProductInput = {
            name: fd.get('name') as string,
            brand: fd.get('brand') as string,
            model: fd.get('model') as string,
            variant: (fd.get('variant') as string) || undefined,
            price: Number(fd.get('price')),
            stock: Number(fd.get('stock')),
            warranty: Number(fd.get('warranty')),
            amperePerHour: Number(fd.get('amperePerHour')),
            coldCrankingAmperes: fd.get('coldCrankingAmperes') ? Number(fd.get('coldCrankingAmperes')) : undefined,
            reserveCapacity: fd.get('reserveCapacity') ? Number(fd.get('reserveCapacity')) : undefined,
            terminalType: (fd.get('terminalType') as string) || undefined,
            description: (fd.get('description') as string) || undefined,
            images: existingImages.map((img) => img.url),
            dimensions: {
                length: fd.get('dim_length') ? Number(fd.get('dim_length')) : undefined,
                width: fd.get('dim_width') ? Number(fd.get('dim_width')) : undefined,
                height: fd.get('dim_height') ? Number(fd.get('dim_height')) : undefined,
                thickness: fd.get('dim_thickness') ? Number(fd.get('dim_thickness')) : undefined,
                weight: fd.get('weightKg') ? Number(fd.get('weightKg')) : undefined,
            },
        }

        await onSubmit(data, newFiles, removedPublicIds)
    }

    const totalImages = existingImages.length + newFiles.length

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{initialData ? 'Edit Product' : 'Create New Product'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Basic info</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product name</label>
                                <input name="name" defaultValue={initialData?.name} className={inputClass} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Brand</label>
                                <input name="brand" defaultValue={initialData?.brand} className={inputClass} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Model</label>
                                <input name="model" defaultValue={initialData?.model} className={inputClass} required placeholder="e.g. GL-100" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Variant <span className="text-muted-foreground">(optional)</span></label>
                                <input name="variant" defaultValue={initialData?.variant} className={inputClass} placeholder="e.g. Plus" />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Pricing & inventory</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (Rs.)</label>
                                <input name="price" type="number" min="0" defaultValue={initialData?.price} className={inputClass} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock</label>
                                <input name="stock" type="number" min="0" defaultValue={initialData?.stock} className={inputClass} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Warranty (months)</label>
                                <input name="warranty" type="number" min="0" defaultValue={initialData?.warranty} className={inputClass} required />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Images
                            <span className="ml-2 font-normal text-muted-foreground">({totalImages} total)</span>
                        </h3>

                        {totalImages > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {existingImages.map((img, i) => (
                                    <div key={img.publicId} className="relative h-24 w-24">
                                        <img src={img.url} alt="" className="h-full w-full rounded-md object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExisting(i)}
                                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {newPreviews.map((src, i) => (
                                    <div key={src} className="relative h-24 w-24">
                                        <img src={src} alt="" className="h-full w-full rounded-md object-cover opacity-80 ring-2 ring-primary" />
                                        <button
                                            type="button"
                                            onClick={() => removeNew(i)}
                                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                                        >
                                            <X size={12} />
                                        </button>
                                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">new</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className={inputClass}
                        />
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG or WebP. You can select multiple files at once.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                        <textarea name="description" defaultValue={initialData?.description} rows={4} className={inputClass} />
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Technical specifications</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ampere per hour (Ah)</label>
                                <input name="amperePerHour" type="number" step="0.01" min="0" defaultValue={initialData?.amperePerHour ?? ''} className={inputClass} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cold cranking amperes (CCA)</label>
                                <input name="coldCrankingAmperes" type="number" step="0.01" min="0" defaultValue={initialData?.coldCrankingAmperes ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reserve capacity (minutes)</label>
                                <input name="reserveCapacity" type="number" step="0.01" min="0" defaultValue={initialData?.reserveCapacity ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Terminal type</label>
                                <input name="terminalType" defaultValue={initialData?.terminalType ?? ''} className={inputClass} placeholder="e.g. T2 (Thick)" />
                            </div>
                        </div>

                        <h4 className="pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Dimensions (mm) & weight</h4>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Length</label>
                                <input name="dim_length" type="number" step="0.01" min="0" defaultValue={initialData?.dimensions?.length ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Width</label>
                                <input name="dim_width" type="number" step="0.01" min="0" defaultValue={initialData?.dimensions?.width ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Height</label>
                                <input name="dim_height" type="number" step="0.01" min="0" defaultValue={initialData?.dimensions?.height ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Thickness</label>
                                <input name="dim_thickness" type="number" step="0.01" min="0" defaultValue={initialData?.dimensions?.thickness ?? ''} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Weight (kg)</label>
                                <input name="weightKg" type="number" step="0.01" min="0" defaultValue={initialData?.dimensions?.weight ?? ''} className={inputClass} />
                            </div>
                        </div>
                    </section>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}