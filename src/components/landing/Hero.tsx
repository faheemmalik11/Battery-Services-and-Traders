'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Battery } from 'lucide-react'
import Image from 'next/image'

const heroImages = [
    '/Images/HeroSection/heroBattery1.jpg',
    '/Images/HeroSection/heroBattery2.jpg',
    '/Images/HeroSection/heroBattery3.jpg',
    '/Images/HeroSection/heroBattery4.jpg',
]

const TICK_MS = 30
const TOTAL_TICKS = 100 // 30 * 100 = 3s per slide

export function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const tickRef = useRef(0)

    useEffect(() => {
        tickRef.current = 0
        setProgress(0)

        const timer = setInterval(() => {
            tickRef.current += 1
            setProgress(tickRef.current)

            if (tickRef.current >= TOTAL_TICKS) {
                clearInterval(timer)
                setCurrentIndex((prev) => (prev + 1) % heroImages.length)
            }
        }, TICK_MS)

        return () => clearInterval(timer)
    }, [currentIndex])

    const goTo = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <section className="relative h-[90vh] min-h-[600px] overflow-hidden">

            {heroImages.map((image, index) => (
                <div
                    key={image}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={image}
                        alt={`Battery showcase ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="relative h-full container mx-auto px-4 flex items-center">
                <div className="max-w-xl space-y-6">

                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-950/40 backdrop-blur-sm border border-orange-500/30 px-3 py-1.5 text-sm text-white">
                        <Battery className="h-4 w-4 text-[#E67D22]" />
                        <span>Trusted Battery Services Since 2010</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl leading-tight">
                        Power Your World With{' '}
                        <span className="text-[#E67D22] drop-shadow-md">Reliable Batteries</span>
                    </h1>

                    <p className="text-base text-white/90 leading-relaxed drop-shadow-md">
                        Professional battery installation and trading services. Quality batteries for cars, trucks, solar systems, and industrial use. Free consultation and expert installation.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/products">
                            <Button size="lg" className="group bg-[#E67D22] hover:bg-[#E67D22]/80">
                                Browse Products
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:border-white"
                            >
                                Request Installation
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-200 pt-2">
                        {['24/7 Support', 'Certified Technicians', 'Warranty Included'].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#E67D22]" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {heroImages.map((_, index) => {
                    const isActive = index === currentIndex
                    return (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`relative h-2 overflow-hidden rounded-full bg-white/30 transition-all duration-300 ${isActive ? 'w-8' : 'w-2 hover:bg-white/50'
                                }`}
                        >
                            {isActive && (
                                <span
                                    className="absolute inset-y-0 left-0 rounded-full bg-white"
                                    style={{ width: `${progress}%` }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

        </section>
    )
}