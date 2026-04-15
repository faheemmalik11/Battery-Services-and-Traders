import Link from 'next/link'
import { Product } from '../types'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock === 0
    const primaryImage = product.images?.[0]

    const specs = [
        { label: 'Reserve Capacity', value: product.reserveCapacity ?? null, unit: '' },
        { label: 'Cold Cranking Amps', value: product.coldCrankingAmperes ?? null, unit: '' },
        { label: 'Ampere Hour', value: product.amperePerHour ?? null, unit: 'Ah' },
    ].filter((s) => s.value !== null)

    return (
        <div className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md ${isOutOfStock ? 'opacity-60' : ''}`}>
            <Link href={`/products/${product.id}`} className="flex flex-col flex-1">

                <div className="relative aspect-square overflow-hidden bg-muted">
                    {primaryImage ? (
                        <>
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                            />
                            {product.images.length > 1 && (
                                <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
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

                <div className="flex flex-1 flex-col p-3">
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">
                        {product.name}
                    </h3>

                    {specs.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-t pt-3">
                            {specs.map((spec) => (
                                <div key={spec.label} className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                                    <span className="text-xs font-medium">
                                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto pt-2">
                        {isOutOfStock ? (
                            <p className="text-xs font-medium text-destructive">Out of stock</p>
                        ) : (
                            <p className="text-base font-bold">
                                Rs. {product.price.toLocaleString('en-PK')}
                            </p>
                        )}
                    </div>
                </div>
            </Link>

            <div className="px-3 pb-3">
                {isOutOfStock ? (
                    <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-border bg-muted py-2 text-xs font-medium text-muted-foreground"
                    >
                        Unavailable
                    </button>
                ) : (
                    <Link
                        href={`/products/${product.id}`}
                        className="block w-full rounded-lg bg-foreground py-2 text-center text-xs font-medium text-background transition-opacity hover:opacity-80"
                    >
                        Enquire
                    </Link>
                )}
            </div>
        </div>
    )
}