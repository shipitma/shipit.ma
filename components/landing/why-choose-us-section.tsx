import Image from "next/image"

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Pourquoi Choisir Notre Plateforme Plutôt que les Solutions Traditionnelles ?
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Contrairement aux solutions traditionnelles ou aux faveurs familiales à l'étranger, nous sommes la première
            plateforme marocaine offrant un service complet d'achat international et de réexpédition avec garantie de
            satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Online Stores Card */}
          <div className="bg-white rounded-2xl border border-[#dd473b] overflow-hidden">
            <div className="p-6 bg-transparent">
              <h3 className="text-lg font-semibold mb-4 text-[#dd473b]">
                Les autres solutions : Complexes et limitées !
              </h3>
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
                  <span className="text-[#dd473b]">
                    <b>Démarches complexes :</b> Multiples intermédiaires et formalités.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                    alt="Issue icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[#dd473b]">
                    <b>Carte bancaire internationale requise :</b> Impossible d'acheter sans carte internationale.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                    alt="Issue icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[#dd473b]">
                    <b>Coûts cachés :</b> Frais supplémentaires découverts à la livraison.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                    alt="Issue icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[#dd473b]">
                    <b>Délais imprévisibles :</b> Aucune garantie sur les temps de transit.
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abece_kr.svg"
                    alt="Issue icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-[#dd473b]">
                    <b>Support limité :</b> Assistance uniquement en cas de problème majeur.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 bg-[rgba(234,88,12,1)]">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Notre plateforme : Service tout-en-un, pensé pour vous !
              </h3>
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
                  <span className="text-white">
                    <b>Plateforme tout-en-un :</b> Réexpédition ET achat assisté sur une seule interface.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                    alt="Benefit icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-white">
                    <b>Transparence totale :</b> Tous les frais affichés dès le départ, sans surprise.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                    alt="Benefit icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-white">
                    <b>Suivi en temps réel :</b> Visibilité complète de votre commande à chaque étape.
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/66ec02b1cb344ea14e7abee9_gl.svg"
                    alt="Benefit icon"
                    width={20}
                    height={20}
                    className="flex-shrink-0"
                  />
                  <span className="text-white">
                    <b>Accompagnement personnalisé :</b> Support dédié de l'achat à la livraison.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 