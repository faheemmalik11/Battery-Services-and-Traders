import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Mail } from 'lucide-react'

export function CTA() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground md:p-12">
                    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                        <div>
                            <h2 className="text-3xl font-bold">Need a Battery Installed?</h2>
                            <p className="mt-4 opacity-90">
                                Get professional installation at your doorstep. Same-day service available.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <Link href="/contact">
                                    <Button size="lg" variant="secondary">
                                        Request Installation
                                    </Button>
                                </Link>
                                <Link href="/products">
                                    <Button size="lg" variant="secondary">
                                        Browse Products
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 rounded-lg bg-primary-foreground/10 p-6 backdrop-blur">
                            <h3 className="text-xl font-semibold">Emergency Support</h3>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5" />
                                <span>emergency@batteryservices.com</span>
                            </div>
                            <p className="text-sm opacity-80">Available 24/7 for urgent battery issues</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}