"use client"

import type { FC, ReactNode } from "react"
import React from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { Package, ShoppingCart, CreditCard, User, LogOut, Home, Plus, HelpCircle, Phone, MessageCircle, ChevronDown } from "lucide-react"
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
import { Input } from "@/components/ui/input"

const navigation = [
  { name: "Accueil", href: "/dashboard", icon: Home },
  { name: "Achats", href: "/purchases", icon: ShoppingCart },
  { name: "Colis", href: "/packages", icon: Package },
]

const createActions = [
  { name: "Nouvelle Demande d'Achat", href: "/purchases/create", icon: ShoppingCart },
  { name: "Ajouter un Colis", href: "/packages/create", icon: Package },
]

const supportLinks = [
  { name: "Support", href: "/help", icon: HelpCircle },
  { name: "Contact", href: "/contact", icon: Phone },
]

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "Tableau de Bord",
  "/packages": "Colis",
  "/purchases": "Achats",
  "/profile": "Profil",
  "/create": "Créer",
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Chargement...</p>
        </div>
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
    if (!user) return "Chargement..."
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Utilisateur"
  }

  const getPhoneNumber = () => {
    return user?.phone_number || "Chargement..."
  }

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment)
    if (pathSegments.length === 0) return null

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
            const name = breadcrumbNameMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
            // Check if currentPath is a valid link, otherwise don't make it a link.
            const isLink = Object.keys(breadcrumbNameMap).includes(currentPath) || /\[id\]/.test(currentPath) === false

            return (
              <React.Fragment key={currentPath}>
                <BreadcrumbSeparator />
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
    <div className="min-h-screen bg-[#fafafa]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-4 overflow-y-auto bg-[#fafafa] px-4 pb-4">
          {/* Logo */}
          <div className="flex h-14 shrink-0 items-center">
            <div className="flex items-center">
              <img src="https://placehold.co/32x32/f97316/ffffff?text=shipit.ma" alt="Logo" className="w-8 h-8" />
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
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Create Actions */}
              <li>
                <div className="text-sm font-medium leading-5 text-gray-400">Actions Rapides</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {createActions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-orange-600 hover:bg-gray-50 group flex gap-x-2 rounded-md p-2 text-sm font-medium"
                      >
                        <Plus className="h-4 w-4 shrink-0" />
                        {item.name}
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
                        {item.name}
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
                        <div className="text-left">
                          <p className="text-sm font-medium">{getFullName()}</p>
                          <p className="text-sm text-gray-500">{getPhoneNumber()}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getFullName()}</p>
                        <p className="text-sm leading-none text-gray-500">{getPhoneNumber()}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="text-sm">
                      <User className="mr-2 h-3 w-3" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-sm" disabled={logoutLoading}>
                      <LogOut className="mr-2 h-3 w-3" />
                      <span>{logoutLoading ? "Déconnexion..." : "Se Déconnecter"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
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
            <span className="truncate">Profil</span>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="bg-white lg:rounded-tl-2xl lg:min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex h-14 items-center justify-between bg-transparent px-6">
            <div>{generateBreadcrumbs()}</div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 h-8 px-2 text-red-600 font-semibold underline underline-offset-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Besoin d'aide&nbsp;?</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <a href="tel:0522300900" className="flex items-center gap-2 py-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span>J'appelle au <span className="font-semibold">0522 300 900</span></span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://wa.me/212522300900" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-green-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.318h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.897 9.891zm8.413-18.306A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.088c0 2.13.557 4.21 1.615 6.032L0 24l6.063-1.591a11.876 11.876 0 0 0 5.987 1.527h.005c6.554 0 11.989-5.435 11.991-12.088a11.86 11.86 0 0 0-3.497-8.594z"/></svg></span>
                      <span>Je prends contact sur Whatsapp</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/help" className="flex items-center gap-2 py-2">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                      <span>Je consulte la page d'aide</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        {/* Top header for mobile */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#fafafa] shadow-sm border-b">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <img src="https://placehold.co/32x32/f97316/ffffff?text=shipit.ma" alt="Logo" className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 h-8 px-2 text-red-600 font-semibold underline underline-offset-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Besoin d'aide&nbsp;?</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <a href="tel:0522300900" className="flex items-center gap-2 py-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span>J'appelle au <span className="font-semibold">0522 300 900</span></span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://wa.me/212522300900" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-green-500"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.318h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.897 9.891zm8.413-18.306A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.088c0 2.13.557 4.21 1.615 6.032L0 24l6.063-1.591a11.876 11.876 0 0 0 5.987 1.527h.005c6.554 0 11.989-5.435 11.991-12.088a11.86 11.86 0 0 0-3.497-8.594z"/></svg></span>
                      <span>Je prends contact sur Whatsapp</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/help" className="flex items-center gap-2 py-2">
                      <HelpCircle className="h-5 w-5 text-gray-500" />
                      <span>Je consulte la page d'aide</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
          <main className="p-6 pb-20 lg:pb-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
