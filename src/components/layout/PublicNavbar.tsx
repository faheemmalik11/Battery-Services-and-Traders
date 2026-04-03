'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PublicNavbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                    Battery Services & Traders
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/products" className="text-sm font-medium hover:underline">
                        Products
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:underline">
                        Contact
                    </Link>
                    <Link href="/cms/login">
                        <Button variant="outline" size="sm">
                            Admin Login
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}