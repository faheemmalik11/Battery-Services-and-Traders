import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    category: z.enum(['car', 'truck', 'motorcycle', 'solar', 'industrial']),
    voltage: z.number().int().min(6).max(48),
    capacity: z.number().positive('Capacity must be positive'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
    createdBy: z.string(),
})

export type ProductSchema = z.infer<typeof productSchema>