export interface Product {
    id: string
    name: string
    brand: string
    category: 'car' | 'truck' | 'motorcycle' | 'solar' | 'industrial'
    voltage: 6 | 12 | 24 | 48
    capacity: number
    price: number
    stock: number
    imageUrl?: string
    publicId?: string
    description?: string
    createdAt: Date
    updatedAt: Date
    createdBy: string
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>