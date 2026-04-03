import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    type DocumentData,
    type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'
import { Product, CreateProductInput, UpdateProductInput } from '../types'
import { productSchema, type ProductSchema } from '../schemas/productSchema'
import { z } from 'zod'

const COLLECTION = 'products'

export const updateProductSchema = productSchema.partial().omit({ createdBy: true })

function stripUndefined<T extends Record<string, unknown>>(obj: T): DocumentData {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined) continue
        if (v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Timestamp)) {
            const nested = stripUndefined(v as Record<string, unknown>)
            if (Object.keys(nested).length > 0) out[k] = nested
        } else {
            out[k] = v
        }
    }
    return out as DocumentData
}

function isVoltage(v: unknown): v is 6 | 12 | 24 | 48 {
    return v === 6 || v === 12 || v === 24 || v === 48
}

/** Normalize legacy docs (flat category/voltage/capacity) into `specifications`. */
function normalizeSpecifications(data: Record<string, unknown>): Product['specifications'] {
    const raw = data.specifications
    if (raw && typeof raw === 'object' && raw !== null && 'voltage' in raw) {
        const s = raw as Record<string, unknown>
        const voltage = isVoltage(s.voltage) ? s.voltage : 12
        const dims = s.dimensions as Record<string, unknown> | undefined
        return {
            batteryType: typeof s.batteryType === 'string' ? s.batteryType : undefined,
            platesPerCell: typeof s.platesPerCell === 'number' ? s.platesPerCell : undefined,
            voltage,
            capacity20hr: typeof s.capacity20hr === 'number' ? s.capacity20hr : undefined,
            capacity5hr: typeof s.capacity5hr === 'number' ? s.capacity5hr : undefined,
            terminalType: typeof s.terminalType === 'string' ? s.terminalType : undefined,
            polarity: s.polarity === 'L' || s.polarity === 'R' ? s.polarity : undefined,
            weightKg: typeof s.weightKg === 'number' ? s.weightKg : undefined,
            dimensions:
                dims && typeof dims === 'object'
                    ? {
                          length: typeof dims.length === 'number' ? dims.length : undefined,
                          width: typeof dims.width === 'number' ? dims.width : undefined,
                          height: typeof dims.height === 'number' ? dims.height : undefined,
                          containerHeight:
                              typeof dims.containerHeight === 'number'
                                  ? dims.containerHeight
                                  : undefined,
                      }
                    : undefined,
        }
    }

    const voltage = isVoltage(data.voltage) ? data.voltage : 12
    const legacyCap =
        typeof data.capacity === 'number' ? data.capacity : undefined

    return {
        voltage,
        capacity20hr: legacyCap,
        batteryType: undefined,
        platesPerCell: undefined,
        capacity5hr: undefined,
        terminalType: undefined,
        polarity: undefined,
        weightKg: undefined,
        dimensions: undefined,
    }
}

function mapDocToProduct(docSnap: DocumentSnapshot): Product {
    const data = docSnap.data()
    if (!data) {
        throw new Error('Product document has no data')
    }
    const row = data as Record<string, unknown>
    const specifications = normalizeSpecifications(row)

    const base: ProductSchema = {
        name: typeof row.name === 'string' ? row.name : '',
        model: typeof row.model === 'string' ? row.model : undefined,
        brand: typeof row.brand === 'string' ? row.brand : '',
        price: typeof row.price === 'number' ? row.price : 0,
        stock: typeof row.stock === 'number' ? row.stock : 0,
        imageUrl: typeof row.imageUrl === 'string' ? row.imageUrl : undefined,
        description: typeof row.description === 'string' ? row.description : undefined,
        specifications,
        createdBy: typeof row.createdBy === 'string' ? row.createdBy : '',
        publicId: typeof row.publicId === 'string' ? row.publicId : undefined,
    }

    return {
        id: docSnap.id,
        ...base,
        createdAt:
            row.createdAt instanceof Timestamp
                ? row.createdAt.toDate()
                : new Date(0),
        updatedAt:
            row.updatedAt instanceof Timestamp
                ? row.updatedAt.toDate()
                : new Date(0),
    }
}

