import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export function useAuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return

    // If user is authenticated, redirect to dashboard
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  return { user, loading }
} 