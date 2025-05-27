'use client';

import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { optimizedBookmakerManager } from '@/lib/optimizedBookmakerManager';

interface BookmakerTestResult {
  name: string;
  isSupported: boolean;
  normalizedName: string;
  config?: any;
  url?: string;
  verified?: boolean;
  category?: string;
}

interface BookmakerDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookmakerDebugPanel({ isOpen, onClose }: BookmakerDebugPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [testResults, setTestResults] = useState<BookmakerTestResult[]>([]);
  const [allBookmakers, setAllBookmakers] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Carica tutti i bookmaker configurati
      const premiumBookmakers = optimizedBookmakerManager.getBookmakersByCategory('premium');
      const standardBookmakers = optimizedBookmakerManager.getBookmakersByCategory('standard');
      const internationalBookmakers = optimizedBookmakerManager.getBookmakersByCategory('international');
      
      const allBookmakersList = [
        ...premiumBookmakers,
        ...standardBookmakers,
        ...internationalBookmakers
      ];
      setAllBookmakers(allBookmakersList);
    }
  }, [isOpen]);

  const testBookmaker = (bookmakerName: string) => {
    const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
    
    const result: BookmakerTestResult = {
      name: bookmakerName,
      isSupported: info.isSupported,
      normalizedName: info.config?.displayName || bookmakerName,
      config: info.config,
      url: info.config?.baseUrl,
      verified: info.config?.verified,
      category: info.config?.category
    };

    setTestResults(prev => [result, ...prev.slice(0, 9)]);
  };

  const filteredBookmakers = allBookmakers.filter(bookmaker =>
    bookmaker.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmaker.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Debug Bookmaker
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cerca bookmaker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bookmaker List */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Bookmaker Configurati ({filteredBookmakers.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {filteredBookmakers.map((bookmaker, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => testBookmaker(bookmaker.key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{bookmaker.displayName}</div>
                        <div className="text-xs text-gray-500">{bookmaker.key}</div>
                        <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          bookmaker.category === 'premium' ? 'bg-purple-100 text-purple-800' :
                          bookmaker.category === 'standard' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {bookmaker.category}
                        </div>
                      </div>
                      {bookmaker.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Risultati Test ({testResults.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.isSupported ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            {result.isSupported ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium text-sm">{result.normalizedName}</span>
                            {result.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Verificato
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {result.category && (
                              <span className="mr-2 capitalize">{result.category}</span>
                            )}
                            {result.url && (
                              <span className="text-blue-600">{result.url}</span>
                            )}
                          </div>
                        </div>
                        {result.url && (
                          <button
                            onClick={() => window.open(result.url, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
          </div>
        </div>
      </div>
    </div>
  );
} 