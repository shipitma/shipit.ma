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

  // Load translation file
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/messages/${language}.json`)
        if (!response.ok) {
          throw new Error(`Failed to load ${language} translations`)
        }
        
        const data = await response.json()
        setTranslations(data)
      } catch (err) {
        console.error(`Error loading ${language} translations:`, err)
        setError(err instanceof Error ? err.message : 'Translation loading failed')
        
        // Fallback to English if current language fails
        if (language !== 'en') {
          try {
            const fallbackResponse = await fetch('/messages/en.json')
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json()
              setTranslations(fallbackData)
            }
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