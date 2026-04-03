import type { CreateProductInput, Product } from '../types'
import type { SpecificationsSchema } from '../schemas/productSchema'

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

function reqVoltage(formData: FormData): 6 | 12 | 24 | 48 {
    const n = reqNum(formData, 'voltage')
    if (n !== 6 && n !== 12 && n !== 24 && n !== 48) {
        throw new Error('Voltage must be 6, 12, 24, or 48')
    }
    return n
}

function polarityOpt(formData: FormData): 'L' | 'R' | undefined {
    const v = str(formData, 'polarity')
    if (v === 'L' || v === 'R') return v
    return undefined
}

function buildSpecifications(formData: FormData): SpecificationsSchema {
    const length = numOpt(formData, 'dim_length')
    const width = numOpt(formData, 'dim_width')
    const height = numOpt(formData, 'dim_height')
    const containerHeight = numOpt(formData, 'dim_containerHeight')

    const dimensions =
        length !== undefined ||
            width !== undefined ||
            height !== undefined ||
            containerHeight !== undefined
            ? { length, width, height, containerHeight }
            : undefined

    return {
        batteryType: str(formData, 'batteryType'),
        platesPerCell: intOpt(formData, 'platesPerCell'),
        voltage: reqVoltage(formData),
        capacity20hr: numOpt(formData, 'capacity20hr'),
        capacity5hr: numOpt(formData, 'capacity5hr'),
        terminalType: str(formData, 'terminalType'),
        polarity: polarityOpt(formData),
        weightKg: numOpt(formData, 'weightKg'),
        dimensions,
    }
}

/** Build payload for create/update from CMS product form */
export function parseProductFormData(formData: FormData): CreateProductInput {
    return {
        name: reqStr(formData, 'name'),
        model: str(formData, 'model'),
        brand: reqStr(formData, 'brand'),
        price: reqNum(formData, 'price'),
        stock: Math.trunc(reqNum(formData, 'stock')),
        description: str(formData, 'description'),
        specifications: buildSpecifications(formData),
    }
}
