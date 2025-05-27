'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import { optimizedBookmakerManager } from '@/lib/optimizedBookmakerManager';

interface TestResult {
  bookmaker: string;
  success: boolean;
  url: string;
  verified: boolean;
  category: string;
  timestamp: number;
}

export default function BookmakerTestPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const testBookmaker = (bookmakerName: string) => {
    const info = optimizedBookmakerManager.getBookmakerInfo(bookmakerName);
    
    if (info.isSupported && info.config) {
      const result: TestResult = {
        bookmaker: info.config.displayName,
        success: true,
        url: info.config.baseUrl,
        verified: info.config.verified,
        category: info.config.category,
        timestamp: Date.now()
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 9)]);
      
      // Apri il bookmaker
      optimizedBookmakerManager.openBookmaker(bookmakerName);
      
      return result;
    } else {
      const result: TestResult = {
        bookmaker: bookmakerName,
        success: false,
        url: '',
        verified: false,
        category: 'unknown',
        timestamp: Date.now()
      };
      
      setTestResults(prev => [result, ...prev.slice(0, 9)]);
      return result;
    }
  };

  const testAllPremium = async () => {
    setIsLoading(true);
    
    const premiumBookmakers = optimizedBookmakerManager.getPremiumBookmakers();
    
    for (const bookmaker of premiumBookmakers) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay tra test
      testBookmaker(bookmaker.name);
    }
    
    setIsLoading(false);
  };

  const testSearchedBookmaker = () => {
    if (searchTerm.trim()) {
      testBookmaker(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (result: TestResult) => {
    if (result.success && result.verified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (result.success) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'international': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = optimizedBookmakerManager.getBookmakerStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Test Bookmaker Ottimizzati</h3>
        <div className="text-sm text-gray-500">
          {stats.total} bookmaker configurati
        </div>
      </div>

      {/* Statistiche */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Statistiche Sistema</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Totale:</span>
            <div className="font-semibold">{stats.total}</div>
          </div>
          <div>
            <span className="text-gray-500">Verificati:</span>
            <div className="font-semibold text-green-600">{stats.verified}</div>
          </div>
          <div>
            <span className="text-gray-500">Premium:</span>
            <div className="font-semibold text-purple-600">{stats.premium}</div>
          </div>
          <div>
            <span className="text-gray-500">Italiani:</span>
            <div className="font-semibold text-blue-600">{stats.italian}</div>
          </div>
          <div>
            <span className="text-gray-500">Internazionali:</span>
            <div className="font-semibold text-green-600">{stats.international}</div>
          </div>
        </div>
      </div>

      {/* Controlli Test */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && testSearchedBookmaker()}
                placeholder="Nome bookmaker da testare..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={testSearchedBookmaker}
                disabled={!searchTerm.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={testAllPremium}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Premium'}
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Pulisci
            </button>
          </div>
        </div>
      </div>

      {/* Bookmaker Premium */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Bookmaker Premium</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {optimizedBookmakerManager.getPremiumBookmakers().map((bookmaker, index) => (
            <div
              key={index}
              className="p-3 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer"
              onClick={() => testBookmaker(bookmaker.name)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{bookmaker.displayName}</div>
                  <div className="text-xs text-gray-500">
                    {bookmaker.country} | Priorità: {bookmaker.priority}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bookmaker.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-1 py-0.5 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risultati Test */}
      {testResults.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Risultati Test</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success && result.verified
                    ? 'bg-green-50 border-green-200'
                    : result.success
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(result)}
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {result.bookmaker}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.success ? 'Test riuscito' : 'Test fallito'}
                        {result.category !== 'unknown' && (
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString('it-IT')}
                    </div>
                    {result.success && result.url && (
                      <button
                        onClick={() => window.open(result.url, '_blank', 'noopener,noreferrer')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Riapri
                      </button>
                    )}
                  </div>
                </div>
                {result.url && (
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {result.url}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 