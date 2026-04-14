import Link from 'next/link'
import { Product } from '../types'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock === 0
    const primaryImage = product.images?.[0]

    return (
        <div className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md ${isOutOfStock ? 'opacity-60' : ''}`}>
            <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
                <div className="aspect-square overflow-hidden bg-muted">
                    {primaryImage ? (
                        <img
                            src={primaryImage}
                            alt={product.name}
                            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                        />
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

                    <div className="mt-auto pt-2">
                        {isOutOfStock ? (
                            <p className="text-xs font-medium text-destructive">Out of stock</p>
                        ) : (
                            <p className="text-base font-bold">
                                Rs.{' '}
                                {product.price.toLocaleString('en-PK')}
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