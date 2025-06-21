"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  DollarSign,
  ExternalLink,
  ImageIcon,
  FileText,
  AlertCircle,
  Clock,
  Receipt,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type PackageType, formatCurrency } from "@/lib/database"

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

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Package,
    CheckCircle,
    Truck,
    MapPin,
    Clock,
  }
  return icons[iconName] || Package
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Month is 0-indexed
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [packageData, setPackageData] = useState<PackageType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPackage() {
      try {
        const response = await fetch(`/api/packages/${params.id}`)
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
  }, [params.id, toast])

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
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-semibold">{packageData.id}</h1>
            <Badge className={getStatusColor(packageData.status)} variant="secondary">
              {packageData.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">
            {packageData.description} • Tracking: {packageData.tracking_number}
          </p>
        </div>
        {packageData.status === "arrived" && (
          <Button onClick={() => setIsPaymentOpen(true)} size="sm" className="h-7 text-xs">
            <DollarSign className="w-3 h-3 mr-1" />
            Payer les Frais d'Expédition
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="tracking" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracking" className="text-xs">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs">
                articles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="w-4 h-4" />
                    Chronologie de Suivi
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Suivez le parcours de votre colis du Maroc vers la Turquie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {packageData.timeline?.map((step, index) => {
                      const IconComponent = getIconComponent(step.icon || "Package")
                      return (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            {index < (packageData.timeline?.length || 0) - 1 && (
                              <div className={`w-0.5 h-8 mt-1 ${step.completed ? "bg-green-200" : "bg-gray-200"}`} />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={`text-sm font-medium ${step.completed ? "text-green-600" : "text-gray-400"}`}
                              >
                                {step.status}
                              </h3>
                              <div className="text-xs text-gray-500">
                                {step.date} • {step.time}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{step.location}</span>
                            </div>
                            <p className="text-xs text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
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
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{item.value ? formatCurrency(item.value) : "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item Attachments */}
                      {item.attachments && item.attachments.length > 0 && (
                        <div className="ml-3 pl-3 border-l-2 border-gray-100">
                          <h4 className="text-xs font-medium text-gray-700 mb-2">
                            Fichiers Joints ({item.attachments.length})
                          </h4>
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
                                  className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-white"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                      className={`w-6 h-6 ${getAttachmentBg(attachment.attachment_type)} rounded flex items-center justify-center flex-shrink-0`}
                                    >
                                      {getAttachmentIcon(attachment.attachment_type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h5 className="text-xs font-medium truncate">{attachment.file_name}</h5>
                                      <p className="text-xs text-gray-500">
                                        {attachment.attachment_type} •{" "}
                                        {attachment.file_size ? `${Math.round(attachment.file_size / 1024)}KB` : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-6 text-xs ml-2 flex-shrink-0"
                                  >
                                    <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
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
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="w-4 h-4" />
                    Documents du Colis
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Documents importants liés à votre colis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* User Attachments */}
                  {packageData.attachments && packageData.attachments.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Fichiers Joints</h4>
                      {packageData.attachments.map((attachment) => {
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
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 ${getAttachmentBg(attachment.attachment_type)} rounded-md flex items-center justify-center`}
                              >
                                {getAttachmentIcon(attachment.attachment_type)}
                              </div>
                              <div>
                                <h3 className="text-xs font-medium">{attachment.file_name}</h3>
                                <p className="text-xs text-gray-500">
                                  {attachment.attachment_type} •{" "}
                                  {attachment.file_size ? `${Math.round(attachment.file_size / 1024)}KB` : "N/A"} •{" "}
                                  {formatDate(attachment.uploaded_at)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="h-6 text-xs">
                              <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Voir
                              </a>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}

                  {/* Empty State */}
                  {(!packageData.attachments || packageData.attachments.length === 0) && (
                    <div className="text-center py-6">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Aucun fichier disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Package Summary */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Résumé du Colis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Poids :</span>
                <span className="text-xs font-medium">{packageData.weight || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Dimensions :</span>
                <span className="text-xs font-medium">{packageData.dimensions || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Valeur :</span>
                <span className="text-xs font-medium">
                  {packageData.estimated_value ? formatCurrency(packageData.estimated_value) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Expédition :</span>
                <span className="text-xs font-medium">
                  {packageData.shipping_cost ? formatCurrency(packageData.shipping_cost) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Assurance :</span>
                <span className="text-xs font-medium">
                  {packageData.insurance ? formatCurrency(packageData.insurance) : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {packageData.status === "arrived" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-medium text-orange-900">Paiement Requis</h4>
                    <p className="text-xs text-orange-800 mt-1">
                      Votre colis est arrivé dans notre entrepôt. Veuillez payer les frais d'expédition pour procéder à
                      la livraison.
                    </p>
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
            <DialogDescription>Effectuez le paiement pour expédier votre colis vers la Turquie</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">Coût d'Expédition :</span>
                  <span className="text-xs font-medium">
                    {packageData.shipping_cost ? formatCurrency(packageData.shipping_cost) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Assurance :</span>
                  <span className="text-xs font-medium">
                    {packageData.insurance ? formatCurrency(packageData.insurance) : "N/A"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-1 flex justify-between">
                  <span className="text-xs font-medium">Total :</span>
                  <span className="text-sm font-bold">
                    {packageData.shipping_cost && packageData.insurance
                      ? formatCurrency(packageData.shipping_cost + packageData.insurance)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePayShipping} className="flex-1 h-8 text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                Payer Maintenant
              </Button>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)} className="h-8 text-xs">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
