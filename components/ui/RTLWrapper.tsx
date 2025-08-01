"use client"

import { useLanguage } from '@/lib/context/language-context'
import { ReactNode } from 'react'

interface RTLWrapperProps {
  children: ReactNode
  className?: string
}

export function RTLWrapper({ children, className = "" }: RTLWrapperProps) {
  const { isRTL } = useLanguage()
  
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`${className} ${isRTL ? 'font-arabic' : 'font-sans'}`}
    >
      {children}
    </div>
  )
} 