"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { ArrowLeft, ArrowRight, Check, Upload, ExternalLink, Package, FileText, ImageIcon, Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type PurchaseRequest, type Attachment, formatCurrency, formatDate } from "@/lib/database"

// Custom type for purchase request with attachments
type PurchaseRequestWithAttachments = PurchaseRequest & {
  attachments?: Attachment[]
}
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import * as React from "react"

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending_review":
      return "bg-yellow-100 text-yellow-800"

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

const getStatusLabel = (status: string, t: (key: string, fallback?: string) => string) => {
  switch (status) {
    case "pending_review":
      return t('purchases.statusLabels.pending_review', 'En Attente de Révision')

    case "confirmed":
      return t('purchases.statusLabels.confirmed', 'Confirmé')
    case "purchasing":
      return t('purchases.statusLabels.purchasing', 'Achat en Cours')
    case "completed":
      return t('purchases.statusLabels.completed', 'Terminé')
    case "cancelled":
      return t('purchases.statusLabels.cancelled', 'Annulé')
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
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequestWithAttachments | null>(null)
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
            title: t('common.error', 'Erreur'),
            description: t('purchaseDetail.notFound', 'Demande d\'achat introuvable'),
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching purchase request:", error)
        toast({
          title: t('common.error', 'Erreur'),
          description: t('purchaseDetail.loadError', 'Impossible de charger la demande d\'achat'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseRequest()
  }, [id, toast, t])



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!purchaseRequest) {
    return <div>{t('purchaseDetail.notFound', 'Purchase request not found')}</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
          {isRTL ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
        </Button>
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{purchaseRequest.id}</h1>
            <Badge className={getStatusColor(purchaseRequest.status) + ' text-xs'} variant="secondary">
              {getStatusLabel(purchaseRequest.status, t)}
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Purchase Request Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t('purchaseDetail.summary.title', 'Résumé de la Demande')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('purchaseDetail.summary.itemsCost', 'Coût des Articles')} :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.items_cost ? formatCurrency(purchaseRequest.items_cost) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('purchaseDetail.summary.shippingFee', 'Frais d\'Expédition')} :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.shipping_fee ? formatCurrency(purchaseRequest.shipping_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('purchaseDetail.summary.serviceFee', 'Frais de Service')} :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.service_fee ? formatCurrency(purchaseRequest.service_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('purchaseDetail.summary.processingFee', 'Frais de Traitement')} :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.processing_fee ? formatCurrency(purchaseRequest.processing_fee) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('purchaseDetail.summary.taxes', 'Taxes')} :</span>
                <span className="text-sm font-medium">
                  {purchaseRequest.taxes ? formatCurrency(purchaseRequest.taxes) : "N/A"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('purchaseDetail.summary.totalAmount', 'Montant Total')} :</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(purchaseRequest.payment_due || purchaseRequest.total_amount)}
                  </span>
                </div>
              </div>
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

              {/* Purchase Request Attachments */}
              {purchaseRequest.attachments && purchaseRequest.attachments.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <FileText className="w-4 h-4" />
                      {t('purchaseDetail.attachments.title', 'Documents')} ({purchaseRequest.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {purchaseRequest.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                          <div className="flex items-center gap-2">
                            {attachment.attachment_type === "receipt" ? (
                              <Receipt className="w-4 h-4 text-green-600" />
                            ) : attachment.attachment_type === "photo" ? (
                              <ImageIcon className="w-4 h-4 text-blue-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{attachment.file_name}</p>
                              <p className="text-sm text-gray-500">
                                {attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} ${t('purchaseDetail.attachments.fileSize', 'KB')}` : "N/A"}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild className="h-7 text-sm">
                            <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {t('purchaseDetail.attachments.view', 'Voir')}
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
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


    </div>
  )
}
