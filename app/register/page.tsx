"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { trackAuth, trackError } = useAnalytics()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phoneNumber.trim()) {
      const missingFields = []
      if (!formData.firstName.trim()) missingFields.push('firstName')
      if (!formData.lastName.trim()) missingFields.push('lastName')
      if (!formData.phoneNumber.trim()) missingFields.push('phoneNumber')
      
      trackAuth('REGISTRATION_VALIDATION_ERROR', { missing_fields: missingFields })
      toast({
        title: t('common.error', 'Erreur'),
        description: t('register.errors.fillAllFields', 'Veuillez remplir tous les champs requis.'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const fullPhoneNumber = "+212" + formData.phoneNumber.replace(/^0+/, "")
      
      // First check if user already exists
      const checkResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      })

      if (checkResponse.ok) {
        const { exists } = await checkResponse.json()
        if (exists) {
          trackAuth('REGISTRATION_EXISTING_USER', { phoneNumber: fullPhoneNumber })
          toast({
            title: t('register.errors.existingAccount', 'Compte existant'),
            description: t('register.errors.accountExists', 'Un compte existe déjà avec ce numéro. Veuillez vous connecter.'),
            variant: "destructive",
          })
          router.push("/login")
          return
        }
      }

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      })

      if (response.ok) {
        trackAuth('REGISTRATION_OTP_SENT', { phoneNumber: fullPhoneNumber })
        // Store user info for completion step
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)
        sessionStorage.setItem("firstName", formData.firstName)
        sessionStorage.setItem("lastName", formData.lastName)
        
        router.push("/verify")
        toast({
          title: t('register.success.codeSent', 'Code Envoyé'),
          description: t('register.success.checkWhatsApp', 'Vérifiez votre WhatsApp pour le code de vérification.'),
        })
      } else {
        throw new Error(t('register.errors.sendFailed', 'Échec de l\'envoi du code OTP.'))
      }
    } catch (error) {
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/send-otp'
      })
      toast({
        title: t('common.error', 'Erreur'),
        description: error instanceof Error ? error.message : t('common.unknownError', 'Une erreur est survenue.'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-semibold">{t('register.title', 'Créer un Compte')}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t('register.subtitle', 'Étape 1/2 : Commencez par nous donner quelques informations de base.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="firstName" className="text-sm">
                  {t('register.firstName', 'Prénom')} *
              </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder={t('register.firstName', 'Prénom')}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
            <div className="space-y-1">
                <Label htmlFor="lastName" className="text-sm">
                  {t('register.lastName', 'Nom')} *
              </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder={t('register.lastName', 'Nom')}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                {t('register.whatsappPhone', 'Téléphone WhatsApp')} *
              </Label>
              <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-sm" dir="ltr">
                  +212
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="612345678"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="rounded-l-none h-9 text-sm text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.sendingCode', 'Envoi du code...')}
                </>
              ) : (
                t('register.continueButton', 'Continuer')
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-500">
              {t('register.haveAccount', 'Vous avez déjà un compte ?')}{" "}
              <a href="/login" className="font-medium text-orange-600 hover:underline">
                {t('register.signIn', 'Se connecter')}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
