"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
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
                Avis de Confidentialité shipit
              </a>
              <a href="/red-politika" className="block text-xs text-gray-500 hover:text-gray-700">
                Politique Éditoriale shipit
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

          {/* shipit */}
          <div>
            <div
              className="flex items-center justify-between mb-4 cursor-pointer lg:cursor-default"
              onClick={() => toggleDropdown("shipit")}
            >
              <h3 className="text-lg font-semibold text-gray-800">shipit</h3>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform lg:hidden ${openDropdowns.shipit ? "rotate-180" : ""}`}
              />
            </div>
            <div className={`space-y-3 ${openDropdowns.shipit ? "block" : "hidden"} lg:block`}>
              <a href="/about-us" className="block text-gray-600 hover:text-gray-800">
                À Propos de Nous
              </a>
              <a href="/contact" className="block text-gray-600 hover:text-gray-800">
                Contactez-nous
              </a>
              <a href="/pricing" className="block text-gray-600 hover:text-gray-800">
                Tarifs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 