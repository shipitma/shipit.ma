"use client"

import { FC } from "react"
import { Package, ShoppingCart, User } from "lucide-react"
import { useTranslations } from "@/lib/hooks/use-translations"

interface MobileNavigationProps {
  isActive: (href: string) => boolean
}

export const MobileNavigation: FC<MobileNavigationProps> = ({ isActive }) => {
  const { t } = useTranslations()
  
  const navigation = [
    { name: t('mainLayout.navigation.home', 'Accueil'), href: "/dashboard", icon: ShoppingCart },
    { name: t('mainLayout.navigation.purchases', 'Achats'), href: "/purchases", icon: ShoppingCart },
    { name: t('mainLayout.navigation.packages', 'Colis'), href: "/packages", icon: Package },
  ]

  const profileNavigation = { name: t('mainLayout.navigation.profile', 'Profil'), href: "/profile", icon: User }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 text-sm ${
              isActive(item.href) ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <item.icon className="h-4 w-4 mb-1" />
            <span className="truncate">{item.name}</span>
          </a>
        ))}
        <a
          href="/profile"
          className={`flex flex-col items-center justify-center p-2 text-sm ${
            isActive("/profile") ? "text-orange-600" : "text-gray-500"
          }`}
        >
          <User className="h-4 w-4 mb-1" />
          <span className="truncate">{profileNavigation.name}</span>
        </a>
      </div>
    </div>
  )
} 