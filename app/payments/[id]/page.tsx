"use client"

import * as React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  CreditCard,
  Upload,
  Download,
  Receipt,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  FileText,
  ImageIcon,
  File,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PaymentRequest } from "@/lib/database"

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-800"
    case "paid":
      return "bg-green-100 text-green-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    case "processing":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Clock
    case "paid":
      return CheckCircle
    case "overdue":
      return XCircle
    case "processing":
      return DollarSign
    default:
      return Clock
  }
}

const getAttachmentIcon = (type: string) => {
  switch (type) {
    case "photo":
      return ImageIcon
    case "receipt":
      return Receipt
    case "document":
      return FileText
    default:
      return File
  }
}

const getAttachmentColor = (type: string) => {
  switch (type) {
    case "photo":
      return "text-blue-600"
    case "receipt":
      return "text-green-600"
    case "document":
      return "text-orange-600"
    default:
      return "text-gray-600"
  }
}

const paymentMethods = [
  { value: "attijariwafa-bank", label: "Attijariwafa Bank", type: "bank" },
  { value: "cih-bank", label: "CIH Bank", type: "bank" },
  { value: "cashplus", label: "CashPlus", type: "transfer" },
  { value: "wafacash", label: "Wafacash", type: "transfer" },
]

const getPaymentMethodDetails = (method: string) => {
  switch (method) {
    case "attijariwafa-bank":
      return {
        name: "Attijariwafa Bank",
        details: {
          "Nom du Compte": "ForwardMorocco SARL",
          "Numéro de Compte": "007 780 0001234567890",
          RIB: "007 780 0001234567890 25",
          SWIFT: "BCMAMAMC",
        },
        color: "blue",
      }
    case "cih-bank":
      return {
        name: "CIH Bank",
        details: {
          "Nom du Compte": "ForwardMorocco SARL",
          "Numéro de Compte": "230 780 2112345678901",
          RIB: "230 780 2112345678901 84",
          SWIFT: "CIHMMAMC",
        },
        color: "green",
      }
    case "cashplus":
      return {
        name: "CashPlus",
        details: {
          "Nom du Bénéficiaire": "ForwardMorocco SARL",
          Téléphone: "+212 6 12 34 56 78",
          CIN: "AB123456",
        },
        color: "orange",
        note: "Envoyez-nous le code de transaction après le transfert",
      }
    case "wafacash":
      return {
        name: "Wafacash",
        details: {
          "Nom du Bénéficiaire": "ForwardMorocco SARL",
          Téléphone: "+212 6 12 34 56 78",
          CIN: "AB123456",
        },
        color: "red",
        note: "Envoyez-nous le code de transaction après le transfert",
      }
    default:
      return null
  }
}

const formatCurrency = (amount: number | undefined) => {
  if (typeof amount !== "number") return "N/A"
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(amount)
}

