'use client'

import { useProducts, useDeleteProduct } from '@/features/products/hooks/useProducts'
import { ProductTable } from '@/features/products/components/productsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function CMSProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const deleteProduct = useDeleteProduct()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div>Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-destructive">Failed to load products</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Link href="/cms/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {products?.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No products yet</p>
          <Link href="/cms/products/new">
            <Button variant="link">Create your first product</Button>
          </Link>
        </div>
      ) : (
        <ProductTable
          products={products || []}
          onDelete={(id, publicId) => deleteProduct.mutate({ id, publicId })}
          isDeleting={deleteProduct.isPending}
        />
      )}
    </div>
  )
}