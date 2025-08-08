import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"
import { useEffect, useRef } from "react"

export function HowItWorksSection() {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('step-highlight')
        } else {
          entry.target.classList.remove('step-highlight')
        }
      })
    }, observerOptions)

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      title: t('howItWorks.step1.title', 'Créez votre compte'),
      description: t('howItWorks.step1.description', 'Rejoignez Shipit en quelques clics et recevez immédiatement votre adresse de livraison personnalisée en Turquie. Aucun frais caché, inscription 100% gratuite.')
    },
    {
      title: t('howItWorks.step2.title', 'Achetez en Turquie'),
      description: t('howItWorks.step2.description', 'Commandez sur Trendyol, Hepsiburada et tous vos sites turcs préférés. Nous réceptionnons vos colis et les stockons en toute sécurité en attendant l\'expédition.')
    },
    {
      title: t('howItWorks.step3.title', 'Recevez au Maroc'),
      description: t('howItWorks.step3.description', 'Nous regroupons vos colis pour économiser jusqu\'à 80% sur les frais d\'expédition. Livraison rapide à votre porte avec dédouanement inclus.')
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {t('howItWorks.title', 'Comment ça marche')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('howItWorks.subtitle', 'Achetez dans n\'importe quelle boutique turque et recevez vos colis au Maroc facilement')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el
              }}
              className="step-card group bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 cursor-pointer"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Step Content */}
              <div className="step-content">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-orange-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium">
            {t('howItWorks.startButton', 'Commencez maintenant')}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .step-card {
          position: relative;
          overflow: hidden;
          border-color: #e5e7eb;
        }
        
        .step-card:hover,
        .step-card.step-highlight {
          border-color: #f97316;
        }
        
        @media (max-width: 768px) {
          .step-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </section>
  )
} 