'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Helper to check if email is allowed
async function isEmailAllowed(email: string): Promise<boolean> {
    try {
        // Check by email as document ID
        const docRef = doc(db, 'allowedUsers', email)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return true
        }

        // Alternative: query by email field
        // const q = query(collection(db, 'allowedUsers'), where('email', '==', email))
        // const querySnap = await getDocs(q)
        // return !querySnap.empty

        return false
    } catch (error) {
        console.error('Error checking allowed user:', error)
        return false
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Check if user is allowed
                const allowed = await isEmailAllowed(firebaseUser.email!)
                if (allowed) {
                    setUser(firebaseUser)
                } else {
                    // Sign out unauthorized user
                    await signOut(auth)
                    setUser(null)
                    router.push('/cms/login?error=unauthorized')
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [router])

    useEffect(() => {
        const setCookie = async () => {
            if (user) {
                const token = await user.getIdToken()
                document.cookie = `firebaseAuthToken=${token}; path=/; max-age=3600`
            } else {
                document.cookie = 'firebaseAuthToken=; path=/; max-age=0'
            }
        }
        setCookie()
    }, [user])

    const signIn = async (email: string, password: string) => {
        // Check if email is allowed before sign in
        const allowed = await isEmailAllowed(email)
        if (!allowed) {
            throw new Error('Access denied. You are not authorized to access this system.')
        }

        await signInWithEmailAndPassword(auth, email, password)
        window.location.href = '/cms/dashboard'
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)

        // Check if email is allowed after Google sign in
        const allowed = await isEmailAllowed(result.user.email!)
        if (!allowed) {
            await signOut(auth)
            throw new Error('Access denied. You are not authorized to access this system.')
        }

        window.location.href = '/cms/dashboard'
    }

    const logout = async () => {
        await signOut(auth)
        router.push('/cms/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}