// import posthog from 'posthog-js'

// Export the PostHog client for use in components
// export { posthog }

// Initialize PostHog on the client side
// if (typeof window !== 'undefined') {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
//     api_host: "/ingest",
//     ui_host: "https://eu.posthog.com",
//     defaults: '2025-05-24',
//     capture_exceptions: true,
//     debug: process.env.NODE_ENV === "development",
//   })
// }

// Create a dummy posthog object to prevent errors
export const posthog = {
  init: () => {},
  identify: () => {},
  reset: () => {},
  capture: () => {},
  set: () => {},
  get: () => null,
  isFeatureEnabled: () => false,
  onFeatureFlags: () => {},
  reloadFeatureFlags: () => {},
  getFeatureFlag: () => null,
  getFeatureFlagPayload: () => null,
  group: () => {},
  alias: () => {},
  register: () => {},
  unregister: () => {},
  opt_in_capturing: () => {},
  opt_out_capturing: () => {},
  has_opted_out_capturing: () => false,
  has_opted_in_capturing: () => false,
  clear_opt_in_out_capturing: () => {},
  people: {
    set: () => {},
    set_once: () => {},
    increment: () => {},
    append: () => {},
    remove: () => {},
  },
}