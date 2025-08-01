# Multilingual Translation Guide - OneService Morocco

This document explains the comprehensive **React-based internationalization (i18n) system** implemented in the OneService Morocco project.

## 🏗️ Architecture Overview

The system is built around these core principles:
- **JSON-based translation files** stored in `/public/messages/`
- **React Context** for language state management
- **Custom hooks** for easy translation access
- **Automatic RTL support** for Arabic
- **Font switching** based on language
- **Browser language detection** with localStorage persistence

## 📁 File Structure

```
public/messages/
├── en.json    # English translations
├── fr.json    # French translations  
├── ar.json    # Arabic translations

lib/
├── context/language-context.tsx    # Language state management
├── hooks/use-translations.ts       # Translation hook

components/ui/
└── LanguageSelector.tsx            # Language switcher UI

components/examples/
└── TranslationExample.tsx          # Usage example
```

## 🔧 Core Components

### 1. Language Context (`lib/context/language-context.tsx`)

**Purpose**: Manages global language state and RTL support

**Key Features**:
- **Automatic language detection** from browser settings
- **localStorage persistence** of user preference
- **RTL support** for Arabic (`isRTL` state)
- **Document direction updates** (`dir` and `lang` attributes)

**Usage**:
```typescript
import { useLanguage } from '@/lib/context/language-context'

export function MyComponent() {
  const { language, setLanguage, isRTL } = useLanguage()
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <button onClick={() => setLanguage('fr')}>
        Switch to French
      </button>
    </div>
  )
}
```

### 2. Translation Hook (`lib/hooks/use-translations.ts`)

**Purpose**: Provides translation function with dynamic loading

**Key Features**:
- **Dynamic loading** of translation files via fetch
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

### JSON Structure
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

### Key Naming Conventions
- **Use nested keys** for organization: `dashboard.stats.totalPackages`
- **Keep keys descriptive**: `auth.signIn` not `si`
- **Group related translations**: All auth-related keys under `auth`
- **Use consistent naming**: `title`, `subtitle`, `description`

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

### RTL Support
```typescript
const { isRTL } = useLanguage()

return (
  <div dir={isRTL ? 'rtl' : 'ltr'}>
    <p>{t('welcome.message', 'Welcome')}</p>
  </div>
)
```

### Language Switching
```typescript
const { language, setLanguage } = useLanguage()

const handleLanguageChange = (newLang: Language) => {
  setLanguage(newLang)
}

return (
  <select onChange={(e) => setLanguage(e.target.value as Language)}>
    <option value="en">English</option>
    <option value="fr">Français</option>
    <option value="ar">العربية</option>
  </select>
)
```

## 🚀 Setup Instructions

### 1. Add Language Provider to Root Layout
```typescript
// app/layout.tsx
import { LanguageProvider } from '@/lib/context/language-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

### 2. Create Translation Files
Create JSON files in `/public/messages/`:
- `en.json` - English translations
- `fr.json` - French translations
- `ar.json` - Arabic translations

### 3. Use in Components
```typescript
import { useTranslations } from '@/lib/hooks/use-translations'
import { useLanguage } from '@/lib/context/language-context'

export function MyComponent() {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('title', 'Default Title')}</h1>
    </div>
  )
}
```

## 🌐 RTL & Font Support

### Automatic RTL Detection
```typescript
// In language-context.tsx
const rtlLanguages: Language[] = ['ar']

useEffect(() => {
  const newIsRTL = rtlLanguages.includes(language)
  setIsRTL(newIsRTL)
  
  // Update document direction
  const newDir = newIsRTL ? 'rtl' : 'ltr'
  document.documentElement.dir = newDir
  document.documentElement.lang = language
}, [language])
```

### Font Switching
```css
/* Automatic font selection based on language */
[lang="ar"], [dir="rtl"] {
  font-family: 'IBMPlexSansArabic', sans-serif;
}

/* Default font for LTR languages */
font-family: 'Satoshi', sans-serif;
```

## ✨ Key Benefits

1. **Type Safety** - TypeScript support with proper typing
2. **Performance** - Dynamic loading with fallbacks
3. **Accessibility** - Proper RTL support and screen reader compatibility
4. **User Experience** - Smooth language switching with persistence
5. **Maintainability** - Clean separation of concerns
6. **Scalability** - Easy to add new languages
7. **SEO Friendly** - Proper `lang` attributes for search engines

## 🔧 Advanced Features

### Loading States
```typescript
const { t, loading } = useTranslations()

if (loading) {
  return <div>Loading translations...</div>
}
```

### Error Handling
```typescript
const { t, error } = useTranslations()

if (error) {
  console.error('Translation error:', error)
  // Fallback to default language
}
```

### Dynamic Language Detection
```typescript
// Automatically detects browser language
const browserLang = navigator.language.split('-')[0]
if (browserLang === 'ar') {
  setLanguage('ar')
} else if (browserLang === 'en') {
  setLanguage('en')
} else {
  setLanguage('fr') // Default
}
```

## 📝 Best Practices

1. **Always provide fallbacks** for translation keys
2. **Use nested keys** for better organization
3. **Keep translations consistent** across languages
4. **Test RTL layouts** thoroughly
5. **Use semantic HTML** with proper `lang` attributes
6. **Consider cultural differences** in translations
7. **Maintain translation files** regularly

## 🚀 Migration Guide

### From Hardcoded Text
```typescript
// Before
<h1>Welcome Back</h1>

// After
<h1>{t('dashboard.welcomeBack', 'Welcome Back')}</h1>
```

### From Simple Language Switcher
```typescript
// Before
<a href="/fr/">FR</a>

// After
<LanguageSelector />
```

This comprehensive internationalization system provides a robust, scalable, and user-friendly solution for multilingual applications! 