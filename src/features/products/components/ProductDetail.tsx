'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Product } from '../types'

interface ProductDetailProps {
    product: Product
}

function specLine(label: string, value: string | number | undefined | null) {
    if (value === undefined || value === null || value === '') return null
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '')
    const images = product.images || []

    const getStockBadge = (stock: number) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
        if (stock < 10) return <Badge variant="default">Low Stock ({stock})</Badge>
        return <Badge variant="secondary">In Stock ({stock})</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-muted-foreground">
                        {product.brand}
                        {product.model ? ` · ${product.model}` : ''}
                    </p>
                </div>
                <Link href={`/cms/products/${product.id}/edit`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Product
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <Card>
                        <CardContent className="p-6">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
                                    <p className="text-muted-foreground">No image available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Thumbnail Grid */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`relative overflow-hidden rounded-lg border-2 transition-all hover:opacity-80 ${selectedImage === image
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-border'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="h-20 w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {specLine('Model', product.model)}
                                {specLine('Variant', product.variant)}
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-medium">Rs. {product.price.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Stock</p>
                                    <div>{getStockBadge(product.stock)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            {specLine('Ampere per hour', product.amperePerHour != null ? `${product.amperePerHour} Ah` : undefined)}
                            {specLine('Cold cranking amperes', product.coldCrankingAmperes != null ? `${product.coldCrankingAmperes} CCA` : undefined)}
                            {specLine('Reserve capacity', product.reserveCapacity != null ? `${product.reserveCapacity} min` : undefined)}
                            {specLine('Warranty', product.warranty != null ? `${product.warranty} months` : undefined)}
                            {specLine('Terminal type', product.terminalType)}
                            {(product.dimensions?.length != null ||
                                product.dimensions?.width != null ||
                                product.dimensions?.height != null ||
                                product.dimensions?.thickness != null) && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">Dimensions (mm)</p>
                                        <p className="font-medium">
                                            {[
                                                product.dimensions?.length != null ? `L ${product.dimensions.length}` : null,
                                                product.dimensions?.width != null ? `W ${product.dimensions.width}` : null,
                                                product.dimensions?.height != null ? `H ${product.dimensions.height}` : null,
                                                product.dimensions?.thickness != null ? `Thickness ${product.dimensions.thickness}` : null,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                )}
                            {specLine('Weight', product.dimensions?.weight != null ? `${product.dimensions.weight} kg` : undefined)}
                        </CardContent>
                    </Card>

                    {product.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{product.description}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}