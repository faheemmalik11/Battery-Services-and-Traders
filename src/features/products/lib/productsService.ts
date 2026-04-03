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
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getAuth } from 'firebase/auth'
import { Product, CreateProductInput, UpdateProductInput } from '../types'
import { productSchema } from '../schemas/productSchema'

const COLLECTION = 'products'

function mapDocToProduct(docSnap: any): Product {
    const data = docSnap.data()
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
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
        return snapshot.docs.map(mapDocToProduct)
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

        await updateDoc(doc(db, COLLECTION, id), {
            ...data,
            ...imageData,
            updatedAt: Timestamp.now(),
        })
    } catch (error) {
        handleError(error, 'Failed to update product')
    }
}

export async function deleteProduct(
    id: string,
    publicId?: string
): Promise<void> {
    try {
        if (publicId) {
            await deleteImage(publicId)
        }

        await deleteDoc(doc(db, COLLECTION, id))
    } catch (error) {
        handleError(error, 'Failed to delete product')
    }
}


export async function updateStock(
    id: string,
    quantity: number
): Promise<void> {
    try {
        await updateDoc(doc(db, COLLECTION, id), {
            stock: quantity,
            updatedAt: Timestamp.now(),
        })
    } catch (error) {
        handleError(error, 'Failed to update stock')
    }
}