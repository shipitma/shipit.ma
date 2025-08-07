"use client"

import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const { user } = useAuth()

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: '2025-05-24',
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
      debug: process.env.NODE_ENV === "development",
    })
  }, [])

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

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}