"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowRight,
  Box,
  MapPin,
  Truck,
  Phone,
  Lock,
  Package,
  Users,
  Star,
  Newspaper,
  Download,
  HeartHandshake,
  MessageCircle,
  BookOpen,
} from "lucide-react"

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
    {children}
  </Link>
)

const LandingHeader = () => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <img src="https://placehold.co/32x32/f97316/ffffff?text=LOGO" alt="Logo" className="w-8 h-8" />
        <span className="text-lg font-semibold text-gray-900">shipit.ma</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="#features">Services</NavLink>
        <NavLink href="#pricing">Tarifs</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Se Connecter</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register">Créer un Compte</Link>
        </Button>
      </div>
    </div>
  </header>
)

const HeroSection = () => (
  <section className="bg-orange-50/50">
    <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-4 md:px-6 py-16 md:py-24">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Envoyer ou recevoir un colis n'a jamais été aussi simple
        </h1>
        <p className="text-lg text-gray-600">
          Votre solution de livraison rapide, fiable et abordable partout au Maroc.
        </p>
        <div className="pt-4">
          <Card className="shadow-lg">
            <CardContent className="p-5">
              <Tabs defaultValue="send">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="send">J'envoie un colis</TabsTrigger>
                  <TabsTrigger value="track">Suivre mon colis</TabsTrigger>
                </TabsList>
                <TabsContent value="send" className="pt-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Ville de départ" />
                    <Input placeholder="Ville d'arrivée" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Taille du colis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petit (&lt;1kg)</SelectItem>
                      <SelectItem value="medium">Moyen (1-5kg)</SelectItem>
                      <SelectItem value="large">Grand (&gt;5kg)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    Estimer le tarif <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TabsContent>
                <TabsContent value="track" className="pt-4 space-y-3">
                  <Input placeholder="Numéro de suivi" />
                  <Button className="w-full">
                    Suivre <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden md:block">
        <img
          src="https://placehold.co/600x500/f97316/ffffff?text=Shipit.ma"
          alt="Person sending a package"
          className="rounded-xl shadow-2xl"
        />
      </div>
    </div>
  </section>
)

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <div className="text-center p-4">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 text-orange-600 mx-auto mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-md font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

const FeaturesSection = () => (
  <section id="features" className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <FeatureCard icon={Truck} title="Livraison en consigne" description="Plus de 120 consignes au Maroc." />
        <FeatureCard icon={MapPin} title="Un réseau national" description="Proches de vous et disponibles 24/7." />
        <FeatureCard icon={Lock} title="Consignes sécurisées" description="Déposez et récupérez vos colis en toute tranquillité." />
        <FeatureCard
          icon={Package}
          title="Application pratique"
          description="Commandez et suivez tout via notre app."
        />
      </div>
    </div>
  </section>
)

const HowItWorksSection = () => (
  <section className="py-16 md:py-24 bg-orange-50/50">
    <div className="container mx-auto px-4 md:px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Quelques clics suffisent pour envoyer votre colis</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
        Suivez ces étapes simples pour une expérience de livraison sans tracas.
      </p>
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-semibold">Créez votre compte</h3>
          </div>
          <p className="text-sm text-gray-600">
            Inscrivez-vous en moins de 2 minutes sur notre site ou notre application mobile.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-semibold">Préparez votre envoi</h3>
          </div>
          <p className="text-sm text-gray-600">
            Renseignez les informations de votre colis, choisissez la destination et le mode de livraison.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-600 text-white font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-semibold">Déposez votre colis</h3>
          </div>
          <p className="text-sm text-gray-600">
            Rendez-vous à la consigne automatique la plus proche et déposez votre colis en toute sécurité.
          </p>
        </div>
      </div>
    </div>
  </section>
)

const CtaSection = () => (
  <section id="pricing" className="bg-orange-600">
    <div className="container mx-auto px-4 md:px-6 py-16 text-center">
      <h2 className="text-3xl font-bold text-white mb-3">Découvrez nos offres de prix maintenant !</h2>
      <p className="text-lg text-orange-100 max-w-2xl mx-auto mb-6">
        Nous livrons partout au Maroc avec le meilleur tarif. Découvrez nos offres de prix dès maintenant !
      </p>
      <Button variant="secondary" size="lg">
        J'en profite
      </Button>
    </div>
  </section>
)

const TestimonialCard = ({
  name,
  role,
  text,
  avatar,
}: {
  name: string
  role: string
  text: string
  avatar: string
}) => (
  <Card className="bg-white shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 italic">"{text}"</p>
    </CardContent>
  </Card>
)

const TestimonialsSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto px-4 md:px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Ils utilisent nos consignes automatiques !</h2>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <TestimonialCard
          name="Kamal N."
          role="Commerçant"
          text="Service express pour mes professionnels et pour la qualité du service offert, franchement rapide. Je suis satisfait."
          avatar="https://placehold.co/40x40/FFC107/FFFFFF"
        />
        <TestimonialCard
          name="Wahiba E."
          role="Particulier"
          text="Le service client et l'humanité de l'équipe ont traité ma problématique au petit soin."
          avatar="https://placehold.co/40x40/4CAF50/FFFFFF"
        />
        <TestimonialCard
          name="Karim A."
          role="Particulier"
          text="C'est simple, c'est très pratique. On peut passer à toute heure."
          avatar="https://placehold.co/40x40/2196F3/FFFFFF"
        />
      </div>
    </div>
  </section>
)

const PartnersSection = () => (
  <section className="py-16 bg-orange-50/50">
    <div className="container mx-auto px-4 md:px-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">Nos partenaires</h2>
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
        <img src="https://placehold.co/120x40/cccccc/ffffff?text=Partner+1" alt="Partner 1" className="h-10" />
        <img src="https://placehold.co/120x40/cccccc/ffffff?text=Partner+2" alt="Partner 2" className="h-10" />
        <img src="https://placehold.co/120x40/cccccc/ffffff?text=Partner+3" alt="Partner 3" className="h-10" />
        <img src="https://placehold.co/120x40/cccccc/ffffff?text=Partner+4" alt="Partner 4" className="h-10" />
        <img src="https://placehold.co/120x40/cccccc/ffffff?text=Partner+5" alt="Partner 5" className="h-10" />
      </div>
    </div>
  </section>
)

const LandingFooter = () => (
  <footer id="contact" className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Express Relais & Vous</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">A propos</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Notre actualité</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Questions/Réponses</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Particuliers</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">J'envoie un colis</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Je reçois un colis</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Professionnels</h3>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Solutions e-commerce</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Nos services</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Devenir client grand compte</h3>
          <p className="text-sm text-gray-400">Contactez-nous pour une offre sur-mesure !</p>
          <Button variant="outline" className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">Contactez-nous</Button>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} shipit.ma. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <MessageCircle className="h-5 w-5 text-gray-500 hover:text-white" />
          <HeartHandshake className="h-5 w-5 text-gray-500 hover:text-white" />
          <BookOpen className="h-5 w-5 text-gray-500 hover:text-white" />
        </div>
      </div>
    </div>
  </footer>
)

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white">
        <LandingHeader />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CtaSection />
          <TestimonialsSection />
          <PartnersSection />
        </main>
        <LandingFooter />
      </div>
    )
  }

  return null
}
