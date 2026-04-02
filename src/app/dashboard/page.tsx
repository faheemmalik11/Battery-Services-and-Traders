'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { CloudinaryUpload } from '@/components/CloudinaryUpload'

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
            <CloudinaryUpload />
        </ProtectedRoute>
    )
}

function DashboardContent() {
    const { user, logout } = useAuth()

    return (
        <div>
            <h1>Welcome {user?.email}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}