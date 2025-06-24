# Analytics Events Guide

This guide explains how to use the structured analytics events in the shipit.ma application.

## Overview

The application uses a structured analytics system with predefined events and type-safe properties. This ensures consistency and makes it easy to track user behavior across the application.

## Event Categories

### 1. Authentication Events (`trackAuth`)

Track user authentication and registration flows:

```typescript
import { useAnalytics } from '@/hooks/use-analytics'

const { trackAuth } = useAnalytics()

// Login events
trackAuth('LOGIN_OTP_SENT', { phoneNumber: '+212612345678' })
trackAuth('LOGIN_VALIDATION_ERROR', { missing_fields: ['phoneNumber'] })
trackAuth('LOGIN_SUCCESS', { userId: 'user123' })

// Registration events
trackAuth('REGISTRATION_STARTED', { phoneNumber: '+212612345678' })
trackAuth('REGISTRATION_OTP_SENT', { phoneNumber: '+212612345678' })
trackAuth('REGISTRATION_EXISTING_USER', { phoneNumber: '+212612345678' })
trackAuth('REGISTRATION_COMPLETED', { 
  phoneNumber: '+212612345678',
  hasEmail: true,
  country: 'Morocco'
})

// OTP events
trackAuth('OTP_VERIFICATION_SUCCESS_NEW_USER', { phoneNumber: '+212612345678' })
trackAuth('OTP_VERIFICATION_SUCCESS_EXISTING_USER', { phoneNumber: '+212612345678' })
trackAuth('OTP_VERIFICATION_FAILED', { phoneNumber: '+212612345678' })
```

### 2. Dashboard Events (`trackDashboard`)

Track dashboard interactions:

```typescript
const { trackDashboard } = useAnalytics()

// Page views
trackDashboard('PAGE_VIEW', {
  user_id: 'user123',
  has_stats: true,
  total_packages: 15
})

// Action clicks
trackDashboard('ACTION_CLICK', { action: 'new_purchase_request' })
trackDashboard('ACTION_CLICK', { action: 'add_package' })

// Stats card clicks
trackDashboard('STATS_CARD_CLICK', { stats_card: 'expected_packages' })
```

### 3. Package Events (`trackPackage`)

Track package management activities:

```typescript
const { trackPackage } = useAnalytics()

// Package creation
trackPackage('CREATE_PACKAGE', { 
  weight: 2.5,
  dimensions: '30x20x15cm'
})
trackPackage('CREATE_PACKAGE_SUCCESS', { packageId: 'pkg123' })

// Package viewing
trackPackage('VIEW_PACKAGE_DETAILS', { packageId: 'pkg123' })

// Package updates
trackPackage('UPDATE_PACKAGE', { packageId: 'pkg123', status: 'shipped' })

// Package filtering and search
trackPackage('PACKAGE_FILTER', { filter_type: 'status', status: 'pending' })
trackPackage('PACKAGE_SEARCH', { search_query: 'tracking123' })
```

### 4. Purchase Events (`trackPurchase`)

Track purchase request activities:

```typescript
const { trackPurchase } = useAnalytics()

// Purchase creation
trackPurchase('CREATE_PURCHASE_REQUEST', { 
  amount: 150.00,
  currency: 'EUR',
  items_count: 3
})
trackPurchase('CREATE_PURCHASE_REQUEST_SUCCESS', { purchaseId: 'pur123' })

// Purchase viewing
trackPurchase('VIEW_PURCHASE_DETAILS', { purchaseId: 'pur123' })

// Purchase updates
trackPurchase('UPDATE_PURCHASE_REQUEST', { 
  purchaseId: 'pur123', 
  status: 'approved' 
})
```

### 5. Payment Events (`trackPayment`)

Track payment activities:

```typescript
const { trackPayment } = useAnalytics()

// Payment creation
trackPayment('CREATE_PAYMENT', { 
  amount: 50.00,
  currency: 'EUR',
  payment_method: 'card'
})
trackPayment('CREATE_PAYMENT_SUCCESS', { paymentId: 'pay123' })

// Payment viewing
trackPayment('VIEW_PAYMENT_DETAILS', { paymentId: 'pay123' })

// Payment method selection
trackPayment('PAYMENT_METHOD_SELECTED', { payment_method: 'bank_transfer' })
```

### 6. Error Events (`trackError`)

Track application errors:

```typescript
const { trackError } = useAnalytics()

// API errors
trackError('API_ERROR', { 
  error_message: 'Network timeout',
  endpoint: '/api/packages',
  error_code: 'TIMEOUT'
})

// Validation errors
trackError('VALIDATION_ERROR', { 
  error_message: 'Invalid email format',
  field: 'email'
})

// Authentication errors
trackError('AUTHENTICATION_ERROR', { 
  error_message: 'Session expired',
  user_id: 'user123'
})
```

### 7. Navigation Events (`trackNavigation`)

Track user navigation:

