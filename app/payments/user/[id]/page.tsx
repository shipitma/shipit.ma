"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Eye, FileText, CheckCircle, Clock, XCircle, AlertCircle, Calendar, DollarSign, CreditCard, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics } from "@/hooks/use-analytics"
import { type Payment, type PaymentTimeline, formatCurrency, formatDate } from "@/lib/database"

const getStatusColor = (status: string) => {
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

const getStatusLabel = (status: string) => {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "submitted":
      return <Clock className="w-4 h-4" />
    case "verified":
      return <CheckCircle className="w-4 h-4" />
    case "rejected":
      return <XCircle className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function UserPaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [paymentData, setPaymentData] = useState<Payment | null>(null)
  const [timeline, setTimeline] = useState<PaymentTimeline[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { trackPayment, trackError } = useAnalytics()

  useEffect(() => {
    const fetchPaymentData = async () => {
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

        const [paymentRes, timelineRes] = await Promise.all([
          fetch(`/api/payments/user/${id}`, {
            headers: { Authorization: `Bearer ${sessionId}` },
          }),
          fetch(`/api/payments/user/${id}/timeline`, {
            headers: { Authorization: `Bearer ${sessionId}` },
          }),
        ])

        if (!paymentRes.ok || !timelineRes.ok) {
          throw new Error("Failed to fetch payment data")
        }

        const payment = await paymentRes.json()
        const timelineData = await timelineRes.json()

        setPaymentData(payment)
        setTimeline(Array.isArray(timelineData) ? timelineData : [])
        
        trackPayment('VIEW_PAYMENT_DETAILS', { paymentId: id })
      } catch (error) {
        trackError('API_ERROR', { 
          error_message: error instanceof Error ? error.message : 'Unknown error',
          endpoint: `/api/payments/user/${id}`
        })
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/payments">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Retour
            </a>
          </Button>
        </div>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/payments">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Retour
            </a>
          </Button>
        </div>
        <Card className="border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Paiement non trouvé
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Le paiement demandé n'existe pas ou vous n'avez pas les permissions pour le voir.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href="/payments">
            <ArrowLeft className="w-3 h-3 mr-1" />
            Retour
          </a>
        </Button>
      </div>

      {/* Payment Header */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-semibold">{paymentData.id}</h1>
              <Badge className={`${getStatusColor(paymentData.status)} text-xs`} variant="secondary">
                {getStatusLabel(paymentData.status)}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(paymentData.amount)}
              </div>
              <div className="text-xs text-gray-500">
                Soumis le {formatDate(paymentData.payment_date)}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Détails du Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Montant:</span>
                  </div>
                  <div className="text-sm font-semibold">{formatCurrency(paymentData.amount)}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Méthode:</span>
                  </div>
                  <div className="text-sm font-semibold capitalize">{paymentData.payment_method}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Date de Paiement:</span>
                  </div>
                  <div className="text-sm">{formatDate(paymentData.payment_date)}</div>
                </div>
                {paymentData.transaction_id && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Transaction:</span>
                    </div>
                    <div className="text-sm font-mono">{paymentData.transaction_id}</div>
                  </div>
                )}
              </div>

              {paymentData.verified_at && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">Vérifié le:</span>
                      </div>
                      <div className="text-sm">{formatDate(paymentData.verified_at)}</div>
                    </div>
                    {paymentData.verified_by && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Vérifié par:</span>
                        </div>
                        <div className="text-sm">{paymentData.verified_by}</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {paymentData.admin_notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Note Admin:</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {paymentData.admin_notes}
                    </div>
                  </div>
                </>
              )}

              {paymentData.payment_proof_url && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Preuve de Paiement:</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="w-full"
                    >
                      <a href={paymentData.payment_proof_url} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-3 h-3 mr-1" />
                        Voir la Preuve
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          {timeline.length > 0 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {event.status === 'submitted' && 'Paiement Soumis'}
                            {event.status === 'verified' && 'Paiement Vérifié'}
                            {event.status === 'rejected' && 'Paiement Rejeté'}
                            {event.status === 'completed' && 'Paiement Terminé'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(event.date)} à {event.time}
                          </div>
                        </div>
                        {event.description && (
                          <div className="text-xs text-gray-600 mt-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Payment Request */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Demande de Paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">ID:</span> {paymentData.payment_request_id}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <a href={`/payments/${paymentData.payment_request_id}`}>
                    <Eye className="w-3 h-3 mr-1" />
                    Voir la Demande
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(paymentData.status)} variant="secondary">
                    {getStatusLabel(paymentData.status)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {paymentData.status === 'submitted' && 'Votre paiement a été soumis et est en attente de vérification.'}
                  {paymentData.status === 'verified' && 'Votre paiement a été vérifié par l\'administrateur.'}
                  {paymentData.status === 'rejected' && 'Votre paiement a été rejeté. Veuillez contacter le support.'}
                  {paymentData.status === 'completed' && 'Votre paiement a été traité avec succès.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 