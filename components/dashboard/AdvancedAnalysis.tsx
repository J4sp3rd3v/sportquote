'use client';

import React from 'react';
import { Target, BarChart3, Calculator, TrendingUp } from 'lucide-react';
import { Match } from '@/types';
import AdvancedOddsAnalyzer from '@/components/AdvancedOddsAnalyzer';
import BettingStrategies from '@/components/BettingStrategies';

interface AdvancedAnalysisProps {
  matches: Match[];
  onMatchClick: (matchId: string) => void;
}

export default function AdvancedAnalysis({
  matches,
  onMatchClick
}: AdvancedAnalysisProps) {
  
  if (matches.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-8 text-center">
        <BarChart3 className="h-12 w-12 text-dark-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nessun Dato per Analisi</h3>
        <p className="text-dark-400">
          Gli strumenti di analisi avanzata saranno disponibili quando ci saranno partite da analizzare.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
          <Target className="h-8 w-8 text-primary-400 mr-3" />
          Analisi Avanzata & Strumenti Professionali
        </h2>
        <p className="text-dark-300 max-w-3xl mx-auto">
          Suite completa di strumenti professionali per l'analisi delle quote, 
          identificazione di opportunità di valore e strategie di betting avanzate.
        </p>
      </div>

      {/* Strumenti di Analisi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-400 mr-2" />
            <h3 className="font-bold text-white">Analisi Quote</h3>
          </div>
          <p className="text-dark-300 text-sm mb-4">
            Analisi dettagliata delle quote con calcolo del valore, 
            identificazione arbitraggi e rating di convenienza.
          </p>
          <div className="text-blue-400 font-bold">
            {matches.length} partite analizzate
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Calculator className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="font-bold text-white">Calcoli Avanzati</h3>
          </div>
          <p className="text-dark-300 text-sm mb-4">
            Calcolo automatico di probabilità implicite, 
            margini bookmaker e opportunità di arbitraggio.
          </p>
          <div className="text-green-400 font-bold">
            Calcoli in tempo reale
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-purple-400 mr-2" />
            <h3 className="font-bold text-white">Strategie</h3>
          </div>
          <p className="text-dark-300 text-sm mb-4">
            Guide professionali per value betting, 
            gestione bankroll e strategie a lungo termine.
          </p>
          <div className="text-purple-400 font-bold">
            Strategie testate
          </div>
        </div>
      </div>

      {/* Analizzatore Quote Avanzato */}
      <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Analizzatore Quote Professionale</h3>
        </div>
        <AdvancedOddsAnalyzer matches={matches} />
      </div>

      {/* Strategie di Betting */}
      <div className="bg-dark-800/30 border border-dark-700 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-green-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Strategie di Betting Avanzate</h3>
        </div>
        <BettingStrategies matches={matches} />
      </div>

      {/* Guida Rapida */}
      <div className="bg-gradient-to-r from-dark-800/50 to-dark-700/50 border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎯 Guida Rapida agli Strumenti</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-primary-400 mb-2">📊 Analisi Quote</h4>
            <ul className="text-sm text-dark-300 space-y-1">
              <li>• <strong>Value Rating:</strong> Punteggio 1-10 per ogni partita</li>
              <li>• <strong>Arbitraggio:</strong> Rilevamento automatico opportunità sicure</li>
              <li>• <strong>Handicap:</strong> Analisi quote asiatiche e europee</li>
              <li>• <strong>Percentuali:</strong> Calcolo probabilità implicite</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">🎲 Strategie</h4>
            <ul className="text-sm text-dark-300 space-y-1">
              <li>• <strong>Value Betting:</strong> Identificazione quote sottovalutate</li>
              <li>• <strong>Kelly Criterion:</strong> Calcolo stake ottimale</li>
              <li>• <strong>Bankroll Management:</strong> Gestione capitale</li>
              <li>• <strong>Risk Assessment:</strong> Valutazione rischi</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-4 w-4 text-primary-400 mr-2" />
            <span className="font-semibold text-primary-400">Suggerimento Pro</span>
          </div>
          <p className="text-sm text-dark-300">
            Utilizza il filtro "Rating Minimo" nell'analizzatore per concentrarti solo 
            sulle opportunità più promettenti. Un rating di 7+ indica opportunità eccellenti.
          </p>
        </div>
      </div>
    </div>
  );
} 