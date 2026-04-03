export interface Product {
    id: string
    name: string
    model?: string
    brand: string
    price: number
    stock: number

    imageUrl?: string
    publicId?: string
    description?: string

    specifications: {
        voltage: 6 | 12 | 24 | 48
        batteryType?: string
        platesPerCell?: number
        capacity20hr?: number
        capacity5hr?: number
        terminalType?: string
        polarity?: 'L' | 'R'
        weightKg?: number
        dimensions?: {
            length?: number
            width?: number
            height?: number
            containerHeight?: number
        }
    }

    createdAt: Date
    updatedAt: Date
    createdBy: string
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>