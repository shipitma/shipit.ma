"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  Check,
  Search,
  Plus,
  Eye,
  Filter,
  Clock,
  CheckCircle,
  ShoppingCart,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type PurchaseRequest, formatCurrency, formatDate } from "@/lib/database"
import { useAuth } from "@/lib/auth-context"

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

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([])
  const [stats, setStats] = useState({
    pending_review: 0,
    pending_payment: 0,
    purchasing: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const { toast } = useToast()
  const { trackPurchase, trackError } = useAnalytics()
  const { user } = useAuth()

  const fetchData = async (status?: string) => {
    try {
      setLoading(true)
      const sessionId = localStorage.getItem("authToken")
      if (!sessionId) {
        toast({
          title: "Erreur",
          description: "Session expirée, veuillez vous reconnecter",
          variant: "destructive",
        })
        return
      }

      const [requestsRes, statsRes] = await Promise.all([
        fetch(`/api/purchase-requests${status && status !== "all" ? `?status=${status}` : ""}`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
        fetch("/api/purchase-requests/stats", {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
      ])

      if (!requestsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const requestsData = await requestsRes.json()
      const statsData = await statsRes.json()

      setPurchaseRequests(Array.isArray(requestsData) ? requestsData : [])
      setStats(statsData)
    } catch (error) {
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/purchase-requests'
      })
      console.error("Error fetching data:", error)
      setPurchaseRequests([])
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [toast])

  // Fetch data when status filter changes
  useEffect(() => {
    if (!loading) {
      trackPurchase('PURCHASE_FILTER', { filter_type: statusFilter })
      fetchData(statusFilter)
    }
  }, [statusFilter])

  const handlePayment = () => {
    if (selectedRequest) {
      trackPurchase('PURCHASE_PAYMENT_SUBMITTED', { 
        purchaseId: selectedRequest.id,
        amount: selectedRequest.payment_due || undefined
      })
    }
    toast({
      title: "Succès",
      description: "Paiement soumis pour examen",
    })
    setIsPaymentOpen(false)
    setSelectedRequest(null)
  }

  const filteredRequests = purchaseRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.items && request.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())))

    return matchesSearch
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value) {
      trackPurchase('PURCHASE_SEARCH', { search_query: value })
    }
  }

  // Calculate total items count
  const getTotalItemsCount = (request: PurchaseRequest) => {
    if (!request.items || !Array.isArray(request.items)) return 0
    return request.items.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex justify-end mb-2">
          <Button size="sm" asChild className="h-7 text-xs">
            <a href="/purchases/create">
              <Plus className="w-3 h-3 mr-1" />
              Nouvelle Demande
            </a>
          </Button>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Demandes d'Achat</h1>
          <p className="text-xs text-gray-600">Gérez vos demandes d'achat et suivez leur progression</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Demandes d'Achat</h1>
          <p className="text-xs text-gray-600">Gérez vos demandes d'achat et suivez leur progression</p>
        </div>
        <Button size="sm" asChild className="h-7 text-xs">
          <a href="/purchases/create">
            <Plus className="w-3 h-3 mr-1" />
            Nouvelle Demande
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">En Attente de Révision</p>
                <p className="text-xl font-semibold text-gray-900">{stats.pending_review}</p>
              </div>
              <div className="p-2 rounded-md bg-yellow-100">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">En Attente de Paiement</p>
                <p className="text-xl font-semibold text-gray-900">{stats.pending_payment}</p>
              </div>
              <div className="p-2 rounded-md bg-orange-100">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">En Cours</p>
                <p className="text-xl font-semibold text-gray-900">{stats.purchasing}</p>
              </div>
              <div className="p-2 rounded-md bg-purple-100">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Terminé</p>
                <p className="text-xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
              <div className="p-2 rounded-md bg-green-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
          <Input
            placeholder="Rechercher des demandes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              Tous les Statuts
            </SelectItem>
            <SelectItem value="pending_review" className="text-xs">
              En Attente de Révision
            </SelectItem>
            <SelectItem value="pending_payment" className="text-xs">
              En Attente de Paiement
            </SelectItem>
            <SelectItem value="confirmed" className="text-xs">
              Confirmé
            </SelectItem>
            <SelectItem value="purchasing" className="text-xs">
              Achat en Cours
            </SelectItem>
            <SelectItem value="completed" className="text-xs">
              Terminé
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchase Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-7 bg-gray-200 rounded"></div>
                    <div className="h-7 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="border-gray-200">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Aucune demande trouvée
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Aucune demande ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de demandes d'achat. Commencez par créer votre première demande."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            {!searchTerm && statusFilter === "all" && (
              <Button size="sm" asChild>
                <a href="/purchases/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre première demande
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border-gray-200 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">{request.id}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{formatDate(request.date)}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(request.status)} variant="secondary">
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-gray-600">
                  {getTotalItemsCount(request)} articles ({request.items?.length || 0} types)
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Montant Total:</span>
                    <span className="text-xs font-semibold">{formatCurrency(request.total_amount)}</span>
                  </div>
                  {request.payment_due && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Paiement Dû:</span>
                      <span className="text-xs font-semibold text-orange-600">{formatCurrency(request.payment_due)}</span>
                    </div>
                  )}
                  {request.service_fee && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Frais de Service:</span>
                      <span className="text-xs font-medium">{formatCurrency(request.service_fee)}</span>
                    </div>
                  )}
                  {request.shipping_fee && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Frais d'Expédition:</span>
                      <span className="text-xs font-medium">{formatCurrency(request.shipping_fee)}</span>
                    </div>
                  )}
                </div>

                {/* Admin Notes Preview */}
                {request.admin_notes && (
                  <div className="p-2 bg-orange-50 rounded-md border border-orange-200">
                    <p className="text-xs text-orange-800 line-clamp-2">
                      <span className="font-medium">Note:</span> {request.admin_notes}
                    </p>
                  </div>
                )}

                {/* Timeline Status */}
                {request.timeline && request.timeline.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Dernière activité:</span>
                      <span className="text-xs font-medium">
                        {request.timeline[request.timeline.length - 1]?.status}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {request.timeline.slice(-3).map((event, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            event.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          title={`${event.status} - ${event.date}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs" 
                    asChild
                    onClick={() => trackPurchase('VIEW_PURCHASE_DETAILS', { purchaseId: request.id })}
                  >
                    <a href={`/purchases/${request.id}`}>
                      <Eye className="w-3 h-3 mr-1" />
                      Voir Détails
                    </a>
                  </Button>
                  {request.status === "pending_payment" && (
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        trackPurchase('PURCHASE_PAYMENT_INITIATED', { 
                          purchaseId: request.id,
                          amount: request.payment_due || undefined
                        })
                        setSelectedRequest(request)
                        setIsPaymentOpen(true)
                      }}
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Payer Maintenant
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Soumettre le Paiement</DialogTitle>
            <DialogDescription>Téléchargez votre reçu de paiement pour {selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-xs">Montant Dû:</span>
                <span className="font-bold text-sm">
                  {selectedRequest?.payment_due ? formatCurrency(selectedRequest.payment_due) : ""}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs">Reçu de Paiement *</Label>
              <div className="mt-2 border-2 border-dashed border-gray-200 rounded-md p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  Cliquez pour télécharger ou glissez-déposez votre reçu de paiement
                </p>
                <Input type="file" accept="image/*" className="mt-2 text-xs" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Notes de Paiement (Optionnel)</Label>
              <Textarea placeholder="Toute information supplémentaire sur votre paiement..." className="text-xs" />
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePayment} className="flex-1 h-8 text-xs">
                <Check className="w-3 h-3 mr-1" />
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
  )
}
