"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  phone_number: string
  first_name?: string
  last_name?: string
  email?: string
  address_line?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  phone_verified: boolean
  email_verified: boolean
  created_at: string
}

interface DashboardStats {
  expected_packages: number
  warehouse_packages: number
  shipped_packages: number
  purchase_assistance: number
}

interface AuthContextType {
  user: User | null
  sessionId: string | null
  accessToken: string | null
  dashboardStats: DashboardStats | null
  loading: boolean
  login: (sessionId: string, accessToken?: string, refreshToken?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  prefetchDashboardData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("/api/session", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return true
      } else if (response.status === 401) {
        // Try to refresh token if we have a refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken)
          if (refreshed) {
            return await fetchUser(refreshed.accessToken)
          }
        }
        // Clear invalid tokens
        localStorage.removeItem("authToken")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)
        setSessionId(null)
        setAccessToken(null)
        return false
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("authToken")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      setSessionId(null)
      setAccessToken(null)
      return false
    }
    return false
  }

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("authToken", data.sessionId)
        setAccessToken(data.accessToken)
        setSessionId(data.sessionId)
        return data
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
    }
    return null
  }

  const prefetchDashboardData = async () => {
    try {
      const token = accessToken || sessionId
      if (!token) return

      const response = await fetch("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data)
      }
    } catch (error) {
      console.error("Error prefetching dashboard data:", error)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      // Try access token first (Neon Auth)
      const storedAccessToken = localStorage.getItem("accessToken")
      if (storedAccessToken) {
        const success = await fetchUser(storedAccessToken)
        if (success) {
          setAccessToken(storedAccessToken)
          setSessionId(localStorage.getItem("authToken"))
          await prefetchDashboardData()
          setLoading(false)
          return
        }
      }

      // Fallback to session ID
      const storedSessionId = localStorage.getItem("authToken")
      if (storedSessionId) {
        const success = await fetchUser(storedSessionId)
        if (success) {
          setSessionId(storedSessionId)
          await prefetchDashboardData()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (newSessionId: string, newAccessToken?: string, refreshToken?: string) => {
    setLoading(true)
    localStorage.setItem("authToken", newSessionId)
    setSessionId(newSessionId)

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken)
      setAccessToken(newAccessToken)
      await fetchUser(newAccessToken)
    } else {
      await fetchUser(newSessionId)
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }

    // Prefetch dashboard data immediately after login
    await prefetchDashboardData()
    setLoading(false)
  }

  const logout = async () => {
    try {
      const token = accessToken || sessionId
      if (token) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      localStorage.removeItem("authToken")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      setSessionId(null)
      setAccessToken(null)
      setDashboardStats(null)
    }
  }

  const refreshUser = async () => {
    const token = accessToken || sessionId
    if (token) {
      await fetchUser(token)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        accessToken,
        dashboardStats,
        loading,
        login,
        logout,
        refreshUser,
        prefetchDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
