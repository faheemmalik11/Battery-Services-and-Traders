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
import { z } from 'zod'

const COLLECTION = 'products'

function stripUndefined<T extends Record<string, unknown>>(obj: T): DocumentData {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined) continue

        if (v !== null && typeof v === 'object') {
            if (Array.isArray(v)) {
                out[k] = v
            } else if (v instanceof Timestamp) {
                out[k] = v
            } else {
                const nested = stripUndefined(v as Record<string, unknown>)
                if (Object.keys(nested).length > 0) out[k] = nested
            }
        } else {
            out[k] = v
        }
    }
    return out as DocumentData
}

function mapDocToProduct(docSnap: DocumentSnapshot): Product {
    const data = docSnap.data()
    if (!data) {
        throw new Error('Product document has no data')
    }
    const row = data as Record<string, unknown>

    return {
        id: docSnap.id,
        name: typeof row.name === 'string' ? row.name : '',
        model: typeof row.model === 'string' ? row.model : '',
        variant: typeof row.variant === 'string' ? row.variant : undefined,
        brand: typeof row.brand === 'string' ? row.brand : '',
        price: typeof row.price === 'number' ? row.price : 0,
        stock: typeof row.stock === 'number' ? row.stock : 0,
        warranty: typeof row.warranty === 'number' ? row.warranty : 0,
        amperePerHour: typeof row.amperePerHour === 'number' ? row.amperePerHour : 0,
        coldCrankingAmperes: typeof row.coldCrankingAmperes === 'number' ? row.coldCrankingAmperes : undefined,
        reserveCapacity: typeof row.reserveCapacity === 'number' ? row.reserveCapacity : undefined,
        terminalType: typeof row.terminalType === 'string' ? row.terminalType : undefined,
        dimensions: row.dimensions as Product['dimensions'],
        images: Array.isArray(row.images) ? row.images as string[] : [],
        description: typeof row.description === 'string' ? row.description : undefined,
        createdBy: typeof row.createdBy === 'string' ? row.createdBy : '',
        createdAt: row.createdAt instanceof Timestamp ? row.createdAt.toDate() : new Date(0),
        updatedAt: row.updatedAt instanceof Timestamp ? row.updatedAt.toDate() : new Date(0),
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
    imageFiles?: File[]
): Promise<string> {
    try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) throw new Error('User not authenticated')

        let uploadedImages: string[] = data.images || []

        if (imageFiles && imageFiles.length > 0) {
            const formData = new FormData()
            imageFiles.forEach(file => {
                formData.append('files', file)
            })

            const res = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Image upload failed')

            const result = await res.json()
            const uploadedUrls = result.uploads.map((upload: { url: string }) => upload.url)
            uploadedImages = [...uploadedUrls, ...uploadedImages]
        }

        const now = Timestamp.now()

        // Build the document with all fields (including undefined)
        const docData = {
            ...data,
            images: uploadedImages,
            createdBy: user.uid,
            createdAt: now,
            updatedAt: now,
        }

        // Strip undefined values before sending to Firestore
        const cleanedData = stripUndefined(docData)

        const docRef = await addDoc(collection(db, COLLECTION), cleanedData)

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
        newImageFiles?: File[]  // Change to array
        removedPublicIds?: string[]  // Add this to delete removed images
    }
): Promise<void> {
    try {
        let images = data.images || []

        // Delete removed images from Cloudinary
        if (options?.removedPublicIds && options.removedPublicIds.length > 0) {
            await Promise.all(
                options.removedPublicIds.map(publicId => deleteImage(publicId))
            )
        }

        // Upload new images
        if (options?.newImageFiles && options.newImageFiles.length > 0) {
            const formData = new FormData()
            options.newImageFiles.forEach(file => {
                formData.append('files', file)
            })

            const res = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Image upload failed')

            const result = await res.json()
            const uploadedUrls = result.uploads.map((upload: { url: string }) => upload.url)
            images = [...uploadedUrls, ...images]
        }

        const ref = doc(db, COLLECTION, id)

        const payload = {
            ...data,
            images,
            updatedAt: Timestamp.now(),
        }

        const cleaned = stripUndefined(payload)

        await updateDoc(ref, cleaned as DocumentData)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Product validation failed', error.flatten())
            throw new Error('Invalid product data')
        }
        handleError(error, 'Failed to update product')
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
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
