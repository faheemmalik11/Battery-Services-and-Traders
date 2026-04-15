'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useProduct } from '@/features/products/hooks/useProducts'
import { PublicProductDetail } from '@/features/products/components/PublicProductDetail'

export default function PublicProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: product, isLoading, error } = useProduct(id)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div>Loading product...</div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products" className="mt-4">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6">
        <PublicProductDetail product={product} />
      </div>
    </div>
  )
}