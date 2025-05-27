import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MonitorQuote Pro - Sistema Avanzato Quote Sportive',
  description: 'Piattaforma professionale per analisi quote sportive, arbitraggio automatico e strategie di betting avanzate. Solo dati reali da campionati attivi.',
  keywords: 'quote sportive, arbitraggio, betting, analisi quote, value betting, scommesse sportive',
  authors: [{ name: 'MonitorQuote Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'MonitorQuote Pro - Sistema Avanzato Quote Sportive',
    description: 'Piattaforma professionale per analisi quote sportive e arbitraggio automatico',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonitorQuote Pro',
    description: 'Sistema avanzato per quote sportive e arbitraggio',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body className={`${inter.className} bg-dark-gradient min-h-screen`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Inizializzazione tema scuro
              document.documentElement.classList.add('dark');
              
              // Prevenzione flash di contenuto non stilizzato
              document.body.style.visibility = 'visible';
            `,
          }}
        />
      </body>
    </html>
  )
} 