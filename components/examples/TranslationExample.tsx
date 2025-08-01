"use client"

import { useTranslations } from '@/lib/hooks/use-translations'
import { useLanguage } from '@/lib/context/language-context'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function TranslationExample() {
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  return (
    <div className="p-6 max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <LanguageSelector />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('landing.hero.title', 'Simplify your international purchases')}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {t('landing.hero.subtitle', 'Shop online and get delivered to Morocco with ease')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">
              {t('landing.features.shipping', 'Fast Shipping')}
            </h3>
            <p className="text-orange-600">
              {t('common.loading', 'Loading...')}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              {t('landing.features.tracking', 'Real-time Tracking')}
            </h3>
            <p className="text-blue-600">
              {t('dashboard.quickAccess', 'Quick Access')}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              {t('landing.features.security', 'Guaranteed Security')}
            </h3>
            <p className="text-green-600">
              {t('common.success', 'Success')}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">
              {t('landing.features.support', '24/7 Support')}
            </h3>
            <p className="text-purple-600">
              {t('navigation.help', 'Help')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcomeBack', 'Welcome back')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                {t('packages.title', 'Packages')}
              </h3>
              <p className="text-gray-600">
                {t('packages.addNew', 'Add Package')}
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                {t('purchases.title', 'Purchases')}
              </h3>
              <p className="text-gray-600">
                {t('purchases.newRequest', 'New Request')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {t('common.language', 'Language')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('common.loading', 'Loading...')} - {t('common.error', 'Error')} - {t('common.success', 'Success')}
          </p>
        </div>
      </div>
    </div>
  )
} 