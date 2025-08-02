import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"

export function PricingSection() {
  const { t } = useTranslations()
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
                  <div className="relative bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 lg:p-12 overflow-hidden">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
                {t('landing.ourServices.pricing.title', 'Commencez à Économiser Aujourd\'hui !')}
              </h2>
              <p className="text-base lg:text-lg leading-relaxed opacity-90 text-white mb-8">
                {t('landing.ourServices.pricing.subtitle', 'Obtenez une adresse gratuite aux États-Unis,Turquie, Espagne ou France. Nous gérons tout, de l\'achat à la livraison directe à votre porte au Maroc.')}
              </p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 font-medium">
                {t('landing.ourServices.pricing.button', 'Voir les Tarifs')}
              </Button>
            </div>

          {/* Arrow Decoration */}
          <div className="absolute bottom-4 right-4 opacity-20">
            <Image
              src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/671f600a4c91e40883142e62_arrow.svg"
              alt=""
              width={60}
              height={60}
              className="w-12 h-12 lg:w-16 lg:h-16"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 