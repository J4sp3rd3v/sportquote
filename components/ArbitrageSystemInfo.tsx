'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Info, ChevronDown, ChevronUp, Target, DollarSign } from 'lucide-react';

export default function ArbitrageSystemInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-primary-900/20 to-accent-900/20 border border-primary-500/30 rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Calculator className="h-6 w-6 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">🎯 Sistema di Arbitraggio Intelligente</h3>
            <p className="text-primary-200 text-sm">
              Calcolo automatico delle opportunità di scommessa sicura
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
        >
          <span className="text-sm">
            {isExpanded ? 'Nascondi dettagli' : 'Mostra dettagli'}
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-dark-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-success-400" />
            <span className="text-success-400 font-semibold">Tennis & Basket</span>
          </div>
          <div className="text-sm text-dark-300">
            Formula: (100/quota1) + (100/quota2)
          </div>
          <div className="text-xs text-success-300 mt-1">
            Se &lt; 100% = Opportunità
          </div>
        </div>

        <div className="bg-dark-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-warning-400" />
            <span className="text-warning-400 font-semibold">Calcio (1X2)</span>
          </div>
          <div className="text-sm text-dark-300">
            Formula: (100/quota1) + (100/quotaX) + (100/quota2)
          </div>
          <div className="text-xs text-warning-300 mt-1">
            Tre esiti da considerare
          </div>
        </div>

        <div className="bg-dark-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary-400" />
            <span className="text-primary-400 font-semibold">Profitto Garantito</span>
          </div>
          <div className="text-sm text-dark-300">
            Indipendente dal risultato
          </div>
          <div className="text-xs text-primary-300 mt-1">
            Calcolo automatico puntate
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-primary-500/20 pt-6 space-y-6">
          
          {/* Come Funziona */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary-400" />
              Come Funziona l'Arbitraggio
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-primary-300 mb-3">🎾 Tennis/Basket (2 esiti)</h5>
                <div className="space-y-2 text-sm text-dark-300">
                  <div className="bg-dark-700/50 rounded p-2 font-mono text-green-400">
                    (100/quota_giocatore1) + (100/quota_giocatore2)
                  </div>
                  <p>
                    <strong>Esempio:</strong> Se Djokovic ha quota 2.20 su Bet365 e Nadal ha quota 2.10 su William Hill:
                  </p>
                  <div className="bg-dark-700/50 rounded p-2 font-mono text-xs">
                    (100/2.20) + (100/2.10) = 45.45 + 47.62 = 93.07%
                  </div>
                  <p className="text-success-400">
                    ✅ 93.07% &lt; 100% = <strong>Profitto garantito del 6.93%</strong>
                  </p>
                </div>
              </div>

              <div className="bg-dark-800/30 rounded-lg p-4">
                <h5 className="font-semibold text-warning-300 mb-3">⚽ Calcio (3 esiti)</h5>
                <div className="space-y-2 text-sm text-dark-300">
                  <div className="bg-dark-700/50 rounded p-2 font-mono text-green-400">
                    (100/quota_1) + (100/quota_X) + (100/quota_2)
                  </div>
                  <p>
                    <strong>Esempio:</strong> Juventus-Inter con quote 2.15, 3.25, 3.50:
                  </p>
                  <div className="bg-dark-700/50 rounded p-2 font-mono text-xs">
                    (100/2.15) + (100/3.25) + (100/3.50) = 105.85%
                  </div>
                  <p className="text-red-400">
                    ❌ 105.85% &gt; 100% = <strong>Nessuna opportunità</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategia di Scommessa */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-success-400" />
              Strategia di Scommessa Ottimale
            </h4>
            
            <div className="bg-dark-800/30 rounded-lg p-4">
              <p className="text-dark-300 mb-4">
                Quando viene identificata un'opportunità, il sistema calcola automaticamente la distribuzione ottimale delle puntate:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-success-900/20 border border-success-500/30 rounded p-3">
                  <h5 className="text-success-400 font-semibold mb-2">📊 Calcolo Puntate</h5>
                  <div className="text-sm text-dark-300 space-y-1">
                    <div>• Puntata 1 = (Percentuale 1 / Totale %) × Budget</div>
                    <div>• Puntata 2 = (Percentuale 2 / Totale %) × Budget</div>
                    <div>• Profitto = (100 - Totale %) × Budget / 100</div>
                  </div>
                </div>
                
                <div className="bg-primary-900/20 border border-primary-500/30 rounded p-3">
                  <h5 className="text-primary-400 font-semibold mb-2">💰 Esempio Pratico</h5>
                  <div className="text-sm text-dark-300 space-y-1">
                    <div>• Budget: €100</div>
                    <div>• Puntata Djokovic: €48.84</div>
                    <div>• Puntata Nadal: €51.16</div>
                    <div className="text-success-400 font-semibold">• Profitto garantito: €6.93</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vantaggi del Sistema */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">✨ Vantaggi del Sistema</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success-400 rounded-full mt-2"></div>
                  <div>
                    <h5 className="text-success-400 font-semibold">Profitto Garantito</h5>
                    <p className="text-sm text-dark-300">
                      Indipendente dal risultato della partita
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                  <div>
                    <h5 className="text-primary-400 font-semibold">Calcolo Automatico</h5>
                    <p className="text-sm text-dark-300">
                      Analisi di tutte le partite in tempo reale
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning-400 rounded-full mt-2"></div>
                  <div>
                    <h5 className="text-warning-400 font-semibold">Multi-Bookmaker</h5>
                    <p className="text-sm text-dark-300">
                      Confronto tra 54+ operatori
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mt-2"></div>
                  <div>
                    <h5 className="text-accent-400 font-semibold">Filtri Intelligenti</h5>
                    <p className="text-sm text-dark-300">
                      Solo opportunità sopra soglia di profitto
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Avvertenze */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Importante da Sapere
            </h4>
            <div className="text-sm text-yellow-200 space-y-2">
              <div>• <strong>Account multipli:</strong> Serve un account su ogni bookmaker coinvolto</div>
              <div>• <strong>Quote volatili:</strong> Le quote cambiano rapidamente, verifica sempre prima di scommettere</div>
              <div>• <strong>Limiti di puntata:</strong> Alcuni bookmaker hanno limiti che potrebbero ridurre il profitto</div>
              <div>• <strong>Commissioni:</strong> Considera eventuali commissioni dei bookmaker</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 