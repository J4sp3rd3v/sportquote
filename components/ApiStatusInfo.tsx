'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, Clock, Database, AlertCircle } from 'lucide-react';

interface ApiStatusInfoProps {
  apiStatus: {
    status: string;
    remainingRequests: string | null;
    usedRequests: string | null;
    rateLimit?: string | null;
  } | null;
  lastUpdate: Date | null;
  categoryStats: {
    calcio: { count: number; leagues: string[] };
    tennis: { count: number; leagues: string[] };
    basket: { count: number; leagues: string[] };
    altro: { count: number; leagues: string[] };
  } | null;
  useRealData: boolean;
}

export default function ApiStatusInfo({ 
  apiStatus, 
  lastUpdate, 
  categoryStats, 
  useRealData 
}: ApiStatusInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!useRealData) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Database className="h-4 w-4 text-yellow-600" />;
    }
  };

  const totalMatches = categoryStats ? 
    Object.values(categoryStats).reduce((sum, cat) => sum + cat.count, 0) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {apiStatus && getStatusIcon(apiStatus.status)}
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Stato API Quote Reali
            </h3>
            <p className="text-xs text-gray-500">
              {apiStatus ? (
                <span className={getStatusColor(apiStatus.status)}>
                  {apiStatus.status === 'active' ? 'Attiva' : 'Errore'}
                </span>
              ) : (
                'Verifica in corso...'
              )}
              {totalMatches > 0 && (
                <span className="ml-2">• {totalMatches} partite caricate</span>
              )}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            {/* Stato API */}
            {apiStatus && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Stato Connessione
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Stato:</span>
                    <span className={getStatusColor(apiStatus.status)}>
                      {apiStatus.status === 'active' ? 'Attiva' : 'Errore'}
                    </span>
                  </div>
                  {apiStatus.remainingRequests && (
                    <div className="flex justify-between">
                      <span>Richieste rimanenti:</span>
                      <span>{apiStatus.remainingRequests}</span>
                    </div>
                  )}
                  {apiStatus.usedRequests && (
                    <div className="flex justify-between">
                      <span>Richieste usate:</span>
                      <span>{apiStatus.usedRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ultimo aggiornamento */}
            {lastUpdate && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Ultimo Aggiornamento
                </h4>
                <p className="text-xs text-gray-600">
                  {formatDate(lastUpdate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((Date.now() - lastUpdate.getTime()) / 60000)} minuti fa
                </p>
              </div>
            )}

            {/* Statistiche per categoria */}
            {categoryStats && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Partite per Sport
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(categoryStats).map(([sport, data]) => (
                    data.count > 0 && (
                      <div key={sport} className="flex justify-between">
                        <span className="capitalize">{sport}:</span>
                        <span>{data.count}</span>
                      </div>
                    )
                  ))}
                  <div className="flex justify-between font-medium pt-1 border-t border-gray-200">
                    <span>Totale:</span>
                    <span>{totalMatches}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informazioni aggiuntive */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              ℹ️ Informazioni
            </h4>
            <p className="text-xs text-blue-700">
              Le quote vengono aggiornate automaticamente ogni ora (versione gratuita). 
              Durante le pause stagionali o nei giorni senza eventi sportivi, 
              potrebbero non essere disponibili partite.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 