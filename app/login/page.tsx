"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { trackAuth, trackError } = useAnalytics()
  const { t } = useTranslations()
  const { isRTL, language } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      trackAuth('LOGIN_VALIDATION_ERROR', { missing_fields: ['phoneNumber'] })
      toast({
        title: t('common.error', 'Erreur'),
        description: t('login.errors.phoneRequired', 'Veuillez entrer votre numéro de téléphone'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const fullPhoneNumber = "+212" + phoneNumber.replace(/^0+/, "")

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Language": language // Send current language preference
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      })

      if (response.ok) {
        trackAuth('LOGIN_OTP_SENT', { phoneNumber: fullPhoneNumber })
        // Store phone number for verification page
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)
        router.push("/verify")
        toast({
          title: t('login.success.codeSent', 'Code Envoyé'),
          description: t('login.success.checkWhatsApp', 'Vérifiez votre WhatsApp pour le code de vérification'),
        })
      } else {
        throw new Error("Failed to send OTP")
      }
    } catch (error) {
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/send-otp'
      })
      toast({
        title: t('common.error', 'Erreur'),
        description: t('login.errors.sendFailed', 'Échec de l\'envoi du code. Veuillez réessayer.'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3">
            <img src="/logo.svg" alt="Shipit Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-lg font-semibold">{t('login.title', 'Bienvenue sur shipit.ma')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t('login.subtitle', 'Entrez votre numéro de téléphone pour vous connecter ou créer un compte')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                {t('login.phoneLabel', 'Numéro de Téléphone')}
              </Label>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} group`}>
                <div className="flex items-center px-2 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-sm group-focus-within:border-orange-500" dir="ltr">
                  +212
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('login.phonePlaceholder', 'Numéro de téléphone*')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-l-none h-8 text-sm text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-8 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  {t('login.sendingCode', 'Envoi du code...')}
                </>
              ) : (
                <>
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {t('login.continueButton', 'Continuer')}
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-500">
              {t('login.newUser', 'Nouveau sur shipit.ma ?')}{" "}
              <a href="/register" className="font-medium text-orange-600 hover:underline">
                {t('login.createAccount', 'Créer un compte')}
              </a>
            </p>
          </div>

          <div className="mt-2 text-center text-sm text-gray-500">
            <p>{t('login.termsAcceptance', 'En continuant, vous acceptez nos Conditions d\'Utilisation et notre Politique de Confidentialité')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
