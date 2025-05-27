'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Calculator, Target, AlertCircle, DollarSign, BarChart3, Info } from 'lucide-react';
import { ArbitrageCalculator, ArbitrageOpportunity, formatArbitrageOpportunity } from '@/lib/arbitrageCalculator';
import { Match } from '@/types';

interface ArbitrageOpportunitiesProps {
  matches: Match[];
  className?: string;
}

// Interfaccia per quasi-arbitraggio
interface NearArbitrageOpportunity {
  match: Match;
  percentage: number;
  profit: number;
  bestOdds: {
    home: { odds: number; bookmaker: string };
    away: { odds: number; bookmaker: string };
    draw?: { odds: number; bookmaker: string };
  };
  type: 'calcio' | 'basket' | 'tennis' | 'other';
}

export default function ArbitrageOpportunities({ matches, className = '' }: ArbitrageOpportunitiesProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [minProfitFilter, setMinProfitFilter] = useState(1);
  const [showNearMiss, setShowNearMiss] = useState(false);

  // Calcola le opportunità di arbitraggio reali
  const realOpportunities = useMemo(() => {
    const allOpportunities = ArbitrageCalculator.findArbitrageOpportunities(matches);
    return allOpportunities
      .filter(opp => opp.profit >= minProfitFilter)
      .slice(0, 10);
  }, [matches, minProfitFilter]);

  // Calcola quasi-opportunità (margine bookmaker basso)
  const nearOpportunities = useMemo(() => {
    const nearOps: NearArbitrageOpportunity[] = [];
    
    matches.forEach(match => {
      if (match.odds.length < 2) return;

      // Calcola le migliori quote
      const homeOdds = match.odds
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.home }))
        .reduce((best, current) => current.odds > best.odds ? current : best);
      
      const awayOdds = match.odds
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.away }))
        .reduce((best, current) => current.odds > best.odds ? current : best);
      
      const drawOdds = match.odds
        .filter(odd => odd.draw)
        .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.draw! }))
        .reduce((best, current) => current.odds > best.odds ? current : best, { bookmaker: '', odds: 0 });

      // Calcola percentuale
      let totalPercentage;
      if (match.sport === 'calcio' && drawOdds.odds > 0) {
        totalPercentage = (100 / homeOdds.odds) + (100 / awayOdds.odds) + (100 / drawOdds.odds);
      } else {
        totalPercentage = (100 / homeOdds.odds) + (100 / awayOdds.odds);
      }

      const profit = 100 - totalPercentage;

      // Solo se è vicino all'arbitraggio (100-103%)
      if (totalPercentage >= 100 && totalPercentage <= 103) {
        nearOps.push({
          match,
          percentage: totalPercentage,
          profit,
          bestOdds: {
            home: homeOdds,
            away: awayOdds,
            draw: drawOdds.odds > 0 ? drawOdds : undefined
          },
          type: match.sport as 'calcio' | 'basket' | 'tennis' | 'other'
        });
      }
    });

    return nearOps
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  }, [matches]);

  const totalAnalyzed = matches.length;
  const totalRealOpportunities = ArbitrageCalculator.findArbitrageOpportunities(matches).length;

  // Mostra le opportunità da visualizzare
  const displayOpportunities = showNearMiss ? [] : realOpportunities;

  if (matches.length === 0) {
    return (
      <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <Calculator className="h-6 w-6 text-primary-400 mr-3" />
          <h3 className="text-xl font-bold text-white">🎯 Analisi Arbitraggio</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Nessuna partita da analizzare
          </h4>
          <p className="text-dark-300">
            Carica prima i dati delle partite per iniziare l'analisi di arbitraggio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calculator className="h-6 w-6 text-primary-400 mr-3" />
          <div>
            <h3 className="text-xl font-bold text-white">🎯 Opportunità di Arbitraggio</h3>
            <p className="text-dark-300 text-sm">
              {totalRealOpportunities} opportunità reali su {totalAnalyzed} partite analizzate
            </p>
          </div>
        </div>
        
        {/* Controlli */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-dark-300">Modalità:</label>
            <button
              onClick={() => setShowNearMiss(!showNearMiss)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                showNearMiss 
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                  : 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
              }`}
            >
              {showNearMiss ? 'Quasi-Arbitraggio' : 'Arbitraggio Reale'}
            </button>
          </div>
          
          {!showNearMiss && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-dark-300">Profitto min:</label>
              <select
                value={minProfitFilter}
                onChange={(e) => setMinProfitFilter(Number(e.target.value))}
                className="bg-dark-700 border border-dark-600 text-white rounded px-2 py-1 text-sm"
              >
                <option value={0}>Tutte</option>
                <option value={0.1}>0.1%+</option>
                <option value={0.5}>0.5%+</option>
                <option value={1}>1%+</option>
                <option value={2}>2%+</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{totalAnalyzed}</div>
          <div className="text-xs text-dark-400">Partite Analizzate</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{totalRealOpportunities}</div>
          <div className="text-xs text-dark-400">Arbitraggi Reali</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{nearOpportunities.length}</div>
          <div className="text-xs text-dark-400">Quasi-Arbitraggi</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary-400">
            {totalAnalyzed > 0 ? ((totalRealOpportunities / totalAnalyzed) * 100).toFixed(1) : '0'}%
          </div>
          <div className="text-xs text-dark-400">Tasso Successo</div>
        </div>
      </div>

      {/* Contenuto principale */}
      {showNearMiss ? (
        // Modalità Quasi-Arbitraggio
        <div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div className="text-yellow-200 text-sm">
                <strong>Modalità Quasi-Arbitraggio:</strong> Mostra le migliori opportunità con margine bookmaker basso (100-103%). 
                Non garantiscono profitto ma indicano value betting potenziale.
              </div>
            </div>
          </div>

          {nearOpportunities.length > 0 ? (
            <div className="space-y-4">
              {nearOpportunities.map((opportunity, index) => (
                <div
                  key={opportunity.match.id}
                  className="bg-dark-700 border border-yellow-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {opportunity.type === 'calcio' ? '⚽' : 
                         opportunity.type === 'basket' ? '🏀' : 
                         opportunity.type === 'tennis' ? '🎾' : '🏆'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {opportunity.match.homeTeam} vs {opportunity.match.awayTeam}
                        </h4>
                        <p className="text-sm text-dark-300">
                          {opportunity.match.league} • {opportunity.match.sport}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {opportunity.profit.toFixed(2)}%
                      </div>
                      <div className="text-xs text-dark-400">
                        Margine: {opportunity.percentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-dark-600 rounded p-2 text-center">
                      <div className="text-xs text-dark-300">Casa</div>
                      <div className="font-semibold text-white">{opportunity.bestOdds.home.odds.toFixed(2)}</div>
                      <div className="text-xs text-primary-400 truncate">{opportunity.bestOdds.home.bookmaker}</div>
                    </div>
                    {opportunity.bestOdds.draw && (
                      <div className="bg-dark-600 rounded p-2 text-center">
                        <div className="text-xs text-dark-300">Pareggio</div>
                        <div className="font-semibold text-white">{opportunity.bestOdds.draw.odds.toFixed(2)}</div>
                        <div className="text-xs text-primary-400 truncate">{opportunity.bestOdds.draw.bookmaker}</div>
                      </div>
                    )}
                    <div className="bg-dark-600 rounded p-2 text-center">
                      <div className="text-xs text-dark-300">Trasferta</div>
                      <div className="font-semibold text-white">{opportunity.bestOdds.away.odds.toFixed(2)}</div>
                      <div className="text-xs text-primary-400 truncate">{opportunity.bestOdds.away.bookmaker}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nessun quasi-arbitraggio trovato</p>
              <p className="text-sm mt-1">I margini dei bookmaker sono tutti superiori al 3%</p>
            </div>
          )}
        </div>
      ) : (
        // Modalità Arbitraggio Reale
        <div>
          {displayOpportunities.length > 0 ? (
            <div className="space-y-4">
              {displayOpportunities.map((opportunity, index) => (
                <div
                  key={opportunity.matchId}
                  className="bg-dark-700 border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {opportunity.type === 'tennis' ? '🎾' : 
                         opportunity.type === 'calcio_1x2' ? '⚽' : 
                         opportunity.type === 'basket' ? '🏀' : '🏆'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {opportunity.match.homeTeam} vs {opportunity.match.awayTeam}
                        </h4>
                        <p className="text-sm text-dark-300">
                          {opportunity.match.league} • {new Date(opportunity.match.date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-400">
                        +{opportunity.profit.toFixed(2)}%
                      </span>
                      <span className="text-xs">🟢</span>
                    </div>
                  </div>

                  {/* Quote migliori */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-dark-600 rounded p-2">
                      <div className="text-dark-300 text-xs">{opportunity.bestOdds.outcome1.label}</div>
                      <div className="font-semibold text-white">
                        {opportunity.bestOdds.outcome1.odds.toFixed(2)} 
                        <span className="text-xs text-primary-400 ml-1">
                          {opportunity.bestOdds.outcome1.bookmaker}
                        </span>
                      </div>
                    </div>
                    
                    {opportunity.bestOdds.outcome2 && (
                      <div className="bg-dark-600 rounded p-2">
                        <div className="text-dark-300 text-xs">{opportunity.bestOdds.outcome2.label}</div>
                        <div className="font-semibold text-white">
                          {opportunity.bestOdds.outcome2.odds.toFixed(2)}
                          <span className="text-xs text-primary-400 ml-1">
                            {opportunity.bestOdds.outcome2.bookmaker}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {opportunity.bestOdds.outcome3 && (
                      <div className="bg-dark-600 rounded p-2">
                        <div className="text-dark-300 text-xs">{opportunity.bestOdds.outcome3.label}</div>
                        <div className="font-semibold text-white">
                          {opportunity.bestOdds.outcome3.odds.toFixed(2)}
                          <span className="text-xs text-primary-400 ml-1">
                            {opportunity.bestOdds.outcome3.bookmaker}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-dark-400">
                    <div className="flex items-center space-x-2">
                      <Target className="h-3 w-3" />
                      <span>#{index + 1} migliore opportunità</span>
                    </div>
                    <div className="text-xs text-primary-400">
                      Clicca per dettagli →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔍</div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Nessuna opportunità di arbitraggio trovata
              </h4>
              <p className="text-dark-300 mb-4">
                Al momento non ci sono opportunità di scommessa sicura con profitto superiore al {minProfitFilter}%.
              </p>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4 text-left">
                <h5 className="font-semibold text-blue-300 mb-2">💡 Perché non ci sono opportunità?</h5>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Le opportunità di arbitraggio reali sono estremamente rare</li>
                  <li>• I bookmaker hanno margini di sicurezza del 2-8%</li>
                  <li>• Le quote vengono sincronizzate rapidamente</li>
                  <li>• Le vere opportunità durano pochi secondi</li>
                </ul>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setMinProfitFilter(0.1)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Cerca con soglia 0.1%
                </button>
                <button
                  onClick={() => setShowNearMiss(true)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  Mostra Quasi-Arbitraggi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Dettagli - resto del codice rimane uguale */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-900 border border-dark-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header Modal */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  🎯 Dettagli Opportunità di Arbitraggio
                </h3>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Info Partita */}
              <div className="bg-dark-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2">
                  {selectedOpportunity.match.homeTeam} vs {selectedOpportunity.match.awayTeam}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-dark-300">Sport:</span>
                    <span className="text-white ml-2">{selectedOpportunity.match.sport.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-dark-300">Campionato:</span>
                    <span className="text-white ml-2">{selectedOpportunity.match.league}</span>
                  </div>
                  <div>
                    <span className="text-dark-300">Data:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedOpportunity.match.date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-300">Profitto:</span>
                    <span className="ml-2 font-bold text-green-400">
                      +{selectedOpportunity.profit.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Calcolo */}
              <div className="bg-dark-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calcolo Arbitraggio
                </h4>
                <div className="bg-dark-700 rounded p-3 font-mono text-sm text-green-400">
                  {selectedOpportunity.calculation}
                </div>
                <p className="text-dark-300 text-sm mt-2">
                  {selectedOpportunity.recommendation}
                </p>
              </div>

              {/* Calcolatore Puntate */}
              <div className="bg-dark-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Calcolatore Puntate
                </h4>
                
                <div className="mb-4">
                  <label className="block text-sm text-dark-300 mb-2">
                    Importo totale da scommettere (€):
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full bg-dark-700 border border-dark-600 text-white rounded px-3 py-2"
                    min="1"
                    step="1"
                  />
                </div>

                {(() => {
                  const stakes = ArbitrageCalculator.calculateOptimalStakes(selectedOpportunity, stakeAmount);
                  return (
                    <div className="space-y-3">
                      <div className="bg-dark-700 rounded p-3">
                        <div className="text-sm text-dark-300">
                          {selectedOpportunity.bestOdds.outcome1.label}
                        </div>
                        <div className="font-semibold text-white">
                          €{stakes.outcome1} su {selectedOpportunity.bestOdds.outcome1.bookmaker}
                        </div>
                        <div className="text-xs text-primary-400">
                          Quota: {selectedOpportunity.bestOdds.outcome1.odds}
                        </div>
                      </div>

                      {stakes.outcome2 && selectedOpportunity.bestOdds.outcome2 && (
                        <div className="bg-dark-700 rounded p-3">
                          <div className="text-sm text-dark-300">
                            {selectedOpportunity.bestOdds.outcome2.label}
                          </div>
                          <div className="font-semibold text-white">
                            €{stakes.outcome2} su {selectedOpportunity.bestOdds.outcome2.bookmaker}
                          </div>
                          <div className="text-xs text-primary-400">
                            Quota: {selectedOpportunity.bestOdds.outcome2.odds}
                          </div>
                        </div>
                      )}

                      {stakes.outcome3 && selectedOpportunity.bestOdds.outcome3 && (
                        <div className="bg-dark-700 rounded p-3">
                          <div className="text-sm text-dark-300">
                            {selectedOpportunity.bestOdds.outcome3.label}
                          </div>
                          <div className="font-semibold text-white">
                            €{stakes.outcome3} su {selectedOpportunity.bestOdds.outcome3.bookmaker}
                          </div>
                          <div className="text-xs text-primary-400">
                            Quota: {selectedOpportunity.bestOdds.outcome3.odds}
                          </div>
                        </div>
                      )}

                      <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mt-4">
                        <div className="text-green-400 font-bold text-center">
                          💰 PROFITTO GARANTITO: €{stakes.guaranteedProfit}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Avvisi */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-yellow-200 text-sm">
                    <strong>Importante:</strong> L'arbitraggio richiede account su più bookmaker e 
                    le quote possono cambiare rapidamente. Verifica sempre le quote prima di scommettere.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 