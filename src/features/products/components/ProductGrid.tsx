import { Product } from '../types'
import { ProductCard } from './ProductCard'
import { ProductListView } from './ProductListView'
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
        return <ProductListView products={products} />
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}