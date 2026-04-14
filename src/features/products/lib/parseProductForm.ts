import type { CreateProductInput } from '../types'

function str(formData: FormData, key: string): string | undefined {
    const v = formData.get(key)
    if (v === null || v === '') return undefined
    return String(v)
}

function reqStr(formData: FormData, key: string): string {
    const v = str(formData, key)
    if (v === undefined) throw new Error(`Missing required field: ${key}`)
    return v
}

function intOpt(formData: FormData, key: string): number | undefined {
    const v = formData.get(key)
    if (v === null || v === '') return undefined
    const n = Number(v)
    if (!Number.isFinite(n)) return undefined
    return Math.trunc(n)
}

function numOpt(formData: FormData, key: string): number | undefined {
    const v = formData.get(key)
    if (v === null || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
}

function reqNum(formData: FormData, key: string): number {
    const v = formData.get(key)
    if (v === null || v === '') throw new Error(`Missing required field: ${key}`)
    const n = Number(v)
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${key}`)
    return n
}


/** Build payload for create/update from CMS product form */
export function parseProductFormData(formData: FormData): CreateProductInput {
    // Handle multiple images - for now, single image upload, but store as array
    const imageFiles = formData.getAll('images') as File[]
    const imageUrls = imageFiles
        .filter(f => f instanceof File && f.size > 0)
        .map(f => URL.createObjectURL(f))

    // For existing images passed as URLs (edit case)
    const existingImages = formData.getAll('existingImages') as string[]

    return {
        name: reqStr(formData, 'name'),
        model: reqStr(formData, 'model'),  // Now required
        variant: str(formData, 'variant'),
        brand: reqStr(formData, 'brand'),
        price: reqNum(formData, 'price'),
        stock: Math.trunc(reqNum(formData, 'stock')),
        warranty: reqNum(formData, 'warranty'),  // Required
        amperePerHour: reqNum(formData, 'amperePerHour'),  // Required
        coldCrankingAmperes: numOpt(formData, 'coldCrankingAmperes'),
        reserveCapacity: numOpt(formData, 'reserveCapacity'),
        terminalType: str(formData, 'terminalType'),
        dimensions: {
            length: numOpt(formData, 'dim_length'),
            width: numOpt(formData, 'dim_width'),
            height: numOpt(formData, 'dim_height'),
            weight: numOpt(formData, 'weightKg'),
            thickness: numOpt(formData, 'dim_thickness'),
        },
        images: existingImages.length > 0 ? existingImages : imageUrls,
        description: str(formData, 'description'),
    }
}