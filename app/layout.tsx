import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { PostHogProvider } from "@/components/posthog-provider"
import { LanguageProvider } from "@/lib/context/language-context"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "Shipit - شحن من تركيا إلى المغرب | خدمة التوصيل السريع",
  description:
    "خدمة شحن وتسوق من تركيا إلى المغرب — شراء، تجميع الطرود لتوفير حتى 80%، وتوصيل سريع لباب منزلك مع تخليص جمركي كامل. اشترِ من Trendyol و Hepsiburada.",
  keywords: "شحن من تركيا, توصيل المغرب, شراء من تركيا, تجميع الطرود, تخليص جمركي, Trendyol, Hepsiburada, شحن سريع, توصيل منزلي, خدمة الشحن, شراء من تركيا للمغرب, توصيل سريع, تخليص جمركي كامل",
  authors: [{ name: "Shipit" }],
  alternates: {
    canonical: "https://shipit.ma",
  },
  openGraph: {
    title: "Shipit - شحن من تركيا إلى المغرب | خدمة التوصيل السريع",
    description: "خدمة شحن وتسوق من تركيا إلى المغرب — شراء، تجميع الطرود لتوفير حتى 80%، وتوصيل سريع لباب منزلك مع تخليص جمركي كامل.",
    type: "website",
    locale: "ar_MA",
    siteName: "Shipit",
    images: [
      {
        url: "https://shipit.ma/logo.svg",
        width: 1200,
        height: 630,
        alt: "Shipit - خدمة الشحن من تركيا إلى المغرب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipit - شحن من تركيا إلى المغرب | خدمة التوصيل السريع",
    description: "خدمة شحن وتسوق من تركيا إلى المغرب مع تخليص جمركي كامل",
  },
  other: {
    "google-site-verification": "your-verification-code",
    "msvalidate.01": "your-bing-verification-code",
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="fr" href="https://shipit.ma" />
        <link rel="alternate" hrefLang="ar" href="https://shipit.ma" />
        <link rel="alternate" hrefLang="en" href="https://shipit.ma" />
        <link rel="alternate" hrefLang="x-default" href="https://shipit.ma" />
        
        {/* Arabic-specific meta tags */}
        <meta name="language" content="fr,ar,en" />
        <meta name="geo.region" content="MA" />
        <meta name="geo.placename" content="Morocco" />
        <meta name="geo.position" content="31.7917;-7.0926" />
        <meta name="ICBM" content="31.7917, -7.0926" />
        
        {/* Arabic SEO specific */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Shipit",
              "alternateName": "شيبت",
              "url": "https://shipit.ma",
              "logo": "https://shipit.ma/logo.svg",
              "description": "خدمة شاملة لشراء المنتجات من تركيا وشحنها إلى المغرب",
              "description_ar": "خدمة شاملة لشراء المنتجات من تركيا وشحنها إلى المغرب",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "MA",
                "addressCountry_ar": "المغرب"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "salam@shipit.ma",
                "availableLanguage": ["French", "Arabic", "English"]
              },
              "sameAs": [
                "https://linkedin.com/company/shipit-ma",
                "https://facebook.com/shipit.ma"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "Morocco",
                "name_ar": "المغرب"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "خدمة الشحن من تركيا إلى المغرب",
              "alternateName": "Expédition Turquie-Maroc",
              "description": "خدمة شراء وشحن المنتجات من تركيا إلى المغرب",
              "description_ar": "خدمة شراء وشحن المنتجات من تركيا إلى المغرب",
              "provider": {
                "@type": "Organization",
                "name": "Shipit",
                "alternateName": "شيبت"
              },
              "serviceType": "Package Forwarding",
              "serviceType_ar": "خدمة إعادة توجيه الطرود",
              "areaServed": {
                "@type": "Country",
                "name": "Morocco",
                "name_ar": "المغرب"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "خدمات الشحن",
                "name_ar": "خدمات الشحن"
              },
              "availableLanguage": ["French", "Arabic", "English"]
            })
          }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <PostHogProvider>
                {children}
              </PostHogProvider>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}