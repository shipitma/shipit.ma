import Image from "next/image"

export function OurServiceSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Vous Achetez, Nous Livrons.</h2>
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
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Créez Votre Compte et Obtenez Votre Adresse GRATUITE</h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Rejoignez Shipit en quelques clics ! Recevez instantanément votre adresse de réexpédition personnalisée en Turquie, en Europe ou aux États-Unis.
              </p>


            </div>
            <div className="lg:w-1/2">
              <Image
                src="/673459963374d61e8a3148d7_work1.svg"
                alt="Create start page"
                width={479}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-start gap-12 border border-gray-200 rounded-2xl p-8">
            <div className="lg:w-1/2">
              <div className="text-2xl font-medium text-gray-500 mb-4">02</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Magasinez en Ligne, Nous Nous Chargeons de la Réception</h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Faites vos achats sur vos sites préférés en Turquie, en Europe ou aux États-Unis et faites-les livrer à votre nouvelle adresse Shipit. Nous prenons le relais dès l'arrivée de votre colis.
              </p>

            </div>
            <div className="lg:w-1/2">
              <Image
                src="/67345996df2043bc0740828b_work2.svg"
                alt="Set up quiz questions"
                width={432}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-start gap-12 border border-gray-200 rounded-2xl p-8">
            <div className="lg:w-1/2">
              <div className="text-2xl font-medium text-gray-500 mb-4">03</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Personnalisez Votre Expédition : Vos Choix, Vos Économies</h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Dès que votre colis arrive chez nous, vous êtes notifié ! C'est le moment de personnaliser votre envoi pour qu'il arrive exactement comme vous le souhaitez.
              </p>
              <div className="mb-6">

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df484f67db695dd93b8_vetv.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Photos détaillées du contenu : assurez-vous de l'état de vos articles.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df46d3632c88af32d49_sale.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Regroupement intelligent : combinez plusieurs colis et économisez jusqu'à 80% sur les frais d'expédition.</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df40cfc8300418e40d9_calc.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Protection renforcée : ajoutez de l'adhésif ou du papier-bulles supplémentaire pour une sécurité optimale.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/67345996502d24b5aa19ec55_work3.svg"
                alt="Customize results"
                width={431}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row-reverse items-start gap-12 border border-gray-200 rounded-2xl p-8">
            <div className="lg:w-1/2">
              <div className="text-2xl font-medium text-gray-500 mb-4">04</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Recevez Votre Colis Directement au Maroc</h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Une fois votre expédition configurée, détendez-vous ! Nous nous occupons de tout pour que votre colis arrive à votre porte au Maroc.
              </p>
              <div className="mb-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df4e20e9675e41972f6_form.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Déclarations douanières prises en charge</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df32934ba4d6a68455f_bot.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Livraison rapide à domicile</span>
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
                src="/673459967caaed53c5346db1_work4.svg"
                alt="Capture and convert"
                width={480}
                height={400}
                className="rounded-lg w-full"
              />
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col lg:flex-row items-start gap-12 border border-gray-200 rounded-2xl p-8">
            <div className="lg:w-1/2">
              <div className="text-2xl font-medium text-gray-500 mb-4">05</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Profitez de Vos Achats !</h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Votre colis est arrivé ? Félicitations ! Il ne vous reste plus qu'à profiter de vos nouveaux articles. N'attendez plus pour vos prochains craquages shopping, nous sommes là pour vous !
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/6734599a90470322c4cd1d92_work5.svg"
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