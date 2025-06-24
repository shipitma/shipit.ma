import { useCallback } from 'react'
import { posthog } from '@/lib/posthog'
import { ANALYTICS_EVENTS } from '@/lib/analytics-events'
import type {
  AuthEventProperties,
  DashboardEventProperties,
  PackageEventProperties,
  PurchaseEventProperties,
  PaymentEventProperties,
  ProfileEventProperties,
  NavigationEventProperties,
  SearchEventProperties,
  FileEventProperties,
  NotificationEventProperties,
  ErrorEventProperties,
  PerformanceEventProperties,
  BusinessEventProperties,
  FeatureEventProperties,
} from '@/lib/analytics-events'

export function useAnalytics() {
  // Generic event tracking
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties)
  }, [])

  // Page view tracking
  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    posthog.capture('$pageview', {
      page_name: pageName,
      ...properties
    })
  }, [])

  // Authentication events
  const trackAuth = useCallback((event: keyof typeof ANALYTICS_EVENTS.AUTH, properties?: AuthEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.AUTH[event], properties)
  }, [])

  // Dashboard events
  const trackDashboard = useCallback((event: keyof typeof ANALYTICS_EVENTS.DASHBOARD, properties?: DashboardEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.DASHBOARD[event], properties)
  }, [])

  // Package events
  const trackPackage = useCallback((event: keyof typeof ANALYTICS_EVENTS.PACKAGES, properties?: PackageEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.PACKAGES[event], properties)
  }, [])

  // Purchase events
  const trackPurchase = useCallback((event: keyof typeof ANALYTICS_EVENTS.PURCHASES, properties?: PurchaseEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.PURCHASES[event], properties)
  }, [])

  // Payment events
  const trackPayment = useCallback((event: keyof typeof ANALYTICS_EVENTS.PAYMENTS, properties?: PaymentEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.PAYMENTS[event], properties)
  }, [])

  // Profile events
  const trackProfile = useCallback((event: keyof typeof ANALYTICS_EVENTS.PROFILE, properties?: ProfileEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.PROFILE[event], properties)
  }, [])

  // Navigation events
  const trackNavigation = useCallback((event: keyof typeof ANALYTICS_EVENTS.NAVIGATION, properties?: NavigationEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.NAVIGATION[event], properties)
  }, [])

  // Search events
  const trackSearch = useCallback((event: keyof typeof ANALYTICS_EVENTS.SEARCH, properties?: SearchEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.SEARCH[event], properties)
  }, [])

  // File events
  const trackFile = useCallback((event: keyof typeof ANALYTICS_EVENTS.FILES, properties?: FileEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.FILES[event], properties)
  }, [])

  // Notification events
  const trackNotification = useCallback((event: keyof typeof ANALYTICS_EVENTS.NOTIFICATIONS, properties?: NotificationEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.NOTIFICATIONS[event], properties)
  }, [])

  // Error events
  const trackError = useCallback((event: keyof typeof ANALYTICS_EVENTS.ERRORS, properties?: ErrorEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.ERRORS[event], properties)
  }, [])

  // Performance events
  const trackPerformance = useCallback((event: keyof typeof ANALYTICS_EVENTS.PERFORMANCE, properties?: PerformanceEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.PERFORMANCE[event], properties)
  }, [])

  // Business events
  const trackBusiness = useCallback((event: keyof typeof ANALYTICS_EVENTS.BUSINESS, properties?: BusinessEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.BUSINESS[event], properties)
  }, [])

  // Feature events
  const trackFeature = useCallback((event: keyof typeof ANALYTICS_EVENTS.FEATURES, properties?: FeatureEventProperties) => {
    posthog.capture(ANALYTICS_EVENTS.FEATURES[event], properties)
  }, [])

  // Legacy methods for backward compatibility
  const trackUserAction = useCallback((action: string, properties?: Record<string, any>) => {
    posthog.capture('user_action', {
      action,
      ...properties
    })
  }, [])

  // Utility methods
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    posthog.people.set(properties)
  }, [])

  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties)
  }, [])

  const resetUser = useCallback(() => {
    posthog.reset()
  }, [])

  return {
    // Generic tracking
    trackEvent,
    trackPageView,
    
    // Specific event tracking
    trackAuth,
    trackDashboard,
    trackPackage,
    trackPurchase,
    trackPayment,
    trackProfile,
    trackNavigation,
    trackSearch,
    trackFile,
    trackNotification,
    trackError,
    trackPerformance,
    trackBusiness,
    trackFeature,
    
    // Legacy methods
    trackUserAction,
    
    // User management
    setUserProperties,
    identifyUser,
    resetUser,
    
    // Direct PostHog access
    posthog,
  }
} 