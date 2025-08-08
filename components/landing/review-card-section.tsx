"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export function ReviewCardSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useTranslations()
  const { language, isRTL } = useLanguage()

  // Get testimonials from translations - using new carousel testimonial keys
  const testimonials = [
    {
      quote: t('hero.carouselTestimonial1.quote', 'Shipit a rendu mes achats en Turquie beaucoup plus simples. Livraison rapide et excellent support.'),
      author: t('hero.carouselTestimonial1.author', 'Ahmed M.'),
      position: t('hero.carouselTestimonial1.role', 'Client fidèle, Rabat'),
      avatar: t('hero.carouselTestimonial1.author', 'A').charAt(0)
    },
    {
      quote: t('hero.carouselTestimonial2.quote', 'Mes commandes turques sont arrivées plus vite que prévu. Équipe professionnelle et service impeccable.'),
      author: t('hero.carouselTestimonial2.author', 'Sara K.'),
      position: t('hero.carouselTestimonial2.role', 'Cliente régulière, Marrakech'),
      avatar: t('hero.carouselTestimonial2.author', 'S').charAt(0)
    },
    {
      quote: t('hero.carouselTestimonial3.quote', 'Le regroupement a réduit mes frais d\'expédition de moitié. Expérience au top.'),
      author: t('hero.carouselTestimonial3.author', 'Youssef B.'),
      position: t('hero.carouselTestimonial3.role', 'Passionné de tech, Fès'),
      avatar: t('hero.carouselTestimonial3.author', 'Y').charAt(0)
    },
    {
      quote: t('hero.carouselTestimonial4.quote', 'Le support client m\'a accompagnée jusqu\'à la réception de mon colis depuis la Turquie.'),
      author: t('hero.carouselTestimonial4.author', 'Layla R.'),
      position: t('hero.carouselTestimonial4.role', 'Cliente première fois, Agadir'),
      avatar: t('hero.carouselTestimonial4.author', 'L').charAt(0)
    },
    {
      quote: t('hero.carouselTestimonial5.quote', 'Je fais confiance à Shipit pour tous mes achats turcs. Service fiable et rapide.'),
      author: t('hero.carouselTestimonial5.author', 'Karim T.'),
      position: t('hero.carouselTestimonial5.role', 'Client de longue date, Tanger'),
      avatar: t('hero.carouselTestimonial5.author', 'K').charAt(0)
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title Section */}
        <div className="text-center mb-16" dir={isRTL ? 'rtl' : 'ltr'}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {t('hero.testimonialsSection.title', 'Avis clients')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            {t('hero.testimonialsSection.subtitle', 'Plus de')} <span className="text-orange-500 font-bold">150 {t('hero.testimonialsSection.clients', 'clients')}</span> {t('hero.testimonialsSection.subtitle2', 'au Maroc nous font confiance pour leurs envois depuis la Turquie')}
          </p>
        </div>

        {/* Testimonial Card - Full width with contained content */}
        <Card className="border-gray-200 hover:shadow-sm transition-shadow">
          <CardContent className="p-8">
            <div className="text-center">
              {/* Quote - Contained content */}
              <div className="mb-8">
                <div className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                  "{testimonials[currentIndex].quote}"
                </div>
              </div>
              
              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                <Avatar className="h-12 w-12 bg-blue-600">
                  <AvatarFallback className="text-white font-semibold text-base">
                    {testimonials[currentIndex].avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left rtl:text-right">
                  <div className="font-semibold text-gray-900 text-base">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].position}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pagination dots - properly handle RTL */}
            <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                  aria-label={t('reviewCard.goToSlide', 'Aller au slide') + ` ${index + 1}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
} 