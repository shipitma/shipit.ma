import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative text-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Vos Achats Mondiaux au Maroc : Simplifiés, Rapides, Sans Surprises.
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w3xl mx-auto leading-relaxed">
            Accédez aux meilleures marques des USA, Turquie, Espagne et France. Nous gérons tout, de l'achat à la
            livraison directe à votre porte au Maroc. Vivez l'expérience shopping sans frontières !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-base font-medium">
              Commencez Votre Aventure Shopping Mondiale !
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-orange-600 border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-base font-medium"
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
                priority
              />
            </div>
          </div>

          {/* Quote Section */}
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-lg md:text-xl font-medium mb-8 leading-relaxed">
              "Grâce à shipit, j'ai pu commander des articles exclusifs des USA que je ne trouvais pas au Maroc. Le
              regroupement a vraiment réduit les frais, et la livraison a été rapide et sans aucun souci de douane.
              Je recommande à 100% !"
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
                  <div className="font-semibold text-white">Fatima Z., Casablanca</div>
                  <div className="text-white/80">Cliente satisfaite</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 