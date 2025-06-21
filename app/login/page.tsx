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

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to send OTP via WhatsApp
      const fullPhoneNumber = "+212" + phoneNumber.replace(/^0+/, "")

      // Here you would call your WhatsApp API
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      })

      if (response.ok) {
        // Store phone number for verification page
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)
        router.push("/verify")
        toast({
          title: "Code Envoyé",
          description: "Vérifiez votre WhatsApp pour le code de vérification",
        })
      } else {
        throw new Error("Failed to send OTP")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'envoi du code. Veuillez réessayer.",
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
            <img src="https://placehold.co/48x48/f97316/ffffff?text=LOGO" alt="Logo" className="w-12 h-12" />
          </div>
          <CardTitle className="text-lg font-semibold">Bienvenue sur shipit.ma</CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Entrez votre numéro de téléphone pour recevoir un code de vérification WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">
                Numéro de Téléphone
              </Label>
              <div className="flex">
                <div className="flex items-center px-2 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-xs">
                  +212
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-l-none h-8 text-xs"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-8 text-xs" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Envoi du code...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Envoyer le Code WhatsApp
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>En continuant, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
