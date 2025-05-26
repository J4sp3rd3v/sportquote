'use client';

import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, AlertTriangle, Lightbulb, Star } from 'lucide-react';

export default function BettingGuide() {
  const [activeGuide, setActiveGuide] = useState('basics');

  const guides = {
    basics: {
      title: 'Basi delle Scommesse',
      icon: BookOpen,
      color: 'primary',
      content: [
        {
          title: 'Come Leggere le Quote',
          description: 'Le quote rappresentano la probabilità di un evento e il potenziale guadagno.',
          example: 'Quota 2.00 = 50% di probabilità, raddoppia la puntata se vinci',
          tips: [
            'Quote basse = alta probabilità, basso guadagno',
            'Quote alte = bassa probabilità, alto guadagno',
            'Quota 1.50 significa 66.7% di probabilità'
          ]
        },
        {
          title: 'Tipi di Scommesse',
          description: 'Esistono diversi tipi di scommesse per ogni sport.',
          example: '1X2: 1=Casa, X=Pareggio, 2=Trasferta',
          tips: [
            'Over/Under: Totale gol sopra o sotto una soglia',
            'Handicap: Vantaggio/svantaggio virtuale',
            'Doppia Chance: Due risultati su tre'
          ]
        }
      ]
    },
    strategy: {
      title: 'Strategie Avanzate',
      icon: Star,
      color: 'warning',
      content: [
        {
          title: 'Value Betting',
          description: 'Trova scommesse dove le quote sono superiori alla probabilità reale.',
          example: 'Se stimi 60% di probabilità ma la quota è 2.00 (50%), hai trovato valore',
          tips: [
            'Studia le statistiche delle squadre',
            'Confronta sempre più bookmaker',
            'Non seguire solo le emozioni'
          ]
        },
        {
          title: 'Gestione del Bankroll',
          description: 'La chiave per sopravvivere nel lungo termine.',
          example: 'Con 1000€ di bankroll, punta massimo 20-50€ per scommessa',
          tips: [
            'Mai più del 5% del bankroll su una scommessa',
            'Tieni traccia di tutte le puntate',
            'Non inseguire le perdite'
          ]
        }
      ]
    },
    psychology: {
      title: 'Psicologia del Betting',
      icon: Lightbulb,
      color: 'success',
      content: [
        {
          title: 'Controllo Emotivo',
          description: 'Le emozioni sono il nemico numero uno dello scommettitore.',
          example: 'Dopo una perdita, aspetta prima di piazzare la prossima scommessa',
          tips: [
            'Stabilisci limiti prima di iniziare',
            'Non scommettere sotto stress',
            'Celebra le vittorie ma analizza le sconfitte'
          ]
        },
        {
          title: 'Bias Cognitivi',
          description: 'Riconosci e evita i tranelli mentali comuni.',
          example: 'Non scommettere sempre sulla tua squadra del cuore',
          tips: [
            'Evita il bias di conferma',
            'Non credere alle "serie fortunate"',
            'Analizza oggettivamente ogni scommessa'
          ]
        }
      ]
    }
  };

  const quickTips = [
    {
      icon: '💡',
      title: 'Inizia Piccolo',
      description: 'Comincia con puntate basse per imparare senza rischi eccessivi'
    },
    {
      icon: '📊',
      title: 'Studia le Statistiche',
      description: 'Analizza forma, scontri diretti e statistiche prima di scommettere'
    },
    {
      icon: '🎯',
      title: 'Specializzati',
      description: 'Concentrati su 1-2 sport che conosci meglio'
    },
    {
      icon: '📝',
      title: 'Tieni un Diario',
      description: 'Registra tutte le scommesse per analizzare i tuoi pattern'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">📚 Guida Completa alle Scommesse</h2>
        <p className="text-dark-300 text-lg">
          Impara le basi, sviluppa strategie vincenti e diventa un scommettitore consapevole
        </p>
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickTips.map((tip, index) => (
          <div key={index} className="bg-dark-800 border border-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
            <p className="text-dark-400 text-sm">{tip.description}</p>
          </div>
        ))}
      </div>

      {/* Guide Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.entries(guides).map(([key, guide]) => {
          const Icon = guide.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveGuide(key)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all ${
                activeGuide === key
                  ? `bg-${guide.color}-500/20 text-${guide.color}-400 border border-${guide.color}-500/30`
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{guide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Content */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="space-y-8">
          {guides[activeGuide as keyof typeof guides].content.map((section, index) => (
            <div key={index} className="border-b border-dark-700 last:border-b-0 pb-8 last:pb-0">
              <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
              
              <p className="text-dark-300 mb-4">{section.description}</p>
              
              {/* Example */}
              <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Play className="h-4 w-4 text-primary-400 mr-2" />
                  <span className="text-primary-400 font-medium text-sm">Esempio Pratico</span>
                </div>
                <p className="text-white">{section.example}</p>
              </div>

              {/* Tips */}
              <div className="space-y-2">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-4 w-4 text-success-400 mr-2" />
                  <span className="text-success-400 font-medium text-sm">Consigli Utili</span>
                </div>
                {section.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-dark-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-gradient-to-r from-danger-500/10 to-warning-500/10 border border-danger-500/20 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-danger-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-danger-400 mb-2">⚠️ Gioco Responsabile</h3>
            <div className="space-y-2 text-dark-300">
              <p>• Le scommesse devono rimanere un divertimento, non un modo per fare soldi</p>
              <p>• Stabilisci sempre un budget e rispettalo rigorosamente</p>
              <p>• Se senti di perdere il controllo, cerca aiuto professionale</p>
              <p>• Ricorda: la casa vince sempre nel lungo termine</p>
            </div>
            <div className="mt-4 p-3 bg-danger-500/20 border border-danger-500/30 rounded-lg">
              <p className="text-danger-400 font-medium text-sm">
                🔞 Vietato ai minori di 18 anni • Numero Verde: 800 558 822
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📖 Risorse Aggiuntive</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-primary-400">Libri Consigliati</h4>
            <ul className="space-y-1 text-sm text-dark-300">
              <li>• "Trading Sportivo" di Caan Berry</li>
              <li>• "Beating the Bookies" di Alex Bellos</li>
              <li>• "The Logic of Sports Betting" di Ed Miller</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-success-400">Strumenti Utili</h4>
            <ul className="space-y-1 text-sm text-dark-300">
              <li>• Calcolatori di probabilità</li>
              <li>• Software di analisi statistiche</li>
              <li>• App per il tracking delle scommesse</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 