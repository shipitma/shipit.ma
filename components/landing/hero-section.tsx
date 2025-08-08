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
        {/* Centered Content */}
        <div className="text-center max-w-4xl mx-auto mb-16" dir={isRTL ? 'rtl' : 'ltr'}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t('hero.title', 'Achetez en Turquie, livré au Maroc — Rapide, Simple, Sans Surprises')}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            {t('hero.description', 'Solution complète pour vos achats en Turquie avec expédition vers le Maroc — achetez en ligne, regroupez vos colis pour économiser jusqu\'à 80%, et recevez-les rapidement à domicile avec dédouanement inclus.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-base font-medium h-12">
              {t('hero.startButton', 'Commencer maintenant')}
            </Button>
            <Button className="bg-orange-600 border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-base font-medium h-12">
              {t('hero.discoverButton', 'Découvrir nos services')}
            </Button>
          </div>
        </div>

        {/* Quote Section */}
        <div className="max-w-4xl mx-auto mt-16" dir={isRTL ? 'rtl' : 'ltr'}>
          <blockquote className="text-lg md:text-xl font-medium mb-8 leading-relaxed text-center">
            "{t('hero.testimonial', 'Grâce à Shipit, j\'ai pu acheter des produits turcs authentiques à des prix avantageux. Le regroupement m\'a fait économiser beaucoup et la livraison a été rapide, sans problème de douane. Je recommande vivement !')}"
          </blockquote>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Image
                src="https://randomuser.me/api/portraits/women/33.jpg"
                alt="Fatima Z."
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