```typescript
const { trackNavigation } = useAnalytics()

// Sidebar navigation
trackNavigation('SIDEBAR_NAVIGATION', { 
  from_page: 'dashboard',
  to_page: 'packages'
})

// Mobile menu
trackNavigation('MOBILE_MENU_OPEN', {})
trackNavigation('MOBILE_MENU_CLOSE', {})

// Breadcrumb navigation
trackNavigation('BREADCRUMB_NAVIGATION', { 
  from_page: 'packages',
  to_page: 'package_details'
})
```

### 8. Search Events (`trackSearch`)

Track search and filtering:

```typescript
const { trackSearch } = useAnalytics()

// Search performed
trackSearch('SEARCH_PERFORMED', { 
  query: 'tracking number',
  search_type: 'packages'
})

// Filter applied
trackSearch('FILTER_APPLIED', { 
  filter_applied: 'status',
  filter_value: 'pending'
})

// Sort changed
trackSearch('SORT_CHANGED', { 
  sort_by: 'created_at',
  sort_direction: 'desc'
})
```

## Best Practices

### 1. Use Structured Events

Always use the predefined events instead of custom event names:

```typescript
// ✅ Good
trackAuth('LOGIN_OTP_SENT', { phoneNumber: '+212612345678' })

// ❌ Bad
trackEvent('login_otp_sent', { phoneNumber: '+212612345678' })
```

### 2. Include Relevant Properties

Add meaningful properties to events for better analysis:

```typescript
// ✅ Good - includes context
trackPackage('CREATE_PACKAGE_SUCCESS', { 
  packageId: 'pkg123',
  weight: 2.5,
  dimensions: '30x20x15cm'
})

// ❌ Bad - missing context
trackPackage('CREATE_PACKAGE_SUCCESS', {})
```

### 3. Handle Errors Properly

Always track errors with sufficient context:

```typescript
try {
  const response = await fetch('/api/packages', { method: 'POST' })
  if (!response.ok) {
    throw new Error('Failed to create package')
  }
  trackPackage('CREATE_PACKAGE_SUCCESS', { packageId: data.id })
} catch (error) {
  trackError('API_ERROR', { 
    error_message: error.message,
    endpoint: '/api/packages'
  })
}
```

### 4. Track User Actions

Track important user interactions:

```typescript
const handleButtonClick = () => {
  trackDashboard('ACTION_CLICK', { action: 'new_purchase_request' })
  // Perform action...
}

const handleFormSubmit = () => {
  trackPackage('CREATE_PACKAGE', { weight: formData.weight })
  // Submit form...
}
```

## Event Properties Reference

### AuthEventProperties
- `phoneNumber?: string` - User's phone number
- `userId?: string` - User ID
- `error?: string` - Error message
- `missing_fields?: string[]` - Missing form fields
- `hasEmail?: boolean` - Whether user provided email
- `country?: string` - User's country
- `otp_length?: number` - OTP code length

### DashboardEventProperties
- `user_id?: string` - User ID
- `has_stats?: boolean` - Whether stats are available
- `total_packages?: number` - Total package count
- `action?: string` - Action performed
- `stats_card?: string` - Stats card clicked

### PackageEventProperties
- `packageId?: string` - Package ID
- `status?: string` - Package status
- `weight?: number` - Package weight
- `dimensions?: string` - Package dimensions
- `trackingNumber?: string` - Tracking number
- `error?: string` - Error message
- `filter_type?: string` - Filter type
- `search_query?: string` - Search query

### PurchaseEventProperties
- `purchaseId?: string` - Purchase ID
- `status?: string` - Purchase status
- `amount?: number` - Purchase amount
- `currency?: string` - Currency
- `items_count?: number` - Number of items
- `error?: string` - Error message
- `filter_type?: string` - Filter type
- `search_query?: string` - Search query

### PaymentEventProperties
- `paymentId?: string` - Payment ID
- `status?: string` - Payment status
- `amount?: number` - Payment amount
- `currency?: string` - Currency
- `payment_method?: string` - Payment method
- `error?: string` - Error message
- `filter_type?: string` - Filter type
- `search_query?: string` - Search query

### ErrorEventProperties
- `error_message?: string` - Error message
- `error_code?: string` - Error code
- `endpoint?: string` - API endpoint
- `user_agent?: string` - User agent
- `stack_trace?: string` - Stack trace

## Testing Analytics

### Development Mode

In development, PostHog debug mode is enabled. You can see events in:
1. Browser console
2. PostHog dashboard
3. Network tab (PostHog API calls)

### Production Monitoring

In production, monitor:
1. Event volume and frequency
2. Error rates
3. User journey completion rates
4. Feature adoption rates

## Privacy Considerations

- Never track sensitive personal information
- Hash or anonymize phone numbers when possible
- Respect user privacy preferences
- Follow GDPR and local privacy laws
- Use PostHog's data retention settings 