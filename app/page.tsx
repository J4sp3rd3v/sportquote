'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import FilterPanel from '@/components/FilterPanel';
import MatchDetails from '@/components/MatchDetails';
import SportCategoryStats from '@/components/SportCategoryStats';
import NavigationOverlay from '@/components/NavigationOverlay';
import BestOddsHighlight from '@/components/BestOddsHighlight';
import LoadingSpinner from '@/components/LoadingSpinner';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';
import ArbitrageSystemInfo from '@/components/ArbitrageSystemInfo';
import BookmakerTestPanel from '@/components/BookmakerTestPanel';
import DebugPanel from '@/components/DebugPanel';
import CountdownTimer from '@/components/CountdownTimer';
import SubscriptionManager from '@/components/SubscriptionManager';
import BettingStrategies from '@/components/BettingStrategies';
import BettingGuide from '@/components/BettingGuide';
import GlobalDailyMonitor from '@/components/GlobalDailyMonitor';
import AdvancedOddsAnalyzer from '@/components/AdvancedOddsAnalyzer';
import ActiveSeasonsMonitor from '@/components/ActiveSeasonsMonitor';
import RealDataStatus from '@/components/RealDataStatus';
import { useNavigationOverlay } from '@/hooks/useNavigationOverlay';
import { useApiManager } from '@/lib/apiManager';
import { useOnlyRealOdds } from '@/hooks/useOnlyRealOdds';
import { globalDailyUpdater } from '@/lib/globalDailyUpdater';
import { activeSeasonsManager } from '@/lib/activeSeasonsManager';
import { FilterOptions, BestOdds, Match } from '@/types';
import { TrendingUp, Users, Award, Clock, Filter, BarChart3, Star, Zap, Target, Calendar, Trophy, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Hook per gestire la barra di navigazione quando si torna da un bookmaker
  const { navigationData, showOverlay, closeOverlay } = useNavigationOverlay();
  
  // Hook per gestire API e abbonamenti
  const { isSubscribed, subscriptionPlan, usage } = useApiManager();
  
  // Hook per gestire SOLO le quote reali
  const {
    matches: realMatches,
    isLoading,
    error,
    lastUpdate,
    stats,
    refreshOdds,
    hasRealData
  } = useOnlyRealOdds();

  // Avvia il sistema giornaliero globale al mount
  React.useEffect(() => {
    // Avvia il sistema giornaliero globale (1 aggiornamento al giorno per tutto il sito)
    globalDailyUpdater.startGlobalSystem();
    
    return () => {
      // Il sistema rimane attivo anche quando l'utente esce
      // Non fermiamo il sistema per preservare l'aggiornamento giornaliero
    };
  }, []);

  // Usa solo i dati reali
  const matches = realMatches;

  // Statistiche dinamiche basate sui campionati attivi
  const activeSeasonsStats = useMemo(() => {
    return activeSeasonsManager.getSeasonsStats();
  }, []);

  // Calcola sport unici dai campionati attivi
  const activeSportsCount = useMemo(() => {
    const uniqueSports = new Set(activeSeasonsStats.activeLeagues.map(league => league.sport));
    return uniqueSports.size;
  }, [activeSeasonsStats]);

  // Funzione per calcolare le migliori quote
  const calculateBestOdds = (match: Match): BestOdds => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    // Calcola migliori quote handicap
    let bestHandicap = undefined;
    const allHandicapOdds = match.odds
      .filter(odd => odd.handicap && odd.handicap.length > 0)
      .flatMap(odd => odd.handicap!);

    if (allHandicapOdds.length > 0) {
      // Trova l'handicap con le quote più equilibrate (somma più alta)
      const handicapByValue = allHandicapOdds.reduce((acc, handicap) => {
        const key = handicap.handicap.toString();
        if (!acc[key] || (handicap.home + handicap.away) > (acc[key].home + acc[key].away)) {
          acc[key] = handicap;
        }
        return acc;
      }, {} as Record<string, any>);

      const bestHandicapOdd = Object.values(handicapByValue).reduce((best: any, current: any) => 
        (current.home + current.away) > (best.home + best.away) ? current : best
      );

      bestHandicap = {
        home: { odds: bestHandicapOdd.home, bookmaker: bestHandicapOdd.bookmaker },
        away: { odds: bestHandicapOdd.away, bookmaker: bestHandicapOdd.bookmaker },
        handicap: bestHandicapOdd.handicap
      };
    }

    return {
      home: bestHome,
      away: bestAway,
      draw: bestDraw,
      bestHandicap
    };
  };

  // Filtro le partite in base alla ricerca e ai filtri
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      // Filtro per ricerca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          match.homeTeam.toLowerCase().includes(query) ||
          match.awayTeam.toLowerCase().includes(query) ||
          match.league.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Filtro per sport
      if (filters.sport && match.sport !== filters.sport) return false;

      // Filtro per campionato
      if (filters.league && match.league !== filters.league) return false;

      // Filtro per data
      if (filters.date) {
        const now = new Date();
        const matchDate = new Date(match.date);
        
        switch (filters.date) {
          case 'today':
            if (matchDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'tomorrow':
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (matchDate.toDateString() !== tomorrow.toDateString()) return false;
            break;
          case 'week':
            const weekFromNow = new Date(now);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            if (matchDate > weekFromNow) return false;
            break;
          case 'month':
            const monthFromNow = new Date(now);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            if (matchDate > monthFromNow) return false;
            break;
        }
      }

      // Filtro per range quote
      if (filters.minOdds || filters.maxOdds) {
        const bestOdds = calculateBestOdds(match);
        const maxOdd = Math.max(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 0);
        const minOdd = Math.min(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || Infinity);
        
        if (filters.minOdds && minOdd < filters.minOdds) return false;
        if (filters.maxOdds && maxOdd > filters.maxOdds) return false;
      }

      return true;
    });
  }, [searchQuery, filters, matches]);

  // Calcola le migliori opportunità del giorno
  const todaysBestOpportunities = useMemo(() => {
    if (filteredMatches.length === 0) return null;

    // Trova la quota più alta del giorno
    const highestOddsMatch = filteredMatches.reduce((best, current) => {
      const currentBest = calculateBestOdds(current);
      const bestBest = calculateBestOdds(best);
      const currentMax = Math.max(currentBest.home.odds, currentBest.away.odds, currentBest.draw?.odds || 0);
      const bestMax = Math.max(bestBest.home.odds, bestBest.away.odds, bestBest.draw?.odds || 0);
      return currentMax > bestMax ? current : best;
    });

    // Trova la partita più equilibrata
    const mostBalancedMatch = filteredMatches.find(match => {
      const bestOdds = calculateBestOdds(match);
      const diff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);
      return diff < 0.5;
    });

    // Trova partite con valore
    const valueMatches = filteredMatches.filter(match => {
      const bestOdds = calculateBestOdds(match);
      const avgOdd = (bestOdds.home.odds + bestOdds.away.odds + (bestOdds.draw?.odds || 0)) / (bestOdds.draw ? 3 : 2);
      return avgOdd > 2.5; // Quote mediamente alte
    });

    return {
      highestOdds: highestOddsMatch,
      mostBalanced: mostBalancedMatch,
      valueMatches: valueMatches.slice(0, 3)
    };
  }, [filteredMatches]);

  const handleViewDetails = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header 
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
      />

      {/* Hero Section Ottimizzato */}
      <div className="bg-dark-gradient text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Sistema Giornaliero Globale Attivo
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent leading-tight">
              Quote del Giorno - 1 Aggiornamento Globale
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-dark-200 px-2">
              📅 1 aggiornamento alle 12:00 per tutto il sito - Quote stabili 24h
            </p>
          </div>

          {/* Today's Highlights */}
          {todaysBestOpportunities && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Quota Più Alta del Giorno */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
                  <h3 className="font-bold text-white">Quota Top del Giorno</h3>
                </div>
                {(() => {
                  const bestOdds = calculateBestOdds(todaysBestOpportunities.highestOdds);
                  const maxOdd = Math.max(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 0);
                  return (
                    <div>
                      <div className="text-sm text-dark-300 mb-1">
                        {todaysBestOpportunities.highestOdds.homeTeam} vs {todaysBestOpportunities.highestOdds.awayTeam}
                      </div>
                      <div className="text-2xl font-bold text-yellow-400 mb-2">{maxOdd.toFixed(2)}</div>
                      <button 
                        onClick={() => handleViewDetails(todaysBestOpportunities.highestOdds.id)}
                        className="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg hover:bg-yellow-500/30 transition-colors"
                      >
                        Analizza Ora
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Partita Equilibrata */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="font-bold text-white">Match Equilibrato</h3>
                </div>
                                 {todaysBestOpportunities.mostBalanced ? (
                   (() => {
                     const balancedMatch = todaysBestOpportunities.mostBalanced;
                     const bestOdds = calculateBestOdds(balancedMatch);
                     return (
                       <div>
                         <div className="text-sm text-dark-300 mb-1">
                           {balancedMatch.homeTeam} vs {balancedMatch.awayTeam}
                         </div>
                         <div className="flex items-center space-x-2 mb-2">
                           <span className="text-lg font-bold text-blue-400">{bestOdds.home.odds.toFixed(2)}</span>
                           <span className="text-dark-400">vs</span>
                           <span className="text-lg font-bold text-blue-400">{bestOdds.away.odds.toFixed(2)}</span>
                         </div>
                         <button 
                           onClick={() => handleViewDetails(balancedMatch.id)}
                           className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors"
                         >
                           Vedi Quote
                         </button>
                       </div>
                     );
                   })()
                 ) : (
                   <div className="text-sm text-dark-400">Nessuna partita equilibrata oggi</div>
                 )}
              </div>

              {/* Opportunità di Valore */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Target className="h-6 w-6 text-green-400 mr-2" />
                  <h3 className="font-bold text-white">Opportunità Valore</h3>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {todaysBestOpportunities.valueMatches.length}
                </div>
                <div className="text-sm text-dark-300 mb-2">
                  Partite con quote alte
                </div>
                <div className="text-xs text-green-400">
                  Quote medie &gt; 2.50
                </div>
              </div>
            </div>
          )}

          {/* Status Dati Reali */}
          <div className="mb-6">
            <RealDataStatus
              hasRealData={hasRealData}
              isLoading={isLoading}
              error={error}
              lastUpdate={lastUpdate}
              stats={stats}
              onRefresh={refreshOdds}
            />
          </div>

          {/* Status e Statistiche */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ultimo Aggiornamento */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-primary-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Ultimo Aggiornamento Quote</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </div>
                <div className="text-sm text-dark-300">
                  {lastUpdate ? new Date(lastUpdate).toLocaleDateString('it-IT') : 'Nessun aggiornamento'}
                </div>
                <div className="mt-3 text-xs text-dark-400">
                  Prossimo aggiornamento: Domani alle 12:00
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-accent-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Statistiche Oggi</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{filteredMatches.length}</div>
                  <div className="text-xs text-dark-400">Partite Disponibili</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{activeSeasonsStats.active}</div>
                  <div className="text-xs text-dark-400">Campionati Attivi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">{activeSportsCount}</div>
                  <div className="text-xs text-dark-400">Sport Attivi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-400">
                    {todaysBestOpportunities?.valueMatches.length || 0}
                  </div>
                  <div className="text-xs text-dark-400">Opportunità Valore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

              {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Messaggio quando non ci sono dati reali */}
        {!hasRealData && !isLoading && (
          <div className="mb-8 bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-6 text-center">
            <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-3">Nessun Dato Reale Disponibile</h2>
            <p className="text-dark-300 mb-4">
              Il sistema è configurato per mostrare SOLO partite e quote reali da API verificate.
              <br />
              Al momento non ci sono partite disponibili o il limite API è stato raggiunto.
            </p>
            <div className="bg-dark-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
              <h3 className="font-bold text-white mb-2">🔍 Possibili Cause:</h3>
              <ul className="text-sm text-dark-300 space-y-1">
                <li>• Nessuna partita programmata nei campionati attivi</li>
                <li>• Limite mensile API raggiunto (500 richieste/mese)</li>
                <li>• Problemi temporanei con l'API esterna</li>
                <li>• Campionati in pausa stagionale</li>
              </ul>
            </div>
            <button
              onClick={refreshOdds}
              disabled={isLoading || !stats.canMakeRequests}
              className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isLoading ? 'Caricamento...' : 'Riprova Caricamento'}
            </button>
          </div>
        )}

        {/* Best Opportunities Section Migliorata */}
        {filteredMatches.length > 0 && todaysBestOpportunities && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                Le Migliori di Oggi
              </h2>
              <div className="text-sm text-dark-400">
                Aggiornato: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('it-IT') : 'Mai'}
              </div>
            </div>
            
            <BestOddsHighlight 
              matches={filteredMatches}
              onMatchClick={(match) => {
                handleViewDetails(match.id);
              }}
            />
          </div>
        )}

        {/* Strategie di Scommessa */}
        <div className="mb-8">
          <BettingStrategies matches={filteredMatches} />
        </div>

        {/* Analisi Avanzata Quote con Handicap */}
        <div className="mb-8">
          <AdvancedOddsAnalyzer matches={filteredMatches} />
        </div>

        {/* Sistema Giornaliero Globale */}
        <div className="mb-8">
          <GlobalDailyMonitor />
        </div>

        {/* Monitor Stagioni Attive */}
        <div className="mb-8">
          <ActiveSeasonsMonitor />
        </div>

        {/* Sistema di Arbitraggio Intelligente */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">🎯 Sistema di Arbitraggio Intelligente</h2>
            </div>
            <p className="text-dark-300 mb-6">
              Analisi automatica delle migliori opportunità di scommessa sicura con le quote aggiornate oggi.
            </p>
            <ArbitrageOpportunities matches={filteredMatches} />
          </div>
        </div>

        {/* Guide e Info Arbitraggio */}
        <div className="mb-8">
          <ArbitrageSystemInfo />
        </div>

        {/* Betting Guide */}
        <div className="mb-8">
          <BettingGuide />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-50 flex items-center">
            <Trophy className="h-6 w-6 text-primary-400 mr-2" />
            Tutte le Partite di Oggi
            <span className="ml-2 text-sm font-normal text-primary-600">
              (Quote Aggiornate Giornalmente)
            </span>
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtri</span>
            </button>
            <div className="text-sm text-gray-500">
              {filteredMatches.length} risultati
            </div>
          </div>
        </div>

        {/* Loading State per API */}
        {isLoading && matches.length === 0 && (
          <LoadingSpinner 
            isApiLoading={true}
            showProgress={true}
          />
        )}

        {/* All Matches */}
        {!isLoading && filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                bestOdds={calculateBestOdds(match)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-dark-50 mb-2">
              {matches.length === 0 ? 'Nessuna partita disponibile oggi' : 'Nessuna partita trovata'}
            </h3>
            <p className="text-dark-300 mb-6">
              {matches.length === 0 
                ? 'Le quote vengono aggiornate giornalmente. Il prossimo aggiornamento sarà domani.'
                : 'Prova a modificare i filtri di ricerca o la query'
              }
            </p>
            <button
              onClick={() => {
                if (matches.length === 0) {
                  refreshOdds();
                } else {
                  setSearchQuery('');
                  setFilters({});
                }
              }}
              className="btn-primary"
            >
              {matches.length === 0 ? 'Controlla Aggiornamenti' : 'Cancella Filtri'}
            </button>
          </div>
        ) : null}

        {/* Bookmaker Test Panel - Solo in development */}
        {process.env.NODE_ENV === 'development' && (
          <BookmakerTestPanel />
        )}
      </main>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetails
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Navigation Overlay */}
      {showOverlay && navigationData && (
        <NavigationOverlay
          bookmakerName={navigationData.bookmakerName}
          originalUrl={navigationData.originalUrl}
          onClose={closeOverlay}
        />
      )}

      {/* Debug Panel - Solo in development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          isVisible={isDebugPanelOpen}
          onToggle={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
        />
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-dark-900 border border-dark-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Gestione Abbonamento</h2>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <SubscriptionManager />
            </div>
          </div>
        </div>
      )}

      {/* Footer Ottimizzato */}
      <footer className="bg-dark-900 border-t border-dark-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary-400 mr-2" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent">
                  MonitorQuote
                </h3>
              </div>
              <p className="text-dark-300 mb-6">
                Sistema giornaliero globale. 1 aggiornamento alle 12:00 per tutto il sito, 
                quote stabili 24h, {activeSeasonsStats.active} campionati attivi, {activeSportsCount} sport in corso.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema giornaliero globale attivo</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Quote condivise da tutti</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Sistema Giornaliero</h4>
              <ul className="space-y-2 text-dark-300">
                <li>• 1 aggiornamento/giorno alle 12:00</li>
                <li>• Quote stabili per 24 ore</li>
                <li>• Condivise da tutti gli utenti</li>
                <li>• 6 sport prioritari</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Funzionalità</h4>
              <ul className="space-y-2 text-dark-300">
                <li>• Arbitraggio automatico</li>
                <li>• Quote migliori del giorno</li>
                <li>• Analisi valore</li>
                <li>• Monitoraggio preciso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-dark-400 text-sm">
                &copy; 2025 MonitorQuote. Sistema Giornaliero Globale | Gioco responsabile +18
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-dark-500">Aggiornamento: 12:00 giornaliero</span>
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <span>1 aggiornamento/giorno</span>
                  <span>•</span>
                  <span>Quote stabili 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 