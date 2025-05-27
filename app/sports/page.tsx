'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  TrendingUp,
  Users,
  Globe,
  Clock,
  Star,
  Trophy,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { activeSeasonsManager } from '@/lib/activeSeasonsManager';

interface Sport {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularity: number;
  leagues: League[];
  totalMatches: number;
  avgOdds: number;
  bestBookmakers: string[];
  features: string[];
  season: string;
  nextMajorEvent: string;
  supported: boolean;
  premium: boolean;
}

interface League {
  id: string;
  name: string;
  country: string;
  level: 'top' | 'medium' | 'low';
  matches: number;
  season: string;
}

const sports: Sport[] = [
  {
    id: 'calcio',
    name: 'Calcio',
    icon: '⚽',
    description: 'Il re degli sport con i campionati più seguiti al mondo',
    popularity: 95,
    leagues: [
      { id: 'serie-a', name: 'Serie A', country: 'Italia', level: 'top', matches: 380, season: '2024/25' },
      { id: 'premier-league', name: 'Premier League', country: 'Inghilterra', level: 'top', matches: 380, season: '2024/25' },
      { id: 'la-liga', name: 'La Liga', country: 'Spagna', level: 'top', matches: 380, season: '2024/25' },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germania', level: 'top', matches: 306, season: '2024/25' },
      { id: 'ligue-1', name: 'Ligue 1', country: 'Francia', level: 'top', matches: 380, season: '2024/25' },
      { id: 'champions-league', name: 'Champions League', country: 'Europa', level: 'top', matches: 125, season: '2024/25' },
      { id: 'europa-league', name: 'Europa League', country: 'Europa', level: 'medium', matches: 205, season: '2024/25' },
      { id: 'serie-b', name: 'Serie B', country: 'Italia', level: 'medium', matches: 380, season: '2024/25' }
    ],
    totalMatches: 2536,
    avgOdds: 2.45,
    bestBookmakers: ['Bet365', 'Pinnacle', 'Betfair'],
    features: ['Live Streaming', 'Cash Out', 'Bet Builder', 'Corner Betting'],
    season: '2024/25',
    nextMajorEvent: 'Euro 2024',
    supported: true,
    premium: false
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    description: 'Sport individuale con tornei ATP, WTA e Slam',
    popularity: 85,
    leagues: [
      { id: 'atp-tour', name: 'ATP Tour', country: 'Mondiale', level: 'top', matches: 2500, season: '2024' },
      { id: 'wta-tour', name: 'WTA Tour', country: 'Mondiale', level: 'top', matches: 2000, season: '2024' },
      { id: 'grand-slam', name: 'Grand Slam', country: 'Mondiale', level: 'top', matches: 508, season: '2024' },
      { id: 'atp-challengers', name: 'ATP Challengers', country: 'Mondiale', level: 'medium', matches: 3500, season: '2024' },
      { id: 'itf-futures', name: 'ITF Futures', country: 'Mondiale', level: 'low', matches: 5000, season: '2024' }
    ],
    totalMatches: 13508,
    avgOdds: 1.85,
    bestBookmakers: ['Pinnacle', 'Bet365', 'William Hill'],
    features: ['Live Betting', 'Set Betting', 'Game Betting', 'Retirement Insurance'],
    season: '2024',
    nextMajorEvent: 'Wimbledon 2024',
    supported: true,
    premium: false
  },
  {
    id: 'basket',
    name: 'Basket',
    icon: '🏀',
    description: 'NBA, EuroLega e campionati nazionali',
    popularity: 80,
    leagues: [
      { id: 'nba', name: 'NBA', country: 'USA', level: 'top', matches: 1230, season: '2024/25' },
      { id: 'euroleague', name: 'EuroLega', country: 'Europa', level: 'top', matches: 244, season: '2024/25' },
      { id: 'serie-a-basket', name: 'Serie A Basket', country: 'Italia', level: 'medium', matches: 240, season: '2024/25' },
      { id: 'eurocup', name: 'EuroCup', country: 'Europa', level: 'medium', matches: 178, season: '2024/25' },
      { id: 'ncaa', name: 'NCAA', country: 'USA', level: 'medium', matches: 5000, season: '2024/25' }
    ],
    totalMatches: 6892,
    avgOdds: 1.95,
    bestBookmakers: ['Bet365', 'Betfair', 'William Hill'],
    features: ['Quarter Betting', 'Player Props', 'Live Betting', 'Handicap'],
    season: '2024/25',
    nextMajorEvent: 'NBA Finals 2024',
    supported: true,
    premium: false
  },
  {
    id: 'formula1',
    name: 'Formula 1',
    icon: '🏎️',
    description: 'Il circus della Formula 1 con 24 Gran Premi',
    popularity: 75,
    leagues: [
      { id: 'f1-championship', name: 'Campionato F1', country: 'Mondiale', level: 'top', matches: 24, season: '2024' },
      { id: 'f1-qualifying', name: 'Qualifiche F1', country: 'Mondiale', level: 'top', matches: 24, season: '2024' },
      { id: 'f1-practice', name: 'Prove Libere', country: 'Mondiale', level: 'medium', matches: 72, season: '2024' }
    ],
    totalMatches: 120,
    avgOdds: 3.25,
    bestBookmakers: ['Bet365', 'William Hill', 'Betsson'],
    features: ['Fastest Lap', 'Constructor Betting', 'Podium Finish', 'Head-to-Head'],
    season: '2024',
    nextMajorEvent: 'Monaco GP 2024',
    supported: true,
    premium: true
  },
  {
    id: 'mma',
    name: 'MMA/UFC',
    icon: '🥊',
    description: 'UFC e promozioni di arti marziali miste',
    popularity: 70,
    leagues: [
      { id: 'ufc', name: 'UFC', country: 'Mondiale', level: 'top', matches: 500, season: '2024' },
      { id: 'bellator', name: 'Bellator', country: 'USA', level: 'medium', matches: 200, season: '2024' },
      { id: 'one-championship', name: 'ONE Championship', country: 'Asia', level: 'medium', matches: 150, season: '2024' }
    ],
    totalMatches: 850,
    avgOdds: 2.15,
    bestBookmakers: ['Pinnacle', 'Bet365', 'Betfair'],
    features: ['Method of Victory', 'Round Betting', 'Fight Props', 'Live Betting'],
    season: '2024',
    nextMajorEvent: 'UFC 300',
    supported: true,
    premium: true
  },
  {
    id: 'esports',
    name: 'Esports',
    icon: '🎮',
    description: 'League of Legends, CS2, Dota 2 e altri titoli',
    popularity: 65,
    leagues: [
      { id: 'lol-worlds', name: 'LoL Worlds', country: 'Mondiale', level: 'top', matches: 100, season: '2024' },
      { id: 'cs2-majors', name: 'CS2 Majors', country: 'Mondiale', level: 'top', matches: 150, season: '2024' },
      { id: 'dota2-ti', name: 'Dota 2 TI', country: 'Mondiale', level: 'top', matches: 80, season: '2024' },
      { id: 'valorant-champions', name: 'Valorant Champions', country: 'Mondiale', level: 'top', matches: 120, season: '2024' }
    ],
    totalMatches: 450,
    avgOdds: 1.75,
    bestBookmakers: ['Pinnacle', 'Betway', 'GG.bet'],
    features: ['Map Betting', 'First Blood', 'Tournament Winner', 'Live Betting'],
    season: '2024',
    nextMajorEvent: 'LoL Worlds 2024',
    supported: false,
    premium: true
  }
];

