import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export function HeroSection() {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  return (
    <section className="relative text-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Left Column - Content */}
          <div className="lg:w-1/2 text-center lg:text-left rtl:text-right">
            <div className="text-sm text-white/80 mb-4 text-left rtl:text-right">
              {t('hero.subtitle', 'Accédez aux meilleures marques des USA, Turquie, Espagne et France. Nous gérons tout, de l\'achat à la livraison directe à votre porte au Maroc. Vivez l\'expérience shopping sans frontières !')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-left rtl:text-right">
              {t('hero.title', 'Vos Achats Mondiaux au Maroc : Simplifiés, Rapides, Sans Surprises.')}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed opacity-90 text-left rtl:text-right">
              {t('hero.description', 'Nous gérons tout, de l\'achat à la livraison directe à votre porte au Maroc. Vivez l\'expérience shopping sans frontières !')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 text-left rtl:text-right">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-base font-medium h-12">
                {t('hero.startButton', 'Commencer !')}
              </Button>
              <Button className="bg-orange-600 border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-base font-medium h-12">
                {t('hero.discoverButton', 'Découvrir Nos Services')}
              </Button>
            </div>
          </div>

          {/* Right Column - Phone Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end rtl:justify-start">
            <div className="relative">
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/678f39cd54859699af3a144b_b1.png"
                alt="Smartphone with shipping app"
                width={385}
                height={600}
                className="w-auto h-auto max-w-sm lg:max-w-md"
                priority
              />
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="max-w-4xl mx-auto mt-16" dir={isRTL ? 'rtl' : 'ltr'}>
          <blockquote className="text-lg md:text-xl font-medium mb-8 leading-relaxed text-center">
            "{t('hero.testimonial', 'Grâce à shipit, j\'ai pu commander des articles exclusifs des USA que je ne trouvais pas au Maroc. Le regroupement a vraiment réduit les frais, et la livraison a été rapide et sans aucun souci de douane. Je recommande à 100% !')}"
          </blockquote>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66dff36ec5f549ec1f252d5f_rob.jpg"
                alt="Robbie F."
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="text-left rtl:text-right">
                <div className="font-semibold text-white">{t('hero.testimonialAuthor', 'Fatima Z., Casablanca')}</div>
                <div className="text-white/80">{t('hero.testimonialRole', 'Cliente satisfaite')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 