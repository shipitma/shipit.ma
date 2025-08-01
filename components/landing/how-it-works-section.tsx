import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/hooks/use-translations"

export function HowItWorksSection() {
  const { t } = useTranslations()
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {t('howItWorks.title', 'Comment Ça Marche ?')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t('howItWorks.subtitle', 'Transformez vos désirs d\'achats en réalité grâce à un processus simple et interactif')}
          </p>
        </div>

        {/* Generation Box */}
        <div className="generation_box relative">
          {/* Desktop Arrow - hidden on mobile */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673443538de5bc7d2a86578c_arrow.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />

          {/* Mobile Arrow - visible only on mobile */}
          <div
            className="md:hidden absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/673d88919a5cd6110dd31da7_arrow_img.svg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-center relative z-10">
            {/* Traffic */}
            <div className="generation_box_item item1 text-center group">
              <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                {t('howItWorks.step1', '1. Inscrivez-vous et obtenez une adresse de livraison grâce à Shipit.')}
              </div>
              <div className="generation_box_imgs relative">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa2bc2e4df973eb7082_gen1.png"
                  alt="Traffic analytics"
                  width={235}
                  height={200}
                  className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0"
                />
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c8de5bc7d2a8459f8_gen1_h.png"
                  alt="Traffic analytics hover"
                  width={235}
                  height={200}
                  className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>

            {/* Quiz */}
            <div className="generation_box_item item2 text-center group">
              <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                {t('howItWorks.step2', '2. Achetez dans les boutiques de votre choix et expédiez vos articles à votre nouvelle adresse.')}
              </div>
              <div className="generation_box_imgs relative">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa23dd426d1ecea98f1_gen2.png"
                  alt="Quiz interface"
                  width={530}
                  height={400}
                  className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0 w-full max-w-[530px]"
                />
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c3581ddb720018278_gen2_h.png"
                  alt="Quiz interface hover"
                  width={530}
                  height={400}
                  className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-full max-w-[530px]"
                />
              </div>
            </div>

            {/* Warm Leads */}
            <div className="generation_box_item item1 text-center group">
              <div className="generation_box_label bg-gray-100 text-gray-700 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 px-6 py-3 rounded-full text-sm font-medium mb-6 inline-block">
                {t('howItWorks.step3', '3. Regroupez vos colis pour payer moins cher')}
              </div>
              <div className="generation_box_imgs relative">
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/67343fa2c1833aee4027e334_gen3.png"
                  alt="Leads dashboard"
                  width={235}
                  height={200}
                  className="generation_box_img mx-auto transition-opacity duration-300 group-hover:opacity-0"
                />
                <Image
                  src="https://cdn.prod.website-files.com/5de164d383c9d7a518dd269b/6734414c8adf4fc1f530d548_gen3_h.png"
                  alt="Leads dashboard hover"
                  width={235}
                  height={200}
                  className="generation_box_img-hover mx-auto absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-medium">
            Commencez Votre Aventure Shopping !
          </Button>
        </div>
      </div>
    </section>
  )
} 