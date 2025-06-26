import Image from "next/image"

export function WeBuyForYouSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Nous achetons pour vous !</h2>
          <p className="text-xl text-gray-600">
            Veuillez visiter la Achat Assisté page pour en savoir plus ...
          </p>
        </div>

        {/* AI-Powered Quiz Creation Flow */}
        <div className="relative mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Column 1 */}
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Comment ça Marche?</h3>
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
                  <p className="text-gray-600 text-left">Dites-nous ce que vous voulez</p>
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
                  <p className="text-gray-600 text-left">
                    Nous vérifions la disponibilité et procédons à l'achat des produits
                  </p>
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
                <p className="text-gray-600 text-left">Une fois reçus, nous vous les expédions.</p>
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
  )
} 