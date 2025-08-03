"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Plus, MapPin, Phone, User, Clock, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useAnalytics } from "@/hooks/use-analytics"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats, loading, error } = useDashboardStats()
  const { toast } = useToast()
  const { trackDashboard, trackError } = useAnalytics()
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [loadingWarehouses, setLoadingWarehouses] = useState(true)
  const { t, language } = useTranslations()
  const { isRTL } = useLanguage()

  // Helper function to get translated country name
  const getCountryName = (country: string) => {
    const countryMap: { [key: string]: { [key: string]: string } } = {
      fr: {
        'Turkey': 'Turquie',
        'USA': 'États-Unis',
        'Europe': 'Europe',
        'France': 'France',
        'Spain': 'Espagne',
        'Morocco': 'Maroc'
      },
      en: {
        'Turkey': 'Turkey',
        'USA': 'USA',
        'Europe': 'Europe',
        'France': 'France',
        'Spain': 'Spain',
        'Morocco': 'Morocco'
      },
      ar: {
        'Turkey': 'تركيا',
        'USA': 'الولايات المتحدة',
        'Europe': 'أوروبا',
        'France': 'فرنسا',
        'Spain': 'إسبانيا',
        'Morocco': 'المغرب'
      }
    }
    
    return countryMap[language]?.[country] || country
  }

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
        title: t('common.error', 'Erreur'),
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast, trackError, t])

  useEffect(() => {
    setLoadingWarehouses(true)
    fetch("/api/warehouses")
      .then((res) => res.json())
      .then((data) => {
        setWarehouses(data.warehouses || [])
        setLoadingWarehouses(false)
      })
      .catch(() => setLoadingWarehouses(false))
  }, [])

  // Group warehouses by region for tabs
  const turkeyWarehouse = warehouses.find(w => w.country === "Turkey")
  const usaWarehouse = warehouses.find(w => w.country === "USA")
  const europeWarehouses = warehouses.filter(w => w.country === "France" || w.country === "Spain")

  const getFullName = () => {
    if (!user) return t('common.user', 'Utilisateur')
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || t('common.user', 'Utilisateur')
  }

  const getFirstName = () => {
    return user?.first_name || t('common.user', 'Utilisateur')
  }

  const handleActionClick = (action: string) => {
    trackDashboard('ACTION_CLICK', { action })
  }

  const statsCards = [
    {
      title: t('dashboard.stats.expectedPackages', 'Colis Attendus'),
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.expected_packages?.toString() || "0",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/packages",
    },
    {
      title: t('dashboard.stats.inWarehouse', 'En Entrepôt'),
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.warehouse_packages?.toString() || "0",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/packages",
    },
    {
      title: t('dashboard.stats.shipped', 'Envoyés'),
      value: loading ? <Skeleton className="h-6 w-8" /> : stats?.shipped_packages?.toString() || "0",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/packages",
    },
    {
      title: t('dashboard.stats.purchaseAssistance', 'Achat Assisté'),
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white">
          <h2 className="text-base font-semibold mb-1">{t('dashboard.welcomeBack', 'Bon retour, {name} !', { name: getFirstName() })}</h2>
          <p className="text-orange-100 text-sm mb-3">
            {t('dashboard.statsDescription', 'Vous avez {shipped} colis en transit et {expected} colis attendus à examiner.', { 
              shipped: stats?.shipped_packages || 0, 
              expected: stats?.expected_packages || 0 
            })}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild className="h-7 text-sm">
              <a href="/purchases/create" onClick={() => handleActionClick('new_purchase_request')}>
                <Plus className="w-3 h-3 mr-1" />
                {t('dashboard.newRequestButton', 'Nouvelle Demande')}
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white hover:bg-white hover:text-orange-600 h-7 text-sm text-orange-500"
              asChild
            >
              <a href="/packages/create" onClick={() => handleActionClick('add_package')}>
                <Package className="w-3 h-3 mr-1" />
                {t('dashboard.addPackageButton', 'Ajouter Colis')}
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
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
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

        {/* Warehouse Addresses with Tabs - Full Width */}
        <Card className="border-gray-200 w-full mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              {t('dashboard.warehouseAddresses.title', 'Adresses d\'entrepôt')}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {t('dashboard.warehouseAddresses.subtitle', 'Vos adresses d\'expédition internationales')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {loadingWarehouses ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Tabs defaultValue={turkeyWarehouse ? "turkey" : europeWarehouses.length ? "europe" : "usa"} className="w-full">
                <TabsList className="mb-2 w-full flex">
                  {isRTL ? (
                    <>
                      {usaWarehouse && <TabsTrigger value="usa" className="flex-1">{getCountryName("USA")}</TabsTrigger>}
                      {europeWarehouses.length > 0 && <TabsTrigger value="europe" className="flex-1">{getCountryName("Europe")}</TabsTrigger>}
                      {turkeyWarehouse && <TabsTrigger value="turkey" className="flex-1">{getCountryName("Turkey")}</TabsTrigger>}
                    </>
                  ) : (
                    <>
                      {turkeyWarehouse && <TabsTrigger value="turkey" className="flex-1">{getCountryName("Turkey")}</TabsTrigger>}
                      {europeWarehouses.length > 0 && <TabsTrigger value="europe" className="flex-1">{getCountryName("Europe")}</TabsTrigger>}
                      {usaWarehouse && <TabsTrigger value="usa" className="flex-1">{getCountryName("USA")}</TabsTrigger>}
                    </>
                  )}
                </TabsList>
                {turkeyWarehouse && (
                  <TabsContent value="turkey">
                    <WarehouseCard warehouse={turkeyWarehouse} getFullName={getFullName} getCountryName={getCountryName} isRTL={isRTL} />
                  </TabsContent>
                )}
                {europeWarehouses.length > 0 && (
                  <TabsContent value="europe">
                    <Tabs defaultValue={europeWarehouses[0].country.toLowerCase()} className="w-full">
                      <TabsList className="mb-2 w-full flex">
                        {isRTL ? (
                          <>
                            {europeWarehouses.filter(w => w.country === "Spain").map(w => (
                              <TabsTrigger key={w.country} value={w.country.toLowerCase()} className="flex-1">
                                {getCountryName(w.country)}
                              </TabsTrigger>
                            ))}
                            {europeWarehouses.filter(w => w.country === "France").map(w => (
                              <TabsTrigger key={w.country} value={w.country.toLowerCase()} className="flex-1">
                                {getCountryName(w.country)}
                              </TabsTrigger>
                            ))}
                          </>
                        ) : (
                          <>
                            {europeWarehouses.filter(w => w.country === "France").map(w => (
                              <TabsTrigger key={w.country} value={w.country.toLowerCase()} className="flex-1">
                                {getCountryName(w.country)}
                              </TabsTrigger>
                            ))}
                            {europeWarehouses.filter(w => w.country === "Spain").map(w => (
                              <TabsTrigger key={w.country} value={w.country.toLowerCase()} className="flex-1">
                                {getCountryName(w.country)}
                              </TabsTrigger>
                            ))}
                          </>
                        )}
                      </TabsList>
                      {europeWarehouses.map(w => (
                        <TabsContent key={w.country} value={w.country.toLowerCase()}>
                          <WarehouseCard warehouse={w} getFullName={getFullName} getCountryName={getCountryName} isRTL={isRTL} />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>
                )}
                {usaWarehouse && (
                  <TabsContent value="usa">
                    <WarehouseCard warehouse={usaWarehouse} getFullName={getFullName} getCountryName={getCountryName} isRTL={isRTL} />
                  </TabsContent>
                )}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// WarehouseCard component
function WarehouseCard({ warehouse, getFullName, getCountryName, isRTL }: { warehouse: any, getFullName: () => string, getCountryName: (country: string) => string, isRTL: boolean }) {
  const { t } = useTranslations()
  
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <User className="w-3 h-3 text-gray-600" />
          <div>
            <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : ''}`}>{t('dashboard.warehouseAddresses.accountHolder', 'Titulaire du Compte')}</p>
            <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>{getFullName()}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-2 space-y-1">
          <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : ''}`}>shipit.ma {warehouse.name}</p>
          <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>{warehouse.address_line}</p>
          <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>{warehouse.city}{warehouse.state ? `, ${warehouse.state}` : ""} {warehouse.zip}</p>
          <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>{getCountryName(warehouse.country)}</p>
        </div>
        <div className={`border-t border-gray-200 pt-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Phone className="w-3 h-3 text-gray-600" />
          <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : ''}`} dir="ltr">{warehouse.phone}</p>
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
        <p className={`text-sm text-yellow-800 ${isRTL ? 'text-right' : ''}`}>
          <strong>{t('dashboard.warehouseAddresses.important', 'Important:')}</strong> {t('dashboard.warehouseAddresses.includeFullName', 'Assurez-vous toujours d\'inclure votre nom complet comme destinataire.')}
        </p>
      </div>
    </div>
  )
}
