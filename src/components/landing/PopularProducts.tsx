'use client'

import { useProducts } from '@/features/products/hooks/useProducts'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/features/products/components/ProductCard'
import { ArrowRight } from 'lucide-react'

export function PopularProducts() {
    const { data: products, isLoading } = useProducts()
    const popularProducts = products?.slice(0, 3)

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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {popularProducts?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
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