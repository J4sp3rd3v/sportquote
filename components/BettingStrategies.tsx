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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {BETTING_STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedStrategy === strategy.id
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`p-1.5 rounded-lg ${selectedStrategy === strategy.id ? 'bg-primary-500/20' : 'bg-dark-600'} mr-2`}>
                {strategy.icon}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${selectedStrategy === strategy.id ? 'text-white' : 'text-white'}`}>
                  {strategy.name}
                </h3>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(strategy.riskLevel)}`}>
              {strategy.riskLevel === 'low' ? 'Basso' : 
               strategy.riskLevel === 'medium' ? 'Medio' : 'Alto'}
            </span>
          </button>
        ))}
      </div>

      {/* Matches for Selected Strategy */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
          <Target className="h-5 w-5 text-accent-400 mr-2" />
            Partite Consigliate per {currentStrategy?.name}
        </h3>
          <span className="text-sm text-dark-400">
            {filteredMatches.length} partite trovate
          </span>
        </div>
        
        {filteredMatches.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMatches.map((match) => {
              const bestOdds = calculateBestOdds(match);
              return (
                <div
                  key={match.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedMatch?.id === match.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-600 bg-dark-700/50 hover:border-primary-500/50 hover:bg-primary-500/5'
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">
                        {match.homeTeam} vs {match.awayTeam}
                      </h4>
                      <p className="text-dark-400 text-sm">{match.league} • {match.sport}</p>
                    </div>
                    <div className="text-right">
                    <span className="text-xs text-dark-400">
                      {new Date(match.date).toLocaleDateString('it-IT')}
                    </span>
                      <div className="text-xs text-primary-400 mt-1">
                        Clicca per simulare
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600/70 transition-colors">
                      <div className="text-xs text-dark-400 mb-1">Casa (1)</div>
                      <div className="font-bold text-white text-lg">{bestOdds.home.odds.toFixed(2)}</div>
                      <div className="text-xs text-primary-400 truncate">{bestOdds.home.bookmaker}</div>
                    </div>
                    {bestOdds.draw && (
                      <div className="text-center p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600/70 transition-colors">
                        <div className="text-xs text-dark-400 mb-1">Pareggio (X)</div>
                        <div className="font-bold text-white text-lg">{bestOdds.draw.odds.toFixed(2)}</div>
                        <div className="text-xs text-primary-400 truncate">{bestOdds.draw.bookmaker}</div>
                      </div>
                    )}
                    <div className="text-center p-3 bg-dark-600/50 rounded-lg hover:bg-dark-600/70 transition-colors">
                      <div className="text-xs text-dark-400 mb-1">Trasferta (2)</div>
                      <div className="font-bold text-white text-lg">{bestOdds.away.odds.toFixed(2)}</div>
                      <div className="text-xs text-primary-400 truncate">{bestOdds.away.bookmaker}</div>
                    </div>
                  </div>
                  
                  {/* Strategy Recommendation */}
                  <div className="mt-3 p-2 bg-dark-800/50 rounded-lg">
                    <div className="text-xs text-dark-300">
                      💡 <strong>Consiglio strategia:</strong> {currentStrategy?.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-400 bg-dark-700/30 rounded-lg">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Nessuna partita disponibile per questa strategia</p>
            <p className="text-sm mt-1">Prova a selezionare una strategia diversa o controlla domani</p>
          </div>
        )}
      </div>

      {/* Betting Simulator - Solo se una partita è selezionata */}
      {selectedMatch && (
        <div className="bg-gradient-to-r from-primary-900/20 to-accent-900/20 border border-primary-500/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Calculator className="h-5 w-5 text-accent-400 mr-2" />
            Simulatore: {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Outcome Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-dark-300 mb-2">Scegli Esito</label>
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
                        if (bestOdds.draw) {
                          odds = bestOdds.draw.odds;
                        } else {
                          available = false;
                        }
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
                        className={`p-2 rounded-lg border transition-all ${
                          selectedOutcome === outcome
                            ? 'border-primary-500 bg-primary-500/20 text-white'
                            : available
                            ? 'border-dark-600 bg-dark-700/50 text-dark-300 hover:border-primary-500/50'
                            : 'border-dark-700 bg-dark-800/50 text-dark-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-xs mb-1">
                          {outcome === '1' ? 'Casa' : outcome === 'X' ? 'Pareggio' : 'Trasferta'}
                        </div>
                        <div className="font-bold">
                          {available ? odds.toFixed(2) : 'N/A'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Stake Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-dark-300 mb-2">Importo (€)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              
              <button
                onClick={simulateBet}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Simula Scommessa
              </button>
            </div>
            
            <div>
              {/* Simulation Results */}
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
                  <div className="bg-dark-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Calcolo Vincita</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-300">Quota:</span>
                      <span className="text-white font-medium">{odds.toFixed(2)}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Bookmaker:</span>
                        <span className="text-primary-400 text-xs">{bookmaker}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Puntata:</span>
                        <span className="text-white">€{stake.toFixed(2)}</span>
                    </div>
                      <div className="border-t border-dark-600 pt-2">
                        <div className="flex justify-between">
                          <span className="text-dark-300">Vincita Totale:</span>
                      <span className="text-success-400 font-bold">€{potentialWin.toFixed(2)}</span>
                    </div>
                        <div className="flex justify-between">
                          <span className="text-dark-300">Profitto:</span>
                      <span className="text-accent-400 font-bold">€{profit.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Avvertenza */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-200 text-sm">
              <strong>Avvertenza:</strong> Questo è solo un simulatore. Scommetti responsabilmente e solo quello che puoi permetterti di perdere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 