"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useLanguage } from '@/lib/context/language-context'

const languages = [
  { 
    code: 'fr', 
    name: 'Français',
    nativeName: 'Français'
  },
  { 
    code: 'en', 
    name: 'English',
    nativeName: 'English'
  },
  { 
    code: 'ar', 
    name: 'Arabic',
    nativeName: 'العربية'
  },
] as const

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-orange-400 hover:bg-orange-50 flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200"
        >
          <span className="font-medium">
            {currentLanguage.nativeName}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl"
      >
        <div className="space-y-1">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
                             className={`flex items-center space-x-3 cursor-pointer rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-orange-50 ${
                 language === lang.code 
                   ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                   : 'hover:border-orange-100'
               }`}
             >
               <div className="flex-1 text-left">
                 <div className="font-medium text-gray-900">
                   {lang.nativeName}
                 </div>
               </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-orange-600 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 