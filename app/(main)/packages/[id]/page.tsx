"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Package,
  DollarSign,
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
import { type PackageType, formatCurrency } from "@/lib/database"
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "expected":
      return "Attendu"
    case "processing":
      return "En Traitement"
    case "arrived":
      return "Arrivé"
    case "in_transit":
      return "En Transit"
    case "delivered":
      return "Livré"
    default:
      return status.replace("_", " ")
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Month is 0-indexed
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
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
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [packageData, setPackageData] = useState<PackageType | null>(null)
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
            title: "Erreur",
            description: "Colis introuvable",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching package:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le colis",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [id, toast])

  const handlePayShipping = () => {
    toast({
      title: "Paiement Soumis",
      description: "Votre paiement d'expédition a été soumis pour traitement",
    })
    setIsPaymentOpen(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>
  }

  if (!packageData) {
    return <div>Package not found</div>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-7 w-7 p-0">
          <ArrowLeft className="w-3 h-3" />
        </Button>
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{packageData.id}</h1>
            <Badge className={getStatusColor(packageData.status) + ' text-xs'} variant="secondary">
              {getStatusLabel(packageData.status)}
            </Badge>
        </div>
        {packageData.status === "arrived" && (
          <Button onClick={() => setIsPaymentOpen(true)} size="sm" className="h-7 text-sm ml-auto">
            <DollarSign className="w-3 h-3 mr-1" />
            Payer les Frais d'Expédition
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Package Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Résumé du Colis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Poids :</span>
                <span className="text-sm font-medium">{packageData.weight || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Dimensions :</span>
                <span className="text-sm font-medium">{packageData.dimensions || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Valeur :</span>
                <span className="text-sm font-medium">
                  {packageData.estimated_value ? formatCurrency(packageData.estimated_value) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expédition :</span>
                <span className="text-sm font-medium">
                  {packageData.shipping_cost ? formatCurrency(packageData.shipping_cost) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Assurance :</span>
                <span className="text-sm font-medium">
                  {packageData.insurance ? formatCurrency(packageData.insurance) : "N/A"}
                </span>
              </div>
              {packageData.carrier && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transporteur :</span>
                  <span className="text-sm font-medium">{packageData.carrier}</span>
                </div>
              )}
              {packageData.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Numéro de Suivi :</span>
                  <span className="text-sm font-medium">{packageData.tracking_number}</span>
                </div>
              )}
              {packageData.eta && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date d'Arrivée Estimée :</span>
                  <span className="text-sm font-medium">{packageData.eta}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package Timeline */}
          {packageData.timeline && packageData.timeline.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Suivi du Colis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageData.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      {/* Timeline Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {getTimelineIcon(event.icon || "Clock")}
                      </div>
                      
                      {/* Timeline Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{event.status}</h4>
                            {event.location && (
                              <p className="text-sm text-gray-500">{event.location}</p>
                            )}
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

          {/* Package Contents */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Package className="w-4 h-4" />
                Contenu du Colis ({packageData.items?.length || 0} articles)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {packageData.items?.map((item, index) => (
                <div key={index} className="space-y-3">
                  {/* Item Details */}
                  <div className="flex gap-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md bg-gray-50"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{item.value ? formatCurrency(item.value) : "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valeur Totale Estimée :</span>
                  <span className="text-lg font-bold text-orange-600">
                    {packageData.estimated_value ? formatCurrency(packageData.estimated_value) : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Attachments */}
          {packageData.attachments && packageData.attachments.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="w-4 h-4" />
                  Documents ({packageData.attachments.length})
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
                            {attachment.file_size ? `${(attachment.file_size / 1024).toFixed(1)} KB` : "N/A"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="h-7 text-sm">
                        <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Voir
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
                  <h4 className="text-sm font-medium text-blue-900">Suivi en Ligne</h4>
                  <Button variant="outline" size="sm" asChild className="w-full h-8 text-sm">
                    <a href={packageData.tracking_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Suivre sur {packageData.carrier || "le site du transporteur"}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts */}
          {packageData.status === "arrived" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-900">Paiement Requis</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Votre colis est arrivé dans notre entrepôt. Veuillez payer les frais d'expédition pour procéder à
                      la livraison.
                    </p>
                  </div>
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
                    <h4 className="text-sm font-medium text-green-900">Assurance</h4>
                    <p className="text-sm text-green-800 mt-1">{packageData.insurance_details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payer les Frais d'Expédition - {packageData.id}</DialogTitle>
            <DialogDescription>Effectuez le paiement pour expédier votre colis vers le Maroc</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Coût d'Expédition :</span>
                  <span className="text-sm font-medium">
                    {packageData.shipping_cost ? formatCurrency(packageData.shipping_cost) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Assurance :</span>
                  <span className="text-sm font-medium">
                    {packageData.insurance ? formatCurrency(packageData.insurance) : "N/A"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-1 flex justify-between">
                  <span className="text-sm font-medium">Total :</span>
                  <span className="text-sm font-bold">
                    {packageData.shipping_cost && packageData.insurance
                      ? formatCurrency(packageData.shipping_cost + packageData.insurance)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePayShipping} className="flex-1 h-8 text-sm">
                <DollarSign className="w-3 h-3 mr-1" />
                Payer Maintenant
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="h-8 text-sm">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
