'use client';

import React, { useState, useEffect } from 'react';
import { Info, Clock, Database, Zap } from 'lucide-react';
import { realOddsService } from '@/lib/realOddsService';

interface SystemDebugInfoProps {
  className?: string;
}

export default function SystemDebugInfo({ className = '' }: SystemDebugInfoProps) {
  const [debugInfo, setDebugInfo] = useState({
    currentTime: new Date(),
    lastUpdate: null as Date | null,
    nextUpdate: new Date(),
    shouldUpdate: false,
    cacheSize: 0,
    requestsUsed: 0,
    requestsRemaining: 0,
    updatedToday: false
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const stats = realOddsService.getServiceStats();
      const lastUpdate = realOddsService.getLastRealUpdate();
      
      setDebugInfo({
        currentTime: new Date(),
        lastUpdate,
        nextUpdate: stats.nextUpdateTime,
        shouldUpdate: stats.shouldUpdateNow,
        cacheSize: 0, // Non possiamo accedere direttamente alla cache privata
        requestsUsed: stats.requestsUsed,
        requestsRemaining: stats.requestsRemaining,
        updatedToday: stats.updatedToday
      });
    };

    // Aggiorna immediatamente
    updateDebugInfo();

    // Aggiorna ogni 10 secondi
    const interval = setInterval(updateDebugInfo, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT') + ' ' + formatTime(date);
  };

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <Info className="h-6 w-6 text-blue-400 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-white">🔧 Debug Sistema</h3>
          <p className="text-dark-300 text-sm">
            Monitoraggio stato interno del sistema di aggiornamento
          </p>
        </div>
      </div>

      {/* Stato Temporale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-blue-400 mr-2" />
            <h4 className="font-semibold text-white">Stato Temporale</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-300">Ora Corrente:</span>
              <span className="text-white font-mono">{formatTime(debugInfo.currentTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Prossimo Aggiornamento:</span>
              <span className="text-white font-mono">{formatTime(debugInfo.nextUpdate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Dovrebbe Aggiornare:</span>
              <span className={`font-bold ${debugInfo.shouldUpdate ? 'text-green-400' : 'text-red-400'}`}>
                {debugInfo.shouldUpdate ? '✅ SÌ' : '❌ NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Aggiornato Oggi:</span>
              <span className={`font-bold ${debugInfo.updatedToday ? 'text-green-400' : 'text-yellow-400'}`}>
                {debugInfo.updatedToday ? '✅ SÌ' : '⏳ NO'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Database className="h-5 w-5 text-green-400 mr-2" />
            <h4 className="font-semibold text-white">Stato Cache</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-300">Ultimo Aggiornamento:</span>
              <span className="text-white font-mono">
                {debugInfo.lastUpdate ? formatDate(debugInfo.lastUpdate) : 'Mai'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Richieste Utilizzate:</span>
              <span className="text-white font-mono">
                {debugInfo.requestsUsed}/500
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Richieste Rimanenti:</span>
              <span className={`font-mono ${
                debugInfo.requestsRemaining > 100 ? 'text-green-400' : 
                debugInfo.requestsRemaining > 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {debugInfo.requestsRemaining}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Progresso API */}
      <div className="bg-dark-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <Zap className="h-5 w-5 text-yellow-400 mr-2" />
          <h4 className="font-semibold text-white">Utilizzo API Mensile</h4>
        </div>
        
        <div className="w-full bg-dark-600 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              debugInfo.requestsUsed < 250 ? 'bg-green-500' :
              debugInfo.requestsUsed < 400 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(debugInfo.requestsUsed / 500) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-dark-400">
          <span>0</span>
          <span className="font-bold text-white">
            {debugInfo.requestsUsed}/500 ({((debugInfo.requestsUsed / 500) * 100).toFixed(1)}%)
          </span>
          <span>500</span>
        </div>
      </div>

      {/* Logica di Aggiornamento */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">📋 Logica di Aggiornamento</h4>
        <div className="text-sm text-blue-200 space-y-1">
          <div>• <strong>Orario Aggiornamento:</strong> 12:00 ogni giorno</div>
          <div>• <strong>Condizioni:</strong> Ora ≥ 12:00 AND non aggiornato oggi</div>
          <div>• <strong>Cache:</strong> Valida per 24 ore dall'ultimo aggiornamento</div>
          <div>• <strong>Refresh Pagina:</strong> Non dovrebbe fare nuove richieste API</div>
          <div>• <strong>Aggiornamento Forzato:</strong> Solo tramite pulsante manuale</div>
        </div>
      </div>
    </div>
  );
} 