'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Phone, Mail, Minus, Plus } from 'lucide-react'
import { Product } from '../types'
import { ContactModal } from '../../contact/components/ContactModal'

interface PublicProductDetailProps {
    product: Product
}

function specRow(label: string, value: string | number | undefined | null) {
    if (value === undefined || value === null || value === '') return null
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
}

export function PublicProductDetail({ product }: PublicProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '')
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const [isZooming, setIsZooming] = useState(false)
    const [quantity, setQuantity] = useState<number>(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const images = product.images || []

    const getStockBadge = (stock: number) => {
        if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
        if (stock < 10) return <Badge variant="default">Low Stock</Badge>
        return <Badge variant="secondary">In Stock</Badge>
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100

        setZoomPosition({ x, y })
    }

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1)
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column - Images */}
                <div className="space-y-4">
                    {/* Main Image with Zoom */}
                    <Card>
                        <CardContent className="p-6">
                            {selectedImage ? (
                                <div
                                    ref={imageContainerRef}
                                    className="relative overflow-hidden rounded-lg"
                                    onMouseEnter={() => setIsZooming(true)}
                                    onMouseLeave={() => setIsZooming(false)}
                                    onMouseMove={handleMouseMove}
                                    style={{ cursor: 'zoom-in' }}
                                >
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full rounded-lg object-cover transition-transform duration-200"
                                        style={{
                                            transform: isZooming ? 'scale(2)' : 'scale(1)',
                                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        }}
                                    />
                                </div>
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

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quantity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center rounded-lg border">
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={quantity <= 1}
                                            className="px-3 py-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            disabled={quantity >= product.stock}
                                            className="px-3 py-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {product.stock} units available
                                    </p>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-muted-foreground">Total Price:</p>
                                    <p className="text-2xl font-bold">
                                        Rs. {(product.price * quantity).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                <a href="tel:+923104528450" className="flex-1">
                                    <Button className="w-full">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Now
                                    </Button>
                                </a>

                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email Us
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contact Modal */}
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={product.name}
                productBrand={product.brand}
                productModel={product.model}
                productVariant={product.variant}
                defaultQuantity={quantity}
            />
        </>
    )
}