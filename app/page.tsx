'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import FilterPanel from '@/components/FilterPanel';
import MatchDetails from '@/components/MatchDetails';

import SportCategoryStats from '@/components/SportCategoryStats';
import NavigationOverlay from '@/components/NavigationOverlay';
import ApiStatusBanner from '@/components/ApiStatusBanner';
import BestOddsHighlight from '@/components/BestOddsHighlight';
import LoadingSpinner from '@/components/LoadingSpinner';
import BookmakerTestPanel from '@/components/BookmakerTestPanel';
import OptimizedApiStats from '@/components/OptimizedApiStats';
import DebugPanel from '@/components/DebugPanel';
import CountdownTimer from '@/components/CountdownTimer';
import SubscriptionManager from '@/components/SubscriptionManager';
import BettingStrategies from '@/components/BettingStrategies';
// import OddsAnalysis from '@/components/OddsAnalysis';
import BettingGuide from '@/components/BettingGuide';
import { useNavigationOverlay } from '@/hooks/useNavigationOverlay';
import { useApiManager } from '@/lib/apiManager';

import { useOptimizedOdds } from '@/hooks/useOptimizedOdds';
import { FilterOptions, BestOdds, Match } from '@/types';
import { TrendingUp, Users, Award, Clock, Filter, BarChart3 } from 'lucide-react';

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

  // Raggruppa partite per sport
  const matchesByCategory = useMemo(() => {
    const grouped = {
      calcio: filteredMatches.filter(m => m.sport === 'calcio'),
      tennis: filteredMatches.filter(m => m.sport === 'tennis'),
      basket: filteredMatches.filter(m => m.sport === 'basket'),
      altro: filteredMatches.filter(m => !['calcio', 'tennis', 'basket'].includes(m.sport))
    };
    return grouped;
  }, [filteredMatches]);

  const handleViewDetails = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  };

  // Rimosso sistema iframe - ora i bookmaker si aprono direttamente in nuova scheda

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header 
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
      />

      {/* Hero Section */}
      <div className="bg-dark-gradient text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent leading-tight">
              MonitorQuote - Quote Intelligenti
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-dark-200 px-2">
              🎯 Trova le quote più vantaggiose, analizza le tendenze e scopri le migliori opportunità di scommessa
            </p>
            
            {/* Value Propositions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-white mb-1">Quote Migliori</h3>
                <p className="text-sm text-dark-300">Confronto automatico tra 54+ bookmaker</p>
              </div>
              <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold text-white mb-1">Analisi Intelligente</h3>
                <p className="text-sm text-dark-300">Suggerimenti e strategie basate sui dati</p>
              </div>
              <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-1">Aggiornamenti Live</h3>
                <p className="text-sm text-dark-300">Quote in tempo reale ogni 30 secondi</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="inline-flex items-center bg-accent-500/20 border border-accent-500/30 text-accent-400 px-6 py-3 rounded-full text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-accent-400 rounded-full mr-3 animate-pulse"></div>
              {useRealData ? '🔴 LIVE: Quote aggiornate ogni minuto' : 'Demo: Dati di esempio'}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Countdown Timer */}
            <div className="lg:col-span-2">
              <CountdownTimer 
              showDetails={true} 
              onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
            />
            </div>
            
            {/* Quick Stats */}
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiche Live</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Richieste utilizzate</span>
                  <span className="text-white font-medium">{usage.requests}/500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Bookmaker attivi</span>
                  <span className="text-primary-400 font-medium">54</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400">Sport supportati</span>
                  <span className="text-accent-400 font-medium">6</span>
                </div>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="w-full mt-4 bg-primary-gradient text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
                >
                  {isSubscribed ? 'Gestisci Piano' : 'Upgrade Premium'}
                </button>
              </div>
            </div>
          </div>

          {/* Badge Live per API reale */}
          {useRealData && (
            <div className="text-center">
              <div className="inline-flex items-center bg-success-500/20 border border-success-500/30 text-success-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <div className="w-2 h-2 bg-success-400 rounded-full mr-2 animate-ping"></div>
                QUOTE LIVE ATTIVE
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 group-hover:from-blue-300 group-hover:to-blue-500 transition-all duration-300">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">Quote in Tempo Reale</h3>
              <p className="text-blue-100 leading-relaxed text-sm md:text-base">Aggiornamenti costanti dalle migliori piattaforme di scommesse</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 group-hover:from-green-300 group-hover:to-green-500 transition-all duration-300">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">100+ Bookmakers</h3>
              <p className="text-blue-100 leading-relaxed text-sm md:text-base">Confronta quote da tutti i principali operatori del mercato</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">Migliori Opportunità</h3>
              <p className="text-blue-100 leading-relaxed text-sm md:text-base">Identifica automaticamente le quote più vantaggiose</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-between items-center text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-0">
            <div className="flex items-center mr-0 sm:mr-6">
              {useRealData ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">LIVE</span>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <span className="text-center sm:text-left">
                    {new Date().toLocaleTimeString('it-IT')}
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary-600" />
                  <span className="text-center sm:text-left">
                    Demo: {new Date().toLocaleTimeString('it-IT')}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center">
                <span className="font-medium">{filteredMatches.length}</span>
                <span className="ml-1">partite</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">35+</span>
                <span className="ml-1">bookmakers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* API Status Banner */}
        <ApiStatusBanner
          useRealData={useRealData}
          error={error}
          loading={loading}
          onToggle={toggleDataSource}
        />

        {/* Bookmaker Test Panel - Solo in development */}
        {process.env.NODE_ENV === 'development' && (
          <BookmakerTestPanel />
        )}

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">Partite Oggi</span>
              <TrendingUp className="h-4 w-4 text-success-400" />
            </div>
            <div className="text-2xl font-bold text-white">{filteredMatches.filter(m => {
              const today = new Date().toDateString();
              return new Date(m.date).toDateString() === today;
            }).length}</div>
            <div className="text-xs text-success-400">+12% vs ieri</div>
          </div>
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">Quota Più Alta</span>
              <Award className="h-4 w-4 text-warning-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {filteredMatches.length > 0 ? 
                Math.max(...filteredMatches.flatMap(m => m.odds.map(o => Math.max(o.home, o.away, o.draw || 0)))).toFixed(2) 
                : '0.00'
              }
            </div>
            <div className="text-xs text-warning-400">Opportunità alta</div>
          </div>
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">Bookmaker Attivi</span>
              <Users className="h-4 w-4 text-primary-400" />
            </div>
            <div className="text-2xl font-bold text-white">54</div>
            <div className="text-xs text-primary-400">Tutti verificati</div>
          </div>
          
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-sm">Ultimo Aggiornamento</span>
              <Clock className="h-4 w-4 text-accent-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-accent-400">Tempo reale</div>
          </div>
        </div>

        {/* Best Opportunities Section */}
        {filteredMatches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">🎯 Migliori Opportunità</h2>
              <div className="text-sm text-dark-400">Aggiornato ogni 30 secondi</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Quota Più Alta */}
              <div className="bg-gradient-to-br from-success-500/10 to-success-600/5 border border-success-500/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-success-500/20 rounded-lg mr-3">
                    <TrendingUp className="h-5 w-5 text-success-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Quota Più Vantaggiosa</h3>
                    <p className="text-sm text-dark-300">Massimo profitto potenziale</p>
                  </div>
                </div>
                {(() => {
                  const bestMatch = filteredMatches.reduce((best, current) => {
                    const currentMax = Math.max(...current.odds.map(o => Math.max(o.home, o.away, o.draw || 0)));
                    const bestMax = Math.max(...best.odds.map(o => Math.max(o.home, o.away, o.draw || 0)));
                    return currentMax > bestMax ? current : best;
                  }, filteredMatches[0]);
                  
                  if (bestMatch) {
                    const bestOdds = calculateBestOdds(bestMatch);
                    const maxOdd = Math.max(bestOdds.home.odds, bestOdds.away.odds, bestOdds.draw?.odds || 0);
                    return (
                      <div>
                        <div className="text-lg font-medium text-white mb-2">
                          {bestMatch.homeTeam} vs {bestMatch.awayTeam}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-success-400 font-bold text-xl">{maxOdd.toFixed(2)}</span>
                          <button 
                            onClick={() => handleViewDetails(bestMatch.id)}
                            className="text-sm bg-success-500/20 text-success-400 px-3 py-1 rounded-lg hover:bg-success-500/30 transition-colors"
                          >
                            Vedi Dettagli
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Partita Equilibrata */}
              <div className="bg-gradient-to-br from-warning-500/10 to-warning-600/5 border border-warning-500/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-warning-500/20 rounded-lg mr-3">
                    <BarChart3 className="h-5 w-5 text-warning-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Partita Equilibrata</h3>
                    <p className="text-sm text-dark-300">Quote simili, risultato incerto</p>
                  </div>
                </div>
                {(() => {
                  const balancedMatch = filteredMatches.find(match => {
                    const bestOdds = calculateBestOdds(match);
                    const diff = Math.abs(bestOdds.home.odds - bestOdds.away.odds);
                    return diff < 0.5; // Differenza minima tra le quote
                  });
                  
                  if (balancedMatch) {
                    const bestOdds = calculateBestOdds(balancedMatch);
                    return (
                      <div>
                        <div className="text-lg font-medium text-white mb-2">
                          {balancedMatch.homeTeam} vs {balancedMatch.awayTeam}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <span className="text-warning-400 font-bold">{bestOdds.home.odds.toFixed(2)}</span>
                            <span className="text-dark-400">vs</span>
                            <span className="text-warning-400 font-bold">{bestOdds.away.odds.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => handleViewDetails(balancedMatch.id)}
                            className="text-sm bg-warning-500/20 text-warning-400 px-3 py-1 rounded-lg hover:bg-warning-500/30 transition-colors"
                          >
                            Analizza
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="text-dark-400 text-center py-4">
                      Nessuna partita equilibrata trovata
                    </div>
                  );
                })()}
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

        {/* Advanced Betting Strategies */}
        <div className="mb-8">
          <BettingStrategies matches={filteredMatches} />
        </div>

        {/* Betting Guide */}
        <div className="mb-8">
          <BettingGuide />
        </div>

        {/* Category Statistics - Rimosso per ora */}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-50">
            Partite e Quote
            {useRealData && (
              <span className="ml-2 text-sm font-normal text-primary-600">
                (Quote Reali)
              </span>
            )}
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

        {/* Matches by Category */}
        {!loading && filteredMatches.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(matchesByCategory).map(([category, categoryMatches]) => {
              if (categoryMatches.length === 0) return null;
              
              return (
                <div key={category}>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">
                      {category === 'calcio' ? '⚽' : 
                       category === 'tennis' ? '🎾' : 
                       category === 'basket' ? '🏀' : '🏆'}
                    </span>
                    <h3 className="text-xl font-semibold text-dark-50 capitalize">
                      {category}
                    </h3>
                    <span className="ml-3 text-sm text-gray-500">
                      ({categoryMatches.length} partite)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {categoryMatches.map((match) => (
                                        <MatchCard
                    key={match.id}
                    match={match}
                    bestOdds={calculateBestOdds(match)}
                    onViewDetails={handleViewDetails}
                  />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-dark-50 mb-2">
              {useRealData && matches.length === 0 ? 'Nessuna partita disponibile dall\'API' : 'Nessuna partita trovata'}
            </h3>
            <p className="text-dark-300 mb-6">
              {useRealData && matches.length === 0 
                ? 'Le quote live potrebbero non essere disponibili al momento. Riprova tra qualche minuto.'
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
              {useRealData && matches.length === 0 ? 'Ricarica Quote' : 'Cancella Filtri'}
            </button>
          </div>
        ) : null}
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

      {/* Footer */}
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
                La piattaforma più avanzata per il confronto delle quote sportive in tempo reale. 
                54+ bookmaker verificati, aggiornamenti ogni minuto, API professionali.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                  <span>Sistema attivo 24/7</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span>Quote verificate</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Sport & Campionati</h4>
              <ul className="space-y-2 text-dark-300">
                <li><a href="/sports" className="hover:text-primary-400 transition-colors flex items-center space-x-2">
                  <span>⚽</span><span>Calcio</span>
                </a></li>
                <li><a href="/sports" className="hover:text-primary-400 transition-colors flex items-center space-x-2">
                  <span>🎾</span><span>Tennis</span>
                </a></li>
                <li><a href="/sports" className="hover:text-primary-400 transition-colors flex items-center space-x-2">
                  <span>🏀</span><span>Basket</span>
                </a></li>
                <li><a href="/sports" className="hover:text-primary-400 transition-colors flex items-center space-x-2">
                  <span>🏈</span><span>Altri Sport</span>
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Risorse</h4>
              <ul className="space-y-2 text-dark-300">
                <li><a href="/bookmakers" className="hover:text-primary-400 transition-colors">Bookmaker Supportati</a></li>
                <li><a href="/sports" className="hover:text-primary-400 transition-colors">Sport e Campionati</a></li>
                <li><button onClick={() => setShowSubscriptionModal(true)} className="hover:text-primary-400 transition-colors text-left">Piani e Prezzi</button></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">API Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-dark-400 text-sm">
                &copy; 2025 MonitorQuote. Tutti i diritti riservati. | Gioco responsabile +18
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-dark-500">Powered by</span>
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <span>The Odds API</span>
                  <span>•</span>
                  <span>Next.js</span>
                  <span>•</span>
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 