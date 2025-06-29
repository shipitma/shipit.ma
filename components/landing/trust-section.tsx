import Image from "next/image"

export function TrustSection() {
  return (
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
            src="/67d9e74de1942bbbb73c83c1-p-500.svg"
            alt="Trust badges and ratings"
            width={403}
            height={200}
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
} 