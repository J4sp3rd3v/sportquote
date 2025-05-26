'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Shield, RefreshCw, X } from 'lucide-react';
import { emergencyApiManager, EmergencyApiState } from '@/lib/emergencyApiManager';

interface EmergencyApiStatusProps {
  className?: string;
}

export default function EmergencyApiStatus({ className = '' }: EmergencyApiStatusProps) {
  const [emergencyState, setEmergencyState] = useState<EmergencyApiState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(0);

  useEffect(() => {
    const updateState = () => {
      const state = emergencyApiManager.getEmergencyStatus();
      setEmergencyState(state);
      setIsVisible(state.isEmergencyMode || state.remainingRequests <= 50);
      setTimeUntilNext(emergencyApiManager.getTimeUntilNextRequest());
    };

    updateState();
    const interval = setInterval(updateState, 30000); // Aggiorna ogni 30 secondi

    return () => clearInterval(interval);
  }, []);

  const formatTimeUntilNext = (ms: number): string => {
    if (ms <= 0) return 'Ora';
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (remainingRequests: number) => {
    if (remainingRequests <= 10) return 'red';
    if (remainingRequests <= 25) return 'orange';
    if (remainingRequests <= 50) return 'yellow';
    return 'green';
  };

  const getStatusIcon = (remainingRequests: number) => {
    if (remainingRequests <= 10) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (remainingRequests <= 25) return <Shield className="h-5 w-5 text-orange-500" />;
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  if (!isVisible || !emergencyState) {
    return null;
  }

  const statusColor = getStatusColor(emergencyState.remainingRequests);
  const recommendations = emergencyApiManager.getRecommendations();

  return (
    <div className={`bg-gradient-to-r ${
      statusColor === 'red' ? 'from-red-50 to-red-100 border-red-300' :
      statusColor === 'orange' ? 'from-orange-50 to-orange-100 border-orange-300' :
      'from-yellow-50 to-yellow-100 border-yellow-300'
    } border-2 rounded-xl p-6 mb-6 ${className}`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(emergencyState.remainingRequests)}
          <div>
            <h3 className={`text-lg font-bold ${
              statusColor === 'red' ? 'text-red-800' :
              statusColor === 'orange' ? 'text-orange-800' :
              'text-yellow-800'
            }`}>
              {emergencyState.remainingRequests <= 10 ? '🔴 MODALITÀ CRITICA' :
               emergencyState.remainingRequests <= 25 ? '🟠 MODALITÀ EMERGENZA AVANZATA' :
               '🟡 MODALITÀ EMERGENZA'}
            </h3>
            <p className={`text-sm ${
              statusColor === 'red' ? 'text-red-700' :
              statusColor === 'orange' ? 'text-orange-700' :
              'text-yellow-700'
            }`}>
              Sistema di protezione API attivato
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className={`bg-white rounded-lg p-4 border ${
          statusColor === 'red' ? 'border-red-200' :
          statusColor === 'orange' ? 'border-orange-200' :
          'border-yellow-200'
        }`}>
          <div className="text-2xl font-bold text-gray-900">
            {emergencyState.remainingRequests}
          </div>
          <div className="text-sm text-gray-600">Richieste rimanenti</div>
          <div className="text-xs text-gray-500">
            su 500 totali ({Math.round((emergencyState.usedRequests / 500) * 100)}% usate)
          </div>
        </div>

        <div className={`bg-white rounded-lg p-4 border ${
          statusColor === 'red' ? 'border-red-200' :
          statusColor === 'orange' ? 'border-orange-200' :
          'border-yellow-200'
        }`}>
          <div className="text-2xl font-bold text-gray-900">
            {formatTimeUntilNext(timeUntilNext)}
          </div>
          <div className="text-sm text-gray-600">Prossima richiesta</div>
          <div className="text-xs text-gray-500">
            {emergencyState.canMakeRequest ? 'Disponibile ora' : 'In attesa'}
          </div>
        </div>

        <div className={`bg-white rounded-lg p-4 border ${
          statusColor === 'red' ? 'border-red-200' :
          statusColor === 'orange' ? 'border-orange-200' :
          'border-yellow-200'
        }`}>
          <div className="text-2xl font-bold text-gray-900">
            {emergencyState.emergencyActivatedAt ? 
              new Date(emergencyState.emergencyActivatedAt).toLocaleDateString('it-IT') : 
              'N/A'
            }
          </div>
          <div className="text-sm text-gray-600">Emergenza attivata</div>
          <div className="text-xs text-gray-500">
            {emergencyState.emergencyActivatedAt ? 
              `${Math.floor((Date.now() - emergencyState.emergencyActivatedAt) / (24 * 60 * 60 * 1000))} giorni fa` : 
              ''
            }
          </div>
        </div>
      </div>

      {/* Raccomandazioni */}
      <div className={`bg-white rounded-lg p-4 border ${
        statusColor === 'red' ? 'border-red-200' :
        statusColor === 'orange' ? 'border-orange-200' :
        'border-yellow-200'
      }`}>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Raccomandazioni
        </h4>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Azioni */}
      {emergencyState.remainingRequests > 5 && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (emergencyApiManager.forceAllowRequest()) {
                setTimeUntilNext(emergencyApiManager.getTimeUntilNextRequest());
              }
            }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              statusColor === 'red' ? 'bg-red-600 hover:bg-red-700' :
              statusColor === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            Forza Richiesta Emergenza
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Ricarica con Cache
          </button>
        </div>
      )}

      {/* Avviso critico */}
      {emergencyState.remainingRequests <= 10 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              ATTENZIONE: Richieste quasi esaurite. Il sistema passerà automaticamente ai dati simulati.
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 