import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { PopularProducts } from '@/components/landing/PopularProducts'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <PopularProducts />
      <HowItWorks />
      <CTA />
    </>
  )
}