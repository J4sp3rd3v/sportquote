'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

interface BettingStrategiesProps {
  matches?: any[];
}

export default function BettingStrategies({ matches = [] }: BettingStrategiesProps) {
  const [activeStrategy, setActiveStrategy] = useState<'value' | 'arbitrage' | 'bankroll'>('value');
  const [bankroll, setBankroll] = useState(1000);
  const [riskLevel, setRiskLevel] = useState(2);

  const strategies = {
    value: {
      title: 'Value Betting',
      icon: TrendingUp,
      description: 'Identifica scommesse con valore positivo atteso',
      color: 'primary',
      example: {
        scenario: 'Juventus vs Milan - Quota 1X2: 2.10',
        analysis: 'Probabilità reale stimata: 55%',
        calculation: 'Valore = (2.10 × 0.55) - 1 = 0.155 (+15.5%)',
        recommendation: 'SCOMMESSA CONSIGLIATA'
      }
    },
    arbitrage: {
      title: 'Arbitraggio',
      icon: Target,
      description: 'Profitto garantito sfruttando differenze di quote',
      color: 'success',
      example: {
        scenario: 'Roma vs Napoli',
        analysis: 'Bookmaker A: Roma 2.20 | Bookmaker B: Napoli 2.30',
        calculation: '(1/2.20 + 1/2.30) = 0.889 < 1',
        recommendation: 'ARBITRAGGIO POSSIBILE (+11.1%)'
      }
    },
    bankroll: {
      title: 'Kelly Criterion',
      icon: Calculator,
      description: 'Calcola la puntata ottimale basata sul valore',
      color: 'warning',
      example: {
        scenario: 'Quota 3.00 con probabilità 40%',
        analysis: 'Valore = (3.00 × 0.40) - 1 = 0.20',
        calculation: 'Kelly = (0.40 × 3.00 - 1) / (3.00 - 1) = 10%',
        recommendation: `PUNTA ${(bankroll * 0.10).toFixed(0)}€ (10% del bankroll)`
      }
    }
  };

  const calculateOptimalBet = (odds: number, probability: number, bankroll: number) => {
    const value = (odds * probability) - 1;
    if (value <= 0) return 0;
    
    const kelly = (probability * odds - 1) / (odds - 1);
    const fractionalKelly = kelly * (riskLevel / 10); // Riduce il rischio
    
    return Math.max(0, Math.min(bankroll * fractionalKelly, bankroll * 0.05)); // Max 5% del bankroll
  };

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🎯 Strategie di Scommessa</h2>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Calculator className="h-4 w-4" />
          <span>Calcolatori Avanzati</span>
        </div>
      </div>

      {/* Strategy Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.entries(strategies).map(([key, strategy]) => {
          const Icon = strategy.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveStrategy(key as 'value' | 'arbitrage' | 'bankroll')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeStrategy === key
                  ? `bg-${strategy.color}-500/20 text-${strategy.color}-400 border border-${strategy.color}-500/30`
                  : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{strategy.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Strategy Content */}
      <div className="space-y-6">
        {/* Strategy Description */}
        <div className="bg-dark-700 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">{strategies[activeStrategy].title}</h3>
          <p className="text-dark-300 text-sm">{strategies[activeStrategy].description}</p>
        </div>

        {/* Bankroll Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Bankroll Totale (€)
            </label>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(Number(e.target.value))}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
              min="100"
              max="100000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Livello di Rischio (1-10)
            </label>
            <input
              type="range"
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className="w-full"
              min="1"
              max="10"
            />
            <div className="flex justify-between text-xs text-dark-400 mt-1">
              <span>Conservativo</span>
              <span className="font-medium text-white">{riskLevel}</span>
              <span>Aggressivo</span>
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className={`bg-gradient-to-br from-${strategies[activeStrategy].color}-500/10 to-${strategies[activeStrategy].color}-600/5 border border-${strategies[activeStrategy].color}-500/20 rounded-lg p-4`}>
          <h4 className="font-semibold text-white mb-3">📊 Esempio Pratico</h4>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-dark-400">Scenario:</span>
              <div className="text-white font-medium">{strategies[activeStrategy].example.scenario}</div>
            </div>
            
            <div>
              <span className="text-sm text-dark-400">Analisi:</span>
              <div className="text-white">{strategies[activeStrategy].example.analysis}</div>
            </div>
            
            <div>
              <span className="text-sm text-dark-400">Calcolo:</span>
              <div className="text-white font-mono text-sm bg-dark-800 p-2 rounded">
                {strategies[activeStrategy].example.calculation}
              </div>
            </div>
            
            <div className={`flex items-center space-x-2 p-2 bg-${strategies[activeStrategy].color}-500/20 rounded`}>
              <CheckCircle className={`h-4 w-4 text-${strategies[activeStrategy].color}-400`} />
              <span className={`text-${strategies[activeStrategy].color}-400 font-medium text-sm`}>
                {strategies[activeStrategy].example.recommendation}
              </span>
            </div>
          </div>
        </div>

        {/* Live Calculator */}
        {activeStrategy === 'bankroll' && (
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4">🧮 Calcolatore Kelly</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1">Quota</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2.50"
                  className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Probabilità (%)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="45"
                  className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">Puntata Consigliata</label>
                <div className="bg-success-500/20 border border-success-500/30 rounded px-3 py-2 text-success-400 font-bold text-sm">
                  €{(bankroll * 0.03).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Warning */}
        <div className="bg-danger-500/10 border border-danger-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-danger-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-danger-400 mb-1">⚠️ Avvertenza Importante</h4>
              <p className="text-sm text-dark-300">
                Le scommesse comportano sempre dei rischi. Scommetti solo quello che puoi permetterti di perdere. 
                Questi strumenti sono solo a scopo educativo e non garantiscono profitti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 