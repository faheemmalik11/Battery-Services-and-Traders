import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ContactFormData {
    name: string
    email: string
    phone: string
    productInterest?: string
    message: string
}

export async function submitContact(data: ContactFormData): Promise<void> {
    try {
        // Save to Firestore
        await addDoc(collection(db, 'contacts'), {
            ...data,
            status: 'pending',
            createdAt: Timestamp.now(),
        })

        // Send email via API route
        const response = await fetch('/api/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Failed to send email')
        }
    } catch (error) {
        console.error('Error submitting contact:', error)
        throw new Error('Failed to submit contact form')
    }
}