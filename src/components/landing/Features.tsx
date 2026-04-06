import { Battery, Truck, Shield, Clock, Wrench, Headphones } from 'lucide-react'

const features = [
    {
        icon: Battery,
        title: 'Premium Batteries',
        description: 'High-quality batteries from top brands for all vehicle types and applications.',
    },
    {
        icon: Truck,
        title: 'Free Delivery',
        description: 'Fast and free delivery on all battery purchases within the city limits.',
    },
    {
        icon: Wrench,
        title: 'Expert Installation',
        description: 'Professional installation by certified technicians at your location.',
    },
    {
        icon: Shield,
        title: '2-Year Warranty',
        description: 'Comprehensive warranty coverage on all batteries and installation services.',
    },
    {
        icon: Clock,
        title: 'Same-Day Service',
        description: 'Quick response and installation within 24 hours of your request.',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Round-the-clock customer support for emergencies and inquiries.',
    },
]

export function Features() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Why Choose Us?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        We provide comprehensive battery solutions with unmatched service quality
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
                        >
                            <feature.icon className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />
                            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}