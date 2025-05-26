'use client';

import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { getBookmakerInfo, getSupportedBookmakers, validateBookmakerUrl } from '@/lib/bookmakerLinks';
import { getSupportedBookmakers as getApiBookmakers } from '@/lib/oddsApiService';

interface BookmakerDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookmakerStatus {
  name: string;
  isSupported: boolean;
  hasDirectLink: boolean;
  baseUrl: string;
  isValidUrl: boolean;
  normalizedName: string;
  status: 'ok' | 'warning' | 'error';
}

export default function BookmakerDebugPanel({ isOpen, onClose }: BookmakerDebugPanelProps) {
  const [bookmakerStatuses, setBookmakerStatuses] = useState<BookmakerStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      analyzeBookmakers();
    }
  }, [isOpen]);

  const analyzeBookmakers = async () => {
    setLoading(true);
    
    const statuses: BookmakerStatus[] = [];
    const supportedBookmakers = getSupportedBookmakers();
    
    // Analizza i bookmaker dall'API
    const apiBookmakers = await getApiBookmakers();
    const topBookmakers = apiBookmakers.slice(0, 20);
    
    for (const bookmaker of topBookmakers) {
      const info = getBookmakerInfo(bookmaker.name);
      const isValidUrl = validateBookmakerUrl(info.baseUrl);
      
      let status: 'ok' | 'warning' | 'error' = 'ok';
      
      if (!info.isSupported) {
        status = 'error';
      } else if (!isValidUrl || info.baseUrl.includes('google.com')) {
        status = 'warning';
      }
      
      statuses.push({
        name: bookmaker.name,
        isSupported: info.isSupported,
        hasDirectLink: info.hasDirectLink,
        baseUrl: info.baseUrl,
        isValidUrl,
        normalizedName: info.normalizedName,
        status
      });
    }
    
    setBookmakerStatuses(statuses);
    setLoading(false);
  };

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (bookmaker: BookmakerStatus) => {
    if (!bookmaker.isSupported) {
      return 'Non supportato - URL mancante';
    }
    if (bookmaker.baseUrl.includes('google.com')) {
      return 'Fallback Google - URL non configurato';
    }
    if (!bookmaker.isValidUrl) {
      return 'URL non valido';
    }
    return 'Configurato correttamente';
  };

  const testBookmakerUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bug className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Debug Bookmaker
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Analizzando bookmaker...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Statistiche</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">
                        {bookmakerStatuses.filter(b => b.status === 'ok').length}
                      </span>
                      <span className="text-gray-600"> Funzionanti</span>
                    </div>
                    <div>
                      <span className="text-yellow-600 font-medium">
                        {bookmakerStatuses.filter(b => b.status === 'warning').length}
                      </span>
                      <span className="text-gray-600"> Con problemi</span>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">
                        {bookmakerStatuses.filter(b => b.status === 'error').length}
                      </span>
                      <span className="text-gray-600"> Non supportati</span>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookmaker
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Azioni
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookmakerStatuses.map((bookmaker, index) => (
                        <tr key={index} className={bookmaker.status === 'error' ? 'bg-red-50' : bookmaker.status === 'warning' ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(bookmaker.status)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {bookmaker.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {bookmaker.normalizedName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getStatusText(bookmaker)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 break-all">
                              {bookmaker.baseUrl.length > 50 
                                ? `${bookmaker.baseUrl.substring(0, 50)}...` 
                                : bookmaker.baseUrl
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => testBookmakerUrl(bookmaker.baseUrl)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              title="Testa URL"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Testa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Suggerimenti per risolvere i problemi:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Non supportato:</strong> Aggiungi l'URL del bookmaker in lib/bookmakerLinks.ts</li>
                    <li>• <strong>Fallback Google:</strong> L'URL non è configurato correttamente</li>
                    <li>• <strong>URL non valido:</strong> Controlla che l'URL sia corretto e usi HTTPS</li>
                    <li>• <strong>Iframe bloccato:</strong> Alcuni bookmaker bloccano iframe per sicurezza</li>
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
              onClick={analyzeBookmakers}
            >
              Rianalizza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 