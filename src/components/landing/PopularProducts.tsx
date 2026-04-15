'use client'

import { useProducts } from '@/features/products/hooks/useProducts'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ArrowRight } from 'lucide-react'

export function PopularProducts() {
    const { data: products, isLoading } = useProducts()
    const popularProducts = products?.slice(0, 5)

    if (isLoading) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div>Loading products...</div>
                    </div>
                </div>
            </section>
        )
    }

    if (!popularProducts || popularProducts.length === 0) {
        return null
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Popular Products
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Our best-selling batteries trusted by thousands of customers
                    </p>
                </div>
                <ProductGrid products={popularProducts} viewMode="grid" />
                <div className="mt-12 text-center">
                    <Link href="/products">
                        <Button variant="link">
                            View All Products
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}