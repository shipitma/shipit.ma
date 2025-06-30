"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { isTokenExpired } from "@/lib/auth"

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

// Utility functions for token storage
const setToken = (key: string, value: string) => {
  localStorage.setItem(key, value)
  // Also set in cookies for middleware access
  document.cookie = `${key}=${value}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
}

const getToken = (key: string): string | null => {
  return localStorage.getItem(key)
}

const removeToken = (key: string) => {
  localStorage.removeItem(key)
  // Also remove from cookies
  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
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
        console.log("Session expired, attempting token refresh...")
        // Try to refresh token if we have a refresh token
        const refreshToken = getToken("refreshToken")
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken)
          if (refreshed) {
            console.log("Token refreshed successfully, retrying user fetch...")
            return await fetchUser(refreshed.accessToken)
          }
        }
        // Clear invalid tokens
        console.log("Token refresh failed, clearing authentication...")
        removeToken("authToken")
        removeToken("accessToken")
        removeToken("refreshToken")
        setUser(null)
        setSessionId(null)
        setAccessToken(null)
        return false
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      removeToken("authToken")
      removeToken("accessToken")
      removeToken("refreshToken")
      setUser(null)
      setSessionId(null)
      setAccessToken(null)
      return false
    }
    return false
  }

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      console.log("Attempting to refresh access token...")
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Token refresh successful")
        setToken("accessToken", data.accessToken)
        setToken("authToken", data.sessionId)
        setAccessToken(data.accessToken)
        setSessionId(data.sessionId)
        return data
      } else {
        console.error("Token refresh failed with status:", response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error("Token refresh error details:", errorData)
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

      // Check if token is about to expire and refresh if needed
      if (accessToken && await isTokenExpired(accessToken)) {
        console.log("Token is about to expire, refreshing...")
        const refreshToken = getToken("refreshToken")
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken)
          if (refreshed) {
            // Use the new token for the API call
            const response = await fetch("/api/dashboard/stats", {
              headers: { Authorization: `Bearer ${refreshed.accessToken}` },
            })

            if (response.ok) {
              const data = await response.json()
              setDashboardStats(data)
            }
            return
          }
        }
      }

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
      const storedAccessToken = getToken("accessToken")
      if (storedAccessToken) {
        const success = await fetchUser(storedAccessToken)
        if (success) {
          setAccessToken(storedAccessToken)
          setSessionId(getToken("authToken"))
          await prefetchDashboardData()
          setLoading(false)
          return
        }
      }

      // Fallback to session ID
      const storedSessionId = getToken("authToken")
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
    setToken("authToken", newSessionId)
    setSessionId(newSessionId)

    if (newAccessToken) {
      setToken("accessToken", newAccessToken)
      setAccessToken(newAccessToken)
      await fetchUser(newAccessToken)
    } else {
      await fetchUser(newSessionId)
    }

    if (refreshToken) {
      setToken("refreshToken", refreshToken)
    }

    // Prefetch dashboard data immediately after login
    await prefetchDashboardData()
    setLoading(false)
  }

  const logout = async () => {
    try {
      const currentSessionId = sessionId
      if (currentSessionId) {
        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: currentSessionId }),
        })
      }
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      removeToken("authToken")
      removeToken("accessToken")
      removeToken("refreshToken")
      setUser(null)
      setSessionId(null)
      setAccessToken(null)
      setDashboardStats(null)
      // Redirect to login page
      window.location.href = "/login"
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
