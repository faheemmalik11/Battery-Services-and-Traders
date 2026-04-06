import { Product } from '../types'
import { ProductCard } from './ProductCard'
import Link from 'next/link'

interface ProductGridProps {
    products: Product[]
    viewMode?: 'grid' | 'list'
}

export function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
    if (products.length === 0) {
        return null
    }

    if (viewMode === 'list') {
        return (
            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group flex gap-4 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md"
                    >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </div>

                        <div className="flex flex-1 flex-col justify-center gap-0.5">
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                            <h3 className="text-sm font-semibold">{product.name}</h3>
                            {product.stock === 0 ? (
                                <p className="text-xs font-medium text-destructive">Out of stock</p>
                            ) : (
                                <p className="text-sm font-bold">
                                    Rs. {product.price.toLocaleString('en-PK')}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center">
                            {product.stock === 0 ? (
                                <span className="rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                    Unavailable
                                </span>
                            ) : (
                                <span className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">
                                    Enquire
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}