'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Calculator, Target, AlertCircle, DollarSign, BarChart3 } from 'lucide-react';
import { ArbitrageCalculator, ArbitrageOpportunity, formatArbitrageOpportunity } from '@/lib/arbitrageCalculator';
import { Match } from '@/types';

interface ArbitrageOpportunitiesProps {
  matches: Match[];
  className?: string;
}

export default function ArbitrageOpportunities({ matches, className = '' }: ArbitrageOpportunitiesProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [minProfitFilter, setMinProfitFilter] = useState(1);

  // Calcola le opportunità di arbitraggio
  const opportunities = useMemo(() => {
    const allOpportunities = ArbitrageCalculator.findArbitrageOpportunities(matches);
    return allOpportunities
      .filter(opp => opp.profit >= minProfitFilter)
      .slice(0, 10); // Mostra solo le prime 10
  }, [matches, minProfitFilter]);

  const totalOpportunities = useMemo(() => {
    return ArbitrageCalculator.findArbitrageOpportunities(matches).length;
  }, [matches]);

  if (opportunities.length === 0) {
    return (
      <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <Calculator className="h-6 w-6 text-primary-400 mr-3" />
          <h3 className="text-xl font-bold text-white">🎯 Analisi Arbitraggio</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <h4 className="text-lg font-semibold text-white mb-2">
            Nessuna opportunità di arbitraggio trovata
          </h4>
          <p className="text-dark-300 mb-4">
            Al momento non ci sono opportunità di scommessa sicura con profitto superiore al {minProfitFilter}%.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setMinProfitFilter(0.5)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Cerca con soglia 0.5%
            </button>
            <button
              onClick={() => setMinProfitFilter(0)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Mostra tutte
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCalculateStakes = (opportunity: ArbitrageOpportunity) => {
    return ArbitrageCalculator.calculateOptimalStakes(opportunity, stakeAmount);
  };

  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calculator className="h-6 w-6 text-primary-400 mr-3" />
          <div>
            <h3 className="text-xl font-bold text-white">🎯 Opportunità di Arbitraggio</h3>
            <p className="text-dark-300 text-sm">
              {opportunities.length} opportunità trovate su {totalOpportunities} analizzate
            </p>
          </div>
        </div>
        
        {/* Filtri */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-dark-300">Profitto min:</label>
            <select
              value={minProfitFilter}
              onChange={(e) => setMinProfitFilter(Number(e.target.value))}
              className="bg-dark-700 border border-dark-600 text-white rounded px-2 py-1 text-sm"
            >
              <option value={0}>Tutte</option>
              <option value={0.5}>0.5%+</option>
              <option value={1}>1%+</option>
              <option value={2}>2%+</option>
              <option value={3}>3%+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista Opportunità */}
      <div className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <div
            key={opportunity.matchId}
            className="bg-dark-700 border border-dark-600 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer"
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
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                                     <span className={`text-lg font-bold ${
                     opportunity.riskLevel === 'low' ? 'text-green-400' :
                     opportunity.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                   }`}>
                     +{opportunity.profit.toFixed(2)}%
                   </span>
                   <span className="text-xs">
                     {opportunity.riskLevel === 'low' ? '🟢' : 
                      opportunity.riskLevel === 'medium' ? '🟡' : '🔴'}
                   </span>
                 </div>
                 <div className="text-xs text-dark-400">
                   {opportunity.percentage.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Quote migliori */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
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

            {/* Indicatore di ranking */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-dark-400">
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

      {/* Modal Dettagli */}
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
                                         <span className={`ml-2 font-bold ${
                       selectedOpportunity.riskLevel === 'low' ? 'text-green-400' :
                       selectedOpportunity.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                     }`}>
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
                  const stakes = handleCalculateStakes(selectedOpportunity);
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