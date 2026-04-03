'use client'

import Link from 'next/link'
import { Product } from '../types'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface ProductGridProps {
    products: Product[]
    viewMode: 'grid' | 'list'
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                        <Card className="transition-colors hover:bg-muted/50">
                            <div className="flex gap-4 p-4">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-muted" />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-lg font-bold">${product.price.toLocaleString()}</span>
                                        {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                    <Card className="h-full transition-all hover:shadow-lg">
                        <CardHeader className="p-0">
                            <div className="aspect-square overflow-hidden rounded-t-lg">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <span className="text-muted-foreground">No image</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xl font-bold">${product.price.toLocaleString()}</span>
                                {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <div className="text-xs text-muted-foreground">
                                {product.capacity} Ah • {product.voltage}V
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    )
}