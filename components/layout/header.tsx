"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LanguageSelector } from "@/components/ui/LanguageSelector"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const navigationItems = [
    { href: "/", label: t('header.home', 'Accueil') },
    { href: "#how-it-works", label: t('header.howItWorks', 'Comment ça marche') },
    { href: "#services", label: t('header.services', 'Nos Services') },
    { href: "/contact", label: t('header.contact', 'Contact') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.svg" alt="Shipit Logo" className="w-16 h-16" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-8 rtl:space-x-reverse">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => item.href.startsWith('#') ? scrollToSection(item.href.slice(1)) : null}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {item.href.startsWith('#') ? (
                  <span className="cursor-pointer">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </button>
            ))}
          </nav>

          {/* Right side - Language and Auth */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSelector />
            
            {user ? (
              <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-medium">
                <Link href="/dashboard">{t('header.myAccount', 'Mon Compte')}</Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Button asChild variant="outline" className="border-gray-300 hover:border-orange-400 hover:bg-orange-50">
                  <Link href="/register">{t('header.register', 'S\'inscrire')}</Link>
                </Button>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white font-medium">
                  <Link href="/login">{t('header.login', 'Se Connecter')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Shipit Logo" className="w-12 h-12" />
          </Link>

          {/* Mobile Right Side */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <LanguageSelector />
            
            <Button
              variant="outline"
              size="icon"
              className="border-gray-300 hover:border-orange-400 hover:bg-orange-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('header.openMenu', 'Ouvrir le menu')}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-lg border border-gray-200 shadow-lg">
            <div className="p-4 space-y-4">
              {/* Mobile Navigation */}
              <nav className="space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => item.href.startsWith('#') ? scrollToSection(item.href.slice(1)) : null}
                    className="block w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  >
                    {item.href.startsWith('#') ? (
                      <span className="cursor-pointer">{item.label}</span>
                    ) : (
                      <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>{item.label}</Link>
                    )}
                  </button>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <Button
                    asChild
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/dashboard">{t('header.myAccount', 'Mon Compte')}</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/register">{t('header.register', 'S\'inscrire')}</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/login">{t('header.login', 'Se Connecter')}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 