import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MonitorQuote - Confronto Quote Sportive',
  description: 'La piattaforma più avanzata per il confronto delle quote sportive. 54+ bookmaker verificati, aggiornamenti regolari, API professionali.',
  keywords: 'quote sportive, scommesse, bookmaker, calcio, tennis, basket, confronto quote, odds comparison',
  authors: [{ name: 'MonitorQuote Team' }],
  openGraph: {
    title: 'MonitorQuote - Confronto Quote Sportive',
    description: 'Confronta le migliori quote tra 54+ bookmaker verificati. Aggiornamenti regolari.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonitorQuote - Confronto Quote Sportive',
    description: 'Confronta le migliori quote tra 54+ bookmaker verificati.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.className} bg-dark-gradient text-white antialiased`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 