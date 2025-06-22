"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Package, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function NotFound() {
  const { user, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Chargement...</p>
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
          <CardTitle className="text-2xl font-semibold text-gray-900">Page Non Trouvée</CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-orange-600 mb-2">404</p>
            <p className="text-xs text-gray-500">
              La page que vous recherchez n'a pas pu être trouvée sur nos serveurs.
            </p>
          </div>

          <div className="space-y-3">
            {user ? (
              // Logged-in user options
              <>
                <Button asChild className="w-full h-10">
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Retour au Tableau de Bord
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full h-10">
                  <Link href="/packages">
                    <Package className="mr-2 h-4 w-4" />
                    Voir Mes Colis
                  </Link>
                </Button>
              </>
            ) : (
              // Non-logged-in user options
              <>
                <Button asChild className="w-full h-10">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Se Connecter
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full h-10">
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Créer un Compte
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              {user ? "Navigation Rapide" : "En savoir plus"}
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              {user ? (
                // Logged-in user quick links
                <>
                  <Link href="/packages" className="text-orange-600 hover:text-orange-700">
                    Mes Colis
                  </Link>
                  <Link href="/purchases" className="text-orange-600 hover:text-orange-700">
                    Mes Achats
                  </Link>
                  <Link href="/payments" className="text-orange-600 hover:text-orange-700">
                    Paiements
                  </Link>
                </>
              ) : (
                // Non-logged-in user links
                <>
                  <Link href="/login" className="text-orange-600 hover:text-orange-700">
                    Connexion
                  </Link>
                  <Link href="/register" className="text-orange-600 hover:text-orange-700">
                    Inscription
                  </Link>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    shipit.ma
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 