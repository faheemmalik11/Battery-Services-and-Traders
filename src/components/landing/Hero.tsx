'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Battery } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
                            <Battery className="h-4 w-4" />
                            <span>Trusted Battery Services Since 2010</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Power Your World With{' '}
                            <span className="text-primary">Reliable Batteries</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Professional battery installation and trading services. Quality batteries for cars, trucks, solar systems, and industrial use. Free consultation and expert installation.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/products">
                                <Button size="lg" className="group">
                                    Browse Products
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">
                                    Request Installation
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Certified Technicians</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Warranty Included</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl" />
                        <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-background p-8 border">
                            <Battery className="h-48 w-48 mx-auto text-primary/30" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}