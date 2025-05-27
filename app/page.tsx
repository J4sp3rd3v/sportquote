'use client';

import React, { useState, useMemo } from 'react';
import { useDailyOdds } from '@/hooks/useDailyOdds';
import { activeSeasonsManager } from '@/lib/activeSeasonsManager';
import { Match, FilterOptions, BestOdds } from '@/types';

// Componenti Core
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickStats from '@/components/dashboard/QuickStats';
import DailyUpdateStatus from '@/components/DailyUpdateStatus';
import LiveMatches from '@/components/dashboard/LiveMatches';
import ArbitrageOpportunities from '@/components/ArbitrageOpportunities';
import AdvancedAnalysis from '@/components/dashboard/AdvancedAnalysis';
import TodayHighlights from '@/components/dashboard/TodayHighlights';
import ActiveCampaigns from '@/components/dashboard/ActiveCampaigns';

// Modali e Overlay
import MatchDetails from '@/components/MatchDetails';
import FilterPanel from '@/components/FilterPanel';
import NavigationOverlay from '@/components/NavigationOverlay';

// Hooks
import { useNavigationOverlay } from '@/hooks/useNavigationOverlay';

// Icons
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Trophy, 
  Calendar,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  // Stati principali
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'analysis' | 'arbitrage' | 'strategies'>('overview');

  // Hooks
  const { navigationData, showOverlay, closeOverlay } = useNavigationOverlay();
  
  const {
    matches,
    isLoading,
    error,
    lastUpdate,
    nextUpdate,
    isDataFresh,
    isUpdating,
    stats,
    forceUpdate,
    hasRealData
  } = useDailyOdds();

  // Statistiche campionati attivi
  const activeSeasonsStats = useMemo(() => {
    return activeSeasonsManager.getSeasonsStats();
  }, []);

  // Calcola migliori quote
  const calculateBestOdds = (match: Match): BestOdds => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: odd.bookmaker }));

    const bestHome = homeOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestAway = awayOdds.reduce((best, current) => current.odds > best.odds ? current : best);
    const bestDraw = drawOdds.length > 0 ? drawOdds.reduce((best, current) => current.odds > best.odds ? current : best) : undefined;

    return { home: bestHome, away: bestAway, draw: bestDraw };
  };

  // Filtra partite
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          match.homeTeam.toLowerCase().includes(query) ||
          match.awayTeam.toLowerCase().includes(query) ||
          match.league.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (filters.sport && match.sport !== filters.sport) return false;
      if (filters.league && match.league !== filters.league) return false;

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
        }
      }

      return true;
    });
  }, [searchQuery, filters, matches]);

  // Analisi opportunità
  const opportunities = useMemo(() => {
    if (filteredMatches.length === 0) return null;

    const arbitrageMatches = filteredMatches.filter(match => {
      const bestOdds = calculateBestOdds(match);
      const totalPercentage = (100 / bestOdds.home.odds) + (100 / bestOdds.away.odds) + 
                             (bestOdds.draw ? (100 / bestOdds.draw.odds) : 0);
      return totalPercentage < 98;
    });

    const valueMatches = filteredMatches.filter(match => {
      const bestOdds = calculateBestOdds(match);
      const avgOdd = (bestOdds.home.odds + bestOdds.away.odds + (bestOdds.draw?.odds || 0)) / 
                     (bestOdds.draw ? 3 : 2);
      return avgOdd > 2.5;
    });

    const highestOddsMatch = filteredMatches.reduce((best, current) => {
      const currentBest = calculateBestOdds(current);
      const bestBest = calculateBestOdds(best);
      const currentMax = Math.max(currentBest.home.odds, currentBest.away.odds, currentBest.draw?.odds || 0);
      const bestMax = Math.max(bestBest.home.odds, bestBest.away.odds, bestBest.draw?.odds || 0);
      return currentMax > bestMax ? current : best;
    });

    return {
      arbitrage: arbitrageMatches,
      value: valueMatches,
      highest: highestOddsMatch,
      total: filteredMatches.length
    };
  }, [filteredMatches]);

  const handleViewDetails = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (match) setSelectedMatch(match);
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Header Dashboard */}
      <DashboardHeader 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Status Sistema e Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Sistema Giornaliero */}
          <div className="lg:col-span-2">
            <DailyUpdateStatus
              lastUpdate={lastUpdate}
              nextUpdate={nextUpdate}
              isDataFresh={isDataFresh}
              isUpdating={isUpdating}
              matchesCount={stats.matchesCount}
              updateCount={stats.updateCount}
              hoursUntilNext={stats.hoursUntilNext}
              minutesUntilNext={stats.minutesUntilNext}
              errors={stats.errors}
              onForceUpdate={forceUpdate}
            />
          </div>

          {/* Quick Stats */}
          <div>
            <QuickStats 
              totalMatches={filteredMatches.length}
              activeCampaigns={activeSeasonsStats.active}
              arbitrageOpportunities={opportunities?.arbitrage.length || 0}
              valueOpportunities={opportunities?.value.length || 0}
            />
          </div>
        </div>

        {/* Messaggio quando non ci sono dati */}
        {!hasRealData && !isLoading && (
          <div className="mb-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/50 rounded-xl p-8 text-center">
            <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Sistema in Attesa di Dati Reali</h2>
            <p className="text-dark-300 mb-6 max-w-2xl mx-auto">
              MonitorQuote Pro utilizza esclusivamente dati reali da campionati attivi. 
              Il sistema si aggiorna automaticamente alle 12:00 ogni giorno con le partite disponibili.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
              <div className="bg-dark-800/50 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">🏆 Campionati Attivi</h3>
                <p className="text-sm text-dark-300">
                  {activeSeasonsStats.activeLeagues.map(l => l.name).join(', ')}
                </p>
              </div>
              <div className="bg-dark-800/50 rounded-lg p-4">
                <h3 className="font-bold text-white mb-2">⏰ Prossimo Aggiornamento</h3>
                <p className="text-sm text-dark-300">
                  {nextUpdate ? nextUpdate.toLocaleDateString('it-IT') + ' alle 12:00' : 'In programmazione'}
                </p>
              </div>
            </div>
            <button
              onClick={forceUpdate}
              disabled={isLoading || isUpdating}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isLoading || isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                  Aggiornamento in corso...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 inline" />
                  Controlla Aggiornamenti
                </>
              )}
            </button>
          </div>
        )}

        {/* Contenuto Principale basato su sezione attiva */}
        {hasRealData && (
          <>
            {activeSection === 'overview' && (
              <div className="space-y-8">
                {/* Highlights del Giorno */}
                <TodayHighlights 
                  matches={filteredMatches}
                  opportunities={opportunities}
                  onMatchClick={handleViewDetails}
                />

                {/* Campionati Attivi */}
                <ActiveCampaigns 
                  matches={filteredMatches}
                  activeCampaigns={activeSeasonsStats.activeLeagues}
                />

                {/* Partite Live */}
                <LiveMatches 
                  matches={filteredMatches}
                  onMatchClick={handleViewDetails}
                  onFilterClick={() => setIsFilterPanelOpen(true)}
                />
              </div>
            )}

            {activeSection === 'analysis' && (
              <AdvancedAnalysis 
                matches={filteredMatches}
                onMatchClick={handleViewDetails}
              />
            )}

            {activeSection === 'arbitrage' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-purple-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Sistema Arbitraggio Automatico</h2>
                  </div>
                  <p className="text-dark-300 mb-6">
                    Analisi in tempo reale delle opportunità di arbitraggio con calcolo automatico dei profitti garantiti.
                  </p>
                  <ArbitrageOpportunities matches={filteredMatches} />
                </div>
              </div>
            )}

            {activeSection === 'strategies' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-green-400 mr-3" />
                    <h2 className="text-2xl font-bold text-white">Strategie di Betting Avanzate</h2>
                  </div>
                  <p className="text-dark-300 mb-6">
                    Guide professionali e strategie testate per massimizzare i profitti con gestione del rischio.
                  </p>
                  {/* Qui andrà il componente delle strategie */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-6">
                      <h3 className="font-bold text-white mb-3">📊 Value Betting</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Identifica quote sottovalutate dai bookmaker per profitti a lungo termine.
                      </p>
                      <div className="text-green-400 font-bold">
                        {opportunities?.value.length || 0} opportunità oggi
                      </div>
                    </div>
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-6">
                      <h3 className="font-bold text-white mb-3">⚖️ Arbitraggio</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Profitti garantiti sfruttando differenze di quote tra bookmaker.
                      </p>
                      <div className="text-purple-400 font-bold">
                        {opportunities?.arbitrage.length || 0} arbitraggi disponibili
                      </div>
                    </div>
                    <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-6">
                      <h3 className="font-bold text-white mb-3">🎯 Gestione Bankroll</h3>
                      <p className="text-dark-300 text-sm mb-4">
                        Strategie di gestione del capitale per minimizzare i rischi.
                      </p>
                      <div className="text-blue-400 font-bold">
                        Kelly Criterion & Fixed Stakes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modali */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {selectedMatch && (
        <MatchDetails
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {showOverlay && navigationData && (
        <NavigationOverlay
          bookmakerName={navigationData.bookmakerName}
          originalUrl={navigationData.originalUrl}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
} 