const categories = ['Tutti', 'Supportati', 'Premium', 'Popolari'];
const sortOptions = ['Popolarità', 'Nome', 'Partite Totali', 'Quote Medie'];

export default function SportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('Popolarità');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);

  // Statistiche dinamiche basate sui campionati attivi
  const activeSeasonsStats = useMemo(() => {
    return activeSeasonsManager.getSeasonsStats();
  }, []);

  // Filtra sport per mostrare solo quelli con campionati attivi
  const sportsWithActiveLeagues = useMemo(() => {
    const activeLeagues = activeSeasonsStats.activeLeagues;
    
    return sports.map(sport => {
      // Trova i campionati attivi per questo sport
      const activeSportLeagues = activeLeagues.filter(league => {
        // Mappa i nomi dei campionati attivi ai nomi nei dati sport
        const leagueMapping: { [key: string]: string } = {
          'Champions League': 'champions-league',
          'NBA': 'nba',
          'Premier League': 'premier-league',
          'La Liga': 'la-liga',
          'Bundesliga': 'bundesliga',
          'Ligue 1': 'ligue-1',
          'Wimbledon ATP': 'atp-tour'
        };
        
        const mappedName = leagueMapping[league.name];
        return sport.leagues.some(l => l.id === mappedName || l.name === league.name);
      });

      // Aggiorna lo sport con solo i campionati attivi
      const activeLeaguesForSport = sport.leagues.filter(league => {
        return activeSportLeagues.some(activeLeague => 
          league.name === activeLeague.name || 
          (activeLeague.name === 'Champions League' && league.id === 'champions-league') ||
          (activeLeague.name === 'NBA' && league.id === 'nba') ||
          (activeLeague.name === 'Premier League' && league.id === 'premier-league') ||
          (activeLeague.name === 'La Liga' && league.id === 'la-liga') ||
          (activeLeague.name === 'Bundesliga' && league.id === 'bundesliga') ||
          (activeLeague.name === 'Ligue 1' && league.id === 'ligue-1') ||
          (activeLeague.name === 'Wimbledon ATP' && league.id === 'atp-tour')
        );
      });

      return {
        ...sport,
        leagues: activeLeaguesForSport,
        supported: activeLeaguesForSport.length > 0, // Solo supportato se ha campionati attivi
        totalMatches: activeLeaguesForSport.reduce((sum, league) => sum + league.matches, 0)
      };
    }).filter(sport => sport.leagues.length > 0); // Mostra solo sport con campionati attivi
  }, [activeSeasonsStats]);

  // Filtra e ordina gli sport (solo quelli con campionati attivi)
  const filteredSports = sportsWithActiveLeagues
    .filter(sport => {
      const matchesSearch = sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sport.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      switch (selectedCategory) {
        case 'Supportati':
          matchesCategory = sport.supported;
          break;
        case 'Premium':
          matchesCategory = sport.premium;
          break;
        case 'Popolari':
          matchesCategory = sport.popularity >= 80;
          break;
      }
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Popolarità':
          return b.popularity - a.popularity;
        case 'Nome':
          return a.name.localeCompare(b.name);
        case 'Partite Totali':
          return b.totalMatches - a.totalMatches;
        case 'Quote Medie':
          return b.avgOdds - a.avgOdds;
        default:
          return 0;
      }
    });

  const getLeagueLevel = (level: string) => {
    switch (level) {
      case 'top': return { label: 'TOP', color: 'bg-accent-500/20 text-accent-400' };
      case 'medium': return { label: 'MED', color: 'bg-warning-500/20 text-warning-400' };
      case 'low': return { label: 'LOW', color: 'bg-dark-500/20 text-dark-400' };
      default: return { label: 'N/A', color: 'bg-dark-500/20 text-dark-400' };
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            Solo Campionati Attivi - Stagione 2024/25
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            Sport e Campionati
          </h1>
          <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
            Esplora solo gli sport con campionati attualmente in corso. Quote aggiornate giornalmente per {activeSeasonsStats.active} campionati attivi.
          </p>
          
          {/* Statistiche Campionati Attivi */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{activeSeasonsStats.active}</div>
              <div className="text-sm text-dark-400">Campionati Attivi</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-400">{sportsWithActiveLeagues.length}</div>
              <div className="text-sm text-dark-400">Sport Disponibili</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent-400">{sportsWithActiveLeagues.reduce((sum, sport) => sum + sport.totalMatches, 0).toLocaleString()}</div>
              <div className="text-sm text-dark-400">Partite Attive</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">{activeSeasonsStats.upcoming}</div>
              <div className="text-sm text-dark-400">Prossime Stagioni</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cerca sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-4 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-4 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>Ordina per {option}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-dark-400">
            Mostrando {filteredSports.length} di {sportsWithActiveLeagues.length} sport con campionati attivi
          </div>
        </div>

        {/* Sports Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSports.map((sport) => (
            <div
              key={sport.id}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedSport(sport)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{sport.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{sport.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3 text-primary-400" />
                        <span className="text-xs text-dark-400">{sport.popularity}% popolarità</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  {sport.supported ? (
                    <div className="bg-success-500/20 text-success-400 px-2 py-1 rounded text-xs font-medium">
                      SUPPORTATO
                    </div>
                  ) : (
                    <div className="bg-dark-500/20 text-dark-400 px-2 py-1 rounded text-xs font-medium">
                      PROSSIMAMENTE
                    </div>
                  )}
                  {sport.premium && (
                    <div className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-xs font-medium">
                      PREMIUM
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-dark-300 mb-4">{sport.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-dark-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="h-4 w-4 text-warning-400" />
                    <span className="text-xs text-dark-400">Campionati</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {sport.leagues.length}
                  </div>
                </div>
                
                <div className="bg-dark-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary-400" />
                    <span className="text-xs text-dark-400">Partite</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {sport.totalMatches.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Top Leagues Preview */}
              <div className="mb-4">
                <div className="text-xs text-dark-400 mb-2">Campionati principali:</div>
                <div className="space-y-1">
                  {sport.leagues.slice(0, 3).map((league) => {
                    const levelInfo = getLeagueLevel(league.level);
                    return (
                      <div key={league.id} className="flex items-center justify-between text-xs">
                        <span className="text-dark-300">{league.name}</span>
                        <span className={`px-2 py-1 rounded ${levelInfo.color}`}>
                          {levelInfo.label}
                        </span>
                      </div>
                    );
                  })}
                  {sport.leagues.length > 3 && (
                    <div className="text-xs text-dark-500">
                      +{sport.leagues.length - 3} altri campionati
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {sport.supported ? (
                <Link
                  href={`/categoria/${sport.id}`}
                  className="w-full bg-primary-gradient text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Vedi Quote</span>
                  <Target className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-dark-600 text-dark-400 py-2 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Prossimamente</span>
                  <Clock className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-dark-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nessuno sport trovato
            </h3>
            <p className="text-dark-300 mb-6">
              Prova a modificare i filtri di ricerca
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tutti');
              }}
              className="bg-primary-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
            >
              Cancella Filtri
            </button>
          </div>
        )}

        {/* Featured Sports Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Sport in Evidenza
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sports.filter(s => s.supported && s.popularity >= 80).slice(0, 3).map((sport) => (
              <div
                key={sport.id}
                className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-200"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{sport.icon}</div>
                  <h3 className="text-lg font-semibold text-white">{sport.name}</h3>
                  <div className="text-sm text-primary-400">
                    {sport.totalMatches.toLocaleString()} partite disponibili
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Quote medie:</span>
                    <span className="text-white font-medium">{sport.avgOdds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Prossimo evento:</span>
                    <span className="text-accent-400 font-medium">{sport.nextMajorEvent}</span>
                  </div>
                </div>
                
                <Link
                  href={`/categoria/${sport.id}`}
                  className="w-full bg-primary-gradient text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Esplora {sport.name}</span>
                  <Zap className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sport Detail Modal */}
        {selectedSport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-dark-900 border border-dark-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{selectedSport.icon}</div>
                    <h2 className="text-2xl font-bold text-white">{selectedSport.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedSport(null)}
                    className="text-dark-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Informazioni</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-dark-400">Popolarità:</span>
                        <span className="text-white">{selectedSport.popularity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Partite totali:</span>
                        <span className="text-white">{selectedSport.totalMatches.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Quote medie:</span>
                        <span className="text-white">{selectedSport.avgOdds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-400">Stagione:</span>
                        <span className="text-white">{selectedSport.season}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-md font-semibold text-white mt-6 mb-3">Caratteristiche</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSport.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Leagues */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Campionati ({selectedSport.leagues.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedSport.leagues.map((league) => {
                        const levelInfo = getLeagueLevel(league.level);
                        return (
                          <div
                            key={league.id}
                            className="bg-dark-800 border border-dark-700 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{league.name}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${levelInfo.color}`}>
                                {levelInfo.label}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-dark-400">{league.country}</span>
                              <span className="text-dark-300">{league.matches} partite</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {selectedSport.supported && (
                  <div className="mt-6 text-center">
                    <Link
                      href={`/categoria/${selectedSport.id}`}
                      className="bg-primary-gradient text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 inline-flex items-center space-x-2"
                    >
                      <span>Vedi Quote {selectedSport.name}</span>
                      <Target className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 