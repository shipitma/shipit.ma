"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreatePurchaseRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRequest, setNewRequest] = useState({
    items: [{ name: "", url: "", variant: "", quantity: 1 }],
    notes: "",
  })

  const addItem = () => {
    setNewRequest((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", url: "", variant: "", quantity: 1 }],
    }))
  }

  const removeItem = (index: number) => {
    setNewRequest((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    setNewRequest((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const handleSubmitRequest = async () => {
    // Validate form
    if (newRequest.items.some((item) => !item.name || !item.url)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le nom et l'URL de tous les articles",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/purchase-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: newRequest.items
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name,
              url: item.url,
              variant: item.variant,
              quantity: item.quantity,
            })),
          notes: newRequest.notes,
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create purchase request")
      }

      toast({
        title: "Succès",
        description: "Demande d'achat soumise avec succès",
      })
      router.push("/purchases")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la soumission de la demande",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
            <ArrowLeft className="w-3 h-3" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Créer une Demande d'Achat</h1>
            <p className="text-sm text-gray-600">
              Ajoutez des articles que vous souhaitez que nous achetions pour vous
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShoppingCart className="w-4 h-4" />
              Détails de la Demande d'Achat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Items */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Articles à Acheter</Label>
              {newRequest.items.map((item, index) => (
                <Card key={index} className="border-dashed border-2 border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Article {index + 1}</CardTitle>
                      {newRequest.items.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeItem(index)} className="h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-sm">Nom de l'Article *</Label>
                        <Input
                          placeholder="ex: iPhone 15 Pro"
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">Quantité</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">URL du Produit *</Label>
                      <Input
                        placeholder="https://exemple.com/produit"
                        value={item.url}
                        onChange={(e) => updateItem(index, "url", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Variante (Taille, Couleur, Type, etc.)</Label>
                      <Input
                        placeholder="ex: Large, Bleu, 256GB"
                        value={item.variant}
                        onChange={(e) => updateItem(index, "variant", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" onClick={addItem} className="w-full h-8 text-sm">
                <Plus className="w-3 h-3 mr-1" />
                Ajouter un Autre Article
              </Button>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm">Notes Supplémentaires</Label>
              <Textarea
                placeholder="Toute instruction spéciale ou préférence..."
                value={newRequest.notes}
                onChange={(e) => setNewRequest((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1 text-sm"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button onClick={handleSubmitRequest} className="flex-1 h-8 text-sm" disabled={isSubmitting}>
                {isSubmitting ? "Soumission..." : "Soumettre la Demande d'Achat"}
              </Button>
              <Button variant="outline" onClick={() => router.back()} className="h-8 text-sm">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
