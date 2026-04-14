export interface ProductDimensions {
    length?: number
    width?: number
    height?: number
    weight?: number
    thickness?: number
}

export interface Product {
    id: string
    name: string
    brand: string
    model: string
    variant?: string

    price: number
    stock: number
    warranty: number

    amperePerHour: number
    coldCrankingAmperes?: number
    reserveCapacity?: number

    terminalType?: string
    dimensions?: ProductDimensions

    images: string[]
    description?: string

    createdAt: Date
    updatedAt: Date
    createdBy: string
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>