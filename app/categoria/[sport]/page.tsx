'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import FilterPanel from '@/components/FilterPanel';
import MatchDetails from '@/components/MatchDetails';
import DataSourceToggle from '@/components/DataSourceToggle';
import ApiStatusBanner from '@/components/ApiStatusBanner';
import BestOddsHighlight from '@/components/BestOddsHighlight';
import BookmakerFrame from '@/components/BookmakerFrame';
import { matches as mockMatches, bookmakers } from '@/data/mockData';
import { useRealOdds } from '@/hooks/useRealOdds';
import { FilterOptions, BestOdds, Match } from '@/types';
import { ArrowLeft, Filter, TrendingUp } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const sport = params.sport as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({ sport });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Stati per il sistema iframe bookmaker
  const [bookmakerFrame, setBookmakerFrame] = useState<{
    isOpen: boolean;
    url: string;
    bookmakerName: string;
    matchInfo?: any;
  }>({
    isOpen: false,
    url: '',
    bookmakerName: '',
    matchInfo: null
  });
  
  // Hook per gestire le quote reali
  const {
    matches: realMatches,
    loading,
    error,
    lastUpdate,
    apiStatus,
    refreshData,
    useRealData,
    toggleDataSource
  } = useRealOdds();

  // Usa i dati reali se disponibili, altrimenti quelli simulati
  const allMatches = useRealData ? realMatches : mockMatches;

  // Filtra per sport specifico
  const categoryMatches = useMemo(() => {
    return allMatches.filter(match => match.sport === sport);
  }, [allMatches, sport]);

  // Applica filtri aggiuntivi
  const filteredMatches = useMemo(() => {
    return categoryMatches.filter(match => {
      // Filtro per ricerca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          match.homeTeam.toLowerCase().includes(query) ||
          match.awayTeam.toLowerCase().includes(query) ||
          match.league.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

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
  }, [searchQuery, filters, categoryMatches]);

  // Raggruppa per campionato
  const matchesByLeague = useMemo(() => {
    const grouped: { [key: string]: Match[] } = {};
    filteredMatches.forEach(match => {
      if (!grouped[match.league]) {
        grouped[match.league] = [];
      }
      grouped[match.league].push(match);
    });
    return grouped;
  }, [filteredMatches]);

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

  const handleViewDetails = (matchId: string) => {
    const match = categoryMatches.find(m => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  };

  // Rimosso sistema iframe - ora i bookmaker si aprono direttamente in nuova scheda

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'calcio': return '⚽';
      case 'tennis': return '🎾';
      case 'basket': return '🏀';
      case 'volley': return '🏐';
      case 'rugby': return '🏉';
      case 'hockey': return '🏒';
      case 'baseball': return '⚾';
      case 'golf': return '⛳';
      case 'boxe': return '🥊';
      case 'mma': return '🥋';
      default: return '🏆';
    }
  };

  const getSportName = (sport: string) => {
    const names: { [key: string]: string } = {
      calcio: 'Calcio',
      tennis: 'Tennis',
      basket: 'Basket',
      volley: 'Volley',
      rugby: 'Rugby',
      hockey: 'Hockey',
      baseball: 'Baseball',
      golf: 'Golf',
      boxe: 'Boxe',
      mma: 'MMA'
    };
    return names[sport] || sport.charAt(0).toUpperCase() + sport.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
      />

      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Indietro
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-4xl mr-4">{getSportIcon(sport)}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getSportName(sport)}
              </h1>
              <p className="text-blue-100 text-lg">
                {filteredMatches.length} partite disponibili
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-between items-center text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-0">
            <div className="flex items-center mr-0 sm:mr-6">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary-600" />
              <span className="text-center sm:text-left">
                Ultimo aggiornamento: {
                  useRealData && lastUpdate 
                    ? lastUpdate.toLocaleTimeString('it-IT')
                    : new Date().toLocaleTimeString('it-IT')
                }
              </span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center">
                <span className="font-medium">{Object.keys(matchesByLeague).length}</span>
                <span className="ml-1">campionati</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{bookmakers.length}</span>
                <span className="ml-1">bookmakers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Source Toggle - Fixed TypeScript props */}
        <DataSourceToggle
          useRealData={useRealData}
          onToggle={toggleDataSource}
          loading={loading}
        />

        {/* API Status Banner */}
        <ApiStatusBanner
          useRealData={useRealData}
          error={error}
          loading={loading}
          onToggle={toggleDataSource}
        />

        {/* Best Odds Highlight */}
        {filteredMatches.length > 0 && (
          <BestOddsHighlight 
            matches={filteredMatches}
            onMatchClick={(match: any) => {
              handleViewDetails(match.id);
            }}
          />
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Partite {getSportName(sport)}
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

        {/* Matches by League */}
        {filteredMatches.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
              <div key={league}>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {league}
                  </h3>
                  <span className="ml-3 text-sm text-gray-500">
                    ({leagueMatches.length} partite)
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                      {leagueMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        bestOdds={calculateBestOdds(match)}
                        onViewDetails={handleViewDetails}
        
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">{getSportIcon(sport)}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nessuna partita trovata per {getSportName(sport)}
            </h3>
            <p className="text-gray-500 mb-6">
              Prova a modificare i filtri di ricerca o torna alla homepage
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ sport });
                }}
                className="btn-secondary"
              >
                Cancella Filtri
              </button>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                Torna alla Homepage
              </button>
            </div>
          </div>
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
          bookmakers={bookmakers}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}

        />
      )}

      {/* Bookmaker Frame */}
              {/* Rimosso BookmakerFrame - ora i siti si aprono direttamente in nuova scheda */}
    </div>
  );
} 