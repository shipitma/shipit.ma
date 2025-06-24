"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, DollarSign, CheckCircle, Clock, XCircle, Eye, CreditCard, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type PaymentRequest, formatCurrency, formatDate } from "@/lib/database"

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

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    overdue: 0,
    paid: 0,
    processing: 0,
  })
  const { toast } = useToast()

  const fetchData = async (status?: string) => {
    try {
      const sessionId = localStorage.getItem("authToken")
      if (!sessionId) {
        toast({
          title: "Erreur",
          description: "Session expirée, veuillez vous reconnecter",
          variant: "destructive",
        })
        return
      }

      const [paymentsRes, statsRes] = await Promise.all([
        fetch(`/api/payments${status && status !== "all" ? `?status=${status}` : ""}`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
        fetch("/api/payments/stats", {
          headers: { Authorization: `Bearer ${sessionId}` },
        }),
      ])

      if (!paymentsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const paymentsData = await paymentsRes.json()
      const statsData = await statsRes.json()

      setPaymentRequests(Array.isArray(paymentsData) ? paymentsData : [])
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setPaymentRequests([])
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [toast])

  // Fetch data when status filter changes
  useEffect(() => {
    fetchData(statusFilter)
  }, [statusFilter])

  const filteredRequests = paymentRequests.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.related_id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  if (paymentRequests.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Paiements</h1>
            <p className="text-xs text-gray-600">Chargement...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-gray-200">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Paiements</h1>
          <p className="text-xs text-gray-600">Gérez vos demandes de paiement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">En Attente</p>
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
                <p className="text-xs font-medium text-gray-600 mb-1">En Retard</p>
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
                <p className="text-xs font-medium text-gray-600 mb-1">Payé</p>
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
                <p className="text-xs font-medium text-gray-600 mb-1">En Traitement</p>
                <p className="text-xl font-semibold text-gray-900">{stats.processing}</p>
              </div>
              <div className="p-2 rounded-md bg-orange-100">
                <DollarSign className="w-4 h-4 text-orange-600" />
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
            placeholder="Rechercher des paiements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <SelectItem value="pending" className="text-xs">
              En Attente
            </SelectItem>
            <SelectItem value="paid" className="text-xs">
              Payé
            </SelectItem>
            <SelectItem value="overdue" className="text-xs">
              En Retard
            </SelectItem>
            <SelectItem value="processing" className="text-xs">
              En Traitement
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Cards Grid */}
      {filteredRequests.length === 0 ? (
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun paiement trouvé</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Aucun paiement ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore de demandes de paiement."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((payment) => (
            <Card key={payment.id} className="border-gray-200 hover:shadow-sm transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">{payment.id}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Lié à : {payment.related_id}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(payment.status)} variant="secondary">
                    {payment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Montant:</span>
                    <span className="text-sm font-semibold">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Date d'Échéance:</span>
                    <span className="text-xs">{formatDate(payment.due_date)}</span>
                  </div>
                  {payment.paid_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Date de Paiement:</span>
                      <span className="text-xs">{formatDate(payment.paid_date)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" asChild>
                    <a href={`/payments/${payment.id}`}>
                      <Eye className="w-3 h-3 mr-1" />
                      Voir Détails
                    </a>
                  </Button>
                  {(payment.status === "pending" || payment.status === "overdue") && (
                    <Button size="sm" className="w-full h-7 text-xs" asChild>
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
      )}
    </div>
  )
}
