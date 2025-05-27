'use client';

import React, { useState } from 'react';
import { Target, Calculator, TrendingUp, Shield, BookOpen, Zap } from 'lucide-react';
import { useDailyOdds } from '@/hooks/useDailyOdds';
import BettingStrategies from '@/components/BettingStrategies';
import BettingGuide from '@/components/BettingGuide';

export default function StrategiesPage() {
  const [activeStrategy, setActiveStrategy] = useState<'value' | 'arbitrage' | 'bankroll' | 'advanced'>('value');
  
  const { matches, hasRealData } = useDailyOdds();

  const strategies = [
    {
      id: 'value' as const,
      name: 'Value Betting',
      icon: Target,
      description: 'Identifica quote sottovalutate per profitti a lungo termine',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'arbitrage' as const,
      name: 'Arbitraggio',
      icon: Zap,
      description: 'Profitti garantiti sfruttando differenze di quote',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'bankroll' as const,
      name: 'Gestione Bankroll',
      icon: Shield,
      description: 'Strategie per proteggere e far crescere il capitale',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'advanced' as const,
      name: 'Strategie Avanzate',
      icon: Calculator,
      description: 'Tecniche professionali per trader esperti',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-gradient pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary-500/20 border border-primary-500/30 text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Strategie Professionali
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            Strategie di Betting Avanzate
          </h1>
          
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Guide complete e strumenti professionali per massimizzare i profitti 
            nel betting sportivo con gestione scientifica del rischio.
          </p>
        </div>

        {/* Navigation Strategie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            const isActive = activeStrategy === strategy.id;
            
            return (
              <button
                key={strategy.id}
                onClick={() => setActiveStrategy(strategy.id)}
                className={`p-6 rounded-xl border transition-all duration-200 text-left ${
                  isActive 
                    ? `${strategy.bgColor} ${strategy.borderColor} scale-105` 
                    : 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50'
                }`}
              >
                <Icon className={`h-8 w-8 mb-4 ${isActive ? strategy.color : 'text-dark-400'}`} />
                <h3 className={`font-bold text-lg mb-2 ${isActive ? 'text-white' : 'text-dark-200'}`}>
                  {strategy.name}
                </h3>
                <p className={`text-sm ${isActive ? 'text-dark-200' : 'text-dark-400'}`}>
                  {strategy.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Contenuto Strategia Attiva */}
        <div className="space-y-8">
          
          {activeStrategy === 'value' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-green-400 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Value Betting</h2>
                    <p className="text-green-300">Strategia per identificare quote sottovalutate</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">🎯 Principi Fondamentali</h3>
                    <ul className="space-y-3 text-dark-300">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span><strong>Valore Reale:</strong> Trova quote superiori alla probabilità reale dell'evento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span><strong>Analisi Statistica:</strong> Usa dati storici e modelli predittivi</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span><strong>Disciplina:</strong> Scommetti solo quando c'è valore matematico</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        <span><strong>Lungo Termine:</strong> Profitti garantiti su grandi volumi</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">📊 Calcolo del Valore</h3>
                    <div className="bg-dark-800/50 rounded-lg p-4">
                      <div className="text-sm text-dark-300 mb-2">Formula del Value Betting:</div>
                      <div className="bg-dark-900/50 rounded p-3 font-mono text-green-400">
                        Valore = (Quota × Probabilità Reale) - 1
                      </div>
                                             <div className="text-xs text-dark-400 mt-2">
                         Se Valore {'>'} 0, la scommessa ha valore positivo
                       </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">Esempio Pratico</h4>
                      <div className="text-sm text-dark-300">
                        <div>Quota bookmaker: 2.50</div>
                        <div>Probabilità reale stimata: 45%</div>
                        <div className="text-green-400 font-bold">Valore = (2.50 × 0.45) - 1 = +0.125 (12.5%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStrategy === 'arbitrage' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Zap className="h-8 w-8 text-purple-400 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Arbitraggio Sportivo</h2>
                    <p className="text-purple-300">Profitti garantiti senza rischi</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">⚡ Come Funziona</h3>
                    <ul className="space-y-3 text-dark-300">
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span><strong>Differenze di Quote:</strong> Sfrutta discrepanze tra bookmaker</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span><strong>Copertura Totale:</strong> Scommetti su tutti i possibili risultati</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span><strong>Profitto Garantito:</strong> Guadagno indipendente dal risultato</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span><strong>Velocità:</strong> Opportunità disponibili per poco tempo</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">🧮 Calcolo Arbitraggio</h3>
                    <div className="bg-dark-800/50 rounded-lg p-4">
                      <div className="text-sm text-dark-300 mb-2">Formula per rilevare arbitraggio:</div>
                                             <div className="bg-dark-900/50 rounded p-3 font-mono text-purple-400">
                         (1/Quota1) + (1/Quota2) + (1/QuotaX) {'<'} 1
                       </div>
                                             <div className="text-xs text-dark-400 mt-2">
                         Se la somma è {'<'} 1, c'è opportunità di arbitraggio
                       </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Esempio Arbitraggio</h4>
                      <div className="text-sm text-dark-300">
                        <div>Casa: 2.10 (Bookmaker A)</div>
                        <div>Pareggio: 3.40 (Bookmaker B)</div>
                        <div>Trasferta: 3.80 (Bookmaker C)</div>
                        <div className="text-purple-400 font-bold">
                          Somma: 0.476 + 0.294 + 0.263 = 1.033 (No arbitraggio)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStrategy === 'bankroll' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-blue-400 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Gestione Bankroll</h2>
                    <p className="text-blue-300">Proteggi e fai crescere il tuo capitale</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-dark-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🎯 Kelly Criterion</h3>
                    <p className="text-dark-300 text-sm mb-4">
                      Formula matematica per calcolare la percentuale ottimale del bankroll da scommettere.
                    </p>
                    <div className="bg-dark-900/50 rounded p-3 font-mono text-blue-400 text-sm">
                      f = (bp - q) / b
                    </div>
                    <div className="text-xs text-dark-400 mt-2">
                      f = frazione da scommettere<br/>
                      b = quota - 1<br/>
                      p = probabilità di vincita<br/>
                      q = probabilità di perdita
                    </div>
                  </div>
                  
                  <div className="bg-dark-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📊 Fixed Stakes</h3>
                    <p className="text-dark-300 text-sm mb-4">
                      Scommetti sempre la stessa percentuale fissa del bankroll.
                    </p>
                    <ul className="text-sm text-dark-300 space-y-2">
                      <li>• <strong>Conservativo:</strong> 1-2% del bankroll</li>
                      <li>• <strong>Moderato:</strong> 3-5% del bankroll</li>
                      <li>• <strong>Aggressivo:</strong> 5-10% del bankroll</li>
                    </ul>
                  </div>
                  
                  <div className="bg-dark-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🛡️ Stop Loss</h3>
                    <p className="text-dark-300 text-sm mb-4">
                      Regole per limitare le perdite e proteggere il capitale.
                    </p>
                    <ul className="text-sm text-dark-300 space-y-2">
                      <li>• <strong>Giornaliero:</strong> Max 5% del bankroll</li>
                      <li>• <strong>Settimanale:</strong> Max 15% del bankroll</li>
                      <li>• <strong>Mensile:</strong> Max 30% del bankroll</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStrategy === 'advanced' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Calculator className="h-8 w-8 text-yellow-400 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Strategie Avanzate</h2>
                    <p className="text-yellow-300">Tecniche per trader professionisti</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-dark-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">📈 Scalping</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Sfrutta piccole variazioni di quote per profitti rapidi.
                      </p>
                      <ul className="text-sm text-dark-300 space-y-1">
                        <li>• Movimenti di quote in tempo reale</li>
                        <li>• Profitti piccoli ma frequenti</li>
                        <li>• Richiede velocità di esecuzione</li>
                      </ul>
                    </div>
                    
                    <div className="bg-dark-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">🎲 Hedging</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Proteggi le scommesse esistenti con scommesse opposte.
                      </p>
                      <ul className="text-sm text-dark-300 space-y-1">
                        <li>• Riduce il rischio di perdite</li>
                        <li>• Garantisce profitti parziali</li>
                        <li>• Utile per scommesse a lungo termine</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-dark-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">🔄 Trading</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Compra e vendi posizioni per profitti indipendenti dal risultato.
                      </p>
                      <ul className="text-sm text-dark-300 space-y-1">
                        <li>• Back e Lay su exchange</li>
                        <li>• Profitti da movimenti di quote</li>
                        <li>• Richiede esperienza avanzata</li>
                      </ul>
                    </div>
                    
                    <div className="bg-dark-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">📊 Modelli Predittivi</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Usa algoritmi e machine learning per prevedere risultati.
                      </p>
                      <ul className="text-sm text-dark-300 space-y-1">
                        <li>• Analisi di big data</li>
                        <li>• Modelli statistici avanzati</li>
                        <li>• Automazione delle decisioni</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strumenti Pratici */}
          {hasRealData && (
            <div className="space-y-8">
              <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 text-primary-400 mr-3" />
                  Strumenti Pratici con Dati Reali
                </h2>
                <BettingStrategies matches={matches} />
              </div>
              
              <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 text-green-400 mr-3" />
                  Guide Complete
                </h2>
                <BettingGuide />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 