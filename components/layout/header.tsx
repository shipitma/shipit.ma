"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LanguageSelector } from "@/components/ui/LanguageSelector"
import { useTranslations } from "@/lib/hooks/use-translations"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useTranslations()

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          {/* White pill container with logo and navigation */}
          <div className="bg-white rounded-full flex items-center space-x-8 border border-gray-200 px-6 py-0">
            <a href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="116" height="28" viewBox="0 0 116 28" fill="none">
                <path
                  d="M4.03105 6.84842V8.671C4.78687 7.25693 6.01508 6.53418 7.71567 6.53418C9.51075 6.53418 10.9594 7.47689 11.5893 9.3309C12.4711 7.44547 14.0142 6.53418 15.9037 6.53418C18.9585 6.53418 20.8796 8.41961 20.8796 11.6877V21.7433H16.8485V12.4419C16.8485 10.8078 15.9352 9.86511 14.644 9.86511C13.2899 9.86511 12.4396 10.8707 12.4396 12.599V21.7433H8.44V12.4419C8.44 10.8392 7.52672 9.95938 6.23552 9.95938C4.94433 9.95938 4.03105 10.9649 4.03105 12.7561V21.7433H0V6.84842H4.03105Z"
                  fill="#ea580c"
                />
                <path
                  d="M31.1241 6.53418C33.2971 6.53418 35.0607 7.41405 35.911 8.89097V6.84842H39.9421V21.7433H36.0685V19.5436C34.9662 21.2091 33.3601 22.0576 31.1871 22.0576C26.9986 22.0576 23.8809 18.978 23.8809 14.3587C23.8809 9.73941 27.0616 6.53418 31.1241 6.53418ZM31.943 9.9908C29.8644 9.9908 27.9119 11.6248 27.9119 14.3587C27.9119 17.0926 29.8644 18.6324 31.943 18.6324C34.0215 18.6324 36.0685 17.0297 36.0685 14.3587C36.0685 11.6877 34.0844 9.9908 31.943 9.9908Z"
                  fill="#ea580c"
                />
                <path
                  d="M47.8162 6.84842V8.76527C48.4461 7.38262 49.6743 6.53418 51.4064 6.53418C54.0832 6.53418 55.6893 8.38819 55.6893 10.9335C55.6893 11.5934 55.6264 12.1905 55.4689 12.7875H51.6583C51.7528 12.4419 51.7843 12.0648 51.7843 11.6563C51.7843 10.5564 51.0284 9.80226 49.8947 9.80226C48.635 9.80226 47.8162 10.6507 47.8162 12.159V21.7433H43.7852V6.84842H47.8162Z"
                  fill="#ea580c"
                />
                <path
                  d="M69.4249 19.5436C68.5431 21.0834 66.937 22.0576 64.7955 22.0576C60.607 22.0576 57.6152 18.978 57.6152 14.3587C57.6152 9.73941 60.607 6.53418 64.7011 6.53418C66.874 6.53418 68.7321 7.57117 69.5824 9.07951V6.84842H73.456V27.9652H69.4249V19.5436ZM65.6143 9.9908C63.3784 9.9908 61.6463 11.6877 61.6463 14.3587C61.6463 17.0297 63.3784 18.6324 65.6143 18.6324C67.8503 18.6324 69.5824 16.9983 69.5824 14.3587C69.5824 11.7191 67.7873 9.9908 65.6143 9.9908Z"
                  fill="#ea580c"
                />
                <path
                  d="M91.4744 6.85352V21.7484H87.4748V19.5487C86.6875 21.0885 85.0499 22.0627 82.9399 22.0627C79.5387 22.0627 77.3027 20.0829 77.3027 16.3121V6.85352H81.3338V15.3065C81.3338 17.4433 82.31 18.606 84.0736 18.606C86.2151 18.606 87.4748 17.0348 87.4748 14.5209V6.85352H91.4744Z"
                  fill="#ea580c"
                />
                <path
                  d="M99.8567 2.48248C99.8567 3.89656 98.7544 4.96497 97.3688 4.96497C95.9831 4.96497 94.8809 3.89656 94.8809 2.48248C94.8809 1.06841 95.9516 0 97.3688 0C98.7859 0 99.8567 1.09983 99.8567 2.48248ZM99.3528 6.8504V21.7453H95.3218V6.8504H99.3528Z"
                  fill="#ea580c"
                />
                <path
                  d="M102.473 21.7484V18.2918L110.661 10.3101H102.725V6.85352H115.731V10.153L107.511 18.1347H115.951V21.7484H102.473Z"
                  fill="#ea580c"
                />
              </svg>
            </a>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              <a href="/about-us" className="text-gray-700 hover:text-orange-600 transition-colors py-2">
                {t('header.about', 'À Propos')}
              </a>
              <a href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors py-2">
                {t('header.contact', 'Contact')}
              </a>
              <a href="/pricing" className="text-gray-700 hover:text-orange-600 transition-colors py-2">
                {t('header.pricing', 'Tarifs')}
              </a>
            </div>
          </div>

          {/* Right side buttons with colored borders */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth Buttons */}
            {user ? (
              <Button
                asChild
                className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 border-white rounded-full px-6 py-2"
              >
                <Link href="/dashboard">{t('header.myAccount', 'Mon Compte')}</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  className="bg-white text-gray-700 hover:bg-gray-100 border border-orange-200 hover:border-orange-400 rounded-full px-6 py-2"
                >
                  <Link href="/register">{t('header.register', 'S\'inscrire')}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 rounded-full px-6 py-2"
                >
                  <Link href="/login">{t('header.login', 'Se Connecter')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Mobile Language Selector */}
          <LanguageSelector />

          {/* Centered Logo with pill */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="bg-white border border-orange-200 rounded-full px-4 py-2">
              <a href="/" className="text-xl font-bold text-orange-600">
                shipit
              </a>
            </div>
          </div>

          {/* Hamburger Menu with pill */}
          <Button
            variant="outline"
            size="icon"
            className="bg-white border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-full p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('header.openMenu', 'Ouvrir le menu')}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        <div
          className={`lg:hidden ${
            isMobileMenuOpen ? "block" : "hidden"
          } bg-white/90 rounded-lg mx-4 mb-4 p-4 backdrop-blur-sm border border-gray-200`}
        >
          {/* Mobile Navigation Items */}
          <div className="space-y-4">
            <a href="/" className="block py-2 text-gray-700 hover:text-orange-600">
              Accueil
            </a>
            <a href="/about-us" className="block py-2 text-gray-700 hover:text-orange-600">
              À Propos
            </a>
            <a href="/contact" className="block py-2 text-gray-700 hover:text-orange-600">
              Contact
            </a>
            <a href="/pricing" className="block py-2 text-gray-700 hover:text-orange-600">
              Tarifs
            </a>

            {/* Auth Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {user ? (
                <Button
                  asChild
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 rounded-full px-6 py-2"
                >
                  <Link href="/dashboard">Tableau de Bord</Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full bg-white text-gray-700 hover:bg-gray-100 border border-orange-200 hover:border-orange-400 rounded-full px-6 py-2"
                  >
                    <Link href="/register">S'inscrire</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 rounded-full px-6 py-2"
                  >
                    <Link href="/login">Se Connecter</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 