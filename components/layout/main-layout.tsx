"use client"

import type { FC, ReactNode } from "react"
import React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from '@/lib/context/language-context'
import { DesktopSidebar } from './desktop-sidebar'
import { MobileNavigation } from './mobile-navigation'
import { MobileHeader } from './mobile-header'
import { DesktopHeader } from './desktop-header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Home } from "lucide-react"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const handleLogout = async () => {
    if (logoutLoading) return // Prevent multiple clicks
    
    setLogoutLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
      setLogoutLoading(false)
    }
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Get user initials for avatar with fallback
  const getUserInitials = () => {
    if (!user) return "U"
    const firstInitial = user.first_name?.charAt(0) || ""
    const lastInitial = user.last_name?.charAt(0) || ""
    return (firstInitial + lastInitial).toUpperCase() || "U"
  }

  const getFullName = () => {
    if (!user) return t('mainLayout.user.loading', 'Chargement...')
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || t('mainLayout.user.user', 'Utilisateur')
  }

  const getPhoneNumber = () => {
    return user?.phone_number || t('mainLayout.user.loading', 'Chargement...')
  }

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment)
    if (pathSegments.length === 0) return null

    const breadcrumbNameMap: { [key: string]: string } = {
          "/dashboard": t('mainLayout.breadcrumbs.dashboard', 'Tableau de Bord'),
    "/packages": t('mainLayout.breadcrumbs.packages', 'Colis'),
    "/purchases": t('mainLayout.breadcrumbs.purchases', 'Achats'),
    "/profile": t('mainLayout.breadcrumbs.profile', 'Profil'),
    "/create": t('mainLayout.breadcrumbs.create', 'Créer'),
    "/purchases/create": t('mainLayout.actions.newPurchaseRequest', 'Nouvelle Demande d\'Achat'),
    "/packages/create": t('mainLayout.actions.addPackage', 'Ajouter un Colis'),
    }

    let currentPath = ""
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            currentPath += `/${segment}`
            const isLast = index === pathSegments.length - 1
            const name = breadcrumbNameMap[currentPath] || 
                      (segment === 'create' ? t('mainLayout.breadcrumbs.create', 'Créer') :
        segment === 'id' ? t('mainLayout.breadcrumbs.details', 'Détails') :
               segment.charAt(0).toUpperCase() + segment.slice(1))
            // Check if currentPath is a valid link, otherwise don't make it a link.
            const isLink = Object.keys(breadcrumbNameMap).includes(currentPath) || /\[id\]/.test(currentPath) === false

            return (
              <React.Fragment key={currentPath}>
                <BreadcrumbSeparator isRTL={isRTL} />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-sm">{name}</BreadcrumbPage>
                  ) : isLink ? (
                    <BreadcrumbLink href={currentPath} className="text-sm">
                      {name}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-sm">{name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <DesktopSidebar
        isActive={isActive}
        handleLogout={handleLogout}
        logoutLoading={logoutLoading}
        getUserInitials={getUserInitials}
        getFullName={getFullName}
        getPhoneNumber={getPhoneNumber}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation isActive={isActive} />

      {/* Main content */}
      <div className={isRTL ? "lg:pr-72" : "lg:pl-72"}>
        <div className={`bg-white lg:min-h-screen ${isRTL ? 'lg:rounded-tr-2xl' : 'lg:rounded-tl-2xl'}`}>
          {/* Desktop Header */}
          <DesktopHeader generateBreadcrumbs={generateBreadcrumbs} />

          {/* Mobile Header */}
          <MobileHeader />

          {/* Page content */}
          <main className="p-6 pb-20 lg:pb-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
