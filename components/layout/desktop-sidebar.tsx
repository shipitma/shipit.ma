"use client"

import { FC } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Package, ShoppingCart, User, LogOut, Home, Plus, HelpCircle, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from '@/lib/context/language-context'
import { useRouter } from "next/navigation"

interface DesktopSidebarProps {
  isActive: (href: string) => boolean
  handleLogout: () => Promise<void>
  logoutLoading: boolean
  getUserInitials: () => string
  getFullName: () => string
  getPhoneNumber: () => string
}

export const DesktopSidebar: FC<DesktopSidebarProps> = ({
  isActive,
  handleLogout,
  logoutLoading,
  getUserInitials,
  getFullName,
  getPhoneNumber
}) => {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const router = useRouter()
  
  const navigation = [
    { name: t('mainLayout.navigation.home', 'Accueil'), href: "/dashboard", icon: Home },
    { name: t('mainLayout.navigation.purchases', 'Achats'), href: "/purchases", icon: ShoppingCart },
    { name: t('mainLayout.navigation.packages', 'Colis'), href: "/packages", icon: Package },
  ]

  const createActions = [
    { name: t('mainLayout.actions.newPurchaseRequest', 'Nouvelle Demande d\'Achat'), href: "/purchases/create", icon: ShoppingCart },
    { name: t('mainLayout.actions.addPackage', 'Ajouter un Colis'), href: "/packages/create", icon: Package },
  ]

  const supportLinks = [
    { name: t('mainLayout.support.support', 'Support'), href: "/help", icon: HelpCircle },
    { name: t('mainLayout.support.contact', 'Contact'), href: "/contact", icon: Phone },
  ]

  return (
    <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
      <div className="flex grow flex-col gap-y-4 overflow-y-auto bg-[#fafafa] px-4 pb-4">
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Shipit Logo" className="w-12 h-12" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-5">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`group flex gap-x-2 rounded-md p-2 text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* Create Actions */}
            <li>
              <div className="text-sm font-medium leading-5 text-gray-400">{t('mainLayout.quickActions', 'Actions Rapides')}</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {createActions.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-700 hover:text-orange-600 hover:bg-gray-50 group flex gap-x-2 rounded-md p-2 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>



            {/* Support Links */}
            <li className="mt-auto">
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {supportLinks.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="group flex gap-x-2 rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* User Profile */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="text-sm">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-sm font-medium">{getFullName()}</p>
                        <p className="text-sm text-gray-500" dir="ltr">{getPhoneNumber()}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getFullName()}</p>
                      <p className="text-sm leading-none text-gray-500" dir="ltr">{getPhoneNumber()}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="text-sm">
                    <User className="h-3 w-3" />
                    <span>{t('mainLayout.user.profile', 'Profil')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-sm" disabled={logoutLoading}>
                    <LogOut className="h-3 w-3" />
                    <span>{logoutLoading ? t('mainLayout.user.logoutLoading', 'Déconnexion...') : t('mainLayout.user.logout', 'Se Déconnecter')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 