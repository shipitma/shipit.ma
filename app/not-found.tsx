"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useLanguage } from "@/lib/context/language-context"

export default function NotFound() {
  const { user, loading } = useAuth()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <div className="flex items-center justify-center mx-auto mb-4">
              <img src="/logo.svg" alt="Shipit Logo" className="w-16 h-16" />
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
              {isRTL ? <ArrowRight className="mr-2 h-4 w-4" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
              {t('notFound.backButton', 'Retour')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 