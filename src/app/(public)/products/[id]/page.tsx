'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useProduct } from '@/features/products/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Phone, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function specRow(label: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export default function PublicProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: product, isLoading, error } = useProduct(id)
  const [selectedImage, setSelectedImage] = useState<string>('')

  // Set the first image when product loads
  if (product && !selectedImage && product.images?.[0]) {
    setSelectedImage(product.images[0])
  }

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

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (stock < 10) return <Badge variant="default">Low Stock</Badge>
    return <Badge variant="secondary">In Stock</Badge>
  }

  const images = product.images || []

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card>
            <CardContent className="p-6">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Grid */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all hover:opacity-80 ${selectedImage === image
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {product.brand}
              {product.model ? ` · ${product.model}` : ''}
              {product.variant ? ` (${product.variant})` : ''}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">Rs. {product.price.toLocaleString()}</div>
            <div>{getStockBadge(product.stock)}</div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {specRow('Ampere per hour', product.amperePerHour != null ? `${product.amperePerHour} Ah` : undefined)}
              {specRow('Cold cranking amperes', product.coldCrankingAmperes != null ? `${product.coldCrankingAmperes} CCA` : undefined)}
              {specRow('Reserve capacity', product.reserveCapacity != null ? `${product.reserveCapacity} min` : undefined)}
              {specRow('Warranty', product.warranty != null ? `${product.warranty} months` : undefined)}
              {specRow('Terminal type', product.terminalType)}
              {(product.dimensions?.length != null ||
                product.dimensions?.width != null ||
                product.dimensions?.height != null ||
                product.dimensions?.thickness != null) && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Dimensions (mm)</p>
                    <p className="font-medium">
                      {[
                        product.dimensions?.length != null ? `L ${product.dimensions.length}` : null,
                        product.dimensions?.width != null ? `W ${product.dimensions.width}` : null,
                        product.dimensions?.height != null ? `H ${product.dimensions.height}` : null,
                        product.dimensions?.thickness != null ? `Thickness ${product.dimensions.thickness}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                )}
              {specRow('Weight', product.dimensions?.weight != null ? `${product.dimensions.weight} kg` : undefined)}
            </CardContent>
          </Card>

          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Interested in this product? Contact us for more information or to place an order.
              </p>
              <div className="flex gap-4">
                <a href="tel:+923001234567" className="flex-1">
                  <Button className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </a>

                <a
                  href="mailto:example@gmail.com?subject=Product Inquiry&body=Hi, I am interested in this product."
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}