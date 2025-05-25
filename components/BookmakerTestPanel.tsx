'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { bookmakers } from '@/data/mockData';
import { getBookmakerInfo } from '@/lib/bookmakerLinks';
import SmartBookmakerHandler from './SmartBookmakerHandler';

interface BookmakerTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmakerTestPanel({ isOpen, onClose }: BookmakerTestPanelProps) {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = () => {
    setIsLoading(true);
    const results = bookmakers.slice(0, 20).map(bookmaker => {
      const info = getBookmakerInfo(bookmaker.name);
      
      // Verifica se il nome contiene "Bookmaker" generico
      const hasGenericName = bookmaker.name.toLowerCase().includes('bookmaker') && 
                            /bookmaker\d+/i.test(bookmaker.name);
      
      let status: 'success' | 'warning' | 'error' = 'success';
      let message = 'OK';
      
      if (hasGenericName) {
        status = 'error';
        message = 'Nome generico rilevato';
      } else if (!info.isSupported) {
        status = 'error';
        message = 'URL non configurato';
      } else if (info.baseUrl.includes('google.com')) {
        status = 'warning';
        message = 'Fallback Google';
      }
      
      return {
        name: bookmaker.name,
        url: info.baseUrl,
        isSupported: info.isSupported,
        hasGenericName,
        status,
        message
      };
    });
    
    setTestResults(results);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      runTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const successCount = testResults.filter(r => r.status === 'success').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Test Bookmaker - Verifica Nomi e URL
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Testando bookmaker...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Statistiche */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Risultati Test</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">{successCount}</span>
                      <span className="text-gray-600 ml-1">OK</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-600 font-medium">{warningCount}</span>
                      <span className="text-gray-600 ml-1">Warning</span>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600 font-medium">{errorCount}</span>
                      <span className="text-gray-600 ml-1">Errori</span>
                    </div>
                  </div>
                </div>

                {/* Lista risultati */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.status === 'success' ? 'bg-green-50 border-green-200' :
                          result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {result.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                            {result.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />}
                            {result.status === 'error' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                            
                            <div>
                              <div className="font-medium text-gray-900">{result.name}</div>
                              <div className="text-sm text-gray-600">{result.message}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <SmartBookmakerHandler
                              bookmakerName={result.name}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <button className="flex items-center text-sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Testa
                              </button>
                            </SmartBookmakerHandler>
                          </div>
                        </div>
                        
                        {result.url && (
                          <div className="mt-2 text-xs text-gray-500 break-all">
                            URL: {result.url}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggerimenti */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Cosa verificare:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Nomi generici:</strong> Non dovrebbero esserci nomi come "Bookmaker31"</li>
                    <li>• <strong>URL configurati:</strong> Tutti i bookmaker dovrebbero avere URL diretti</li>
                    <li>• <strong>Fallback Google:</strong> Indica URL mancanti o non configurati</li>
                    <li>• <strong>Test funzionali:</strong> Clicca "Testa" per verificare che il link funzioni</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Chiudi
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={runTests}
            >
              Ritest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 