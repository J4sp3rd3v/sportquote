'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Target, DollarSign, AlertTriangle, Info, Zap, Trophy, BarChart3, PieChart } from 'lucide-react';
import { Match, BestOdds } from '@/types';

interface BettingStrategiesProps {
  matches: Match[];
}

interface BettingStrategy {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  riskLevel: 'low' | 'medium' | 'high';
  minOdds: number;
  maxOdds?: number;
  color: string;
}

interface BettingSimulation {
  strategy: string;
  match: Match;
  outcome: '1' | 'X' | '2';
  odds: number;
  bookmaker: string;
  stake: number;
  potentialWin: number;
  profit: number;
}

const BETTING_STRATEGIES: BettingStrategy[] = [
  {
    id: 'value_betting',
    name: 'Value Betting',
    description: 'Scommesse su quote sottovalutate con valore atteso positivo',
    icon: <Target className="h-5 w-5" />,
    riskLevel: 'medium',
    minOdds: 1.8,
    maxOdds: 4.0,
    color: 'blue'
  },
  {
    id: 'safe_betting',
    name: 'Scommesse Sicure',
    description: 'Quote basse con alta probabilità di successo',
    icon: <Trophy className="h-5 w-5" />,
    riskLevel: 'low',
    minOdds: 1.2,
    maxOdds: 1.8,
    color: 'green'
  },
  {
    id: 'high_odds',
    name: 'Quote Alte',
    description: 'Scommesse ad alto rischio e alta ricompensa',
    icon: <Zap className="h-5 w-5" />,
    riskLevel: 'high',
    minOdds: 3.0,
    color: 'red'
  },
  {
    id: 'balanced',
    name: 'Equilibrate',
    description: 'Partite con quote simili tra i due esiti principali',
    icon: <BarChart3 className="h-5 w-5" />,
    riskLevel: 'medium',
    minOdds: 1.8,
    maxOdds: 2.5,
    color: 'purple'
  }
];

