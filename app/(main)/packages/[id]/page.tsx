"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  ArrowLeft,
  ArrowRight,
  Package,
  ExternalLink,
  ImageIcon,
  FileText,
  AlertCircle,
  Receipt,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Package as PackageType, type Attachment, formatCurrency } from "@/lib/database"

// Custom type for package with attachments
type PackageWithAttachments = PackageType & {
  attachments?: Attachment[]
}
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import * as React from "react"

const getStatusColor = (status: string) => {
  switch (status) {
    case "expected":
      return "bg-gray-100 text-gray-800"
    case "arrived":
      return "bg-orange-100 text-orange-800"
    case "in_transit":
      return "bg-green-100 text-green-800"
    case "delivered":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusLabel = (status: string, t: (key: string, fallback?: string) => string) => {
  switch (status) {
    case "expected":
      return t('packages.statusLabels.expected', 'Attendu')
    case "processing":
      return t('packages.statusLabels.processing', 'En Traitement')
    case "arrived":
      return t('packages.statusLabels.arrived', 'Arrivé')
    case "in_transit":
      return t('packages.statusLabels.in_transit', 'En Transit')
    case "delivered":
      return t('packages.statusLabels.delivered', 'Livré')
    default:
      return status.replace("_", " ")
  }
}



const getTimelineIcon = (icon: string) => {
  switch (icon) {
    case "Package":
      return <Package className="w-4 h-4" />
    case "CheckCircle":
      return <CheckCircle className="w-4 h-4" />
    case "Truck":
      return <Truck className="w-4 h-4" />
    case "MapPin":
      return <MapPin className="w-4 h-4" />
    case "Shield":
      return <Shield className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslations()
  const { language, isRTL } = useLanguage()
  const [packageData, setPackageData] = useState<PackageWithAttachments | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = React.use(params)

  useEffect(() => {
    async function fetchPackage() {
      try {
        const response = await fetch(`/api/packages/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPackageData(data)
        } else {
          toast({
            title: t('common.error', 'Erreur'),
            description: t('packageDetail.notFound', 'Colis introuvable'),
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching package:", error)
        toast({
          title: t('common.error', 'Erreur'),
          description: t('packageDetail.loadError', 'Impossible de charger le colis'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [id, toast, t])



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!packageData) {
    return <div>{t('packageDetail.notFound', 'Package not found')}</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
          {isRTL ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
        </Button>
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{packageData.id}</h1>
            <Badge className={getStatusColor(packageData.status) + ' text-xs'} variant="secondary">
              {getStatusLabel(packageData.status, t)}
            </Badge>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Package Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">{t('packageDetail.summary.title', 'Résumé du Colis')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('packageDetail.summary.weight', 'Poids')} :</span>
                <span className="text-sm font-medium">{packageData.weight || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('packageDetail.summary.dimensions', 'Dimensions')} :</span>
                <span className="text-sm font-medium">{packageData.dimensions || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('packageDetail.summary.value', 'Valeur')} :</span>
                <span className="text-sm font-medium">
                  {packageData.estimated_value ? formatCurrency(packageData.estimated_value, language) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('packageDetail.summary.shipping', 'Expédition')} :</span>
                <span className="text-sm font-medium">
                  {packageData.shipping_cost ? formatCurrency(packageData.shipping_cost, language) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{t('packageDetail.summary.insurance', 'Assurance')} :</span>
                <span className="text-sm font-medium">
                  {packageData.insurance ? formatCurrency(packageData.insurance, language) : "N/A"}
                </span>
              </div>
              {packageData.carrier && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('packageDetail.summary.carrier', 'Transporteur')} :</span>
                  <span className="text-sm font-medium">{packageData.carrier}</span>
                </div>
              )}
              {packageData.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('packageDetail.summary.trackingNumber', 'Numéro de Suivi')} :</span>
                  <span className="text-sm font-medium">{packageData.tracking_number}</span>
                </div>
              )}
              {packageData.eta && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t('packageDetail.summary.eta', 'Date d\'Arrivée Estimée')} :</span>
                  <span className="text-sm font-medium">{packageData.eta}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Attachments */}
          {packageData.attachments && packageData.attachments.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="w-4 h-4" />
                  {t('packageDetail.attachments.title', 'Documents')} ({packageData.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {packageData.attachments.map((attachment) => (
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
                            {attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} ${t('packageDetail.attachments.fileSize', 'KB')}` : "N/A"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-7 text-sm">
                        <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {t('packageDetail.attachments.view', 'Voir')}
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


          {/* Tracking Info */}
          {packageData.tracking_url && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-900">{t('packageDetail.tracking.title', 'Suivi en Ligne')}</h4>
                  <Button variant="outline" size="sm" asChild className="w-full h-8 text-sm">
                    <a href={packageData.tracking_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {t('packageDetail.tracking.trackOn', 'Suivre sur')} {packageData.carrier || t('packageDetail.tracking.carrierSite', 'le site du transporteur')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}



          {/* Insurance Info */}
          {packageData.insurance_details && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">{t('packageDetail.alerts.insurance.title', 'Assurance')}</h4>
                    <p className="text-sm text-green-800 mt-1">{packageData.insurance_details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>


    </div>
  )
}
