'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';

interface ApiStatusBannerProps {
  useRealData: boolean;
  error: string | null;
  loading: boolean;
  onToggle?: () => void;
}

export default function ApiStatusBanner({ 
  useRealData, 
  error, 
  loading,
  onToggle 
}: ApiStatusBannerProps) {
  // Non mostrare nulla se tutto è OK
  if (useRealData && !error && !loading) {
    return null;
  }

  // Banner informativo per dati mock (solo se forzati in produzione)
  if (!useRealData) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              {process.env.NODE_ENV === 'production' ? 'Modalità Demo Forzata' : 'Modalità Demo Attiva'}
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Stai visualizzando dati simulati per scopi dimostrativi. 
                Le quote e i bookmaker sono realistici ma non aggiornati in tempo reale.
              </p>
              {process.env.NODE_ENV === 'development' && onToggle && (
                <button
                  onClick={onToggle}
                  className="mt-2 text-blue-800 hover:text-blue-900 font-medium underline"
                >
                  Attiva API reale
                </button>
              )}
              {process.env.NODE_ENV === 'production' && (
                <p className="mt-2 text-xs">
                  Modalità demo attivata con <code className="bg-blue-100 px-1 rounded">?usemock=true</code>. 
                  Rimuovi il parametro per le quote reali.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner di errore API
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Errore API Quote Reali
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <p className="mt-1">
                Il sistema è passato automaticamente ai dati simulati per garantire il funzionamento.
              </p>
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="mt-2 text-red-800 hover:text-red-900 font-medium underline"
                >
                  Torna ai dati simulati
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner di caricamento
  if (loading) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400 mt-0.5 mr-3 flex-shrink-0"></div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Caricamento Quote Reali
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Recuperando le quote aggiornate dall'API. Questo potrebbe richiedere alcuni secondi...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 