"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-600 to-orange-800 flex flex-col">
      <Header />
      <main className="flex-1 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <section className="max-w-5xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-900">
            Transformez votre façon d'acheter à l'international&nbsp;
            <span className="text-orange-700">avec Shipiti</span>
          </h1>
          {/* Main Box - Card Layout */}
          <div className="rounded-3xl bg-orange-50/60 p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center shadow-lg">
            {/* Left: Text blocks */}
            <div className="flex-1 w-full">
              <div className="mb-8">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Achetez partout, recevez au Maroc</div>
                <div className="text-gray-700 text-base md:text-lg">
                  Shipiti simplifie vos achats à l'international. Accédez aux meilleures boutiques des États-Unis, d'Europe et de Turquie, et faites-vous livrer directement chez vous au Maroc, sans tracas ni frais cachés.
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Fini les complications douanières</div>
                <div className="text-gray-700 text-base md:text-lg">
                  Nous gérons pour vous toutes les étapes : achat, paiement, réception, dédouanement et livraison. Profitez d'un service transparent, rapide et sécurisé, avec un support client réactif.
                </div>
              </div>
            </div>
            {/* Right: Image in card */}
            <div className="flex-1 flex justify-center w-full">
              <div className="rounded-2xl bg-white shadow-xl p-2 md:p-4 flex items-center justify-center">
                <img
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/663a4b0d17e256d1449add8e_b1.png"
                  alt="Shipiti international shopping"
                  className="w-64 md:w-80 rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 