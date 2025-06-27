"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, DollarSign, Check, Upload, ExternalLink, Package, FileText, ImageIcon, Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type PurchaseRequest, formatCurrency, formatDate } from "@/lib/database"
import * as React from "react"

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending_review":
      return "bg-yellow-100 text-yellow-800"
    case "pending_payment":
      return "bg-orange-100 text-orange-800"
    case "confirmed":
      return "bg-orange-100 text-orange-800"
    case "purchasing":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending_review":
      return "En Attente de Révision"
    case "pending_payment":
      return "En Attente de Paiement"
    case "confirmed":
      return "Confirmé"
    case "purchasing":
      return "Achat en Cours"
    case "completed":
      return "Terminé"
    case "cancelled":
      return "Annulé"
    default:
      return status.replace("_", " ")
  }
}

const getTimelineIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "request submitted":
      return <Package className="w-4 h-4" />
    case "payment confirmed":
      return <CheckCircle className="w-4 h-4" />
    case "purchasing":
      return <Clock className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "cancelled":
      return <AlertCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function PurchaseRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPurchaseRequest() {
      try {
        const response = await fetch(`/api/purchase-requests/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPurchaseRequest(data)
        } else {
          toast({
            title: "Erreur",
            description: "Demande d'achat introuvable",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching purchase request:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la demande d'achat",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseRequest()
  }, [id, toast])

  const handlePayment = () => {
    toast({
      title: "Payment Submitted",
      description: "Your payment has been submitted for review",
    })
    setIsPaymentOpen(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>
  }

  if (!purchaseRequest) {
    return <div>Purchase request not found</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
          <ArrowLeft className="w-3 h-3" />
        </Button>
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{purchaseRequest.id}</h1>
            <Badge className={getStatusColor(purchaseRequest.status) + ' text-xs'} variant="secondary">
              {getStatusLabel(purchaseRequest.status)}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Purchase Request Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Résumé de la Demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Coût des Articles :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.items_cost ? formatCurrency(purchaseRequest.items_cost) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Frais d'Expédition :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.shipping_fee ? formatCurrency(purchaseRequest.shipping_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Frais de Service :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.service_fee ? formatCurrency(purchaseRequest.service_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Frais de Traitement :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.processing_fee ? formatCurrency(purchaseRequest.processing_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Taxes :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.taxes ? formatCurrency(purchaseRequest.taxes) : "N/A"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Montant Total :</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(purchaseRequest.payment_due || purchaseRequest.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Request Timeline */}
          {purchaseRequest.timeline && purchaseRequest.timeline.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Progression de la Demande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseRequest.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      {/* Timeline Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {getTimelineIcon(event.status)}
                      </div>
                      
                      {/* Timeline Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{event.status}</h4>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                            <p className="text-sm text-gray-400">{event.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Request Contents */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Package className="w-4 h-4" />
                    Articles Demandés ({purchaseRequest.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {purchaseRequest.items?.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex gap-3 p-3 border border-gray-200 rounded-md">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md bg-gray-50"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-medium">{item.name}</h3>
                              {item.specifications && <p className="text-sm text-gray-500">{item.specifications}</p>}
                              <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                              {item.url && (
                                <Button variant="outline" size="sm" asChild className="h-6 text-sm mt-1">
                                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Voir le Produit
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                  {/* Item Attachments */}
                      {item.attachments && item.attachments.length > 0 && (
                        <div className="ml-3 pl-3 border-l-2 border-gray-100">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Fichiers Joints ({item.attachments.length})
                            </Label>
                            <div className="space-y-1">
                              {item.attachments.map((attachment) => {
                                const getAttachmentIcon = (type: string) => {
                                  switch (type) {
                                    case "photo":
                                      return <ImageIcon className="w-4 h-4 text-blue-600" />
                                    case "receipt":
                                      return <Receipt className="w-4 h-4 text-green-600" />
                                    case "document":
                                      return <FileText className="w-4 h-4 text-orange-600" />
                                    default:
                                      return <FileText className="w-4 h-4 text-gray-600" />
                                  }
                                }

                                const getAttachmentBg = (type: string) => {
                                  switch (type) {
                                    case "photo":
                                      return "bg-blue-100"
                                    case "receipt":
                                      return "bg-green-100"
                                    case "document":
                                      return "bg-orange-100"
                                    default:
                                      return "bg-gray-100"
                                  }
                                }

                                return (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div
                                        className={`w-6 h-6 ${getAttachmentBg(attachment.attachment_type)} rounded-md flex items-center justify-center flex-shrink-0`}
                                      >
                                        {getAttachmentIcon(attachment.attachment_type)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                                        <p className="text-sm text-gray-500">
                                          {attachment.attachment_type} •{" "}
                                          {attachment.file_size
                                            ? `${Math.round(attachment.file_size / 1024)}KB`
                                            : "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="h-6 text-sm flex-shrink-0">
                                      <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Voir
                                      </a>
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Admin Notes */}
              {purchaseRequest.admin_notes && (
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Notes de l'Administrateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-orange-50 rounded-md border border-orange-200">
                      <p className="text-sm text-orange-800">{purchaseRequest.admin_notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Action */}
          {purchaseRequest.status === "pending_payment" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-orange-900">Paiement Requis</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Veuillez effectuer le paiement pour procéder à l'achat.
                    </p>
                  </div>
                  <Button onClick={() => setIsPaymentOpen(true)} className="w-full h-8 text-sm">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Payer Maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Informations</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date de création :</span>
                    <span className="text-sm font-medium">{formatDate(purchaseRequest.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Dernière mise à jour :</span>
                    <span className="text-sm font-medium">{formatDate(purchaseRequest.updated_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Payment - {purchaseRequest.id}</DialogTitle>
            <DialogDescription>Complétez votre paiement pour procéder à l'achat</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Total Amount Due:</span>
                <span className="text-lg font-bold">
                  {formatCurrency(purchaseRequest.payment_due || purchaseRequest.total_amount)}
                </span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="p-3 bg-orange-50 rounded-md">
              <h4 className="font-medium text-orange-900 mb-1 text-sm">Instructions de Virement Bancaire</h4>
              <div className="text-sm text-orange-800 space-y-0.5">
                <p>
                  <strong>Bank:</strong> Attijariwafa Bank
                </p>
                <p>
                  <strong>Account Name:</strong> ForwardMorocco SARL
                </p>
                <p>
                  <strong>Account Number:</strong> 007 780 0001234567890
                </p>
                <p>
                  <strong>SWIFT:</strong> BCMAMAMC
                </p>
                <p>
                  <strong>Reference:</strong> {purchaseRequest.id}
                </p>
              </div>
            </div>

            {/* Receipt Upload */}
            <div>
              <Label className="text-sm">Payment Receipt *</Label>
              <div className="mt-1 border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Téléchargez votre reçu de paiement</p>
                <Input type="file" accept="image/*,.pdf" className="mt-2 text-sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handlePayment} className="flex-1 h-8 text-sm">
                <Check className="w-3 h-3 mr-1" />
                Submit Payment
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="h-8 text-sm">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
