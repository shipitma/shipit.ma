"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function Component() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
                {/* Products Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors py-2">
                    <span>Produits</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <a
                        href="/calculator"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Calculateur de Frais
                      </a>
                      <a
                        href="/online-store"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Achats en ligne
                      </a>
                      <a href="/test" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        Suivi de Colis
                      </a>
                      <a
                        href="/lead-capture-form"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Formulaire d'Envoi
                      </a>
                      <a
                        href="/landing-page-creator"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Pages de Service
                      </a>
                    </div>
                  </div>
                </div>

                {/* Resources Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors py-2">
                    <span>Ressources</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <a href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        Notre Blog
                      </a>
                      <a
                        href="https://help.marquiz.io/"
                        target="_blank"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        rel="noreferrer"
                      >
                        Base de Connaissances
                      </a>
                      <a href="/faq" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        FAQ
                      </a>
                    </div>
                  </div>
                </div>

                {/* Features Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors py-2">
                    <span>Fonctionnalités</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <a
                        href="/features#payment"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Traitement des Paiements
                      </a>
                      <a
                        href="/features#discounts"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Remises Dynamiques
                      </a>
                      <a
                        href="/features/#ab"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Regroupement de Colis
                      </a>
                      <a
                        href="/features/#results"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Options de Livraison
                      </a>
                      <a
                        href="/features/#utm"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Suivi Personnalisé
                      </a>
                      <a
                        href="/features/#analytics"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Analyse des Coûts
                      </a>
                      <a
                        href="/features/#vetvlenie"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Assistance Client
                      </a>
                      <a
                        href="/features/#meta"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Déclarations Douanières
                      </a>
                      <a
                        href="/features/#dog"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Achats Personnels
                      </a>
                    </div>
                  </div>
                </div>

                {/* Plans Link */}
                <a href="/pricing" className="text-gray-700 hover:text-orange-600 transition-colors py-2">
                  Tarifs
                </a>
              </div>
            </div>

            {/* Right side buttons with colored borders */}
            <div className="flex items-center space-x-3">
              {/* Language Dropdown */}
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50 flex items-center space-x-1 rounded-full px-4 py-2"
                >
                  <span>FR</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                <div className="absolute top-full right-0 mt-2 w-20 bg-white rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href="/pt/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      EN
                    </a>
                    <a href="/es/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      AR
                    </a>
                  </div>
                </div>
              </div>

              {/* Auth Buttons */}
              <Button className="bg-white text-gray-700 hover:bg-gray-100 border border-orange-200 hover:border-orange-400 rounded-full px-6 py-2">
                S'inscrire
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 rounded-full px-6 py-2">
                Se Connecter
              </Button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between">
            {/* Mobile Language Dropdown */}
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50 flex items-center space-x-1 rounded-full px-3 py-1"
              >
                <span>FR</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              <div className="absolute top-full left-0 mt-2 w-20 bg-white rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a href="/pt/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    EN
                  </a>
                  <a href="/es/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    AR
                  </a>
                </div>
              </div>
            </div>

            {/* Centered Logo with pill */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-white border border-orange-200 rounded-full px-4 py-2">
                <a href="/" className="text-xl font-bold text-orange-600">
                  TransiPack
                </a>
              </div>
            </div>

            {/* Hamburger Menu with pill */}
            <Button
              variant="outline"
              size="icon"
              className="bg-white border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-full p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

              {/* Products Section */}
              <div>
                <div
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => toggleDropdown("mobile-products")}
                >
                  <span className="text-gray-700 hover:text-orange-600">Produits</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns["mobile-products"] ? "rotate-180" : ""}`}
                  />
                </div>
                <div className={`ml-4 space-y-2 ${openDropdowns["mobile-products"] ? "block" : "hidden"}`}>
                  <a href="/calculator" className="block py-1 text-gray-600 hover:text-orange-600">
                    Calculateur de Frais
                  </a>
                  <a href="/online-store" className="block py-1 text-gray-600 hover:text-orange-600">
                    Achats en ligne
                  </a>
                  <a href="/test" className="block py-1 text-gray-600 hover:text-orange-600">
                    Suivi de Colis
                  </a>
                  <a href="/lead-capture-form" className="block py-1 text-gray-600 hover:text-orange-600">
                    Formulaire d'Envoi
                  </a>
                  <a href="/landing-page-creator" className="block py-1 text-gray-600 hover:text-orange-600">
                    Pages de Service
                  </a>
                </div>
              </div>

              {/* Resources Section */}
              <div>
                <div
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => toggleDropdown("mobile-resources")}
                >
                  <span className="text-gray-700 hover:text-orange-600">Ressources</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns["mobile-resources"] ? "rotate-180" : ""}`}
                  />
                </div>
                <div className={`ml-4 space-y-2 ${openDropdowns["mobile-resources"] ? "block" : "hidden"}`}>
                  <a href="/blog" className="block py-1 text-gray-600 hover:text-orange-600">
                    Notre Blog
                  </a>
                  <a
                    href="https://help.marquiz.io/"
                    target="_blank"
                    className="block py-1 text-gray-600 hover:text-orange-600"
                    rel="noreferrer"
                  >
                    Base de Connaissances
                  </a>
                  <a href="/faq" className="block py-1 text-gray-600 hover:text-orange-600">
                    FAQ
                  </a>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <div
                  className="flex items-center justify-between py-2 cursor-pointer"
                  onClick={() => toggleDropdown("mobile-features")}
                >
                  <span className="text-gray-700 hover:text-orange-600">Fonctionnalités</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns["mobile-features"] ? "rotate-180" : ""}`}
                  />
                </div>
                <div className={`ml-4 space-y-2 ${openDropdowns["mobile-features"] ? "block" : "hidden"}`}>
                  <a href="/features#payment" className="block py-1 text-gray-600 hover:text-orange-600">
                    Traitement des Paiements
                  </a>
                  <a href="/features#discounts" className="block py-1 text-gray-600 hover:text-orange-600">
                    Remises Dynamiques
                  </a>
                  <a href="/features/#ab" className="block py-1 text-gray-600 hover:text-orange-600">
                    Regroupement de Colis
                  </a>
                  <a href="/features/#results" className="block py-1 text-gray-600 hover:text-orange-600">
                    Options de Livraison
                  </a>
                  <a href="/features/#utm" className="block py-1 text-gray-600 hover:text-orange-600">
                    Suivi Personnalisé
                  </a>
                  <a href="/features/#analytics" className="block py-1 text-gray-600 hover:text-orange-600">
                    Analyse des Coûts
                  </a>
                  <a href="/features/#vetvlenie" className="block py-1 text-gray-600 hover:text-orange-600">
                    Assistance Client
                  </a>
                  <a href="/features/#meta" className="block py-1 text-gray-600 hover:text-orange-600">
                    Déclarations Douanières
                  </a>
                  <a href="/features/#dog" className="block py-1 text-gray-600 hover:text-orange-600">
                    Achats Personnels
                  </a>
                </div>
              </div>

              <a href="/pricing" className="block py-2 text-gray-700 hover:text-orange-600">
                Tarifs
              </a>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button className="w-full bg-white text-gray-700 hover:bg-gray-100 border border-orange-200 hover:border-orange-400 rounded-full px-6 py-2">
                  S'inscrire
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 rounded-full px-6 py-2">
                  Se Connecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Votre Colis de Turquie, Livré au Maroc en Toute Simplicité
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w3xl mx-auto leading-relaxed">
              Nous facilitons l'expédition de vos achats depuis la Turquie directement à votre porte au Maroc. Que ce
              soit pour des articles que vous avez déjà achetés ou pour ceux que vous souhaitez que nous achetions pour
              vous, nous nous occupons de tout.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-base font-medium">
                Commencer — C'est Simple et Rapide
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-base font-medium"
              >
                Découvrir Nos Services
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
                />
              </div>
            </div>

            {/* Quote Section */}
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-lg md:text-xl font-medium mb-8 leading-relaxed">
                "C'est incroyablement facile d'expédier des colis depuis la Turquie. Le service est rapide et fiable.
                Mes livraisons sont arrivées sans aucun problème au Maroc."
              </blockquote>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66dff36ec5f549ec1f252d5f_rob.jpg"
                    alt="Robbie F."
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-white">Fatima Z.</div>
                    <div className="text-orange-100">Cliente fidèle, utilise notre service depuis: 1 an</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            Faites Confiance à un Service Éprouvé par des Milliers de Clients
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Des évaluations élevées et une satisfaction client maximale pour toutes vos livraisons.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67d9e74de1942bbbb73c83c1_Group%202087328783-p-500.png"
              alt="Trust badges and ratings"
              width={403}
              height={200}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Online Store vs Quiz Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Créez Votre Propre Boutique en Ligne</h2>
            <p className="text-lg md:text-xl text-gray-600">
              Les quiz résolvent la surcharge de choix, engagent les utilisateurs et augmentent les ventes grâce à un
              flux de questions intelligent
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Online Stores Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-transparent">
                <h3 className="text-lg font-semibold mb-4 text-black">Boutiques en Ligne</h3>
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abf15_shop.jpg"
                  alt="Online store interface"
                  width={522}
                  height={350}
                  className="w-full rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                      alt="Issue icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-black">Paniers abandonnés</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                      alt="Issue icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-black">Produits non pertinents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                      alt="Issue icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-black">Filtres complexes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                      alt="Issue icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-black">Surcharge de choix</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-[rgba(234,88,12,1)]">
                <h3 className="text-lg font-semibold mb-4 text-white">Quiz</h3>
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66f2646a4be1bb9a1d5d12da_quiz.jpg"
                  alt="Quiz interface"
                  width={522}
                  height={350}
                  className="w-full rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                      alt="Benefit icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-white">Dialogue d'expert interactif</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                      alt="Benefit icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-white">Prise de décision guidée</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                      alt="Benefit icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-white">Recommandations précises</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                      alt="Benefit icon"
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    <span className="text-white">Commande facile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Effortless Lead Generation */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              La Solution Idéale pour vos Achats et Expéditions depuis la Turquie
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Transformez vos désirs d'achats en réalité grâce à un processus simple et interactif
            </p>
          </div>

          {/* Generation Box */}
          <div className="generation_box relative">
            {/* Desktop Arrow - hidden on mobile */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url(https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673443538de5bc7d2a86578c_arrow.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />

            {/* Mobile Arrow - visible only on mobile */}
            <div
              className="md:hidden absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url(https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673d88919a5cd6110dd31da7_arrow_img.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-center relative z-10">
              {/* Traffic */}
              <div className="generation_box_item item1 text-center group">
                <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                  Vos Achats en Turquie
                </div>
                <div className="generation_box_imgs relative">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa2bc2e4df973eb7082_gen1.png"
                    alt="Traffic analytics"
                    width={235}
                    height={200}
                    className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c8de5bc7d2a8459f8_gen1_h.png"
                    alt="Traffic analytics hover"
                    width={235}
                    height={200}
                    className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
              </div>

              {/* Quiz */}
              <div className="generation_box_item item2 text-center group">
                <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                  Notre Service de Réexpédition
                </div>
                <div className="generation_box_imgs relative">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa23dd426d1ecea98f1_gen2.png"
                    alt="Quiz interface"
                    width={530}
                    height={400}
                    className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0 w-full max-w-[530px]"
                  />
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c3581ddb720018278_gen2_h.png"
                    alt="Quiz interface hover"
                    width={530}
                    height={400}
                    className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-full max-w-[530px]"
                  />
                </div>
              </div>

              {/* Warm Leads */}
              <div className="generation_box_item item1 text-center group">
                <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                  Votre Colis au Maroc
                </div>
                <div className="generation_box_imgs relative">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa2c1833aee4027e334_gen3.png"
                    alt="Leads dashboard"
                    width={235}
                    height={200}
                    className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c8adf4fc1f530d548_gen3_h.png"
                    alt="Leads dashboard hover"
                    width={235}
                    height={200}
                    className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium">
              Expédier Mon Premier Colis
            </Button>
          </div>
        </div>
      </section>

      {/* How to Make a Quiz */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Comment Fonctionne Notre Service ?</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
              Notre processus est conçu pour être simple et transparent, vous garantissant une expérience sans tracas du
              début à la fin.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-start gap-12 border border-gray-200 rounded-2xl p-8">
              <div className="lg:w-1/2">
                <div className="text-2xl font-medium text-gray-500 mb-4">01</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Ajoutez un Colis Attendu</h3>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Vous avez déjà effectué vos achats en Turquie ? Informez-nous de l'arrivée de votre colis à notre
                  entrepôt. Nous nous chargeons de la réception et de la préparation pour l'expédition.
                </p>
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Pour vous faciliter la vie, vous pouvez :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673459832c11f0880877749f_icon1.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Déclarer un colis en quelques clics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67345983b129ec433bf5fe05_icon2.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Suivre son statut en temps réel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67345983e0825a566f878162_icon3.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Ajouter plusieurs colis à regrouper</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67345983614e9ede23fce4e9_icon4.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Obtenir une estimation des frais</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673459963374d61e8a3148d7_work1.jpg"
                  alt="Create start page"
                  width={479}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-start gap-12 border border-gray-200 rounded-2xl p-8">
              <div className="lg:w-1/2">
                <div className="text-2xl font-medium text-gray-500 mb-4">02</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Demandez-nous d'Acheter pour Vous</h3>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Pas de carte bancaire turque ou des difficultés à acheter en ligne ? Donnez-nous votre liste
                  d'articles souhaités. Nous les achetons pour vous et les ajoutons à votre envoi.
                </p>
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Nos services d'achat incluent :
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {[
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df49714cd24bc6a9c92_q-1svg.svg",
                        title: "Achats sur vos sites préférés",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df4709cb0ddfac298d1_q-2.svg",
                        title: "Négociation de prix si possible",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df4e20e9675e41972ec_q-3.svg",
                        title: "Conseils sur les produits",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df3709cb0ddfac2989d_q-9.svg",
                        title: "Gestion des retours",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df370efb645c1699335_q-4.svg",
                        title: "Suivi des commandes",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df347eac7eaee5abaca_q-5.svg",
                        title: "Regroupement des achats",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df3102a20967f67e396_q-6.svg",
                        title: "Paiement sécurisé en MAD",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df310f2aa00e2f60658_q-7.svg",
                        title: "Assistance personnalisée",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df31f8e1e0f8528c1af_q-8.svg",
                        title: "Disponibilité 24/7",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67357fb0e4922c58f5e1a66a_star.svg",
                        title: "Qualité garantie",
                      },
                      {
                        src: "https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67357fb02737e25344217815_group.svg",
                        title: "Large choix de boutiques",
                      },
                    ].map((item, index) => (
                      <div key={index} className="relative group">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                          <Image
                            src={item.src || "/placeholder.svg"}
                            alt=""
                            width={30}
                            height={30}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67345996df2043bc0740828b_work2.jpg"
                  alt="Set up quiz questions"
                  width={432}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-start gap-12 border border-gray-200 rounded-2xl p-8">
              <div className="lg:w-1/2">
                <div className="text-2xl font-medium text-gray-500 mb-4">03</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Personnalisez Votre Expédition</h3>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Optimisez votre envoi selon vos besoins. Choisissez le mode de livraison, regroupez vos colis, et
                  assurez-vous que tout est parfait avant le départ.
                </p>
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Options de personnalisation
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df484f67db695dd93b8_vetv.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Choix du transporteur</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df46d3632c88af32d49_sale.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Consolidation de plusieurs colis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df40cfc8300418e40d9_calc.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Assurance optionnelle</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67345996502d24b5aa19ec55_work3.jpg"
                  alt="Customize results"
                  width={431}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-start gap-12 border border-gray-200 rounded-2xl p-8">
              <div className="lg:w-1/2">
                <div className="text-2xl font-medium text-gray-500 mb-4">04</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Recevez Votre Colis au Maroc</h3>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Une fois votre colis préparé et les formalités douanières gérées, votre envoi est expédié directement
                  à l'adresse de votre choix au Maroc.
                </p>
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Ce que nous gérons pour vous :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df4e20e9675e41972f6_form.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Déclarations douanières</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df32934ba4d6a68455f_bot.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Suivi de l'envoi de bout en bout</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df39aaf471406800c9f_set.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Livraison à domicile</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Image
                        src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df36e2922c6c6ecee62_pay.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-700">Support client dédié</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673459967caaed53c5346db1_work4.jpg"
                  alt="Capture and convert"
                  width={480}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col lg:flex-row items-start gap-12 border border-gray-200 rounded-2xl p-8">
              <div className="lg:w-1/2">
                <div className="text-2xl font-medium text-gray-500 mb-4">05</div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Profitez de Vos Achats !</h3>
                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                  Le plus beau moment ! Déballez vos articles de Turquie et profitez de vos achats en toute sérénité,
                  sans les tracas de la logistique internationale.
                </p>
              </div>
              <div className="lg:w-1/2">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734599a90470322c4cd1d92_work5.svg"
                  alt="Share your quiz"
                  width={421}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-[]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Pourquoi Choisir Notre Service ?</h2>
            <p className="text-xl text-gray-600">
              Découvrez les avantages qui font de nous votre partenaire privilégié pour l'import de Turquie
            </p>
          </div>

          {/* AI-Powered Quiz Creation Flow */}
          <div className="relative mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Column 1 */}
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Processus Simplifié & Efficace</h3>
                <p className="text-gray-600 mb-8">Profitez d'un service fluide en seulement trois étapes :</p>

                {/* Desktop Button */}
                <div className="hidden lg:block mb-8">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    Démarrer Mon Expédition
                  </button>
                </div>

                {/* Step 1 */}
                <div className="mb-6">
                  <div className="flex items-start justify-center lg:justify-start space-x-4 mb-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      1
                    </div>
                    <p className="text-gray-600 text-left">Inscrivez-vous et obtenez votre adresse en Turquie</p>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-start">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673d87d857d4ad57fe67d472_Group%202087329188.svg"
                    alt="Step 1"
                    width={300}
                    height={200}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="text-center relative">
                {/* Step 2 */}
                <div className="mb-6">
                  <div className="flex items-start justify-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      2
                    </div>
                    <p className="text-gray-600 text-left">Déclarez vos colis ou demandez un achat</p>
                  </div>
                </div>

                {/* Desktop Image */}
                <div className="hidden md:block">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673590e03470f7b3ed7bf1ee_2.svg"
                    alt="Step 2 Desktop"
                    width={400}
                    height={300}
                    className="mx-auto max-w-full h-auto"
                  />
                </div>

                {/* Mobile Image */}
                <div className="md:hidden">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673d8a89835f079c653a6dcc_ai_mob.svg"
                    alt="Step 2 Mobile"
                    width={300}
                    height={200}
                    className="mx-auto max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="text-center lg:text-right">
                <div className="flex justify-center lg:justify-end mb-6">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673590e0455667ddc7fee1c7_3.svg"
                    alt="Step 3"
                    width={400}
                    height={300}
                    className="max-w-full h-auto"
                  />
                </div>

                {/* Step 3 */}
                <div className="flex items-start justify-center lg:justify-end space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-600 text-left">Recevez votre colis chez vous au Maroc</p>
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div className="hidden lg:block">
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673593135e4b5b7c08d41e4e_arrow_ai.svg"
                alt="Arrow 1"
                width={80}
                height={40}
                className="absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2"
              />
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673593135e4b5b7c08d41e4e_arrow_ai.svg"
                alt="Arrow 2"
                width={80}
                height={40}
                className="absolute top-1/2 right-1/4 transform -translate-y-1/2 translate-x-1/2"
              />
            </div>

            {/* Mobile Button */}
            <div className="lg:hidden text-center mt-8">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Démarrer Mon Expédition
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="bg-white py-[]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Connectivité et Flexibilité
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Notre plateforme est conçue pour s'intégrer à vos besoins, offrant des solutions pour le suivi et la
                gestion de vos envois.
              </p>
            </div>

            {/* Integration Logos */}
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67359dfeb0ac7295d3e020eb_logo_comp.svg"
                alt="Integration logos including Zapier, Stripe, MailChimp, Meta, Google Analytics, TikTok, Telegram and more"
                width={600}
                height={400}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fair Payment System Banner */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 lg:p-12 overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between relative z-10 items-stretch">
              {/* Left Content */}
              <div className="lg:w-2/3 mb-8 lg:mb-0 text-white">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">Tarification Simple et Transparente</h2>
                <p className="text-base lg:text-lg leading-relaxed opacity-90">
                  Pas de frais cachés, pas de surprises. Vous payez uniquement pour le service dont vous avez besoin,
                  avec une clarté totale sur les coûts.
                </p>
              </div>

              {/* Right Content */}
              <div className="lg:w-1/3 lg:text-right text-white text-left">
                <div className="mb-6">
                  <div className="text-3xl lg:text-4xl font-bold">À partir de 19 MAD</div>
                  <div className="text-lg opacity-90">par envoi</div>
                </div>
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 font-medium">
                  Voir les Tarifs
                </Button>
              </div>
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

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66d81daf62a4eb1c50340914_logo.svg"
                alt="Marquiz Logo"
                width={120}
                height={40}
                className="mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Votre partenaire de confiance pour les envois Turquie-Maroc © 2025
              </p>

              {/* Legal Links */}
              <div className="space-y-2 mb-6">
                <a href="/terms-of-use" className="block text-xs text-gray-500 hover:text-gray-700">
                  Conditions d'Utilisation
                </a>
                <a href="/policy" className="block text-xs text-gray-500 hover:text-gray-700">
                  Politique de Confidentialité
                </a>
                <a href="#" className="block text-xs text-gray-500 hover:text-gray-700">
                  Accord de Traitement des Données GDPR
                </a>
                <a href="/gdpr-faq" className="block text-xs text-gray-500 hover:text-gray-700">
                  FAQ sur le GDPR
                </a>
                <a href="/marquiz-privacy-notice" className="block text-xs text-gray-500 hover:text-gray-700">
                  Avis de Confidentialité TransiPack
                </a>
                <a href="/red-politika" className="block text-xs text-gray-500 hover:text-gray-700">
                  Politique Éditoriale TransiPack
                </a>
                <a href="/return-and-refund-policy" className="block text-xs text-gray-500 hover:text-gray-700">
                  Politique de Retour et Remboursement
                </a>
                <a href="/payment-security/" className="block text-xs text-gray-500 hover:text-gray-700">
                  Paiement & Sécurité
                </a>
              </div>

              {/* Payment Methods */}
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66d820750895684cefae10ed_pay.svg"
                alt="Payment methods"
                width={91}
                height={30}
                className="mb-4"
              />

              {/* Reviews */}
              <Image
                src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66d820759fc9fe19ab290fb6_otz.png"
                alt="Reviews"
                width={200}
                height={40}
                className="mb-4"
              />

              {/* Social Links */}
              <div className="flex space-x-3">
                <a
                  href="https://www.linkedin.com/company/marquiz-io/"
                  target="_blank"
                  rel="noreferrer nofollow noopener"
                >
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66d821ae3f854ea620e2d22c_in.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </a>
                <a href="https://www.facebook.com/try.marquiz/" target="_blank" rel="noreferrer nofollow noopener">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66d821aeb7910c15b8b69ba6_fb.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <div
                className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
                onClick={() => toggleDropdown("products")}
              >
                <h3 className="text-lg font-semibold text-gray-800">Produits</h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.products ? "rotate-180" : ""}`}
                />
              </div>
              <div className={`space-y-3 ${openDropdowns.products ? "block" : "hidden"} lg:block`}>
                <a href="/calculator" className="block text-gray-600 hover:text-gray-800">
                  Calculateur de Frais
                </a>
                <a href="/online-store" className="block text-gray-600 hover:text-gray-800">
                  Achats en ligne
                </a>
                <a href="/test" className="block text-gray-600 hover:text-gray-800">
                  Suivi de Colis
                </a>
                <a href="/lead-capture-form" className="block text-gray-600 hover:text-gray-800">
                  Formulaire d'Envoi
                </a>
                <a href="/landing-page-creator" className="block text-gray-600 hover:text-gray-800">
                  Pages de Service
                </a>
              </div>
            </div>

            {/* Resources & Quick Start */}
            <div>
              <div className="mb-8">
                <div
                  className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
                  onClick={() => toggleDropdown("resources")}
                >
                  <h3 className="text-lg font-semibold text-gray-800">Ressources</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.resources ? "rotate-180" : ""}`}
                  />
                </div>
                <div className={`space-y-3 ${openDropdowns.resources ? "block" : "hidden"} lg:block`}>
                  <a href="/blog" className="block text-gray-600 hover:text-gray-800">
                    Notre Blog
                  </a>
                  <a
                    href="https://help.marquiz.io/"
                    target="_blank"
                    className="block text-gray-600 hover:text-gray-800"
                    rel="noreferrer"
                  >
                    Base de Connaissances
                  </a>
                  <a href="/faq" className="block text-gray-600 hover:text-gray-800">
                    FAQ
                  </a>
                </div>
              </div>

              <div>
                <div
                  className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
                  onClick={() => toggleDropdown("quickstart")}
                >
                  <h3 className="text-lg font-semibold text-gray-800">Démarrage Rapide</h3>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.quickstart ? "rotate-180" : ""}`}
                  />
                </div>
                <div className={`space-y-3 ${openDropdowns.quickstart ? "block" : "hidden"} lg:block`}>
                  <a href="/ai" className="block text-gray-600 hover:text-gray-800">
                    Comment Envoyer un Colis
                  </a>
                  <a href="/blog" className="block text-gray-600 hover:text-gray-800">
                    Guide d'Achat
                    <br />
                    en Turquie
                  </a>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div
                className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
                onClick={() => toggleDropdown("features")}
              >
                <h3 className="text-lg font-semibold text-gray-800">Fonctionnalités</h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.features ? "rotate-180" : ""}`}
                />
              </div>
              <div className={`space-y-3 ${openDropdowns.features ? "block" : "hidden"} lg:block`}>
                <a href="/features#payment" className="block text-gray-600 hover:text-gray-800">
                  Traitement des Paiements
                </a>
                <a href="/features#discounts" className="block text-gray-600 hover:text-gray-800">
                  Remises Dynamiques
                </a>
                <a href="/features/#ab" className="block text-gray-600 hover:text-gray-800">
                  Regroupement de Colis
                </a>
                <a href="/features/#results" className="block text-gray-600 hover:text-gray-800">
                  Options de Livraison
                </a>
                <a href="/features/#utm" className="block text-gray-600 hover:text-gray-800">
                  Suivi Personnalisé
                </a>
                <a href="/features/#analytics" className="block text-gray-600 hover:text-gray-800">
                  Analyse des Coûts
                </a>
                <a href="/features/#vetvlenie" className="block text-gray-600 hover:text-gray-800">
                  Assistance Client
                </a>
                <a href="/features/#meta" className="block text-gray-600 hover:text-gray-800">
                  Déclarations Douanières
                </a>
                <a href="/features/#dog" className="block text-gray-600 hover:text-gray-800">
                  Achats Personnels
                </a>
              </div>
            </div>

            {/* TransiPack */}
            <div>
              <div
                className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
                onClick={() => toggleDropdown("transipack")}
              >
                <h3 className="text-lg font-semibold text-gray-800">TransiPack</h3>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.transipack ? "rotate-180" : ""}`}
                />
              </div>
              <div className={`space-y-3 ${openDropdowns.transipack ? "block" : "hidden"} lg:block`}>
                <a href="/about-us" className="block text-gray-600 hover:text-gray-800">
                  À Propos de Nous
                </a>
                <a href="/contact" className="block text-gray-600 hover:text-gray-800">
                  Contactez-nous
                </a>
                <a href="/partners" className="block text-gray-600 hover:text-gray-800">
                  Programme d'Affiliation
                </a>
                <a href="/pricing" className="block text-gray-600 hover:text-gray-800">
                  Tarifs
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
