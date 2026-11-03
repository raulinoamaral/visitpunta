import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Playfair_Display } from 'next/font/google'
import '../../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { HTML_LANG, isLocale, LOCALES } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  // Real italic for the footer closing line and editorial asides (avoids faux italic)
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return {
    metadataBase: new URL('https://visitpunta.com'),
    title: 'Visit Punta',
    description: getDictionary(locale).meta.siteDescription,
    icons: {
      icon: [
        { url: '/favicon/favicon.ico' },
        { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: '/favicon/apple-touch-icon.png',
    },
    manifest: '/favicon/site.webmanifest',
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={HTML_LANG[locale]} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <GoogleAnalytics />
        <PageTransition />
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  )
}
