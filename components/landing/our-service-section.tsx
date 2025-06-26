import Image from "next/image"

export function OurServiceSection() {
  return (
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
  )
} 