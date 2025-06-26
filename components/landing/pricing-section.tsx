import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl p-8 lg:p-12 overflow-hidden">
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
  )
} 