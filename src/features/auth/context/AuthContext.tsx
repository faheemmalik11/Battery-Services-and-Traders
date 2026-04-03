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
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

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
        await signInWithEmailAndPassword(auth, email, password)
        router.push('/cms/dashboard')
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
        router.push('/cms/dashboard')
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