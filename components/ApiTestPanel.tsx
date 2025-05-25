'use client';

import React, { useState } from 'react';
import { Play, RefreshCw, CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';
import { oddsApi } from '@/lib/oddsApi';

interface ApiTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiTestPanel({ isOpen, onClose }: ApiTestPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [bookmakerAnalysis, setBookmakerAnalysis] = useState<any[]>([]);

  const runApiTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    setBookmakerAnalysis([]);

    try {
      // 1. Verifica stato API
      console.log('🔄 Verificando stato API...');
      const status = await oddsApi.checkApiStatus();
      setApiStatus(status);

      if (status.status === 'error') {
        throw new Error('API non disponibile');
      }

      // 2. Recupera dati di test (solo Serie A per velocità)
      console.log('🔄 Recuperando dati Serie A...');
      const serieAEvents = await oddsApi.getOdds('soccer_italy_serie_a');
      
      if (serieAEvents.length === 0) {
        throw new Error('Nessun evento Serie A disponibile');
      }

      // 3. Analizza i bookmaker
      const bookmakerMap = new Map();
      serieAEvents.forEach(event => {
        event.bookmakers.forEach(bookmaker => {
          const key = bookmaker.key;
          const title = bookmaker.title;
          
          if (!bookmakerMap.has(key)) {
            bookmakerMap.set(key, {
              key,
              title,
              count: 0,
              normalizedName: '', // Verrà calcolato
              hasMapping: false
            });
          }
          bookmakerMap.get(key).count++;
        });
      });

      // 4. Converti e analizza
      const convertedMatches = oddsApi.convertToAppFormat(serieAEvents);
      
      // 5. Analizza i nomi normalizzati
      const analysis = Array.from(bookmakerMap.values()).map(bm => {
        // Simula la normalizzazione
        const normalizedName = normalizeBookmakerNameTest(bm.key, bm.title);
        const hasMapping = normalizedName !== bm.title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        
        return {
          ...bm,
          normalizedName,
          hasMapping,
          status: hasMapping ? 'mapped' : 'unmapped'
        };
      });

      setBookmakerAnalysis(analysis);
      setTestResults({
        eventsCount: serieAEvents.length,
        convertedCount: convertedMatches.length,
        bookmakerCount: bookmakerMap.size,
        mappedCount: analysis.filter(a => a.hasMapping).length,
        unmappedCount: analysis.filter(a => !a.hasMapping).length
      });

    } catch (error) {
      console.error('❌ Errore test API:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Errore sconosciuto' });
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione di test per la normalizzazione (copia della logica)
  const normalizeBookmakerNameTest = (key: string, title: string): string => {
    const BOOKMAKER_MAPPING: { [key: string]: string } = {
      'bet365': 'Bet365',
      'williamhill': 'William Hill',
      'betfair': 'Betfair',
      'unibet': 'Unibet',
      'bwin': 'Bwin',
      'marathonbet': 'Marathonbet',
      'sisal': 'Sisal',
      'snai': 'Snai',
      'eurobet': 'Eurobet',
      'lottomatica': 'Lottomatica',
      'betclic': 'Betclic',
      'netbet': 'NetBet',
      'leovegas': 'LeoVegas',
      'pokerstars': 'Pokerstars',
      'betway': 'Betway',
      'pinnacle': 'Pinnacle'
    };

    const normalizedFromKey = BOOKMAKER_MAPPING[key.toLowerCase()];
    if (normalizedFromKey) return normalizedFromKey;

    const normalizedFromTitle = BOOKMAKER_MAPPING[title.toLowerCase()];
    if (normalizedFromTitle) return normalizedFromTitle;

    return title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Test API Reale - Analisi Bookmaker
                </h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Stato API */}
            {apiStatus && (
              <div className={`p-4 rounded-lg mb-4 ${
                apiStatus.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              } border`}>
                <h4 className="font-medium mb-2">Stato API</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 font-medium ${
                      apiStatus.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {apiStatus.status === 'active' ? 'Attiva' : 'Errore'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Richieste rimanenti:</span>
                    <span className="ml-2 font-medium">{apiStatus.remainingRequests || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Richieste usate:</span>
                    <span className="ml-2 font-medium">{apiStatus.usedRequests || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rate limit:</span>
                    <span className="ml-2 font-medium">{apiStatus.rateLimit || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pulsante test */}
            <div className="mb-4">
              <button
                onClick={runApiTest}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Testando...' : 'Testa API Serie A'}
              </button>
            </div>

            {/* Risultati test */}
            {testResults && (
              <div className="space-y-4">
                {testResults.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium text-red-900">Errore: {testResults.error}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Statistiche generali */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Risultati Test</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">{testResults.eventsCount}</span>
                          <span className="text-gray-600 ml-1">Eventi API</span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">{testResults.convertedCount}</span>
                          <span className="text-gray-600 ml-1">Convertiti</span>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">{testResults.bookmakerCount}</span>
                          <span className="text-gray-600 ml-1">Bookmaker</span>
                        </div>
                        <div>
                          <span className="text-green-600 font-medium">{testResults.mappedCount}</span>
                          <span className="text-gray-600 ml-1">Mappati</span>
                        </div>
                        <div>
                          <span className="text-red-600 font-medium">{testResults.unmappedCount}</span>
                          <span className="text-gray-600 ml-1">Non mappati</span>
                        </div>
                      </div>
                    </div>

                    {/* Analisi bookmaker */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Analisi Bookmaker</h4>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="space-y-2">
                          {bookmakerAnalysis.map((bm, index) => (
                            <div 
                              key={index}
                              className={`p-3 rounded border ${
                                bm.status === 'mapped' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {bm.status === 'mapped' ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {bm.key} → {bm.normalizedName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Title API: "{bm.title}" | Eventi: {bm.count}
                                    </div>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  bm.status === 'mapped' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {bm.status === 'mapped' ? 'Mappato' : 'Da mappare'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Suggerimenti */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Come risolvere i problemi:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Bookmaker non mappati:</strong> Aggiungi la mappatura in BOOKMAKER_NAME_MAPPING</li>
                <li>• <strong>Nomi generici:</strong> L'API restituisce key come "marathonbet" invece di "Marathonbet"</li>
                <li>• <strong>Test locale:</strong> Questo test usa dati reali dall'API per verificare la mappatura</li>
                <li>• <strong>Versione live:</strong> Assicurati che useRealData sia false o che la mappatura sia corretta</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 