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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phoneNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
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
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec ce numéro. Veuillez vous connecter.",
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
        // Store user info for completion step
        sessionStorage.setItem("phoneNumber", fullPhoneNumber)
        sessionStorage.setItem("firstName", formData.firstName)
        sessionStorage.setItem("lastName", formData.lastName)
        
        router.push("/verify")
        toast({
          title: "Code Envoyé",
          description: "Vérifiez votre WhatsApp pour le code de vérification.",
        })
      } else {
        throw new Error("Échec de l'envoi du code OTP.")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
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
          <CardTitle className="text-lg font-semibold">Créer un Compte</CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Étape 1/2 : Commencez par nous donner quelques informations de base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs">
                  Prénom *
              </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
            <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs">
                  Nom *
              </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">
                Téléphone WhatsApp *
              </Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50 text-gray-600 text-sm">
                  +212
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="612345678"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="rounded-l-none h-9 text-sm"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi du code...
                </>
              ) : (
                "Continuer"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs">
            <p className="text-gray-500">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="font-medium text-orange-600 hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
