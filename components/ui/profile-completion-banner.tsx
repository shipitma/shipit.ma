"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useTranslations } from "@/lib/hooks/use-translations"

interface ProfileCompletionBannerProps {
  className?: string
}

export function ProfileCompletionBanner({ className }: ProfileCompletionBannerProps) {
  const { t } = useTranslations()

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className || ''}`}>
      <CardContent className="p-4">
        {/* Desktop layout: flex row with button on right */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">
                {t('dashboard.completeProfile.title', 'Complete Your Registration')}
              </h3>
              <p className="text-xs text-orange-700">
                {t('dashboard.completeProfile.description', 'Add your email and address for better service')}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-sm border-orange-300 text-orange-700 hover:bg-orange-100"
            asChild
          >
            <a href="/profile">
              {t('dashboard.completeProfile.button', 'Complete Profile')}
            </a>
          </Button>
        </div>

        {/* Mobile layout: flex column with button under text */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">
                {t('dashboard.completeProfile.title', 'Complete Your Registration')}
              </h3>
              <p className="text-xs text-orange-700">
                {t('dashboard.completeProfile.description', 'Add your email and address for better service')}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full h-8 text-sm border-orange-300 text-orange-700 hover:bg-orange-100"
            asChild
          >
            <a href="/profile">
              {t('dashboard.completeProfile.button', 'Complete Profile')}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
