import posthog from 'posthog-js'

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(
    process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_HQT8RD8KjQo9DvYake4f9xXBQCWIJFvoPxJmP1y8Rz6',
    {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      // Capture page views automatically
      capture_pageview: true,
      // Capture clicks automatically
      capture_pageleave: true,
      // Disable in development if needed
      disable_session_recording: process.env.NODE_ENV === 'development',
    }
  )
}

export { posthog } 