"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CreditCard, Eye, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { type PaymentRequest, type Payment, formatCurrency, formatDateWithLanguage } from "@/lib/database"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

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

interface PaymentCardProps {
  paymentRequest?: PaymentRequest
  payments?: Payment[]
  onViewDetails?: () => void
  onPayNow?: () => void
  compact?: boolean
}

export function PaymentCard({ paymentRequest, payments, onViewDetails, onPayNow, compact = false }: PaymentCardProps) {
  const { t } = useTranslations()
  const { language } = useLanguage()
  
  if (!paymentRequest) {
    return null
  }

  const isOverdue = paymentRequest.status === "overdue" || 
    (paymentRequest.status === "pending" && new Date(paymentRequest.due_date) < new Date())

  return (
    <Card className="border-gray-200">
      <CardHeader className={`pb-3 ${compact ? 'pb-2' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
              {t('paymentCard.title', 'Payment Request')} {paymentRequest.id}
            </CardTitle>
            <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
              {paymentRequest.type === 'purchase' ? t('paymentCard.purchase', 'Purchase') : t('paymentCard.shipping', 'Shipping')}
            </div>
          </div>
          <Badge className={getPaymentRequestStatusColor(paymentRequest.status)} variant="secondary">
            {getPaymentRequestStatusLabel(paymentRequest.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`space-y-3 ${compact ? 'space-y-2' : ''}`}>
        <div className={`space-y-1 ${compact ? 'space-y-0.5' : ''}`}>
          <div className="flex justify-between items-center">
            <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>Montant:</span>
            <span className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
              {formatCurrency(paymentRequest.amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>{t('paymentCard.dueDate', 'Due Date')}:</span>
            <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
              {formatDateWithLanguage(paymentRequest.due_date, language)}
            </span>
          </div>
          {paymentRequest.paid_date && (
            <div className="flex justify-between items-center">
              <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>{t('paymentCard.paymentDate', 'Payment Date')}:</span>
              <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
                {formatDateWithLanguage(paymentRequest.paid_date, language)}
              </span>
            </div>
          )}
        </div>

        {/* Payment Breakdown */}
        {paymentRequest.breakdown && Object.keys(paymentRequest.breakdown).length > 0 && (
          <div className="pt-1 border-t border-gray-100">
            <div className={`text-gray-500 mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>{t('paymentCard.breakdown', 'Breakdown')}:</div>
            {Object.entries(paymentRequest.breakdown).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className={`text-gray-400 capitalize ${compact ? 'text-xs' : 'text-sm'}`}>
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                </span>
                <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
                  {formatCurrency(value)}
                </span>
              </div>
            ))}
            {Object.keys(paymentRequest.breakdown).length > 2 && (
              <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                +{Object.keys(paymentRequest.breakdown).length - 2} {t('paymentCard.others', 'others')}
              </div>
            )}
          </div>
        )}

        {/* Payment Methods */}
        {paymentRequest.payment_methods && paymentRequest.payment_methods.length > 0 && (
          <div className={`space-y-1 ${compact ? 'space-y-0.5' : ''}`}>
            <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>{t('paymentCard.acceptedMethods', 'Accepted Methods')}:</div>
            <div className="flex flex-wrap gap-1">
              {paymentRequest.payment_methods.slice(0, 2).map((method) => (
                <span key={method} className={`bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ${compact ? 'text-xs' : 'text-sm'}`}>
                  {method}
                </span>
              ))}
              {paymentRequest.payment_methods.length > 2 && (
                <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
                  +{paymentRequest.payment_methods.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="p-2 bg-red-50 rounded-md border border-red-200">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span className={`text-red-800 font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                {t('paymentCard.overdue', 'Payment Overdue')}
              </span>
            </div>
          </div>
        )}

        {/* User Payments */}
        {payments && payments.length > 0 && (
          <div className="space-y-2">
            <div className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>{t('paymentCard.submittedPayments', 'Submitted Payments')}:</div>
            {payments.map((payment) => (
              <div key={payment.id} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{payment.id}</span>
                  <Badge className={getPaymentStatusColor(payment.status)} variant="secondary">
                    {getPaymentStatusLabel(payment.status)}
                  </Badge>
                </div>
                <div className={`space-y-0.5 ${compact ? 'space-y-0' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>{t('paymentCard.amount', 'Amount')}:</span>
                    <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
                      {formatCurrency(payment.amount ? Number(payment.amount) : null)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>{t('paymentCard.method', 'Method')}:</span>
                    <span className={`capitalize ${compact ? 'text-xs' : 'text-sm'}`}>
                      {payment.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>{t('paymentCard.date', 'Date')}:</span>
                    <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
                      {formatDateWithLanguage(payment.payment_date, language)}
                    </span>
                  </div>
                </div>
                {payment.admin_notes && (
                  <div className="mt-1 p-1 bg-white rounded text-xs text-gray-600">
                    Note: {payment.admin_notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex flex-col gap-2 pt-2 ${compact ? 'pt-1' : ''}`}>
          {onViewDetails && (
            <Button 
              variant="outline" 
              size={compact ? "sm" : "default"}
              className={`w-full ${compact ? 'h-7 text-xs' : 'h-8 text-sm'}`}
              onClick={onViewDetails}
            >
              <Eye className={`mr-1 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {t('common.view', 'View')}
            </Button>
          )}
          {(paymentRequest.status === "pending" || paymentRequest.status === "overdue") && onPayNow && (
            <Button 
              size={compact ? "sm" : "default"}
              className={`w-full ${compact ? 'h-7 text-xs' : 'h-8 text-sm'}`}
              onClick={onPayNow}
            >
              <CreditCard className={`mr-1 ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {t('paymentCard.payNow', 'Pay Now')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 