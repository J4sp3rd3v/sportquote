'use client';

import React, { useState } from 'react';
import { BookOpen, TrendingUp, Shield, Calculator, Target, AlertTriangle, CheckCircle, Info, Lightbulb, DollarSign } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function BettingGuide() {
  const [activeSection, setActiveSection] = useState<string>('basics');

  const guideSections: GuideSection[] = [
    {
      id: 'basics',
      title: 'Basi delle Scommesse',
      icon: <BookOpen className="h-5 w-5" />,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">📚 Concetti Fondamentali</h4>
            <div className="space-y-4">
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-2">Quote Decimali</h5>
                <p className="text-dark-300 text-sm mb-2">
                  Le quote indicano quanto puoi vincere per ogni euro scommesso.
                </p>
                <div className="bg-dark-700 rounded p-3 font-mono text-sm">
                  <div className="text-white">Quota 2.50 = Vincita di €2.50 per ogni €1 puntato</div>
                  <div className="text-success-400">Profitto = €1.50 per ogni €1 puntato</div>
                </div>
              </div>
              
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-2">Tipi di Scommessa</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-dark-700 rounded p-3">
                    <div className="font-medium text-white mb-1">1X2</div>
                    <div className="text-xs text-dark-300">Casa, Pareggio, Trasferta</div>
                  </div>
                  <div className="bg-dark-700 rounded p-3">
                    <div className="font-medium text-white mb-1">Over/Under</div>
                    <div className="text-xs text-dark-300">Più o meno di X gol</div>
                  </div>
                  <div className="bg-dark-700 rounded p-3">
                    <div className="font-medium text-white mb-1">Handicap</div>
                    <div className="text-xs text-dark-300">Vantaggio/svantaggio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bankroll',
      title: 'Gestione del Bankroll',
      icon: <DollarSign className="h-5 w-5" />,
      difficulty: 'intermediate',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">💰 Gestione del Budget</h4>
            <div className="space-y-4">
              <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4">
                <h5 className="font-medium text-success-400 mb-2">✅ Regole d'Oro</h5>
                <ul className="space-y-2 text-sm text-dark-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Non scommettere mai più del 1-5% del tuo bankroll per singola scommessa</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Stabilisci un budget mensile e rispettalo sempre</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tieni traccia di tutte le tue scommesse</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Non inseguire mai le perdite con puntate più alte</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-3">📊 Esempio Pratico</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-dark-400 mb-2">Bankroll: €1000</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-300">Puntata conservativa (1%):</span>
                        <span className="text-white font-medium">€10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Puntata moderata (3%):</span>
                        <span className="text-white font-medium">€30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Puntata aggressiva (5%):</span>
                        <span className="text-white font-medium">€50</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-dark-700 rounded p-3">
                    <div className="text-xs text-dark-400 mb-2">Raccomandazione</div>
                    <div className="text-success-400 font-medium">Inizia con 1-2%</div>
                    <div className="text-xs text-dark-300 mt-1">
                      Aumenta gradualmente solo se sei profittevole
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'value',
      title: 'Value Betting',
      icon: <Target className="h-5 w-5" />,
      difficulty: 'advanced',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">🎯 Trovare il Valore</h4>
            <div className="space-y-4">
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-2">Cos'è il Value Betting?</h5>
                <p className="text-dark-300 text-sm mb-3">
                  Il value betting consiste nel trovare scommesse dove le quote offerte sono superiori 
                  alla probabilità reale dell'evento.
                </p>
                <div className="bg-dark-700 rounded p-3">
                  <div className="text-sm font-mono">
                    <div className="text-white mb-1">Formula del Valore:</div>
                    <div className="text-primary-400">Valore = (Quota × Probabilità) - 1</div>
                                         <div className="text-dark-400 text-xs mt-2">Se il risultato è &gt; 0, c'è valore</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-3">📈 Esempio Pratico</h5>
                <div className="space-y-3">
                  <div className="bg-dark-700 rounded p-3">
                    <div className="text-white font-medium mb-2">Scenario: Juventus vs Milan</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-dark-400">Quota bookmaker per Juventus:</div>
                        <div className="text-white font-medium">2.20</div>
                      </div>
                      <div>
                        <div className="text-dark-400">Tua stima probabilità:</div>
                        <div className="text-white font-medium">50% (0.50)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded p-3">
                    <div className="text-sm font-mono">
                      <div className="text-white">Calcolo: (2.20 × 0.50) - 1 = 0.10</div>
                      <div className="text-success-400 font-medium">Valore positivo del 10%! ✅</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-yellow-300 mb-1">💡 Consigli per il Value Betting</h5>
                    <ul className="text-sm text-yellow-200 space-y-1">
                      <li>• Specializzati in pochi campionati che conosci bene</li>
                      <li>• Usa statistiche e analisi approfondite</li>
                      <li>• Confronta sempre le quote di più bookmaker</li>
                      <li>• Mantieni un registro dettagliato delle tue scommesse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'psychology',
      title: 'Psicologia del Betting',
      icon: <Shield className="h-5 w-5" />,
      difficulty: 'intermediate',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">🧠 Controllo Mentale</h4>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h5 className="font-medium text-red-400 mb-2">❌ Errori Comuni da Evitare</h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium text-sm">Tilt Emotivo</div>
                      <div className="text-red-200 text-xs">Scommettere impulsivamente dopo una perdita</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium text-sm">Overconfidence</div>
                      <div className="text-red-200 text-xs">Aumentare le puntate dopo alcune vincite</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium text-sm">Confirmation Bias</div>
                      <div className="text-red-200 text-xs">Cercare solo informazioni che confermano le tue idee</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4">
                <h5 className="font-medium text-success-400 mb-2">✅ Strategie di Controllo</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-white font-medium text-sm mb-2">Disciplina</h6>
                    <ul className="text-xs text-success-200 space-y-1">
                      <li>• Stabilisci regole chiare e seguile</li>
                      <li>• Non scommettere mai sotto l'influenza di alcol</li>
                      <li>• Fai pause regolari</li>
                      <li>• Non scommettere quando sei emotivo</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-white font-medium text-sm mb-2">Analisi</h6>
                    <ul className="text-xs text-success-200 space-y-1">
                      <li>• Basa le decisioni sui dati, non sulle emozioni</li>
                      <li>• Tieni un diario delle scommesse</li>
                      <li>• Analizza i tuoi errori</li>
                      <li>• Cerca sempre il valore, non la vincita facile</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-3">🎯 Test di Autocontrollo</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-dark-700 rounded">
                    <span className="text-dark-300">Hai mai scommesso più del previsto?</span>
                    <span className="text-yellow-400">⚠️ Attenzione</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-dark-700 rounded">
                    <span className="text-dark-300">Insegui mai le perdite?</span>
                    <span className="text-red-400">🚨 Pericolo</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-dark-700 rounded">
                    <span className="text-dark-300">Scommetti quando sei arrabbiato?</span>
                    <span className="text-red-400">🚨 Pericolo</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="text-blue-300 text-xs">
                    Se hai risposto "sì" a una di queste domande, considera di prenderti una pausa 
                    e rivedere la tua strategia di betting.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tools',
      title: 'Strumenti e Risorse',
      icon: <Calculator className="h-5 w-5" />,
      difficulty: 'intermediate',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">🛠️ Strumenti Essenziali</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-600/50 rounded-lg p-4">
                  <h5 className="font-medium text-primary-400 mb-2">📊 Fogli di Calcolo</h5>
                  <p className="text-dark-300 text-sm mb-3">
                    Traccia le tue scommesse con Excel o Google Sheets
                  </p>
                  <div className="bg-dark-700 rounded p-3 text-xs">
                    <div className="text-white font-medium mb-1">Colonne essenziali:</div>
                    <div className="text-dark-300">Data, Partita, Tipo, Quota, Puntata, Risultato, P/L</div>
                  </div>
                </div>
                
                <div className="bg-dark-600/50 rounded-lg p-4">
                  <h5 className="font-medium text-primary-400 mb-2">📱 App Utili</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Comparatori quote:</span>
                      <span className="text-white">Oddschecker</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Statistiche:</span>
                      <span className="text-white">SofaScore</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Tracking:</span>
                      <span className="text-white">Bet Angel</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-600/50 rounded-lg p-4">
                <h5 className="font-medium text-primary-400 mb-3">📈 Metriche Importanti</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-dark-700 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">ROI</div>
                    <div className="text-xs text-dark-400">Return on Investment</div>
                    <div className="text-xs text-success-400 mt-1">Target: +5% mensile</div>
                  </div>
                  <div className="bg-dark-700 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">Strike Rate</div>
                    <div className="text-xs text-dark-400">% di scommesse vincenti</div>
                    <div className="text-xs text-primary-400 mt-1">Varia per strategia</div>
                  </div>
                  <div className="bg-dark-700 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">Yield</div>
                    <div className="text-xs text-dark-400">Profitto per scommessa</div>
                    <div className="text-xs text-accent-400 mt-1">Target: +3% per bet</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-blue-300 mb-1">💡 Consiglio Pro</h5>
                    <p className="text-blue-200 text-sm">
                      Usa il nostro simulatore di strategie per testare le tue idee senza rischiare denaro reale. 
                      Analizza i risultati e affina la tua strategia prima di scommettere con soldi veri.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzato';
      default: return difficulty;
    }
  };

  const currentSection = guideSections.find(s => s.id === activeSection);

  return (
    <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-primary-400 mr-3" />
        <h2 className="text-2xl font-bold text-white">📖 Guida alle Scommesse</h2>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {guideSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-3 rounded-lg border transition-all duration-200 text-left ${
              activeSection === section.id
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-dark-600 bg-dark-700/50 hover:border-dark-500'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`p-1 rounded ${activeSection === section.id ? 'bg-primary-500/30' : 'bg-dark-600'} mr-2`}>
                {section.icon}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(section.difficulty)}`}>
                {getDifficultyText(section.difficulty)}
              </span>
            </div>
            <h3 className={`font-medium text-sm ${activeSection === section.id ? 'text-white' : 'text-dark-300'}`}>
              {section.title}
            </h3>
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      {currentSection && (
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <div className="p-2 bg-primary-500/20 rounded-lg mr-3">
                {currentSection.icon}
              </div>
              {currentSection.title}
            </h3>
            <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(currentSection.difficulty)}`}>
              {getDifficultyText(currentSection.difficulty)}
            </span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {currentSection.content}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-success-400 mr-2" />
            <h4 className="font-medium text-success-300">Regola d'Oro</h4>
          </div>
          <p className="text-success-200 text-sm">
            Non scommettere mai più di quello che puoi permetterti di perdere
          </p>
        </div>
        
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-primary-400 mr-2" />
            <h4 className="font-medium text-primary-300">Obiettivo</h4>
          </div>
          <p className="text-primary-200 text-sm">
            Punta alla consistenza, non ai grandi colpi
          </p>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
            <h4 className="font-medium text-yellow-300">Consiglio</h4>
          </div>
          <p className="text-yellow-200 text-sm">
            Studia sempre prima di scommettere
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-300 mb-1">⚠️ Disclaimer Importante</h4>
            <p className="text-red-200 text-sm">
              Questa guida è solo a scopo educativo. Le scommesse comportano sempre dei rischi. 
              Se hai problemi con il gioco d'azzardo, cerca aiuto professionale. 
              Gioca responsabilmente e solo se maggiorenne.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 