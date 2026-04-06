import { ShoppingCart, Calendar, Truck, CheckCircle } from 'lucide-react'

const steps = [
    {
        icon: ShoppingCart,
        title: 'Choose Your Battery',
        description: 'Browse our collection and select the perfect battery for your needs',
    },
    {
        icon: Calendar,
        title: 'Schedule Installation',
        description: 'Pick a convenient time for our technician to visit',
    },
    {
        icon: Truck,
        title: 'We Come to You',
        description: 'Our expert team arrives with your battery at the scheduled time',
    },
    {
        icon: CheckCircle,
        title: 'Professional Installation',
        description: 'We install the battery and ensure everything works perfectly',
    },
]

export function HowItWorks() {
    return (
        <section className="py-20 bg-primary/5">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Get your battery installed in four simple steps
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <div className="mt-4">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Step {index + 1}
                                </div>
                                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block">
                                    <div className="absolute left-full top-8 -ml-4 h-0.5 w-8 bg-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}