export default function PaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [paymentData, setPaymentData] = useState<PaymentRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: number
      name: string
      url: string
      type: string
      size: number
    }>
  >([])
  const [uploading, setUploading] = useState(false)
  const [deletingFiles, setDeletingFiles] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`/api/payments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch payment data")
        }

        const data = await response.json()
        setPaymentData(data)

        // Fetch attachments for this payment
        const attachmentsResponse = await fetch(`/api/attachments?relatedType=payment&relatedId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (attachmentsResponse.ok) {
          const attachments = await attachmentsResponse.json()
          setUploadedFiles(
            attachments.map((att: any) => ({
              id: att.id,
              name: att.file_name,
              url: att.file_url,
              type: att.attachment_type,
              size: att.file_size || 0,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching payment data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du paiement",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [id, toast])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (!paymentMethod) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une méthode de paiement d'abord",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const token = localStorage.getItem("authToken")

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "receipt")
        formData.append("relatedType", "payment")
        formData.append("relatedId", id)

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const result = await response.json()
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: result.id,
            name: file.name,
            url: result.url,
            type: "receipt",
            size: file.size,
          },
        ])
      }

      toast({
        title: "Succès",
        description: "Fichiers téléchargés avec succès",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const deleteFile = async (fileId: number) => {
    setDeletingFiles((prev) => new Set(prev).add(fileId))

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/attachments/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
      toast({
        title: "Succès",
        description: "Fichier supprimé avec succès",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      })
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })
    }
  }

  const StatusIcon = paymentData ? getStatusIcon(paymentData.status) : Clock
  const selectedMethodDetails = paymentMethod ? getPaymentMethodDetails(paymentMethod) : null

  const handlePayment = () => {
    if (!paymentMethod) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive",
      })
      return
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger au moins un reçu de paiement",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Succès",
      description: "Votre paiement a été soumis pour examen",
    })
    setIsPaymentOpen(false)
    setPaymentNotes("")
    setPaymentMethod("")
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
            <a href="/payments">
              <ArrowLeft className="w-3 h-3" />
            </a>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{paymentData?.id}</h1>
            <p className="text-xs text-gray-600">Payment details and status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Payment Overview */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <StatusIcon className="w-4 h-4" />
                      Aperçu du Paiement
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Détails de la demande de paiement et statut actuel
                    </CardDescription>
                  </div>
                  <Badge
                    className={paymentData ? getStatusColor(paymentData.status) : "bg-gray-100 text-gray-800"}
                    variant="secondary"
                  >
                    {paymentData?.status || "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">ID de Paiement</Label>
                    <p className="text-sm font-medium">{paymentData?.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Lié à</Label>
                    <p className="text-sm font-medium">{paymentData?.related_id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Montant Dû</Label>
                    <p className="text-sm font-medium">{formatCurrency(paymentData?.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Date d'Échéance</Label>
                    <p className="text-sm font-medium">{paymentData?.due_date}</p>
                  </div>
                  {paymentData?.paid_date && (
                    <div>
                      <Label className="text-xs text-gray-500">Date de Paiement</Label>
                      <p className="text-sm font-medium">{paymentData.paid_date}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-gray-500">Type</Label>
                    <p className="text-sm font-medium capitalize">{paymentData?.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            {paymentData?.breakdown && (
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Répartition du Paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(paymentData.breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                        </span>
                        <span className="text-xs font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Montant Total Dû :</span>
                        <span className="text-lg font-bold text-orange-600">{formatCurrency(paymentData.amount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Receipts */}
            {uploadedFiles.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Reçus de Paiement ({uploadedFiles.length})</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Fichiers téléchargés pour ce paiement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => {
                      const AttachmentIcon = getAttachmentIcon(file.type)
                      const isDeleting = deletingFiles.has(file.id)

                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <AttachmentIcon className={`w-4 h-4 flex-shrink-0 ${getAttachmentColor(file.type)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.type} • {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-3 h-3" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteFile(file.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Payment Actions */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Actions de Paiement</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Actions disponibles pour ce paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(paymentData?.status === "pending" || paymentData?.status === "overdue") && (
                  <Button className="w-full h-7 text-xs" onClick={() => setIsPaymentOpen(true)}>
                    <CreditCard className="w-3 h-3 mr-1" />
                    Soumettre le Paiement
                  </Button>
                )}
                {paymentData?.status === "paid" && paymentData?.receipt_url && (
                  <Button variant="outline" className="w-full h-7 text-xs" asChild>
                    <a href={paymentData.receipt_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-3 h-3 mr-1" />
                      Télécharger le Reçu
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full h-7 text-xs" asChild>
                  <a
                    href={`/${paymentData?.type === "purchase" ? "purchases" : "packages"}/${paymentData?.related_id}`}
                  >
                    <Receipt className="w-3 h-3 mr-1" />
                    Voir l'Article Lié
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Payment - {paymentData?.id}</DialogTitle>
              <DialogDescription>Complétez votre paiement</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">Montant Total Dû :</span>
                  <span className="text-lg font-bold">{formatCurrency(paymentData?.amount)}</span>
                </div>
                {paymentData?.breakdown && (
                  <div className="space-y-1 text-xs">
                    {Object.entries(paymentData.breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                        </span>
                        <span>{formatCurrency(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-xs">Méthode de Paiement *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-1 h-8 text-xs">
                    <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value} className="text-xs">
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Method Details */}
              {selectedMethodDetails && (
                <div className={`p-3 bg-${selectedMethodDetails.color}-50 rounded-md`}>
                  <h4 className={`font-medium text-${selectedMethodDetails.color}-900 mb-2 text-xs`}>
                    Détails - {selectedMethodDetails.name}
                  </h4>
                  <div className={`text-xs text-${selectedMethodDetails.color}-800 space-y-1`}>
                    {Object.entries(selectedMethodDetails.details).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {value}
                      </p>
                    ))}
                    <p>
                      <strong>Référence:</strong> {paymentData?.id}
                    </p>
                    {selectedMethodDetails.note && (
                      <p className={`text-${selectedMethodDetails.color}-700 font-medium mt-2`}>
                        {selectedMethodDetails.note}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt Upload */}
              <div>
                <Label className="text-xs">Reçu de Paiement *</Label>
                <div className="mt-1 border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500 mb-2">
                    {paymentMethod
                      ? "Téléchargez votre reçu de paiement ou capture d'écran"
                      : "Sélectionnez d'abord une méthode de paiement"}
                  </p>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="text-xs"
                    onChange={handleFileUpload}
                    disabled={uploading || !paymentMethod}
                  />
                  {uploading && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-600">Téléchargement...</span>
                    </div>
                  )}
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <Label className="text-xs text-gray-600">Fichiers téléchargés:</Label>
                    {uploadedFiles.map((file) => {
                      const AttachmentIcon = getAttachmentIcon(file.type)
                      const isDeleting = deletingFiles.has(file.id)

                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <AttachmentIcon className={`w-4 h-4 flex-shrink-0 ${getAttachmentColor(file.type)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.type} • {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteFile(file.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Payment Notes */}
              <div>
                <Label className="text-xs">Notes de Paiement (Optionnel)</Label>
                <Textarea
                  placeholder="Toute information supplémentaire sur votre paiement..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handlePayment} className="flex-1 h-8 text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  Soumettre le Paiement
                </Button>
                <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="h-8 text-xs">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
