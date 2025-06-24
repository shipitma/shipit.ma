# PostHog Analytics Setup

This project uses PostHog for analytics tracking. Here's how it's configured:

## Environment Variables

Add these to your `.env.local` or `.env.development` file:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_HQT8RD8KjQo9DvYake4f9xXBQCWIJFvoPxJmP1y8Rz6
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Features

### Automatic Tracking
- Page views are automatically captured
- User identification when logged in
- Session recording (disabled in development)

### Custom Events Tracked

#### Authentication Events
- `login_otp_sent` - When OTP is sent for login
- `login_validation_error` - Login form validation errors
- `registration_otp_sent` - When OTP is sent for registration
- `registration_existing_user` - When existing user tries to register
- `registration_validation_error` - Registration form validation errors
- `otp_verification_success_new_user` - Successful OTP verification for new users
- `otp_verification_success_existing_user` - Successful OTP verification for existing users
- `otp_verification_failed` - Failed OTP verification
- `registration_completed_successfully` - Successful user registration
- `registration_completion_validation_error` - Registration completion validation errors

#### Dashboard Events
- `dashboard_action_click` - When users click dashboard actions
- `view_colis_attendus` - View expected packages
- `view_en_entrepot` - View warehouse packages
- `view_envoyes` - View shipped packages
- `view_achat_assiste` - View purchase assistance

#### Error Tracking
- `error` - General error tracking with error messages

## Usage

### In Components

```typescript
import { useAnalytics } from '@/hooks/use-analytics'

export function MyComponent() {
  const { trackEvent, trackUserAction, trackError } = useAnalytics()

  const handleClick = () => {
    trackUserAction('button_clicked', { button_name: 'submit' })
  }

  const handleError = (error: string) => {
    trackError('api_error', { endpoint: '/api/data' })
  }
}
```

### Direct PostHog Usage

```typescript
import { posthog } from '@/lib/posthog'

// Track custom event
posthog.capture('custom_event', { property: 'value' })

// Set user properties
posthog.people.set({ plan: 'premium' })
```

## Configuration

The PostHog configuration is in `lib/posthog.ts` and includes:

- Automatic page view tracking
- User identification on login
- Debug mode in development
- Session recording (disabled in development)

## Privacy

- User data is anonymized where possible
- Sensitive information (phone numbers) are hashed
- Session recording can be disabled per environment 