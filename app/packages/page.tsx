"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Truck, PackageIcon, MapPin, Clock, DollarSign, Eye, Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/database"
import type { PackageType } from "@/lib/database"

const getStatusColor = (status: string) => {
  switch (status) {
    case "expected":
      return "bg-gray-100 text-gray-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
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

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [packages, setPackages] = useState<PackageType[]>([])
  const [stats, setStats] = useState({
    expected: 0,
    arrived: 0,
    in_transit: 0,
    delivered: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
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

        const [packagesRes, statsRes] = await Promise.all([
          fetch("/api/packages", {
            headers: { Authorization: `Bearer ${sessionId}` },
          }),
          fetch("/api/packages/stats", {
            headers: { Authorization: `Bearer ${sessionId}` },
          }),
        ])

        if (!packagesRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const packagesData = await packagesRes.json()
        const statsData = await statsRes.json()

        // Ensure packages is an array
        setPackages(Array.isArray(packagesData) ? packagesData : [])
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setPackages([])
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex justify-end mb-2">
          <Button size="sm" asChild className="h-7 text-xs">
            <a href="/packages/create">
              <Plus className="w-3 h-3 mr-1" />
              Ajouter Colis
            </a>
          </Button>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Colis</h1>
          <p className="text-xs text-gray-600">Suivez vos colis du Maroc vers la Turquie</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Colis</h1>
          <p className="text-xs text-gray-600">Suivez vos colis du Maroc vers la Turquie</p>
        </div>
        <Button size="sm" asChild className="h-7 text-xs">
          <a href="/packages/create">
            <Plus className="w-3 h-3 mr-1" />
            Ajouter Colis
          </a>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Attendu</p>
                <p className="text-xl font-semibold text-gray-900">{stats.expected}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-100">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Arrivé</p>
                <p className="text-xl font-semibold text-gray-900">{stats.arrived}</p>
              </div>
              <div className="p-2 rounded-md bg-orange-100">
                <PackageIcon className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">En Transit</p>
                <p className="text-xl font-semibold text-gray-900">{stats.in_transit}</p>
              </div>
              <div className="p-2 rounded-md bg-green-100">
                <Truck className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Livré</p>
                <p className="text-xl font-semibold text-gray-900">{stats.delivered}</p>
              </div>
              <div className="p-2 rounded-md bg-purple-100">
                <MapPin className="w-4 h-4 text-purple-600" />
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
            placeholder="Rechercher des colis..."
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
            <SelectItem value="expected" className="text-xs">
              Attendu
            </SelectItem>
            <SelectItem value="arrived" className="text-xs">
              Arrivé
            </SelectItem>
            <SelectItem value="in_transit" className="text-xs">
              En Transit
            </SelectItem>
            <SelectItem value="delivered" className="text-xs">
              Livré
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="border-gray-200 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-sm font-semibold">{pkg.id}</CardTitle>
                </div>
                <Badge className={getStatusColor(pkg.status)} variant="secondary">
                  {pkg.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">Suivi:</span>
                  <span className="font-mono text-xs">{pkg.tracking_number || "N/A"}</span>
                </div>
                {pkg.weight && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Poids:</span>
                    <span className="font-medium">{pkg.weight}</span>
                  </div>
                )}
                {pkg.dimensions && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-500">Dimensions:</span>
                    <span className="font-medium">{pkg.dimensions}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-gray-500">Coût d'Expédition:</span>
                  <span className={pkg.shipping_cost ? "font-semibold" : "text-orange-600 font-medium"}>
                    {pkg.shipping_cost ? formatCurrency(pkg.shipping_cost) : "Pending"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-xs mb-2">Items ({pkg.items?.length || 0})</h4>
                <div className="space-y-1">
                  {pkg.items?.slice(0, 2).map((item, index) => (
                    <p key={index} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                      {item.name}
                    </p>
                  ))}
                  {pkg.items && pkg.items.length > 2 && (
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>+{pkg.items.length - 2}{" "}
                      articles supplémentaires
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" asChild>
                  <a href={`/packages/${pkg.id}`}>
                    <Eye className="w-3 h-3 mr-1" />
                    Voir Détails
                  </a>
                </Button>
                {pkg.status === "arrived" && (
                  <Button size="sm" className="flex-1 h-7 text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Payer Expédition
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
