"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useTranslations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{t('profile.title', 'Paramètres du Profil')}</h1>
        <p className="text-sm text-gray-600">{t('profile.subtitle', 'Gérez vos informations personnelles et votre adresse de livraison')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              {t('profile.personalInfo.title', 'Informations Personnelles')}
            </CardTitle>
            <CardDescription>
              {t('profile.personalInfo.subtitle', 'Gérez vos informations de base')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{t('profile.personalInfo.firstName', 'Prénom')} & {t('profile.personalInfo.lastName', 'Nom')}</p>
                  <p className="text-xs text-gray-500">{user?.first_name} {user?.last_name}</p>
                </div>
              </div>
              {user?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.personalInfo.email', 'Email')}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{t('profile.personalInfo.phone', 'Téléphone')}</p>
                  <p className="text-xs text-gray-500" dir="ltr">{user?.phone_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              {t('profile.shippingAddress.title', 'Adresse d\'Expédition')}
            </CardTitle>
            <CardDescription>
              {t('profile.shippingAddress.subtitle', 'Votre adresse de livraison au Maroc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {user?.address_line && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.shippingAddress.addressLine', 'Adresse')}</p>
                    <p className="text-xs text-gray-500">{user.address_line}</p>
                  </div>
                </div>
              )}
              {(user?.city || user?.state || user?.zip) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.shippingAddress.city', 'Ville')}, {t('profile.shippingAddress.state', 'Région/État')}, {t('profile.shippingAddress.zip', 'Code Postal')}</p>
                    <p className="text-xs text-gray-500">
                      {[user.city, user.state, user.zip].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
              {user?.country && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.shippingAddress.country', 'Pays')}</p>
                    <p className="text-xs text-gray-500">{user.country}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
