"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Mail, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phoneNumber")
    if (!storedPhone) {
      router.push("/login")
      return
    }
    setPhoneNumber(storedPhone)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom complet est requis",
        variant: "destructive",
      })
      return
    }

    if (!formData.addressLine.trim() || !formData.city.trim()) {
      toast({
        title: "Erreur",
        description: "L'adresse et la ville sont requis",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const sessionId = sessionStorage.getItem("registrationSessionId")
      if (!sessionId) {
        throw new Error("Session expirée")
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fullName: formData.fullName,
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
        // Store auth token and redirect to dashboard
        localStorage.setItem("authToken", data.sessionId)
        sessionStorage.removeItem("phoneNumber")
        sessionStorage.removeItem("registrationSessionId")
        router.push("/dashboard")
        toast({
          title: "Bienvenue !",
          description: "Votre compte a été créé avec succès",
        })
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Registration failed",
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
          <CardTitle className="text-lg font-semibold">Complétez Votre Profil</CardTitle>
          <CardDescription className="text-xs text-gray-600">Parlez-nous un peu de vous pour commencer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs">
                Numéro de Téléphone
              </Label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <Phone className="w-3 h-3 text-gray-500" />
                <span className="text-xs">{phoneNumber}</span>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs">
                Nom Complet *
              </Label>
              <div className="relative">
                <User className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="pl-7 h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">
                Adresse Email (Optionnel)
              </Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addressLine" className="text-xs">
                Ligne d'Adresse *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="addressLine"
                  placeholder="Adresse, appartement, suite, etc."
                  value={formData.addressLine}
                  onChange={(e) => handleInputChange("addressLine", e.target.value)}
                  className="pl-7 h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs">
                  Ville *
                </Label>
                <Input
                  id="city"
                  placeholder="Ville"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-xs">
                  État/Province (Optionnel)
                </Label>
                <Input
                  id="state"
                  placeholder="État/Province"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="zip" className="text-xs">
                Code Postal (Optionnel)
              </Label>
              <Input
                id="zip"
                placeholder="Code postal"
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <Button type="submit" className="w-full h-8 text-xs" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Création du Compte...
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
