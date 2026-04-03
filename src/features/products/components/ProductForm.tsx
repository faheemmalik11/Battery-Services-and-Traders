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

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
    const router = useRouter()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '')

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
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <input
                                name="name"
                                defaultValue={initialData?.name}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Brand</label>
                            <input
                                name="brand"
                                defaultValue={initialData?.brand}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                name="category"
                                defaultValue={initialData?.category}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            >
                                <option value="car">Car</option>
                                <option value="truck">Truck</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="solar">Solar</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Voltage</label>
                            <select
                                name="voltage"
                                defaultValue={initialData?.voltage}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            >
                                <option value="6">6V</option>
                                <option value="12">12V</option>
                                <option value="24">24V</option>
                                <option value="48">48V</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity (Ah)</label>
                            <input
                                name="capacity"
                                type="number"
                                defaultValue={initialData?.capacity}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={initialData?.price}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock</label>
                            <input
                                name="stock"
                                type="number"
                                defaultValue={initialData?.stock}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded-md object-cover" />
                            )}
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                defaultValue={initialData?.description}
                                rows={4}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                        </div>
                    </div>
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