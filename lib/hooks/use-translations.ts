"use client"

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/lib/context/language-context'

interface TranslationData {
  [key: string]: any
}

export function useTranslations() {
  const { language } = useLanguage()
  const [translations, setTranslations] = useState<TranslationData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load translation files
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Load main translations
        const mainResponse = await fetch(`/messages/${language}.json`)
        if (!mainResponse.ok) {
          throw new Error(`Failed to load ${language} main translations`)
        }
        
        const mainData = await mainResponse.json()
        
        // Load landing page translations
        let landingData = {}
        try {
          const landingResponse = await fetch(`/messages/landing-${language}.json`)
          if (landingResponse.ok) {
            landingData = await landingResponse.json()
          }
        } catch (landingErr) {
          console.warn(`Landing translations not found for ${language}, using main translations only`)
        }
        
        // Merge translations (landing translations will override main translations if there are conflicts)
        const mergedTranslations = {
          ...mainData,
          ...landingData
        }
        
        setTranslations(mergedTranslations)
      } catch (err) {
        console.error(`Error loading ${language} translations:`, err)
        setError(err instanceof Error ? err.message : 'Translation loading failed')
        
        // Fallback to English if current language fails
        if (language !== 'en') {
          try {
            // Load English main translations
            const fallbackMainResponse = await fetch('/messages/en.json')
            let fallbackData = {}
            
            if (fallbackMainResponse.ok) {
              fallbackData = await fallbackMainResponse.json()
            }
            
            // Load English landing translations
            try {
              const fallbackLandingResponse = await fetch('/messages/landing-en.json')
              if (fallbackLandingResponse.ok) {
                const fallbackLandingData = await fallbackLandingResponse.json()
                fallbackData = {
                  ...fallbackData,
                  ...fallbackLandingData
                }
              }
            } catch (fallbackLandingErr) {
              console.warn('English landing translations not found')
            }
            
            setTranslations(fallbackData)
          } catch (fallbackErr) {
            console.error('Fallback translation loading failed:', fallbackErr)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [language])

  // Translation function with nested key support and interpolation
  const t = useCallback((key: string, fallback?: string, interpolation?: Record<string, any>): string => {
    if (loading) {
      return fallback || key
    }

    if (error) {
      return fallback || key
    }

    // Support nested keys like "home.welcomeBack"
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
  }, [translations, loading, error])

  return {
    t,
    loading,
    error,
    language
  }
} 