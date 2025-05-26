'use client';

import React from 'react';
import BookmakerTestButton from '@/components/BookmakerTestButton';

export default function TestBookmakerPage() {
  // Bookmaker dai dati mock che dovrebbero funzionare
  const testBookmakers = [
    'Sisal',
    'Betflag', 
    'Betaland',
    'Vincitu',
    'Stanleybet',
    'William Hill',
    'Betclic',
    'Betway',
    'NetBet',
    'Marathonbet',
    '888sport',
    'Betsson',
    'Betfred'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Bookmaker</h1>
          <p className="mt-2 text-gray-600">
            Testa il funzionamento dei link dei bookmaker
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Istruzioni:</strong> Apri la console del browser (F12) per vedere i log di debug.
              Clicca sui pulsanti per testare l'apertura dei bookmaker.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {testBookmakers.map((bookmaker) => (
            <BookmakerTestButton 
              key={bookmaker} 
              bookmakerName={bookmaker} 
            />
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Cosa controllare:
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>Console:</strong> Verifica i log di debug per ogni click</li>
            <li>• <strong>Apertura:</strong> I bookmaker dovrebbero aprirsi in nuova scheda</li>
            <li>• <strong>Errori:</strong> Non dovrebbero apparire messaggi di "non trovato"</li>
            <li>• <strong>URL:</strong> Gli URL dovrebbero contenere parametri UTM</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 