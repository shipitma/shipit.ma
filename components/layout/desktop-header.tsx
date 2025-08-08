"use client"

import { FC } from "react"
import { LanguageSelector } from '@/components/ui/LanguageSelector'

interface DesktopHeaderProps {
  generateBreadcrumbs: () => React.ReactNode
}

export const DesktopHeader: FC<DesktopHeaderProps> = ({ generateBreadcrumbs }) => {
  return (
    <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex h-14 items-center justify-between bg-transparent px-6">
      <div>{generateBreadcrumbs()}</div>
      <div className="flex items-center space-x-3">
        <LanguageSelector />
      </div>
    </div>
  )
} 