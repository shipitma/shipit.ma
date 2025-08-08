import fs from 'fs'
import path from 'path'

interface TranslationData {
  [key: string]: any
}

// Cache for loaded translations
const translationCache: Record<string, TranslationData> = {}

/**
 * Load translations from JSON files
 */
async function loadTranslations(language: string): Promise<TranslationData> {
  // Check cache first
  if (translationCache[language]) {
    return translationCache[language]
  }

  try {
    // Load main translations
    const messagesPath = path.join(process.cwd(), 'public', 'messages', `${language}.json`)
    const fileContent = fs.readFileSync(messagesPath, 'utf-8')
    const mainTranslations = JSON.parse(fileContent)
    
    // Load landing page translations
    let landingTranslations = {}
    try {
      const landingPath = path.join(process.cwd(), 'public', 'messages', `landing-${language}.json`)
      const landingContent = fs.readFileSync(landingPath, 'utf-8')
      landingTranslations = JSON.parse(landingContent)
    } catch (landingErr) {
      console.warn(`Landing translations not found for ${language}, using main translations only`)
    }
    
    // Merge translations (landing translations will override main translations if there are conflicts)
    const mergedTranslations = {
      ...mainTranslations,
      ...landingTranslations
    }
    
    // Cache the merged translations
    translationCache[language] = mergedTranslations
    
    return mergedTranslations
  } catch (error) {
    console.error(`Failed to load ${language} translations:`, error)
    
    // Fallback to English if current language fails
    if (language !== 'en') {
      try {
        // Load English main translations
        const fallbackPath = path.join(process.cwd(), 'public', 'messages', 'en.json')
        const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8')
        let fallbackTranslations = JSON.parse(fallbackContent)
        
        // Load English landing translations
        try {
          const fallbackLandingPath = path.join(process.cwd(), 'public', 'messages', 'landing-en.json')
          const fallbackLandingContent = fs.readFileSync(fallbackLandingPath, 'utf-8')
          const fallbackLandingTranslations = JSON.parse(fallbackLandingContent)
          
          fallbackTranslations = {
            ...fallbackTranslations,
            ...fallbackLandingTranslations
          }
        } catch (fallbackLandingErr) {
          console.warn('English landing translations not found')
        }
        
        translationCache[language] = fallbackTranslations
        return fallbackTranslations
      } catch (fallbackError) {
        console.error('Fallback translation loading failed:', fallbackError)
        return {}
      }
    }
    
    return {}
  }
}

/**
 * Get translations for a specific language
 */
export async function getTranslations(language: string): Promise<TranslationData> {
  return await loadTranslations(language)
}

/**
 * Get translation value by key
 */
export function getTranslationValue(translations: TranslationData, key: string, fallback?: string): string {
  const keys = key.split('.')
  let value: any = translations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  return typeof value === 'string' ? value : fallback || key
}

/**
 * Server-side translation function
 */
export async function serverTranslate(
  key: string, 
  language: string = 'en', 
  fallback?: string,
  interpolation?: Record<string, string>
): Promise<string> {
  const translations = await loadTranslations(language)
  
  // Support nested keys like "auth.whatsappOtpMessage"
  const keys = key.split('.')
  let value: any = translations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return fallback || key
    }
  }

  let result = typeof value === 'string' ? value : fallback || key

  // Handle interpolation if provided
  if (interpolation && typeof result === 'string') {
    Object.keys(interpolation).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g')
      result = result.replace(regex, interpolation[placeholder])
    })
  }

  return result
}

/**
 * Get user's preferred language from request headers
 */
export function getLanguageFromRequest(request: Request): string {
  // First check for X-Language header (frontend preference)
  const xLanguage = request.headers.get('x-language')
  if (xLanguage && ['en', 'fr', 'ar'].includes(xLanguage)) {
    return xLanguage
  }
  
  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  
  if (acceptLanguage) {
    // Parse Accept-Language header
    const languages = acceptLanguage.split(',').map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=')
      return { code: code.split('-')[0], quality: parseFloat(quality) }
    })
    
    // Sort by quality and find first supported language
    languages.sort((a, b) => b.quality - a.quality)
    
    for (const lang of languages) {
      if (['en', 'fr', 'ar'].includes(lang.code)) {
        return lang.code
      }
    }
  }
  
  return 'en' // Default to English
} 