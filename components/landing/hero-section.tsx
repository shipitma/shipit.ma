import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"

export function HeroSection() {
  const { t } = useTranslations()
  
  return (
    <section className="relative text-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t('hero.title', 'Vos Achats Mondiaux au Maroc : Simplifiés, Rapides, Sans Surprises.')}
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w3xl mx-auto leading-relaxed">
            {t('hero.subtitle', 'Accédez aux meilleures marques des USA, Turquie, Espagne et France. Nous gérons tout, de l\'achat à la livraison directe à votre porte au Maroc. Vivez l\'expérience shopping sans frontières !')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-base font-medium">
              {t('hero.startButton', 'Commencer !')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-orange-600 border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-base font-medium"
            >
              {t('hero.discoverButton', 'Découvrir Nos Services')}
            </Button>
          </div>

          {/* Quiz Preview */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Quiz interface preview"
                width={800}
                height={500}
                className="rounded-lg mx-auto"
                priority
              />
            </div>
          </div>

          {/* Quote Section */}
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-lg md:text-xl font-medium mb-8 leading-relaxed">
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
      </div>
    </section>
  )
} 