export default function BettingStrategies({ matches }: BettingStrategiesProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('value_betting');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'1' | 'X' | '2'>('1');
  const [stake, setStake] = useState<number>(10);
  const [simulations, setSimulations] = useState<BettingSimulation[]>([]);

  // Calcola le migliori quote per ogni partita
  const calculateBestOdds = (match: Match): BestOdds => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    return {
      home: bestHome,
      away: bestAway,
      draw: bestDraw
    };
  };

  // Filtra le partite in base alla strategia selezionata
  const filteredMatches = useMemo(() => {
    const strategy = BETTING_STRATEGIES.find(s => s.id === selectedStrategy);
    if (!strategy) return [];

    return matches.filter(match => {
      const bestOdds = calculateBestOdds(match);
      
      switch (strategy.id) {
        case 'value_betting':
          // Quote con buon valore (non troppo basse, non troppo alte)
          const avgOdds = (bestOdds.home.odds + bestOdds.away.odds + (bestOdds.draw?.odds || 0)) / (bestOdds.draw ? 3 : 2);
          return avgOdds >= strategy.minOdds && avgOdds <= (strategy.maxOdds || 10);
          
        case 'safe_betting':
          // Almeno una quota bassa disponibile
          const minOdds = Math.min(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 10);
          return minOdds >= strategy.minOdds && minOdds <= (strategy.maxOdds || 10);
          
        case 'high_odds':
          // Almeno una quota alta disponibile
          const maxOdds = Math.max(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 0);
          return maxOdds >= strategy.minOdds;
          
        case 'balanced':
          // Quote simili tra casa e trasferta
          const diff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);
          return diff < 0.5 && bestOdds.home.odds >= strategy.minOdds && bestOdds.home.odds <= (strategy.maxOdds || 10);
          
        default:
          return true;
      }
    }).slice(0, 10); // Limita a 10 partite per performance
  }, [matches, selectedStrategy]);

  // Simula una scommessa
  const simulateBet = () => {
    if (!selectedMatch) return;

    const bestOdds = calculateBestOdds(selectedMatch);
    let odds = 0;
    let bookmaker = '';

    switch (selectedOutcome) {
      case '1':
        odds = bestOdds.home.odds;
        bookmaker = bestOdds.home.bookmaker;
        break;
      case 'X':
        if (bestOdds.draw) {
          odds = bestOdds.draw.odds;
          bookmaker = bestOdds.draw.bookmaker;
        }
        break;
      case '2':
        odds = bestOdds.away.odds;
        bookmaker = bestOdds.away.bookmaker;
        break;
    }

    if (odds === 0) return;

    const potentialWin = stake * odds;
    const profit = potentialWin - stake;

    const simulation: BettingSimulation = {
      strategy: selectedStrategy,
      match: selectedMatch,
      outcome: selectedOutcome,
      odds,
      bookmaker,
      stake,
      potentialWin,
      profit
    };

    setSimulations(prev => [simulation, ...prev.slice(0, 9)]); // Mantieni solo le ultime 10 simulazioni
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStrategyColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'green': return 'border-green-500 bg-green-50';
      case 'red': return 'border-red-500 bg-red-50';
      case 'purple': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const currentStrategy = BETTING_STRATEGIES.find(s => s.id === selectedStrategy);

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-primary-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">🎯 Strategie di Scommessa</h2>
      </div>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {BETTING_STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedStrategy === strategy.id
                ? `${getStrategyColor(strategy.color)} border-opacity-100`
                : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg ${selectedStrategy === strategy.id ? 'bg-white/20' : 'bg-dark-600'} mr-3`}>
                {strategy.icon}
              </div>
              <div>
                <h3 className={`font-semibold ${selectedStrategy === strategy.id ? 'text-gray-900' : 'text-white'}`}>
                  {strategy.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(strategy.riskLevel)}`}>
                  {strategy.riskLevel === 'low' ? 'Basso Rischio' : 
                   strategy.riskLevel === 'medium' ? 'Medio Rischio' : 'Alto Rischio'}
                </span>
              </div>
            </div>
            <p className={`text-sm ${selectedStrategy === strategy.id ? 'text-gray-700' : 'text-dark-300'}`}>
              {strategy.description}
            </p>
          </button>
        ))}
      </div>

      {/* Strategy Info */}
      {currentStrategy && (
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Info className="h-5 w-5 text-primary-400 mr-2" />
            <h3 className="font-semibold text-white">Strategia: {currentStrategy.name}</h3>
          </div>
          <p className="text-dark-300 text-sm mb-3">{currentStrategy.description}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-dark-400">
              Quote consigliate: {currentStrategy.minOdds} - {currentStrategy.maxOdds || '∞'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(currentStrategy.riskLevel)}`}>
              {currentStrategy.riskLevel === 'low' ? 'Basso Rischio' : 
               currentStrategy.riskLevel === 'medium' ? 'Medio Rischio' : 'Alto Rischio'}
            </span>
          </div>
        </div>
      )}

      {/* Matches for Selected Strategy */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 text-accent-400 mr-2" />
          Partite Consigliate ({filteredMatches.length})
        </h3>
        
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredMatches.map((match) => {
              const bestOdds = calculateBestOdds(match);
              return (
                <div
                  key={match.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedMatch?.id === match.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {match.homeTeam} vs {match.awayTeam}
                      </h4>
                      <p className="text-dark-400 text-xs">{match.league}</p>
                    </div>
                    <span className="text-xs text-dark-400">
                      {new Date(match.date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-dark-600/50 rounded">
                      <div className="text-xs text-dark-400 mb-1">1</div>
                      <div className="font-bold text-white text-sm">{bestOdds.home.odds}</div>
                      <div className="text-xs text-primary-400 truncate">{bestOdds.home.bookmaker}</div>
                    </div>
                    {bestOdds.draw && (
                      <div className="text-center p-2 bg-dark-600/50 rounded">
                        <div className="text-xs text-dark-400 mb-1">X</div>
                        <div className="font-bold text-white text-sm">{bestOdds.draw.odds}</div>
                        <div className="text-xs text-primary-400 truncate">{bestOdds.draw.bookmaker}</div>
                      </div>
                    )}
                    <div className="text-center p-2 bg-dark-600/50 rounded">
                      <div className="text-xs text-dark-400 mb-1">2</div>
                      <div className="font-bold text-white text-sm">{bestOdds.away.odds}</div>
                      <div className="text-xs text-primary-400 truncate">{bestOdds.away.bookmaker}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nessuna partita disponibile per questa strategia</p>
            <p className="text-sm mt-1">Prova a selezionare una strategia diversa</p>
          </div>
        )}
      </div>

      {/* Betting Simulator */}
      {selectedMatch && (
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calculator className="h-5 w-5 text-accent-400 mr-2" />
            Simulatore Scommessa
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </h4>
              
              {/* Outcome Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Esito</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1', 'X', '2'].map((outcome) => {
                    const bestOdds = calculateBestOdds(selectedMatch);
                    let odds = 0;
                    let available = true;
                    
                    switch (outcome) {
                      case '1':
                        odds = bestOdds.home.odds;
                        break;
                      case 'X':
                        odds = bestOdds.draw?.odds || 0;
                        available = !!bestOdds.draw;
                        break;
                      case '2':
                        odds = bestOdds.away.odds;
                        break;
                    }
                    
                    return (
                      <button
                        key={outcome}
                        onClick={() => setSelectedOutcome(outcome as '1' | 'X' | '2')}
                        disabled={!available}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          selectedOutcome === outcome
                            ? 'border-primary-500 bg-primary-500/20 text-white'
                            : available
                            ? 'border-dark-500 bg-dark-600/50 text-dark-300 hover:border-dark-400'
                            : 'border-dark-600 bg-dark-700/30 text-dark-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{outcome}</div>
                          <div className="text-sm">{available ? odds.toFixed(2) : 'N/A'}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Stake Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">Puntata (€)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  min="1"
                  max="10000"
                  className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <button
                onClick={simulateBet}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Simula Scommessa
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Calcolo Vincita</h4>
              {(() => {
                const bestOdds = calculateBestOdds(selectedMatch);
                let odds = 0;
                let bookmaker = '';
                
                switch (selectedOutcome) {
                  case '1':
                    odds = bestOdds.home.odds;
                    bookmaker = bestOdds.home.bookmaker;
                    break;
                  case 'X':
                    if (bestOdds.draw) {
                      odds = bestOdds.draw.odds;
                      bookmaker = bestOdds.draw.bookmaker;
                    }
                    break;
                  case '2':
                    odds = bestOdds.away.odds;
                    bookmaker = bestOdds.away.bookmaker;
                    break;
                }
                
                const potentialWin = stake * odds;
                const profit = potentialWin - stake;
                
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-dark-600/50 rounded-lg">
                      <span className="text-dark-300">Quota</span>
                      <span className="text-white font-medium">{odds.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-dark-600/50 rounded-lg">
                      <span className="text-dark-300">Bookmaker</span>
                      <span className="text-primary-400 font-medium">{bookmaker}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-dark-600/50 rounded-lg">
                      <span className="text-dark-300">Puntata</span>
                      <span className="text-white font-medium">€{stake.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-success-500/20 border border-success-500/30 rounded-lg">
                      <span className="text-success-300">Vincita Potenziale</span>
                      <span className="text-success-400 font-bold">€{potentialWin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent-500/20 border border-accent-500/30 rounded-lg">
                      <span className="text-accent-300">Profitto</span>
                      <span className="text-accent-400 font-bold">€{profit.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Simulation History */}
      {simulations.length > 0 && (
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 text-accent-400 mr-2" />
            Cronologia Simulazioni
          </h3>
          
          <div className="space-y-3">
            {simulations.map((sim, index) => (
              <div key={index} className="p-4 bg-dark-600/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-white text-sm">
                      {sim.match.homeTeam} vs {sim.match.awayTeam}
                    </h4>
                    <p className="text-dark-400 text-xs">{sim.match.league}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      Esito {sim.outcome} @ {sim.odds.toFixed(2)}
                    </div>
                    <div className="text-xs text-primary-400">{sim.bookmaker}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-dark-400">Puntata:</span>
                    <span className="text-white ml-1">€{sim.stake.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Vincita:</span>
                    <span className="text-success-400 ml-1">€{sim.potentialWin.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Profitto:</span>
                    <span className="text-accent-400 ml-1">€{sim.profit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <h4 className="font-medium text-white mb-2">Riepilogo Simulazioni</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-dark-400">Totale Puntate:</span>
                <span className="text-white ml-1">
                  €{simulations.reduce((sum, sim) => sum + sim.stake, 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-dark-400">Vincite Potenziali:</span>
                <span className="text-success-400 ml-1">
                  €{simulations.reduce((sum, sim) => sum + sim.potentialWin, 0).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-dark-400">Profitto Totale:</span>
                <span className="text-accent-400 ml-1">
                  €{simulations.reduce((sum, sim) => sum + sim.profit, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-300 mb-1">Avvertenza Importante</h4>
            <p className="text-yellow-200 text-sm">
              Questo è solo un simulatore. Le scommesse comportano sempre dei rischi. 
              Scommetti responsabilmente e solo quello che puoi permetterti di perdere. 
              Le quote possono variare e non sono garantite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 