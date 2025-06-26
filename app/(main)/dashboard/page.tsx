"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Plus, MapPin, Phone, User, Clock, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useAnalytics } from "@/hooks/use-analytics"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, loading, error } = useDashboardStats()
  const { toast } = useToast()
  const { trackDashboard, trackError } = useAnalytics()

  // Track page view
  useEffect(() => {
    trackDashboard('PAGE_VIEW', {
      user_id: user?.id,
      has_stats: !!stats,
      total_packages: (stats?.expected_packages || 0) + (stats?.warehouse_packages || 0) + (stats?.shipped_packages || 0)
    })
  }, [trackDashboard, user?.id, stats])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      trackError('API_ERROR', { 
        error_message: error,
        endpoint: '/api/dashboard/stats'
      })
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast, trackError])

  const getFullName = () => {
    if (!user) return "Utilisateur"
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Utilisateur"
  }

  const getFirstName = () => {
    return user?.first_name || "Utilisateur"
  }

  const handleActionClick = (action: string) => {
    trackDashboard('ACTION_CLICK', { action })
  }

  const statsCards = [
    {
      title: "Colis Attendus",
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.expected_packages?.toString() || "0",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/packages",
    },
    {
      title: "En Entrepôt",
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.warehouse_packages?.toString() || "0",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/packages",
    },
    {
      title: "Envoyés",
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.shipped_packages?.toString() || "0",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/packages",
    },
    {
      title: "Achat Assisté",
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.purchase_assistance?.toString() || "0",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/purchases",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Accueil</h1>
            <p className="text-xs text-gray-600">Aperçu de vos colis et activité récente</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white">
          <h2 className="text-base font-semibold mb-1">Bon retour, {getFirstName()} !</h2>
          <p className="text-orange-100 text-xs mb-3">
            Vous avez {stats?.shipped_packages || 0} colis en transit et {stats?.expected_packages || 0} colis attendus
            à examiner.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild className="h-7 text-xs">
              <a href="/purchases/create" onClick={() => handleActionClick('new_purchase_request')}>
                <Plus className="w-3 h-3 mr-1" />
                Nouvelle Demande
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white hover:bg-white hover:text-orange-600 h-7 text-xs text-orange-500"
              asChild
            >
              <a href="/packages/create" onClick={() => handleActionClick('add_package')}>
                <Package className="w-3 h-3 mr-1" />
                Ajouter Colis
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-sm transition-shadow cursor-pointer border-gray-200">
              <a href={stat.href} className="block" onClick={() => handleActionClick(`view_${stat.title.toLowerCase().replace(/\s+/g, '_')}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                      <div className="text-xl font-semibold text-gray-900">
                        {typeof stat.value === "string" ? stat.value : stat.value}
                      </div>
                    </div>
                    <div className={`p-2 rounded-md ${stat.bgColor}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Turkey Warehouse Address */}
          <div>
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Adresse Turquie
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Votre adresse d'entrepôt d'expédition
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                        <p className="text-xs text-gray-500">Titulaire du Compte</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-2 space-y-1">
                      <p className="text-xs font-medium text-gray-900">shipit.ma Turkey Warehouse</p>
                      <p className="text-xs text-gray-600">Atatürk Mahallesi, İstanbul Caddesi No: 123</p>
                      <p className="text-xs text-gray-600">Kadıköy, İstanbul 34710</p>
                      <p className="text-xs text-gray-600">Turkey</p>
                    </div>

                    <div className="border-t border-gray-200 pt-2 flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-600" />
                      <p className="text-xs font-medium text-gray-900">+90 212 555 0123</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Incluez toujours votre nom complet ({getFullName()}) comme destinataire.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
