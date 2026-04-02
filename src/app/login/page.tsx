'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, signInWithGoogle, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signIn(email, password)
        } catch (error) {
            console.error(error)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96 space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border p-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border p-2"
                />
                <button type="submit" className="w-full rounded bg-blue-500 p-2 text-white">
                    Login
                </button>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full rounded border p-2"
                >
                    Sign in with Google
                </button>
            </form>
        </div>
    )
}