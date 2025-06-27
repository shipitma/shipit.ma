"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, DollarSign, CheckCircle, Clock, XCircle, Eye, CreditCard, AlertCircle, FileText, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { type PaymentRequest, type Payment, formatCurrency, formatDate } from "@/lib/database"

const getPaymentRequestStatusColor = (status: string) => {
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

const getPaymentRequestStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "En Attente"
    case "paid":
      return "Payé"
    case "overdue":
      return "En Retard"
    case "processing":
      return "En Traitement"
    default:
      return status
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-blue-100 text-blue-800"
    case "verified":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case "submitted":
      return "Soumis"
    case "verified":
      return "Vérifié"
    case "rejected":
      return "Rejeté"
    case "completed":
      return "Terminé"
    default:
      return status
  }
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewType, setViewType] = useState<"requests" | "payments">("requests")
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    overdue: 0,
    paid: 0,
    processing: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { trackPayment, trackError } = useAnalytics()

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

      const [requestsRes, paymentsRes, statsRes] = await Promise.all([
        fetch(`/api/payments${status && status !== "all" ? `?status=${status}` : ""}`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
        fetch(`/api/payments/user-payments${status && status !== "all" ? `?status=${status}` : ""}`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
        fetch("/api/payments/stats", {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
      ])

      if (!requestsRes.ok || !paymentsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const requestsData = await requestsRes.json()
      const paymentsData = await paymentsRes.json()
      const statsData = await statsRes.json()

      setPaymentRequests(Array.isArray(requestsData) ? requestsData : [])
      setPayments(Array.isArray(paymentsData) ? paymentsData : [])
      setStats(statsData)
    } catch (error) {
      trackError('API_ERROR', { 
        error_message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/payments'
      })
      console.error("Error fetching data:", error)
      setPaymentRequests([])
      setPayments([])
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
      trackPayment('PAYMENT_FILTER', { filter_type: statusFilter })
      fetchData(statusFilter)
    }
  }, [statusFilter])

  const filteredRequests = paymentRequests.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.related_id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_request_id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value) {
      trackPayment('PAYMENT_SEARCH', { search_query: value })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Paiements</h1>
          <p className="text-sm text-gray-600">Gérez vos demandes de paiement et vos paiements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">En Attente</p>
                <p className="text-xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-2 rounded-md bg-orange-100">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">En Retard</p>
                <p className="text-xl font-semibold text-gray-900">{stats.overdue}</p>
              </div>
              <div className="p-2 rounded-md bg-red-100">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Payé</p>
                <p className="text-xl font-semibold text-gray-900">{stats.paid}</p>
              </div>
              <div className="p-2 rounded-md bg-green-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">En Traitement</p>
                <p className="text-xl font-semibold text-gray-900">{stats.processing}</p>
              </div>
              <div className="p-2 rounded-md bg-orange-100">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Type Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewType === "requests" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("requests")}
          className="text-sm"
        >
          <FileText className="w-3 h-3 mr-1" />
          Demandes de Paiement
        </Button>
        <Button
          variant={viewType === "payments" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("payments")}
          className="text-sm"
        >
          <Upload className="w-3 h-3 mr-1" />
          Mes Paiements
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
          <Input
            placeholder={viewType === "requests" ? "Rechercher des demandes..." : "Rechercher des paiements..."}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-7 h-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">
              Tous les Statuts
            </SelectItem>
            {viewType === "requests" ? (
              <>
                <SelectItem value="pending" className="text-sm">
                  En Attente
                </SelectItem>
                <SelectItem value="paid" className="text-sm">
                  Payé
                </SelectItem>
                <SelectItem value="overdue" className="text-sm">
                  En Retard
                </SelectItem>
                <SelectItem value="processing" className="text-sm">
                  En Traitement
                </SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="submitted" className="text-sm">
                  Soumis
                </SelectItem>
                <SelectItem value="verified" className="text-sm">
                  Vérifié
                </SelectItem>
                <SelectItem value="rejected" className="text-sm">
                  Rejeté
                </SelectItem>
                <SelectItem value="completed" className="text-sm">
                  Terminé
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewType === "requests" ? (
        // Payment Requests View
        filteredRequests.length === 0 ? (
          <Card className="border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Aucune demande de paiement trouvée
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Aucune demande ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore de demandes de paiement."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((payment) => (
              <Card key={payment.id} className="border-gray-200 hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">{payment.id}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">Lié à : {payment.related_id}</CardDescription>
                    </div>
                    <Badge className={getPaymentRequestStatusColor(payment.status)} variant="secondary">
                      {getPaymentRequestStatusLabel(payment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Montant:</span>
                      <span className="text-sm font-semibold">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Date d'Échéance:</span>
                      <span className="text-sm">{formatDate(payment.due_date)}</span>
                    </div>
                    {payment.paid_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Date de Paiement:</span>
                        <span className="text-sm">{formatDate(payment.paid_date)}</span>
                      </div>
                    )}
                    {payment.breakdown && Object.keys(payment.breakdown).length > 0 && (
                      <div className="pt-1 border-t border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">Répartition:</div>
                        {Object.entries(payment.breakdown).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                            </span>
                            <span className="text-sm">{formatCurrency(value)}</span>
                          </div>
                        ))}
                        {Object.keys(payment.breakdown).length > 2 && (
                          <div className="text-sm text-gray-400">
                            +{Object.keys(payment.breakdown).length - 2} autres
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  {payment.payment_methods && payment.payment_methods.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Méthodes acceptées:</div>
                      <div className="flex flex-wrap gap-1">
                        {payment.payment_methods.slice(0, 2).map((method) => (
                          <span key={method} className="text-sm bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {method}
                          </span>
                        ))}
                        {payment.payment_methods.length > 2 && (
                          <span className="text-sm text-gray-500">
                            +{payment.payment_methods.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overdue Warning */}
                  {(payment.status === "overdue" || (payment.status === "pending" && new Date(payment.due_date) < new Date())) && (
                    <div className="p-2 bg-red-50 rounded-md border border-red-200">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-sm text-red-800 font-medium">Paiement en retard</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-7 text-sm" 
                      asChild
                      onClick={() => trackPayment('VIEW_PAYMENT_REQUEST_DETAILS', { paymentId: payment.id })}
                    >
                      <a href={`/payments/${payment.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Voir Détails
                      </a>
                    </Button>
                    {(payment.status === "pending" || payment.status === "overdue") && (
                      <Button 
                        size="sm" 
                        className="w-full h-7 text-sm" 
                        asChild
                        onClick={() => trackPayment('PAYMENT_METHOD_SELECTED', { 
                          paymentId: payment.id,
                          payment_method: 'manual',
                          amount: payment.amount
                        })}
                      >
                        <a href={`/payments/${payment.id}`}>
                          <CreditCard className="w-3 h-3 mr-1" />
                          Payer Maintenant
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        // User Payments View
        filteredPayments.length === 0 ? (
          <Card className="border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Aucun paiement trouvé
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Aucun paiement ne correspond à vos critères de recherche."
                  : "Vous n'avez pas encore soumis de paiements."}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="border-gray-200 hover:shadow-sm transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">{payment.id}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">Pour : {payment.payment_request_id}</CardDescription>
                    </div>
                    <Badge className={getPaymentStatusColor(payment.status)} variant="secondary">
                      {getPaymentStatusLabel(payment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Montant:</span>
                      <span className="text-sm font-semibold">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Méthode:</span>
                      <span className="text-sm capitalize">{payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Date de Paiement:</span>
                      <span className="text-sm">{formatDate(payment.payment_date)}</span>
                    </div>
                    {payment.verified_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Vérifié le:</span>
                        <span className="text-sm">{formatDate(payment.verified_at)}</span>
                      </div>
                    )}
                    {payment.transaction_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Transaction:</span>
                        <span className="text-sm font-mono">{payment.transaction_id}</span>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes */}
                  {payment.admin_notes && (
                    <div className="p-2 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500 mb-1">Note Admin:</div>
                      <div className="text-sm text-gray-700">{payment.admin_notes}</div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-7 text-sm" 
                      asChild
                      onClick={() => trackPayment('VIEW_PAYMENT_DETAILS', { paymentId: payment.id })}
                    >
                      <a href={`/payments/user/${payment.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Voir Détails
                      </a>
                    </Button>
                    {payment.payment_proof_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-7 text-sm" 
                        asChild
                      >
                        <a href={payment.payment_proof_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-3 h-3 mr-1" />
                          Voir Preuve
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
