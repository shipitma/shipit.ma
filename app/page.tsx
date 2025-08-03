"use client"

import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/landing/hero-section"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useLanguage } from "@/lib/context/language-context"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const HowItWorksSection = dynamic(() =>
  import("@/components/landing/how-it-works-section").then(
    mod => mod.HowItWorksSection,
  ),
)
const PartnerBrandsSection = dynamic(() =>
  import("@/components/landing/partner-brands-section").then(
    mod => mod.PartnerBrandsSection,
  ),
)
const OurServiceSection = dynamic(() =>
  import("@/components/landing/our-service-section").then(
    mod => mod.OurServiceSection,
  ),
)
const WeBuyForYouSection = dynamic(() =>
  import("@/components/landing/we-buy-for-you-section").then(
    mod => mod.WeBuyForYouSection,
  ),
)
const WhyChooseUsSection = dynamic(() =>
  import("@/components/landing/why-choose-us-section").then(
    mod => mod.WhyChooseUsSection,
  ),
)

const PricingSection = dynamic(() =>
  import("@/components/landing/pricing-section").then(
    mod => mod.PricingSection,
  ),
)
const ReviewCardSection = dynamic(() =>
  import("@/components/landing/review-card-section").then(
    mod => mod.ReviewCardSection,
  ),
)
const Footer = dynamic(() =>
  import("@/components/layout/footer").then(mod => mod.Footer),
)

export default function Component() {
  const { language, isRTL } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for language context to be properly initialized
    if (language) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 150) // Slightly longer delay to ensure everything is loaded

      return () => clearTimeout(timer)
    }
  }, [language])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-600 to-orange-800 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-600 to-orange-800">
      <Header />
      <div id="home">
        <HeroSection />
      </div>
      <div className="bg-white">
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <PartnerBrandsSection />
        <div id="services">
          <OurServiceSection />
        </div>
        <WeBuyForYouSection />
        <WhyChooseUsSection />
        <ReviewCardSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <Footer />
      </div>
    </div>
  )
}
