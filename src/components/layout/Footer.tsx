import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-muted/40">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Battery Services & Traders</h3>
                        <p className="text-sm text-muted-foreground">
                            Your trusted partner for all battery needs.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-3 font-medium">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:underline">Products</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-3 font-medium">Contact</h4>
                        <p className="text-sm text-muted-foreground">Email: info@batteryservices.com</p>
                        <p className="text-sm text-muted-foreground">Phone: +92 310 4528450</p>
                    </div>
                </div>

                <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Battery Services & Traders. All rights reserved.
                </div>
            </div>
        </footer>
    )
}