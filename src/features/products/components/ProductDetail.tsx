'use client'

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
    const getStockBadge = (stock: number) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
        if (stock < 10) return <Badge variant="default">Low Stock ({stock})</Badge>
        return <Badge variant="secondary">In Stock ({stock})</Badge>
    }

    const s = product.specifications
    const d = s.dimensions

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
                <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full rounded-lg object-cover"
                            />
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                                <p className="text-muted-foreground">No image available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {specLine('Model', product.model)}
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="font-medium">${product.price.toLocaleString()}</p>
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
                            {specLine('Battery type', s.batteryType)}
                            {specLine('Plates per cell', s.platesPerCell)}
                            {specLine('Voltage', `${s.voltage}V`)}
                            {specLine('Capacity @ 20hr', s.capacity20hr != null ? `${s.capacity20hr} Ah` : undefined)}
                            {specLine('Capacity @ 5hr', s.capacity5hr != null ? `${s.capacity5hr} Ah` : undefined)}
                            {specLine('Terminal type', s.terminalType)}
                            {specLine('Polarity', s.polarity)}
                            {specLine('Weight', s.weightKg != null ? `${s.weightKg} kg` : undefined)}
                            {(d?.length != null ||
                                d?.width != null ||
                                d?.height != null ||
                                d?.containerHeight != null) && (
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Dimensions (mm)</p>
                                    <p className="font-medium">
                                        {[
                                            d?.length != null ? `L ${d.length}` : null,
                                            d?.width != null ? `W ${d.width}` : null,
                                            d?.height != null ? `H ${d.height}` : null,
                                            d?.containerHeight != null ? `Container ${d.containerHeight}` : null,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                </div>
                            )}
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
