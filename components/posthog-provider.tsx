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
    // Suppress PostHog web vitals warnings
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('[PostHog.js] [Web Vitals]')) {
        return // Suppress PostHog web vitals warnings
      }
      originalWarn.apply(console, args)
    }

    return () => {
      console.warn = originalWarn
    }
  }, [])

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