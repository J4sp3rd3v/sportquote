import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'SitoSport - Confronta Quote Scommesse',
  description: 'Confronta le quote dei migliori siti di scommesse sportive in tempo reale. Trova le migliori quote per calcio, tennis, basket e molto altro.',
  keywords: 'scommesse, quote, confronto, calcio, tennis, basket, sport',
  authors: [{ name: 'SitoSport Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'SitoSport - Confronta Quote Scommesse',
    description: 'Confronta le quote dei migliori siti di scommesse sportive',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 