"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { isTokenExpired } from "@/lib/auth"

interface DashboardStats {
  expected_packages: number
  warehouse_packages: number
  shipped_packages: number
  purchase_assistance: number
}

export function useDashboardStats() {
  const { sessionId, accessToken, dashboardStats } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    expected_packages: 0,
    warehouse_packages: 0,
    shipped_packages: 0,
    purchase_assistance: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use prefetched data if available
    if (dashboardStats) {
      setStats(dashboardStats)
      return
    }

    // Fetch fresh data if no prefetched data
    if (sessionId || accessToken) {
      fetchStats()
    }
  }, [dashboardStats, sessionId, accessToken])

  const fetchStats = async () => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const token = accessToken || sessionId
      if (!token) {
        throw new Error("No authentication token available")
      }

      // Check if token is about to expire and refresh if needed
      if (accessToken && await isTokenExpired(accessToken)) {
        // This will trigger a refresh in the auth context
        // For now, we'll continue with the current token and let the API handle the 401
      }

      const response = await fetch("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error - this will be handled by the auth context
          throw new Error("Authentication required")
        }
        const errorText = await response.text()
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}
