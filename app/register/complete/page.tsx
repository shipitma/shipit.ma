"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function RegisterCompletePage() {
  const [formData, setFormData] = useState({
    email: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()

  useEffect(() => {
    // Redirect if essential session data is missing
    const sessionId = sessionStorage.getItem("registrationSessionId")
    const firstName = sessionStorage.getItem("firstName")
    if (!sessionId || !firstName) {
      toast({
        title: "Session Expirée",
        description: "Veuillez recommencer le processus d'inscription.",
        variant: "destructive",
      })
      router.push("/register")
    }
  }, [router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.addressLine.trim() || !formData.city.trim()) {
      toast({
        title: "Erreur",
        description: "L'adresse et la ville sont requises.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const sessionId = sessionStorage.getItem("registrationSessionId")
      const firstName = sessionStorage.getItem("firstName")
      const lastName = sessionStorage.getItem("lastName")

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          firstName,
          lastName,
          email: formData.email,
          address: {
            line: formData.addressLine,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: "Morocco",
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await login(data.sessionId, data.accessToken, data.refreshToken)
        sessionStorage.removeItem("phoneNumber")
        sessionStorage.removeItem("firstName")
        sessionStorage.removeItem("lastName")
        sessionStorage.removeItem("registrationSessionId")
        router.push("/dashboard")
        toast({
          title: "Bienvenue !",
          description: "Votre compte a été créé avec succès.",
        })
      } else {
        throw new Error(data.error || "La finalisation de l'inscription a échoué.")
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
          <CardTitle className="text-lg font-semibold">Finaliser Votre Profil</CardTitle>
          <CardDescription className="text-xs text-gray-600">
            Juste quelques détails supplémentaires pour terminer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">
                Adresse Email (Optionnel)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addressLine" className="text-xs">
                Adresse de Livraison *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="addressLine"
                  placeholder="Adresse, appartement, suite, etc."
                  value={formData.addressLine}
                  onChange={(e) => handleInputChange("addressLine", e.target.value)}
                  className="pl-9 h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs">
                  Ville *
                </Label>
                <Input
                  id="city"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs">
                  État/Province
                </Label>
                <Input
                  id="state"
                  placeholder="Optionnel"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="zip" className="text-xs">
                Code Postal
              </Label>
              <Input
                id="zip"
                placeholder="Optionnel"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalisation...
                </>
              ) : (
                "Terminer l'Inscription"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 