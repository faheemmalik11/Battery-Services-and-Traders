'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Product } from '../types'

interface ProductFormProps {
    initialData?: Product
    onSubmit: (data: FormData, imageFile?: File) => Promise<void>
    isLoading: boolean
}

const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm'

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const router = useRouter()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '')

    const s = initialData?.specifications

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await onSubmit(formData, imageFile || undefined)
    }

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
                                <input
                                    name="name"
                                    defaultValue={initialData?.name}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Model</label>
                                <input
                                    name="model"
                                    defaultValue={initialData?.model}
                                    className={inputClass}
                                    placeholder="e.g. 6FT15"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Brand</label>
                                <input
                                    name="brand"
                                    defaultValue={initialData?.brand}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Pricing & inventory
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price ($)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={initialData?.price}
                                    className={inputClass}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock</label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    defaultValue={initialData?.stock}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Media</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={inputClass}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 w-32 rounded-md object-cover"
                                />
                            )}
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            rows={4}
                            className={inputClass}
                        />
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Technical specifications
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Battery type</label>
                                <input
                                    name="batteryType"
                                    defaultValue={s?.batteryType}
                                    className={inputClass}
                                    placeholder="e.g. 6FT15"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Plates per cell</label>
                                <input
                                    name="platesPerCell"
                                    type="number"
                                    min="0"
                                    defaultValue={s?.platesPerCell ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Voltage (V)</label>
                                <select
                                    name="voltage"
                                    defaultValue={s?.voltage ?? 12}
                                    className={inputClass}
                                    required
                                >
                                    <option value="6">6</option>
                                    <option value="12">12</option>
                                    <option value="24">24</option>
                                    <option value="48">48</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Capacity @ 20hr (Ah)</label>
                                <input
                                    name="capacity20hr"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.capacity20hr ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Capacity @ 5hr (Ah)</label>
                                <input
                                    name="capacity5hr"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.capacity5hr ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Terminal type</label>
                                <input
                                    name="terminalType"
                                    defaultValue={s?.terminalType}
                                    className={inputClass}
                                    placeholder="e.g. T2 (Thick)"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Polarity</label>
                                <select
                                    name="polarity"
                                    defaultValue={s?.polarity ?? ''}
                                    className={inputClass}
                                >
                                    <option value="">—</option>
                                    <option value="L">L</option>
                                    <option value="R">R</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Weight (kg)</label>
                                <input
                                    name="weightKg"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.weightKg ?? ''}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <h4 className="pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Dimensions (mm)
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Length</label>
                                <input
                                    name="dim_length"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.dimensions?.length ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Width</label>
                                <input
                                    name="dim_width"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.dimensions?.width ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Height</label>
                                <input
                                    name="dim_height"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.dimensions?.height ?? ''}
                                    className={inputClass}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Container height</label>
                                <input
                                    name="dim_containerHeight"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={s?.dimensions?.containerHeight ?? ''}
                                    className={inputClass}
                                />
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
