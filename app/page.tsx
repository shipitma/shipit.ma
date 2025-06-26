"use client"

import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/landing/hero-section"
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
const TrustSection = dynamic(() =>
  import("@/components/landing/trust-section").then(mod => mod.TrustSection),
)
const PricingSection = dynamic(() =>
  import("@/components/landing/pricing-section").then(
    mod => mod.PricingSection,
  ),
)
const Footer = dynamic(() =>
  import("@/components/layout/footer").then(mod => mod.Footer),
)

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-600 to-orange-800">
      <Header />
      <HeroSection />
      <div className="bg-white">
        <HowItWorksSection />
        <PartnerBrandsSection />
        <OurServiceSection />
        <WeBuyForYouSection />
        <WhyChooseUsSection />
        <TrustSection />
        <PricingSection />
        <Footer />
      </div>
    </div>
  )
}
