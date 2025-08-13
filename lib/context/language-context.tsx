"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Preload Arabic translations immediately
  if (typeof window !== 'undefined') {
    fetch('/messages/ar.json').catch(() => {
      // Silently fail if preload fails
    })
  }

  const [language, setLanguageState] = useState<Language>('ar')
  const [isRTL, setIsRTL] = useState(true) // Start with RTL since default is Arabic

  // RTL languages
  const rtlLanguages: Language[] = ['ar']

  // Initialize language and set document attributes
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'ar', 'fr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
    // Default is already 'ar' from useState
  }, [])

  // Update RTL state and document attributes when language changes
  useEffect(() => {
    const newIsRTL = rtlLanguages.includes(language)
    setIsRTL(newIsRTL)

    // Update document direction and language
    const newDir = newIsRTL ? 'rtl' : 'ltr'
    document.documentElement.dir = newDir
    document.documentElement.lang = language

    // Update font class based on language direction
    document.body.classList.remove('font-ltr', 'font-rtl')
    const fontClass = newIsRTL ? 'font-rtl' : 'font-ltr'
    document.body.classList.add(fontClass)

    // Save to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
} 