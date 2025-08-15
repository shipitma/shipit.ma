import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"

export function OurServiceSection() {
  const { t } = useTranslations()
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {t('landing.ourServices.title', 'Vous Achetez, Nous Livrons.')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            {t('landing.ourServices.subtitle', 'Notre processus est conçu pour être simple et transparent, vous garantissant une expérience sans tracas du début à la fin.')}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row border border-gray-200 rounded-2xl overflow-hidden">
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="text-2xl font-medium text-gray-500 mb-4">01</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                {t('landing.ourServices.step1.title', 'Créez Votre Compte et Obtenez Votre Adresse GRATUITE')}
              </h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {t('landing.ourServices.step1.description', 'Rejoignez Shipit en quelques clics ! Recevez instantanément votre adresse de réexpédition personnalisée en Turquie, en Europe ou aux États-Unis.')}
              </p>
            </div>
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <Image
                src="/charismatic-smiling-young-caucasian-girl-holding-mobile-phone-showing-smartphone-application-display.jpg"
                alt={t('landing.ourServices.step1.imageAlt', 'Créer un compte Shipit et obtenir une adresse de livraison')}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse border border-gray-200 rounded-2xl overflow-hidden">
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="text-2xl font-medium text-gray-500 mb-4">02</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                {t('landing.ourServices.step2.title', 'Magasinez en Ligne, Nous Nous Chargeons de la Réception')}
              </h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {t('landing.ourServices.step2.description', 'Faites vos achats sur vos sites préférés en Turquie, en Europe ou aux États-Unis et faites-les livrer à votre nouvelle adresse Shipit. Nous prenons le relais dès l\'arrivée de votre colis.')}
              </p>
            </div>
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <Image
                src="/positive-curly-haired-european-woman-smiles-happily-uses-modern-smartphone-credit-card-purchases-something-makes-shopping-online-dressed-casual-jumper-isolated-vivid-yellow-background.jpg"
                alt={t('landing.ourServices.step2.imageAlt', 'Acheter en ligne et faire livrer à l\'adresse Shipit')}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row border border-gray-200 rounded-2xl overflow-hidden">
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="text-2xl font-medium text-gray-500 mb-4">03</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                {t('landing.ourServices.step3.title', 'Personnalisez Votre Expédition : Vos Choix, Vos Économies')}
              </h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {t('landing.ourServices.step3.description', 'Dès que votre colis arrive chez nous, vous êtes notifié ! C\'est le moment de personnaliser votre envoi pour qu\'il arrive exactement comme vous le souhaitez.')}
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
                    <span className="text-gray-700">{t('landing.ourServices.step3.feature1', 'Photos détaillées du contenu : assurez-vous de l\'état de vos articles.')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df46d3632c88af32d49_sale.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">{t('landing.ourServices.step3.feature2', 'Regroupement intelligent : combinez plusieurs colis et économisez jusqu\'à 80% sur les frais d\'expédition.')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df40cfc8300418e40d9_calc.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">{t('landing.ourServices.step3.feature3', 'Protection renforcée : ajoutez de l\'adhésif ou du papier-bulles supplémentaire pour une sécurité optimale.')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <Image
                src="/woman-safety-equipment-work.jpg"
                alt={t('landing.ourServices.step3.imageAlt', 'Personnaliser l\'expédition et choisir les options')}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col lg:flex-row-reverse border border-gray-200 rounded-2xl overflow-hidden">
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="text-2xl font-medium text-gray-500 mb-4">04</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                {t('landing.ourServices.step4.title', 'Recevez Votre Colis Directement au Maroc')}
              </h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {t('landing.ourServices.step4.description', 'Une fois votre expédition configurée, détendez-vous ! Nous nous occupons de tout pour que votre colis arrive à votre porte au Maroc.')}
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
                    <span className="text-gray-700">{t('landing.ourServices.step4.feature1', 'Déclarations douanières prises en charge')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df32934ba4d6a68455f_bot.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">{t('landing.ourServices.step4.feature2', 'Livraison rapide à domicile')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df39aaf471406800c9f_set.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">{t('landing.ourServices.step4.feature3', 'Livraison à domicile')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Image
                      src="https://cdn.prod.website-files.com/5adb18f797c69778e81b7f73/668e2df36e2922c6c6ecee62_pay.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">{t('landing.ourServices.step4.feature4', 'Support client dédié')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <Image
                src="/happy-courier-showing-order-sheet-client-holding-clipboard-professional-deliveryman-carrying-paper-bag-woman-receiving-order-home-food-delivery-service-online-shopping-concept.jpg"
                alt={t('landing.ourServices.step4.imageAlt', 'Livraison à domicile au Maroc')}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col lg:flex-row border border-gray-200 rounded-2xl overflow-hidden">
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="text-2xl font-medium text-gray-500 mb-4">05</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                {t('landing.ourServices.step5.title', 'Profitez de Vos Achats !')}
              </h3>
              <p className="text-gray-600 mb-8 text-base leading-relaxed">
                {t('landing.ourServices.step5.description', 'Votre colis est arrivé ? Félicitations ! Il ne vous reste plus qu\'à profiter de vos nouveaux articles. N\'attendez plus pour vos prochains craquages shopping, nous sommes là pour vous !')}
              </p>
            </div>
            <div className="lg:w-1/2 relative h-64 lg:h-auto">
              <Image
                src="/young-beautiful-girl-wearing-orange-t-shirt-holding-paper-package-credit-card-smiling-cheerfully-standing-isolated-orange-background.jpg"
                alt={t('landing.ourServices.step5.imageAlt', 'Profiter des achats livrés')}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium">
            <Link href="/register">
              {t('landing.ourServices.cta', 'Commencer maintenant')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 