"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Upload, Package, Plus, X, Loader2, ExternalLink, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export default function CreatePackagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false)
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())
  const [newPackage, setNewPackage] = useState({
    description: "",
    retailer: "",
    trackingNumber: "",
    weight: "",
    dimensions: "",
    items: [""],
    notes: "",
    receipts: [] as Array<{ file: File; url: string; name: string; attachmentId: string }>,
    attachmentType: "receipt", // Add this line
  })

  const addItem = () => {
    setNewPackage((prev) => ({
      ...prev,
      items: [...prev.items, ""],
    }))
  }

  const removeItem = (index: number) => {
    setNewPackage((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, value: string) => {
    setNewPackage((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleReceiptUpload = async (file: File) => {
    if (!file) return

    setIsUploadingReceipt(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", newPackage.attachmentType) // Add this line
      formData.append("relatedType", "package") // Add this line

      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || "Upload failed")
      }

      // Add the new receipt to the existing receipts array
      setNewPackage((prev) => ({
        ...prev,
        receipts: [...prev.receipts, { file, url: result.url, name: file.name, attachmentId: result.id }],
      }))

      toast({
        title: t('common.success', 'Succès'),
        description: t('createPackage.success.uploadSuccess', 'Fichier téléchargé avec succès'),
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: t('common.error', 'Erreur'),
        description: error instanceof Error ? error.message : t('createPackage.errors.uploadError', 'Erreur lors du téléchargement du fichier'),
        variant: "destructive",
      })
    } finally {
      setIsUploadingReceipt(false)
    }
  }

  const deleteReceipt = async (receiptIndex: number) => {
    const receipt = newPackage.receipts[receiptIndex]
    if (!receipt?.attachmentId) return

    const deleteKey = receiptIndex.toString()
    setDeletingFiles((prev) => new Set(prev).add(deleteKey))

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/attachments/${receipt.attachmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      // Remove from local state
      setNewPackage((prev) => ({
        ...prev,
        receipts: prev.receipts.filter((_, ri) => ri !== receiptIndex),
      }))

      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du fichier",
        variant: "destructive",
      })
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(deleteKey)
        return newSet
      })
    }
  }

  const handleSubmitPackage = async () => {
    if (!newPackage.description || !newPackage.retailer) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir la description du colis et les informations du détaillant",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newPackage.description,
          retailer: newPackage.retailer,
          tracking_number: newPackage.trackingNumber,
          weight: newPackage.weight,
          dimensions: newPackage.dimensions,
          items: newPackage.items.filter((item) => item.trim()),
          notes: newPackage.notes,
          attachments: newPackage.receipts.map((receipt) => ({ url: receipt.url, name: receipt.name })), // Add this line
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create package")
      }

      toast({
        title: "Succès",
        description: "Colis ajouté avec succès",
      })
      router.push("/packages")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du colis",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
            {isRTL ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
          </Button>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">{t('createPackage.title', 'Ajouter un Nouveau Colis')}</h1>
            <p className="text-sm text-gray-600">{t('createPackage.subtitle', 'Ajoutez un colis que vous attendez de recevoir')}</p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Package className="w-4 h-4" />
              {t('createPackage.cardTitle', 'Informations du Colis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-6 pt-0 space-y-3">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">{t('createPackage.description', 'Description du Colis *')}</Label>
                <Input
                  placeholder={t('createPackage.descriptionPlaceholder', 'ex: Colis Électronique')}
                  value={newPackage.description}
                  onChange={(e) => setNewPackage((prev) => ({ ...prev, description: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">{t('createPackage.retailer', 'Nom du Détaillant/Magasin ou URL *')}</Label>
                <Input
                  placeholder={t('createPackage.retailerPlaceholder', 'ex: Amazon, Best Buy, ou site web du magasin')}
                  value={newPackage.retailer}
                  onChange={(e) => setNewPackage((prev) => ({ ...prev, retailer: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">{t('createPackage.trackingNumber', 'Numéro de Suivi (Optionnel)')}</Label>
                <Input
                  placeholder={t('createPackage.trackingNumberPlaceholder', 'ex: TK123456789')}
                  value={newPackage.trackingNumber}
                  onChange={(e) => setNewPackage((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">{t('createPackage.weight', 'Poids (Optionnel)')}</Label>
                <Input
                  placeholder={t('createPackage.weightPlaceholder', 'ex: 2,5 kg')}
                  value={newPackage.weight}
                  onChange={(e) => setNewPackage((prev) => ({ ...prev, weight: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">{t('createPackage.dimensions', 'Dimensions (Optionnel)')}</Label>
              <Input
                placeholder={t('createPackage.dimensionsPlaceholder', 'ex: 30x20x15 cm')}
                value={newPackage.dimensions}
                onChange={(e) => setNewPackage((prev) => ({ ...prev, dimensions: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>

            {/* Package Items */}
            <div>
              <Label className="text-sm font-medium">{t('createPackage.itemsLabel', 'Articles du Colis')}</Label>
              <div className="space-y-2 mt-1">
                {newPackage.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={t('createPackage.itemPlaceholder', 'Description de l\'article')}
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="flex-1 h-8 text-sm"
                    />
                    {newPackage.items.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeItem(index)} className="h-8 w-8 p-0">
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addItem} className="w-full h-7 text-sm">
                  <Plus className="w-3 h-3 mr-1" />
                  {t('createPackage.addItem', 'Ajouter Article')}
                </Button>
              </div>
            </div>

            {/* File Upload with Type Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t('createPackage.filesLabel', 'Fichiers (Optionnel)')}</Label>
                <Select
                  value={newPackage.attachmentType}
                  onValueChange={(value) => setNewPackage((prev) => ({ ...prev, attachmentType: value }))}
                >
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receipt" className="text-sm">
                      {t('createPackage.attachmentType.receipt', 'Reçu')}
                    </SelectItem>
                    <SelectItem value="photo" className="text-sm">
                      {t('createPackage.attachmentType.photo', 'Photo')}
                    </SelectItem>
                    <SelectItem value="document" className="text-sm">
                      {t('createPackage.attachmentType.document', 'Document')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                className={`border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer ${
                  isUploadingReceipt ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => !isUploadingReceipt && document.getElementById("receipt-input")?.click()}
              >
                {isUploadingReceipt ? (
                  <>
                    <Loader2 className="w-8 h-8 mx-auto text-blue-500 mb-2 animate-spin" />
                    <p className="text-sm font-medium text-blue-700">{t('createPackage.uploadArea.uploading', 'Téléchargement en cours...')}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">{t('createPackage.uploadArea.title', 'Cliquez pour télécharger vos fichiers')}</p>
                      <p className="text-sm text-gray-500">{t('createPackage.uploadArea.subtitle', 'PNG, JPG, PDF jusqu\'à 10MB chacun')}</p>
                    </div>
                  </>
                )}
                <input
                  id="receipt-input"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleReceiptUpload(file)
                    }
                    // Reset the input so the same files can be selected again if needed
                    e.target.value = ""
                  }}
                />
              </div>

              {/* Display all uploaded files */}
              {newPackage.receipts.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-green-700">
                    {t('createPackage.uploadedFiles', 'Fichiers téléchargés ({count})', { count: newPackage.receipts.length })}
                  </Label>
                  <div className="space-y-1">
                    {newPackage.receipts.map((receipt, receiptIndex) => {
                      const deleteKey = receiptIndex.toString()
                      const isDeleting = deletingFiles.has(deleteKey)

                      return (
                        <div
                          key={receiptIndex}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Upload className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700 truncate">{receipt.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(receipt.url, "_blank")
                              }}
                              className="h-6 px-2 text-green-600 hover:text-green-800 flex-shrink-0"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {t('createPackage.viewFile', 'Voir')}
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteReceipt(receiptIndex)
                            }}
                            disabled={isDeleting}
                            className="h-6 w-6 p-0 text-green-600 hover:text-red-500 flex-shrink-0 ml-2"
                          >
                            {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label className="text-sm">{t('createPackage.notes', 'Notes Supplémentaires')}</Label>
              <Textarea
                placeholder={t('createPackage.notesPlaceholder', 'Toute instruction spéciale ou note sur ce colis...')}
                value={newPackage.notes}
                onChange={(e) => setNewPackage((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1 text-sm"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button onClick={handleSubmitPackage} className="flex-1 h-8 text-sm" disabled={isSubmitting}>
                {isSubmitting ? t('createPackage.submitting', 'Ajout...') : t('createPackage.submit', 'Ajouter Colis')}
              </Button>
              <Button variant="outline" onClick={() => router.back()} className="h-8 text-sm">
                {t('createPackage.cancel', 'Annuler')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
