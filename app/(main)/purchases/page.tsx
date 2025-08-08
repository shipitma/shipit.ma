"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Check,
  Search,
  Plus,
  Eye,
  Filter,
  Clock,
  CheckCircle,
  ShoppingCart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type PurchaseRequest, formatCurrency } from "@/lib/database"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

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

// ... existing code ...

export default function PurchasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([])
  const [stats, setStats] = useState({
    pending_review: 0,
    purchasing: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const { toast } = useToast()
  const { trackPurchase, trackError } = useAnalytics()
  const { user } = useAuth()
  const { t } = useTranslations()
  const { language, isRTL } = useLanguage()

  const getStatusLabel = (status: string) => {
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

  const fetchData = async (status?: string) => {
    try {
      setLoading(true)
      const sessionId = localStorage.getItem("authToken")
      if (!sessionId) {
        toast({
          title: t('common.error', 'Erreur'),
          description: t('purchases.errors.sessionExpired', 'Session expirée, veuillez vous reconnecter'),
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
        title: t('common.error', 'Erreur'),
        description: t('purchases.errors.loadError', 'Impossible de charger les données'),
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

  const filteredRequests = purchaseRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })



  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value) {
      trackPurchase('PURCHASE_SEARCH', { search_query: value })
    }
  }

  const getTotalItemsCount = (request: any) => {
    return request.items?.reduce((total: number, item: any) => total + (item.quantity || 0), 0) || 0
  }

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex justify-end mb-2">
          <Button size="sm" asChild className="h-7 text-sm">
            <a href="/purchases/create">
              <Plus className="w-3 h-3 mr-1" />
              {t('purchases.newRequestButton', 'Nouvelle Demande')}
            </a>
          </Button>
        </div>
        <div>
          <h1 className="text-lg font-semibold">{t('purchases.title', 'Demandes d\'Achat')}</h1>
          <p className="text-sm text-gray-600">{t('purchases.subtitle', 'Gérez vos demandes d\'achat et suivez leur progression')}</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{t('purchases.title', 'Demandes d\'Achat')}</h1>
          <p className="text-sm text-gray-600">{t('purchases.subtitle', 'Gérez vos demandes d\'achat et suivez leur progression')}</p>
        </div>
        <Button size="sm" asChild className="h-7 text-sm">
          <a href="/purchases/create">
            <Plus className="w-3 h-3 mr-1" />
            {t('purchases.newRequestButton', 'Nouvelle Demande')}
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('purchases.stats.pendingReview', 'En Attente de Révision')}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">{t('purchases.stats.inProgress', 'En Cours')}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">{t('purchases.stats.completed', 'Terminé')}</p>
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
            placeholder={t('purchases.searchPlaceholder', 'Rechercher des demandes...')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-7 h-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder={t('purchases.statusFilter', 'Statut')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">
              {t('purchases.allStatuses', 'Tous les Statuts')}
            </SelectItem>
            <SelectItem value="pending_review" className="text-sm">
              {t('purchases.statusLabels.pending_review', 'En Attente de Révision')}
            </SelectItem>
            <SelectItem value="pending_payment" className="text-sm">
              {t('purchases.statusLabels.pending_payment', 'En Attente de Paiement')}
            </SelectItem>
            <SelectItem value="confirmed" className="text-sm">
              {t('purchases.statusLabels.confirmed', 'Confirmé')}
            </SelectItem>
            <SelectItem value="purchasing" className="text-sm">
              {t('purchases.statusLabels.purchasing', 'Achat en Cours')}
            </SelectItem>
            <SelectItem value="completed" className="text-sm">
              {t('purchases.statusLabels.completed', 'Terminé')}
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
              {t('purchases.emptyState.title', 'Aucune demande trouvée')}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? t('purchases.emptyState.description', 'Aucune demande ne correspond à vos critères de recherche.')
                : t('purchases.emptyState.descriptionNoRequests', 'Vous n\'avez pas encore de demandes d\'achat. Commencez par créer votre première demande.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-0">
            {!searchTerm && statusFilter === "all" && (
              <Button asChild>
                <a href="/purchases/create">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('purchases.emptyState.createFirstRequest', 'Créer votre première demande')}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border-gray-200 hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">#{request.id}</h3>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('purchases.total', 'Total')}:</span>
                    <span className="font-medium">{formatCurrency(request.total_amount ? Number(request.total_amount) : null, language)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('purchases.items', 'Items')}:</span>
                    <span className="font-medium">{getTotalItemsCount(request)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('purchases.created', 'Created')}:</span>
                    <span className="font-medium">{isRTL ? (
                      <>
                        {new Date(request.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })} {new Date(request.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </>
                    ) : (
                      <>
                        {new Date(request.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })} {new Date(request.created_at).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </>
                    )}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`/purchases/${request.id}`}>
                      <Eye className="w-3 h-1 mr-1" />
                      {t('common.view', 'View')}
                    </a>
                  </Button>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


    </div>
  )
}
