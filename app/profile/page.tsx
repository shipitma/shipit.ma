"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, MapPin, Edit, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddresses, setIsEditingAddresses] = useState(false)
  const [saving, setSaving] = useState(false)
  const { user, sessionId, accessToken, refreshUser } = useAuth()

  const [personalData, setPersonalData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  })

  const [address, setAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setPersonalData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      })
      setAddress({
        address_line: user.address_line || "",
        city: user.city || "",
        state: user.state || "",
        zip: user.zip || "",
        country: user.country || "",
      })
    }
  }, [user])

  const handleSavePersonal = async () => {
    if (!user || (!sessionId && !accessToken)) return

    setSaving(true)
    try {
      const token = accessToken || sessionId
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(personalData),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Vos informations personnelles ont été sauvegardées avec succès",
        })
        setIsEditingPersonal(false)
        await refreshUser()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAddresses = async () => {
    if (!user || (!sessionId && !accessToken)) return

    setSaving(true)
    try {
      const token = accessToken || sessionId
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre adresse d'expédition a été sauvegardée avec succès",
        })
        setIsEditingAddresses(false)
        await refreshUser()
      } else {
        throw new Error("Failed to update address")
      }
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'adresse",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-semibold">Paramètres du Profil</h1>
          <p className="text-xs text-gray-600">Gérez les informations de votre compte et les adresses de livraison</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div>
          <h1 className="text-lg font-semibold">Paramètres du Profil</h1>
          <p className="text-xs text-gray-600">Gérez les informations de votre compte et les adresses de livraison</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Paramètres du Profil</h1>
          <p className="text-xs text-gray-600">Gérez les informations de votre compte et les adresses de livraison</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex justify-end mb-2">
              <Button
                variant={isEditingPersonal ? "outline" : "default"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => (isEditingPersonal ? setIsEditingPersonal(false) : setIsEditingPersonal(true))}
                disabled={saving}
              >
                {isEditingPersonal ? (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Informations Personnelles</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Mettez à jour vos détails personnels et informations de contact
              </CardDescription>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Informations Personnelles</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Mettez à jour vos détails personnels et informations de contact
              </CardDescription>
            </div>
            <Button
              variant={isEditingPersonal ? "outline" : "default"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => (isEditingPersonal ? setIsEditingPersonal(false) : setIsEditingPersonal(true))}
              disabled={saving}
            >
              {isEditingPersonal ? (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit className="w-3 h-3 mr-1" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-xs">
                Prénom
              </Label>
              <div className="relative">
                <User className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="firstName"
                  value={personalData.first_name}
                  onChange={(e) => setPersonalData((prev) => ({ ...prev, first_name: e.target.value }))}
                  disabled={!isEditingPersonal || saving}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs">
                Nom
              </Label>
              <div className="relative">
                <User className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="lastName"
                  value={personalData.last_name}
                  onChange={(e) => setPersonalData((prev) => ({ ...prev, last_name: e.target.value }))}
                  disabled={!isEditingPersonal || saving}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email" className="text-xs">
                Adresse Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditingPersonal || saving}
                  className="pl-7 h-8 text-xs"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs">
                Numéro de Téléphone
              </Label>
              <div className="relative">
                <Phone className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                <Input
                  id="phone"
                  value={personalData.phone_number}
                  onChange={(e) => setPersonalData((prev) => ({ ...prev, phone_number: e.target.value }))}
                  disabled={true}
                  className="pl-7 h-8 text-xs bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Le numéro de téléphone ne peut pas être modifié</p>
            </div>
          </div>

          {isEditingPersonal && (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSavePersonal} className="flex-1 h-7 text-xs" disabled={saving}>
                <Save className="w-3 h-3 mr-1" />
                {saving ? "Sauvegarde..." : "Sauvegarder les Modifications"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex justify-end mb-2">
              <Button
                variant={isEditingAddresses ? "outline" : "default"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => (isEditingAddresses ? setIsEditingAddresses(false) : setIsEditingAddresses(true))}
                disabled={saving}
              >
                {isEditingAddresses ? (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Adresse de Livraison</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Gérez votre adresse d'expédition au Maroc
              </CardDescription>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Adresse de Livraison</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Gérez votre adresse d'expédition au Maroc
              </CardDescription>
            </div>
            <Button
              variant={isEditingAddresses ? "outline" : "default"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => (isEditingAddresses ? setIsEditingAddresses(false) : setIsEditingAddresses(true))}
              disabled={saving}
            >
              {isEditingAddresses ? (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit className="w-3 h-3 mr-1" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-md space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <Badge variant="secondary" className="text-xs h-4">
                Adresse Principale
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="line" className="text-xs">
                  Ligne d'Adresse
                </Label>
                <Input
                  id="line"
                  value={address.address_line}
                  onChange={(e) => setAddress((prev) => ({ ...prev, address_line: e.target.value }))}
                  disabled={!isEditingAddresses || saving}
                  placeholder="Adresse, appartement, suite, etc."
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="city" className="text-xs">
                    Ville
                  </Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditingAddresses || saving}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs">
                    État/Province
                  </Label>
                  <Input
                    id="state"
                    value={address.state || ""}
                    onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                    disabled={!isEditingAddresses || saving}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-xs">
                    Code Postal
                  </Label>
                  <Input
                    id="zip"
                    value={address.zip || ""}
                    onChange={(e) => setAddress((prev) => ({ ...prev, zip: e.target.value }))}
                    disabled={!isEditingAddresses || saving}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country" className="text-xs">
                  Pays
                </Label>
                <Input id="country" value={address.country} disabled className="bg-gray-50 h-8 text-xs" />
              </div>
            </div>
          </div>

          {isEditingAddresses && (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveAddresses} className="flex-1 h-7 text-xs" disabled={saving}>
                <Save className="w-3 h-3 mr-1" />
                {saving ? "Sauvegarde..." : "Sauvegarder l'Adresse"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
