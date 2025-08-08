"use client"

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, Phone, HelpCircle } from "lucide-react"
import { useTranslations } from "@/lib/hooks/use-translations"
import { useLanguage } from "@/lib/context/language-context"

interface HelpDrawerProps {
  className?: string
}

export const HelpDrawer: FC<HelpDrawerProps> = ({ className = "" }) => {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={`flex items-center gap-1 h-8 px-2 text-red-600 font-semibold underline underline-offset-2 ${isRTL ? 'flex-row-reverse' : ''} ${className}`}>
          <MessageCircle className="h-5 w-5" />
          <span>{t('mainLayout.help.needHelp', 'Besoin d\'aide ?')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] rounded-t-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold">
            {t('mainLayout.help.needHelp', 'Besoin d\'aide ?')}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4">
          {/* Phone Call */}
          <a 
            href="tel:0522300900" 
            className={`flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => setOpen(false)}
          >
            <div className="flex-shrink-0">
              <Phone className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {t('mainLayout.help.callUs', 'J\'appelle au')}
              </div>
              <div className="text-sm text-gray-500 font-semibold">
                0522 300 900
              </div>
            </div>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/212522300900" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => setOpen(false)}
          >
            <div className="flex-shrink-0">
              <div className="inline-flex items-center justify-center h-6 w-6 rounded bg-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 6.318h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.897 9.891zm8.413-18.306A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.088c0 2.13.557 4.21 1.615 6.032L0 24l6.063-1.591a11.876 11.876 0 0 0 5.987 1.527h.005c6.554 0 11.989-5.435 11.991-12.088a11.86 11.86 0 0 0-3.497-8.594z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {t('mainLayout.help.contactWhatsapp', 'Je prends contact sur Whatsapp')}
              </div>
              <div className="text-sm text-gray-500">
                {t('mainLayout.help.whatsappDescription', 'Chat en direct avec notre équipe')}
              </div>
            </div>
          </a>

          {/* Help Page */}
          <a 
            href="/help" 
            className={`flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            onClick={() => setOpen(false)}
          >
            <div className="flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {t('mainLayout.help.consultHelpPage', 'Je consulte la page d\'aide')}
              </div>
              <div className="text-sm text-gray-500">
                {t('mainLayout.help.helpPageDescription', 'FAQ et guides d\'utilisation')}
              </div>
            </div>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
} 