"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Prevent hydration mismatch with Zustand persist
    }

    return <>{children}</>
}

// Higher order component for route protection
export function withAuth(Component: React.ComponentType<any>, allowedRoles?: ('ADMIN' | 'STUDENT')[]) {
    return function ProtectedRoute(props: any) {
        const { isAuthenticated, user } = useAuthStore()
        const router = useRouter()
        const [isChecking, setIsChecking] = useState(true)

        useEffect(() => {
            if (!isAuthenticated) {
                router.replace('/login')
            } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // Redirect to appropriate dashboard if wrong role
                router.replace(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard')
            } else {
                setIsChecking(false)
            }
        }, [isAuthenticated, user, router])

        if (isChecking) {
            return <div className="min-h-screen flex items-center justify-center">Loading...</div>
        }

        return <Component {...props} />
    }
}
