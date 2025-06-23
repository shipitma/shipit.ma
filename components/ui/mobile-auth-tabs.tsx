"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Dynamically import the login and register forms to avoid SSR issues
const LoginForm = dynamic(() => import("@/app/login/page"), { ssr: false })
const RegisterForm = dynamic(() => import("@/app/register/page"), { ssr: false })

function isNativeApp() {
  // Capacitor injects window.Capacitor, Cordova injects window.cordova
  if (typeof window !== "undefined") {
    return !!(window as any).Capacitor || !!(window as any).cordova
  }
  return false
}

export function MobileAuthTabs() {
  const [showTabs, setShowTabs] = React.useState(false)

  React.useEffect(() => {
    setShowTabs(isNativeApp())
  }, [])

  if (!showTabs) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="login">Se connecter</TabsTrigger>
          <TabsTrigger value="register">Créer un compte</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  )
} 