function handleError(error: unknown, message: string): never {
    console.error(message, error)
    throw new Error(message)
}

async function uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) throw new Error('Image upload failed')

    return res.json()
}

async function deleteImage(publicId: string): Promise<void> {
    await fetch(`/api/cloudinary/delete?publicId=${publicId}`, {
        method: 'DELETE',
    })
}

export async function getProducts(): Promise<Product[]> {
    try {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((d) => mapDocToProduct(d))
    } catch (error) {
        handleError(error, 'Failed to fetch products')
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const snapshot = await getDoc(doc(db, COLLECTION, id))
        return snapshot.exists() ? mapDocToProduct(snapshot) : null
    } catch (error) {
        handleError(error, 'Failed to fetch product')
    }
}

export async function createProduct(
    data: CreateProductInput,
    imageFile?: File
): Promise<string> {
    try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) throw new Error('User not authenticated')

        let imageData: { imageUrl?: string; publicId?: string } = {}

        if (imageFile) {
            const upload = await uploadImage(imageFile)
            imageData = {
                imageUrl: upload.url,
                publicId: upload.publicId,
            }
        }

        const validated = productSchema.parse({
            ...data,
            ...imageData,
            createdBy: user.uid,
        })

        const now = Timestamp.now()

        const docRef = await addDoc(collection(db, COLLECTION), {
            ...validated,
            createdAt: now,
            updatedAt: now,
        })

        return docRef.id
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Product validation failed', error.flatten())
            throw new Error('Invalid product data')
        }
        handleError(error, 'Failed to create product')
    }
}

export async function updateProduct(
    id: string,
    data: UpdateProductInput,
    options?: {
        newImageFile?: File
        oldPublicId?: string
    }
): Promise<void> {
    try {
        let imageData: { imageUrl?: string; publicId?: string } = {}

        if (options?.newImageFile) {
            if (options.oldPublicId) {
                await deleteImage(options.oldPublicId)
            }

            const upload = await uploadImage(options.newImageFile)

            imageData = {
                imageUrl: upload.url,
                publicId: upload.publicId,
            }
        }

        const ref = doc(db, COLLECTION, id)
        const snap = await getDoc(ref)
        if (!snap.exists()) throw new Error('Product not found')

        const existing = snap.data() as Record<string, unknown>
        const prevSpec = normalizeSpecifications(existing)

        const mergedSpecs =
            data.specifications !== undefined
                ? {
                      ...prevSpec,
                      ...data.specifications,
                      dimensions:
                          data.specifications.dimensions !== undefined
                              ? {
                                    ...prevSpec.dimensions,
                                    ...data.specifications.dimensions,
                                }
                              : prevSpec.dimensions,
                  }
                : prevSpec

        const payload: Record<string, unknown> = {
            ...data,
            ...imageData,
            specifications: data.specifications !== undefined ? mergedSpecs : undefined,
            updatedAt: Timestamp.now(),
        }

        const cleaned = stripUndefined(payload) as Record<string, unknown> & {
            updatedAt: Timestamp
        }
        const { updatedAt, ...productFields } = cleaned
        updateProductSchema.parse(productFields)

        await updateDoc(ref, cleaned as DocumentData)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Product validation failed', error.flatten())
            throw new Error('Invalid product data')
        }
        handleError(error, 'Failed to update product')
    }
}

export async function deleteProduct(id: string, publicId?: string): Promise<void> {
    try {
        if (publicId) {
            await deleteImage(publicId)
        }

        await deleteDoc(doc(db, COLLECTION, id))
    } catch (error) {
        handleError(error, 'Failed to delete product')
    }
}

export async function updateStock(id: string, quantity: number): Promise<void> {
    try {
        await updateDoc(doc(db, COLLECTION, id), {
            stock: quantity,
            updatedAt: Timestamp.now(),
        })
    } catch (error) {
        handleError(error, 'Failed to update stock')
    }
}
