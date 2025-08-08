"use client"

import { FC } from "react"
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { HelpDrawer } from '@/components/ui/help-drawer'

export const MobileHeader: FC = () => {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-[#fafafa] shadow-sm border-b">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Need Help */}
        <div className="flex items-center">
          <HelpDrawer />
        </div>

        {/* Right: Language Selector */}
        <div className="flex items-center">
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
} 