"use client"

import { useTranslations } from "@/lib/hooks/use-translations"

export function Footer() {
  const { t } = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white py-8 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} shipit.ma. {t('footer.copyright', 'Tous droits réservés.')}
          </p>
        </div>
      </div>
    </footer>
  )
} 