'use client'

import { useProducts } from '@/features/products/hooks/useProducts'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Grid3x3, List } from 'lucide-react'
import { useState } from 'react'

export default function PublicProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const q = searchQuery.toLowerCase()
  const filteredProducts = products?.filter((product) => {
    const model = product.model?.toLowerCase() ?? ''
    return (
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      model.includes(q)
    )
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div>Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Failed to load products</h1>
          <p className="mt-2 text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our wide range of high-quality batteries
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredProducts?.length || 0} of {products?.length || 0} products
      </div>

      {/* Product Grid/List */}
      {filteredProducts?.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No products found</p>
          {searchQuery && (
            <Button
              variant="link"
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <ProductGrid products={filteredProducts || []} viewMode={viewMode} />
      )}
    </div>
  )
}