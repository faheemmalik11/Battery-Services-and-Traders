'use client'

import Link from 'next/link'
import { Product } from '../types'

interface ProductListViewProps {
    products: Product[]
}

export function ProductListView({ products }: ProductListViewProps) {
    if (products.length === 0) return null

    return (
        <div className="flex flex-col gap-3">
            {products.map((product) => {
                const isOutOfStock = product.stock === 0
                const primaryImage = product.images?.[0]

                const specs = [
                    { label: 'Reserve Capacity', value: product.reserveCapacity ?? null, unit: '' },
                    { label: 'Cold Cranking Amps', value: product.coldCrankingAmperes ?? null, unit: '' },
                    { label: 'Ampere Hour', value: product.amperePerHour ?? null, unit: 'Ah' },
                    { label: 'Warranty', value: product.warranty ?? null, unit: 'months' },
                ].filter((s) => s.value !== null)

                return (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className={`group flex gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md ${isOutOfStock ? 'opacity-60' : ''}`}
                    >
                        {/* Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                            {primaryImage ? (
                                <>
                                    <img
                                        src={primaryImage}
                                        alt={product.name}
                                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {product.images.length > 1 && (
                                        <span className="absolute bottom-1 right-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                                            +{product.images.length - 1}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="text-xs text-muted-foreground">No image</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-2 min-w-0">

                            {/* Top row — name + price */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                                    <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {product.model}{product.variant ? ` (${product.variant})` : ''}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    {isOutOfStock ? (
                                        <p className="text-xs font-medium text-destructive">Out of stock</p>
                                    ) : (
                                        <p className="text-base font-bold">
                                            Rs. {product.price.toLocaleString('en-PK')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Specs row */}
                            {specs.length > 0 && (
                                <div className="flex flex-wrap gap-x-5 gap-y-1 border-t pt-2">
                                    {specs.map((spec) => (
                                        <div key={spec.label} className="flex items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">{spec.label}:</span>
                                            <span className="text-xs font-semibold">
                                                {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Bottom row — terminal + enquire */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    {product.terminalType && (
                                        <span className="text-xs text-muted-foreground">
                                            Terminal: <span className="font-medium text-foreground">{product.terminalType}</span>
                                        </span>
                                    )}
                                    {!isOutOfStock && product.stock < 10 && (
                                        <span className="text-xs font-medium text-orange-600">
                                            Only {product.stock} left
                                        </span>
                                    )}
                                </div>
                                <span className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80">
                                    Enquire
                                </span>
                            </div>

                        </div>
                    </Link>
                )
            })}
        </div>
    )
}