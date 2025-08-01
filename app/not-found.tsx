"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Package, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"

export default function NotFound() {
  const { user, loading } = useAuth()
  const { t } = useTranslations()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">{t('mainLayout.loading', 'Chargement...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">{t('notFound.title', 'Page Non Trouvée')}</CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-2">
            {t('notFound.description', 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-600 mb-2">{t('notFound.errorCode', '404')}</p>
            <p className="text-sm text-gray-500">
              {t('notFound.errorMessage', 'La page que vous recherchez n\'a pas pu être trouvée sur nos serveurs.')}
            </p>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full h-10" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('notFound.backButton', 'Retour')}
            </Button>
            {user ? (
              // Logged-in user options
              <>
                <Button asChild className="w-full h-10">
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    {t('notFound.dashboardButton', 'Retour au Tableau de Bord')}
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full h-10">
                  <Link href="/packages">
                    <Package className="mr-2 h-4 w-4" />
                    {t('notFound.packagesButton', 'Voir Mes Colis')}
                  </Link>
                </Button>
              </>
            ) : (
              // Non-logged-in user options
              <>
                <Button asChild className="w-full h-10">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('notFound.loginButton', 'Se Connecter')}
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full h-10">
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('notFound.registerButton', 'Créer un Compte')}
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              {user ? t('notFound.quickNavigation', 'Navigation Rapide') : t('notFound.learnMore', 'En savoir plus')}
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              {user ? (
                // Logged-in user quick links
                <>
                  <Link href="/packages" className="text-orange-600 hover:text-orange-700">
                    {t('notFound.quickLinks.myPackages', 'Mes Colis')}
                  </Link>
                  <Link href="/purchases" className="text-orange-600 hover:text-orange-700">
                    {t('notFound.quickLinks.myPurchases', 'Mes Achats')}
                  </Link>
                  <Link href="/payments" className="text-orange-600 hover:text-orange-700">
                    {t('notFound.quickLinks.payments', 'Paiements')}
                  </Link>
                </>
              ) : (
                // Non-logged-in user links
                <>
                  <Link href="/login" className="text-orange-600 hover:text-orange-700">
                    {t('notFound.quickLinks.login', 'Connexion')}
                  </Link>
                  <Link href="/register" className="text-orange-600 hover:text-orange-700">
                    {t('notFound.quickLinks.register', 'Inscription')}
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link href="/" className="text-gray-500 hover:text-orange-600">
                    {t('notFound.quickLinks.homepage', 'shipit.ma')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 