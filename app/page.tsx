'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import FilterPanel from '@/components/FilterPanel';
import MatchDetails from '@/components/MatchDetails';
import SportCategoryStats from '@/components/SportCategoryStats';
import NavigationOverlay from '@/components/NavigationOverlay';
import ApiStatusBanner from '@/components/ApiStatusBanner';
import ApiStatusInfo from '@/components/ApiStatusInfo';
import EmergencyApiStatus from '@/components/EmergencyApiStatus';
import BestOddsHighlight from '@/components/BestOddsHighlight';
import LoadingSpinner from '@/components/LoadingSpinner';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';
import ArbitrageSystemInfo from '@/components/ArbitrageSystemInfo';
import DailyApiMonitor from '@/components/DailyApiMonitor';
import BookmakerTestPanel from '@/components/BookmakerTestPanel';
import OptimizedApiStats from '@/components/OptimizedApiStats';
import DebugPanel from '@/components/DebugPanel';
import CountdownTimer from '@/components/CountdownTimer';
import SubscriptionManager from '@/components/SubscriptionManager';
import BettingStrategies from '@/components/BettingStrategies';
import BettingGuide from '@/components/BettingGuide';
import { useNavigationOverlay } from '@/hooks/useNavigationOverlay';
import { useApiManager } from '@/lib/apiManager';
import { useOptimizedOdds } from '@/hooks/useOptimizedOdds';
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
  
  // Hook per gestire le quote ottimizzate
  const {
    matches: realMatches,
    loading,
    error,
    useRealData,
    apiStats,
    lastUpdate,
    categoryStats,
    toggleDataSource,
    forceRefresh,
    refreshSport
  } = useOptimizedOdds();

  // Usa solo i dati reali
  const matches = realMatches;

  // Funzione per calcolare le migliori quote
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
            <div className="inline-flex items-center bg-accent-500/20 border border-accent-500/30 text-accent-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Sistema API Giornaliero Attivo
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent leading-tight">
              Quote del Giorno - Aggiornate Oggi
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-dark-200 px-2">
              🎯 Le migliori opportunità di oggi con 1 aggiornamento giornaliero per sport
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

          {/* Status e Statistiche */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countdown e Status */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Aggiornamenti Giornalieri</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Richieste oggi</span>
                  <span className="text-white font-medium">{usage.requests}/6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Richieste mese</span>
                  <span className="text-primary-400 font-medium">{usage.requests}/500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Sport aggiornati</span>
                  <span className="text-accent-400 font-medium">6/6</span>
                </div>
                <div className="pt-2 border-t border-dark-700">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300 text-sm">Prossimo reset</span>
                    <span className="text-white text-sm">Domani alle 00:00</span>
                  </div>
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
                  <div className="text-2xl font-bold text-primary-400">54</div>
                  <div className="text-xs text-dark-400">Bookmaker</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-400">6</div>
                  <div className="text-xs text-dark-400">Sport</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-400">
                    {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </div>
                  <div className="text-xs text-dark-400">Ultimo Aggiornamento</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Emergency API Status - Priorità massima */}
        <EmergencyApiStatus />

        {/* Daily API Monitor - Sistema giornaliero */}
        <div className="mb-8">
          <DailyApiMonitor />
        </div>

        {/* Sistema di Arbitraggio - Opportunità del giorno */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">🎯 Opportunità di Arbitraggio del Giorno</h2>
            </div>
            <p className="text-dark-300 mb-4">
              Analisi automatica delle migliori opportunità di scommessa sicura con le quote aggiornate oggi.
            </p>
            <ArbitrageOpportunities matches={filteredMatches} />
          </div>
        </div>

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

        {/* Strategie e Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <BettingStrategies matches={filteredMatches} />
          </div>
          <div>
            <ArbitrageSystemInfo />
          </div>
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
        {useRealData && loading && matches.length === 0 && (
          <LoadingSpinner 
            isApiLoading={true}
            showProgress={true}
          />
        )}

        {/* All Matches */}
        {!loading && filteredMatches.length > 0 ? (
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
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-dark-50 mb-2">
              {useRealData && matches.length === 0 ? 'Nessuna partita disponibile oggi' : 'Nessuna partita trovata'}
            </h3>
            <p className="text-dark-300 mb-6">
              {useRealData && matches.length === 0 
                ? 'Le quote vengono aggiornate giornalmente. Il prossimo aggiornamento sarà domani.'
                : 'Prova a modificare i filtri di ricerca o la query'
              }
            </p>
            <button
              onClick={() => {
                if (useRealData && matches.length === 0) {
                  forceRefresh();
                } else {
                  setSearchQuery('');
                  setFilters({});
                }
              }}
              className="btn-primary"
            >
              {useRealData && matches.length === 0 ? 'Controlla Aggiornamenti' : 'Cancella Filtri'}
            </button>
          </div>
        ) : null}

        {/* API Status Info - Dettagli tecnici */}
        <div className="mt-8">
          <ApiStatusInfo
            apiStatus={apiStats}
            lastUpdate={lastUpdate}
            categoryStats={categoryStats}
            useRealData={useRealData}
          />
        </div>

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
                Sistema API giornaliero ottimizzato. 1 aggiornamento per sport al giorno, 
                54+ bookmaker verificati, analisi arbitraggio automatica.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                  <span>Sistema giornaliero attivo</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Quote verificate</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Sistema API</h4>
              <ul className="space-y-2 text-dark-300">
                <li>• 1 aggiornamento/sport/giorno</li>
                <li>• 500 richieste/mese preservate</li>
                <li>• Cache 24 ore intelligente</li>
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
                &copy; 2025 MonitorQuote. Sistema API Giornaliero Ottimizzato | Gioco responsabile +18
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-dark-500">API Key: 4815fd45...</span>
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <span>6 richieste/giorno</span>
                  <span>•</span>
                  <span>500/mese</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 