'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { 
  getSupportedBookmakers, 
  getBookmakerInfo, 
  getBookmakerStats,
  openBookmaker 
} from '@/lib/bookmakerLinks';

interface BookmakerTestResult {
  name: string;
  url: string;
  isSupported: boolean;
  supportsIframe: boolean;
  status: 'untested' | 'testing' | 'success' | 'error';
  error?: string;
}

export default function BookmakerTestPanel() {
  const [testResults, setTestResults] = useState<BookmakerTestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'supported' | 'unsupported'>('all');

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = () => {
    const bookmakers = getSupportedBookmakers();
    const results: BookmakerTestResult[] = bookmakers.map(name => {
      const info = getBookmakerInfo(name);
      return {
        name,
        url: info.baseUrl,
        isSupported: info.isSupported,
        supportsIframe: info.supportsIframe,
        status: 'untested'
      };
    });
    setTestResults(results);
  };

  const testSingleBookmaker = async (index: number) => {
    const result = testResults[index];
    
    setTestResults(prev => prev.map((r, i) => 
      i === index ? { ...r, status: 'testing' } : r
    ));

    try {
      // Test semplice: verifica se l'URL è raggiungibile
      const response = await fetch(result.url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      
      setTestResults(prev => prev.map((r, i) => 
        i === index ? { ...r, status: 'success' } : r
      ));
    } catch (error) {
      setTestResults(prev => prev.map((r, i) => 
        i === index ? { 
          ...r, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Errore sconosciuto'
        } : r
      ));
    }
  };

  const testAllBookmakers = async () => {
    setIsTestingAll(true);
    
    for (let i = 0; i < testResults.length; i++) {
      await testSingleBookmaker(i);
      // Piccola pausa per evitare di sovraccaricare
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsTestingAll(false);
  };

  const openBookmakerTest = (bookmakerName: string) => {
    openBookmaker(bookmakerName, {
      homeTeam: 'Test Team A',
      awayTeam: 'Test Team B',
      sport: 'calcio',
      league: 'Test League'
    });
  };

  const filteredResults = testResults.filter(result => {
    switch (filter) {
      case 'supported':
        return result.isSupported;
      case 'unsupported':
        return !result.isSupported;
      default:
        return true;
    }
  });

  const stats = getBookmakerStats();
  const testStats = {
    total: testResults.length,
    tested: testResults.filter(r => r.status !== 'untested').length,
    success: testResults.filter(r => r.status === 'success').length,
    errors: testResults.filter(r => r.status === 'error').length
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🧪 Test Bookmaker URLs
          </h2>
          <p className="text-sm text-gray-600">
            Verifica la funzionalità degli URL dei bookmaker configurati
          </p>
        </div>
        <button
          onClick={testAllBookmakers}
          disabled={isTestingAll}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isTestingAll ? 'animate-spin' : ''}`} />
          <span>{isTestingAll ? 'Testing...' : 'Test Tutti'}</span>
        </button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Bookmaker Totali</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{testStats.success}</div>
          <div className="text-sm text-green-800">Test Riusciti</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{testStats.errors}</div>
          <div className="text-sm text-red-800">Test Falliti</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.iframeBlocked}</div>
          <div className="text-sm text-yellow-800">Iframe Bloccati</div>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'all' 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tutti ({testResults.length})
        </button>
        <button
          onClick={() => setFilter('supported')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'supported' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Supportati ({testResults.filter(r => r.isSupported).length})
        </button>
        <button
          onClick={() => setFilter('unsupported')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'unsupported' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Non Supportati ({testResults.filter(r => !r.isSupported).length})
        </button>
      </div>

      {/* Lista Bookmaker */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredResults.map((result, index) => (
          <div
            key={result.name}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              result.status === 'success' ? 'bg-green-50 border-green-200' :
              result.status === 'error' ? 'bg-red-50 border-red-200' :
              result.status === 'testing' ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {result.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                {result.status === 'testing' && <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />}
                {result.status === 'untested' && <div className="h-5 w-5 rounded-full bg-gray-300" />}
              </div>

              {/* Bookmaker Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 truncate">
                    {result.name}
                  </span>
                  {!result.supportsIframe && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      No Iframe
                    </span>
                  )}
                  {!result.isSupported && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Fallback
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {result.url}
                </div>
                {result.error && (
                  <div className="text-xs text-red-600 mt-1">
                    {result.error}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => testSingleBookmaker(testResults.findIndex(r => r.name === result.name))}
                disabled={result.status === 'testing'}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Test URL"
              >
                <RefreshCw className={`h-4 w-4 ${result.status === 'testing' ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => openBookmakerTest(result.name)}
                className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                title="Apri Bookmaker"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>Nessun bookmaker trovato per il filtro selezionato</p>
        </div>
      )}
    </div>
  );
} 