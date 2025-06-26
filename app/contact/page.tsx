"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/33.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/46.jpg",
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-600 to-orange-800 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <section className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column */}
            <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-orange-800 mb-6">Comment nous contacter</h1>
<div className="text-lg text-gray-800 mb-4">
  Shipit vous permet de recevoir vos colis des États-Unis, d’Europe et de Turquie directement au Maroc. Pour toute question, le moyen le plus rapide de nous joindre est via notre chat de support.
  <span className="block md:inline text-orange-700"> Cliquez simplement sur l’icône de la main qui salue en bas à droite de l’écran <span className="inline-block align-middle">👋</span>.</span>
</div>
{/* Avatars Row */}
<div className="flex items-center gap-2 mb-2">
  {avatars.map((src, i) => (
    <img key={i} src={src} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow -ml-2 first:ml-0" />
  ))}
  <span className="ml-2 text-2xl bg-white rounded-full shadow px-2">👋</span>
</div>
<div className="text-gray-400 text-base mb-6">En semaine, nous répondons généralement en moins de 2 à 3 minutes.</div>
{/* Email Card */}
<div className="bg-orange-50 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 max-w-xl">
  <div className="flex-1 text-gray-700 text-base">
    Vous pouvez également nous contacter par e-mail. Nous lisons tous les messages, mais le délai de réponse peut être plus long.
  </div>
  <a href="mailto:salam@shipit.ma" className="flex items-center gap-2 font-bold text-orange-800 text-lg hover:underline">
    salam@shipit.ma
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.664062 17.4534L14.7841 3.33341H5.9974V0.666748H19.3307V14.0001H16.6641V5.21341L2.54406 19.3334L0.664062 17.4534Z" fill="currentColor"></path>
    </svg>
  </a>
</div>

            </div>
            {/* Right Column */}
            <div className="flex-1 flex flex-col md:pl-8 md:border-l md:border-gray-200">
            <div className="text-lg text-gray-800 mb-4 md:mb-8 md:mt-2 border-l-0 md:border-l-0">
  Suivez-nous sur les réseaux sociaux, notre équipe est toujours disponible en message privé !
</div>

              <div className="flex gap-4 mt-2 md:mt-0">
                <a href="#" target="_blank" rel="nofollow noopener" className="rounded-full bg-orange-100 hover:bg-orange-200 p-2">
                  <svg className="w-10 h-10 text-orange-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v4.731z"/></svg>
                </a>
                <a href="#" target="_blank" rel="nofollow noopener" className="rounded-full bg-orange-100 hover:bg-orange-200 p-2">
                  <svg className="w-10 h-10 text-orange-700" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.294h6.116c.729 0 1.321-.593 1.321-1.326v-21.349c0-.734-.592-1.326-1.325-1.326z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 