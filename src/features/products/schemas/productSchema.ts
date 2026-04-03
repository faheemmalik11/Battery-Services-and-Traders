import { z } from 'zod'

const specificationsSchema = z.object({
    batteryType: z.string().optional(),
    platesPerCell: z.number().int().optional(),

    voltage: z.union([
        z.literal(6),
        z.literal(12),
        z.literal(24),
        z.literal(48),
    ]),

    capacity20hr: z.number().positive().optional(),
    capacity5hr: z.number().positive().optional(),

    terminalType: z.string().optional(),
    polarity: z.enum(['L', 'R']).optional(),

    weightKg: z.number().positive().optional(),

    dimensions: z
        .object({
            length: z.number().positive().optional(),
            width: z.number().positive().optional(),
            height: z.number().positive().optional(),
            containerHeight: z.number().positive().optional(),
        })
        .optional(),
})

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    model: z.string().optional(),
    brand: z.string().min(1, 'Brand is required'),

    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),

    imageUrl: z.string().url().optional(),

    description: z.string().optional(),

    specifications: specificationsSchema,

    createdBy: z.string(),

    /** Cloudinary asset id — not user-editable in forms */
    publicId: z.string().optional(),
})

export type ProductSchema = z.infer<typeof productSchema>
export type SpecificationsSchema = z.infer<typeof specificationsSchema>
