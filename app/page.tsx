'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import FilterPanel from '@/components/FilterPanel';
import MatchDetails from '@/components/MatchDetails';
import DataSourceToggle from '@/components/DataSourceToggle';
import SportCategoryStats from '@/components/SportCategoryStats';
import { matches as mockMatches, bookmakers } from '@/data/mockData';
import { useRealOdds } from '@/hooks/useRealOdds';
import { FilterOptions, BestOdds, Match } from '@/types';
import { TrendingUp, Users, Award, Clock, Filter } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  // Hook per gestire le quote reali
  const {
    matches: realMatches,
    loading,
    error,
    lastUpdate,
    apiStatus,
    categoryStats,
    refreshData,
    useRealData,
    toggleDataSource
  } = useRealOdds();

  // Usa i dati reali se disponibili, altrimenti quelli simulati
  const matches = useRealData ? realMatches : mockMatches;

  // Calcola statistiche per dati simulati
  const mockCategoryStats = useMemo(() => {
    if (useRealData) return null;
    
    const stats = {
      calcio: { count: 0, leagues: new Set<string>() },
      tennis: { count: 0, leagues: new Set<string>() },
      basket: { count: 0, leagues: new Set<string>() },
      altro: { count: 0, leagues: new Set<string>() }
    };

    mockMatches.forEach(match => {
      const category = match.sport as keyof typeof stats;
      if (stats[category]) {
        stats[category].count++;
        stats[category].leagues.add(match.league);
      }
    });

    return {
      calcio: { count: stats.calcio.count, leagues: Array.from(stats.calcio.leagues) },
      tennis: { count: stats.tennis.count, leagues: Array.from(stats.tennis.leagues) },
      basket: { count: stats.basket.count, leagues: Array.from(stats.basket.leagues) },
      altro: { count: stats.altro.count, leagues: Array.from(stats.altro.leagues) }
    };
  }, [useRealData]);

  const currentStats = useRealData ? categoryStats : mockCategoryStats;

  // Funzione per calcolare le migliori quote
  const calculateBestOdds = (match: Match): BestOdds => {
    const homeOdds = match.odds.map(odd => ({ odds: odd.home, bookmaker: bookmakers.find(b => b.id === odd.bookmaker)?.name || odd.bookmaker }));
    const awayOdds = match.odds.map(odd => ({ odds: odd.away, bookmaker: bookmakers.find(b => b.id === odd.bookmaker)?.name || odd.bookmaker }));
    const drawOdds = match.odds.filter(odd => odd.draw).map(odd => ({ odds: odd.draw!, bookmaker: bookmakers.find(b => b.id === odd.bookmaker)?.name || odd.bookmaker }));

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setIsFilterPanelOpen(true)}
      />

      {/* Hero Section */}
      <div className="gradient-bg text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-shadow leading-tight">
            Confronta le Migliori Quote
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-100 px-2">
            {useRealData 
              ? 'Quote reali aggiornate in tempo reale da The Odds API'
              : 'Trova le quote più vantaggiose tra oltre 100 siti di scommesse'
            }
          </p>
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
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary-600" />
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
                <span className="font-medium">{filteredMatches.length}</span>
                <span className="ml-1">partite</span>
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
        {/* Data Source Toggle */}
        <DataSourceToggle
          useRealData={useRealData}
          onToggle={toggleDataSource}
          loading={loading}
          error={error}
          lastUpdate={lastUpdate}
          apiStatus={apiStatus}
          onRefresh={refreshData}
        />

        {/* Test Link Bookmaker Avanzato */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">🚀 Sistema Link Diretti Attivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-blue-700 mb-2">✅ Bookmaker con Link Diretti:</h4>
              <div className="flex flex-wrap gap-1">
                {['Bet365', 'Sisal', 'Snai', 'Bwin', 'Betfair', 'Unibet'].map(name => (
                  <span key={name} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-blue-700 mb-2">🔗 Funzionalità:</h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Link diretti alle partite specifiche</li>
                <li>• Parametri UTM per tracking</li>
                <li>• Fallback automatico per altri bookmaker</li>
                <li>• Gestione errori avanzata</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-3">
            💡 <strong>Novità:</strong> Clicca sulle quote nelle card per andare direttamente alla pagina della partita sul sito del bookmaker!
          </p>
        </div>

        {/* Category Statistics */}
        {currentStats && (
          <SportCategoryStats 
            stats={currentStats} 
            isRealData={useRealData}
          />
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
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

        {/* Matches by Category */}
        {filteredMatches.length > 0 ? (
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
                    <h3 className="text-xl font-semibold text-gray-900 capitalize">
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nessuna partita trovata
            </h3>
            <p className="text-gray-500 mb-6">
              Prova a modificare i filtri di ricerca o la query
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({});
              }}
              className="btn-primary"
            >
              Cancella Filtri
            </button>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary-400 mr-2" />
                <h3 className="text-2xl font-bold">SitoSport</h3>
              </div>
              <p className="text-gray-300 mb-4">
                La piattaforma leader per il confronto delle quote di scommesse sportive. 
                Trova sempre le migliori opportunità tra centinaia di bookmakers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sport</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Calcio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tennis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Basket</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Altri Sport</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Informazioni</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Chi Siamo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termini</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SitoSport. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 