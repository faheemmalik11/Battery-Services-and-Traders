'use client'

import { useProduct } from '@/features/products/hooks/useProducts'
import { ProductDetail } from '@/features/products/components/ProductDetail'
import { notFound, useParams } from 'next/navigation'

export default function ViewProductPage() {
  const params = useParams()
  const id = params.id as string
  const { data: product, isLoading, error } = useProduct(id)

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div>Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  return <ProductDetail product={product} />
}