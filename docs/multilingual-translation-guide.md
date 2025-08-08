# 🌐 Multilingual Translation Guide

This guide explains how to implement and use the multilingual translation system in the Shipit application.

## 📁 Translation File Structure

### Main Translation Files
- `public/messages/en.json` - English translations for main app
- `public/messages/fr.json` - French translations for main app  
- `public/messages/ar.json` - Arabic translations for main app

### Landing Page Translation Files
- `public/messages/landing-en.json` - English translations for landing page
- `public/messages/landing-fr.json` - French translations for landing page
- `public/messages/landing-ar.json` - Arabic translations for landing page

### Translation Loading Strategy
The system automatically loads and merges both main and landing page translations:
1. **Main translations** are loaded first (core app functionality)
2. **Landing page translations** are loaded second and merged
3. **Landing translations override** main translations if there are conflicts
4. **Fallback to English** if current language fails

## 🔧 Core Components

### 1. Language Context (`lib/context/language-context.tsx`)

**Purpose**: Global state management for language and RTL support

**Features**:
- **Language switching** with persistence
- **RTL support** for Arabic
- **Context provider** for app-wide access
- **Local storage** for language preference

**Usage**:
```typescript
import { useLanguage } from '@/lib/context/language-context'

export function MyComponent() {
  const { language, isRTL, setLanguage } = useLanguage()
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={() => setLanguage('fr')}>Français</button>
    </div>
  )
}
```

### 2. Translation Hook (`lib/hooks/use-translations.ts`)

**Purpose**: Client-side translation loading and management

**Features**:
- **Dynamic loading** of both main and landing translation files
- **Automatic merging** of main and landing translations
- **Fallback to English** if translation fails
- **Nested key resolution** (e.g., `t('home.welcomeBack')`)
- **Loading states** with fallback text

**Usage**:
```typescript
import { useTranslations } from '@/lib/hooks/use-translations'

export function MyComponent() {
  const { t, loading, error } = useTranslations()
  
  return (
    <div>
      <h1>{t('home.welcomeBack', 'Welcome back')}</h1>
      <p>{t('common.loading', 'Loading...')}</p>
    </div>
  )
}
```

### 3. Language Selector (`components/ui/LanguageSelector.tsx`)

**Purpose**: UI component for language switching

**Features**:
- **Dropdown menu** with flag icons
- **Current language indicator**
- **Smooth transitions**
- **Accessibility support**

**Usage**:
```typescript
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function Header() {
  return (
    <header>
      <LanguageSelector />
    </header>
  )
}
```

## 🌐 Translation Files Structure

### Main App JSON Structure
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "dashboard": {
    "welcomeBack": "Welcome back",
    "stats": {
      "totalPackages": "Total Packages"
    }
  }
}
```

### Landing Page JSON Structure
```json
{
  "hero": {
    "title": "Your Global Purchases in Morocco",
    "subtitle": "Access the best brands from USA, Turkey, Spain and France",
    "startButton": "Get Started!"
  },
  "landing": {
    "ourServices": {
      "title": "You Buy, We Deliver",
      "step1": {
        "title": "Create Your Account",
        "description": "Join Shipit in a few clicks!"
      }
    }
  }
}
```

### Key Naming Conventions
- **Use nested keys** for organization: `dashboard.stats.totalPackages`
- **Keep keys descriptive**: `auth.signIn` not `si`
- **Group related translations**: All auth-related keys under `auth`
- **Use consistent naming**: `title`, `subtitle`, `description`
- **Landing page keys** are prefixed with `landing.` or `hero.`

## 🎯 Usage Examples

### Basic Translation
```typescript
const { t } = useTranslations()

// Simple key
<h1>{t('home.title', 'Home')}</h1>

// Nested key
<p>{t('dashboard.stats.totalPackages', 'Total Packages')}</p>

// With fallback
<span>{t('user.name', 'User Name')}</span>
```

### Landing Page Translation
```typescript
const { t } = useTranslations()

// Hero section
<h1>{t('hero.title', 'Your Global Purchases in Morocco')}</h1>
<p>{t('hero.subtitle', 'Access the best brands')}</p>

// Landing services
<h2>{t('landing.ourServices.title', 'You Buy, We Deliver')}</h2>
<p>{t('landing.ourServices.step1.title', 'Create Your Account')}</p>
```

### RTL Support
```typescript
const { isRTL } = useLanguage()

return (
  <div dir={isRTL ? 'rtl' : 'ltr'}>
    <h1 className={isRTL ? 'text-right' : 'text-left'}>
      {t('hero.title', 'Title')}
    </h1>
  </div>
)
```

## 🔄 Translation Loading Process

### Client-Side (useTranslations hook)
1. **Load main translations** from `/messages/{language}.json`
2. **Load landing translations** from `/messages/landing-{language}.json`
3. **Merge translations** with landing overriding main if conflicts
4. **Fallback to English** if current language fails
5. **Cache merged translations** for performance

### Server-Side (server-translations.ts)
1. **Load main translations** from file system
2. **Load landing translations** from file system
3. **Merge translations** with same override logic
4. **Cache merged translations** for performance
5. **Provide utility functions** for server-side rendering

## 🚀 Best Practices

### 1. Key Organization
```typescript
// ✅ Good - Organized by feature
t('dashboard.stats.totalPackages')
t('auth.signIn.title')
t('landing.hero.title')

// ❌ Bad - Flat structure
t('totalPackages')
t('signInTitle')
t('heroTitle')
```

### 2. Fallback Values
```typescript
// ✅ Good - Always provide fallback
t('dashboard.welcomeBack', 'Welcome back')

// ❌ Bad - No fallback
t('dashboard.welcomeBack')
```

### 3. RTL Support
```typescript
// ✅ Good - Always consider RTL
<div dir={isRTL ? 'rtl' : 'ltr'}>
  <p className={isRTL ? 'text-right' : 'text-left'}>
    {t('content.text')}
  </p>
</div>
```

### 4. Loading States
```typescript
// ✅ Good - Handle loading state
const { t, loading } = useTranslations()

if (loading) {
  return <div>Loading translations...</div>
}
```

## 🛠️ Adding New Translations

### 1. Main App Translations
Add to the appropriate language file in `public/messages/`:
```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description of the new feature"
  }
}
```

### 2. Landing Page Translations
Add to the appropriate landing file in `public/messages/`:
```json
{
  "hero": {
    "newSection": {
      "title": "New Hero Section",
      "subtitle": "New hero subtitle"
    }
  }
}
```

### 3. Usage in Components
```typescript
const { t } = useTranslations()

return (
  <div>
    <h1>{t('newFeature.title', 'New Feature')}</h1>
    <p>{t('newFeature.description', 'Description')}</p>
  </div>
)
```

## 🔍 Debugging

### Check Translation Loading
```typescript
const { t, loading, error } = useTranslations()

console.log('Loading:', loading)
console.log('Error:', error)
console.log('Translation:', t('test.key', 'Fallback'))
```

### Verify File Structure
Ensure both main and landing translation files exist:
- `public/messages/en.json` ✅
- `public/messages/landing-en.json` ✅
- `public/messages/fr.json` ✅
- `public/messages/landing-fr.json` ✅
- `public/messages/ar.json` ✅
- `public/messages/landing-ar.json` ✅

This system provides a robust, scalable multilingual solution that separates concerns between main app functionality and landing page content while maintaining a unified translation interface. 