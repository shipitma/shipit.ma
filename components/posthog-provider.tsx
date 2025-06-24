"use client"

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { posthog } from '@/lib/posthog'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Identify user in PostHog
      posthog.identify(user.id, {
        phoneNumber: user.phone_number,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneVerified: user.phone_verified,
        emailVerified: user.email_verified,
      })
    } else {
      // Reset identification when user logs out
      posthog.reset()
    }
  }, [user])

  return <>{children}</>
} 