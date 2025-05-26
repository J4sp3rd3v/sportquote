import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SitoSport - Quote Live in Tempo Reale',
  description: 'La piattaforma più avanzata per il confronto delle quote sportive. 54+ bookmaker verificati, aggiornamenti ogni minuto, API professionali.',
  keywords: 'quote sportive, scommesse, bookmaker, calcio, tennis, basket, confronto quote, odds comparison',
  authors: [{ name: 'SitoSport Team' }],
  openGraph: {
    title: 'SitoSport - Quote Live in Tempo Reale',
    description: 'Confronta le migliori quote tra 54+ bookmaker verificati. Aggiornamenti ogni minuto.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SitoSport - Quote Live in Tempo Reale',
    description: 'Confronta le migliori quote tra 54+ bookmaker verificati.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
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