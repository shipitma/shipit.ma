import Image from "next/image"
import { useTranslations } from "@/lib/hooks/use-translations"

export function PartnerBrandsSection() {
  const { t } = useTranslations()
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left rtl:text-right">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight text-left rtl:text-right">
              {t('landing.ourServices.partnerBrands.title', 'Commandez sur vos sites préférés')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed text-left rtl:text-right">
              {t('landing.ourServices.partnerBrands.subtitle', 'Ne vous limitez plus ! Faites votre shopping sur Trendyol, Amazon, Vente-Privée, eBay ou tout autre site en Turquie, en Europe ou aux États-Unis — nous nous occupons du reste.')}
            </p>
          </div>

          {/* Integration Logos */}
          <div className="lg:w-1/2 flex justify-center">
            <Image
              src="/logo_comp.svg"
              alt="Integration logos including Zapier, Stripe, MailChimp, Meta, Google Analytics, TikTok, Telegram and more"
              width={600}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 