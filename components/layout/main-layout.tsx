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
import { Package, ShoppingCart, CreditCard, User, LogOut, Home, Plus, HelpCircle, Phone } from "lucide-react"
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

const navigation = [
  { name: "Accueil", href: "/dashboard", icon: Home },
  { name: "Achats", href: "/purchases", icon: ShoppingCart },
  { name: "Colis", href: "/packages", icon: Package },
  { name: "Paiements", href: "/payments", icon: CreditCard },
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
  "/payments": "Paiements",
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
                        className={`group flex gap-x-2 rounded-md p-2 text-xs font-medium ${
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
                <div className="text-xs font-medium leading-5 text-gray-400">Actions Rapides</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {createActions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-orange-600 hover:bg-gray-50 group flex gap-x-2 rounded-md p-2 text-xs font-medium"
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
                        className="group flex gap-x-2 rounded-md p-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600"
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
                          <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-xs font-medium">{getFullName()}</p>
                          <p className="text-xs text-gray-500">{getPhoneNumber()}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-medium leading-none">{getFullName()}</p>
                        <p className="text-xs leading-none text-gray-500">{getPhoneNumber()}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/profile")} className="text-xs">
                      <User className="mr-2 h-3 w-3" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs" disabled={logoutLoading}>
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
              className={`flex flex-col items-center justify-center p-2 text-xs ${
                isActive(item.href) ? "text-orange-600" : "text-gray-500"
              }`}
            >
              <item.icon className="h-4 w-4 mb-1" />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="bg-white lg:rounded-tl-2xl lg:min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex h-14 items-center justify-between bg-transparent px-6">
            <div>{generateBreadcrumbs()}</div>
            <div className="flex items-center space-x-3">
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-8 px-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-xs font-medium">{getFullName()}</p>
                      <p className="text-xs text-gray-500">{getPhoneNumber()}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium leading-none">{getFullName()}</p>
                      <p className="text-xs leading-none text-gray-500">{getPhoneNumber()}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="text-xs">
                    <User className="mr-2 h-3 w-3" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-xs" disabled={logoutLoading}>
                    <LogOut className="mr-2 h-3 w-3" />
                    <span>{logoutLoading ? "Déconnexion..." : "Se Déconnecter"}</span>
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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium leading-none">{getFullName()}</p>
                      <p className="text-xs leading-none text-gray-500">{getPhoneNumber()}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="text-xs">
                    <User className="mr-2 h-3 w-3" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs" disabled={logoutLoading}>
                    <LogOut className="mr-2 h-3 w-3" />
                      <span>{logoutLoading ? "Déconnexion..." : "Se Déconnecter"}</span>
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
