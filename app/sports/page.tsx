'use client';

import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  Search,
  Filter,
  TrendingUp,
  Globe,
  Crown,
  Zap
} from 'lucide-react';

interface League {
  id: string;
  name: string;
  country: string;
  sport: string;
  tier: 'premium' | 'standard' | 'basic';
  teams: number;
  season: string;
  popularity: number;
}

interface Sport {
  id: string;
  name: string;
  icon: string;
  leagues: League[];
  totalMatches: number;
  popularity: number;
}

// Database degli sport e campionati
const SPORTS_DATABASE: Sport[] = [
  {
    id: 'calcio',
    name: 'Calcio',
    icon: '⚽',
    popularity: 95,
    totalMatches: 1250,
    leagues: [
      { id: 'serie-a', name: 'Serie A', country: 'Italia', sport: 'calcio', tier: 'premium', teams: 20, season: '2024/25', popularity: 90 },
      { id: 'premier-league', name: 'Premier League', country: 'Inghilterra', sport: 'calcio', tier: 'premium', teams: 20, season: '2024/25', popularity: 95 },
      { id: 'la-liga', name: 'La Liga', country: 'Spagna', sport: 'calcio', tier: 'premium', teams: 20, season: '2024/25', popularity: 88 },
      { id: 'bundesliga', name: 'Bundesliga', country: 'Germania', sport: 'calcio', tier: 'premium', teams: 18, season: '2024/25', popularity: 85 },
      { id: 'ligue-1', name: 'Ligue 1', country: 'Francia', sport: 'calcio', tier: 'premium', teams: 18, season: '2024/25', popularity: 80 },
      { id: 'champions-league', name: 'Champions League', country: 'Europa', sport: 'calcio', tier: 'premium', teams: 32, season: '2024/25', popularity: 98 },
      { id: 'europa-league', name: 'Europa League', country: 'Europa', sport: 'calcio', tier: 'standard', teams: 32, season: '2024/25', popularity: 75 },
      { id: 'serie-b', name: 'Serie B', country: 'Italia', sport: 'calcio', tier: 'standard', teams: 20, season: '2024/25', popularity: 65 }
    ]
  },
  {
    id: 'basket',
    name: 'Basket',
    icon: '🏀',
    popularity: 75,
    totalMatches: 850,
    leagues: [
      { id: 'nba', name: 'NBA', country: 'USA', sport: 'basket', tier: 'premium', teams: 30, season: '2024/25', popularity: 95 },
      { id: 'euroleague', name: 'EuroLeague', country: 'Europa', sport: 'basket', tier: 'premium', teams: 18, season: '2024/25', popularity: 85 },
      { id: 'serie-a-basket', name: 'Serie A Basket', country: 'Italia', sport: 'basket', tier: 'standard', teams: 16, season: '2024/25', popularity: 70 },
      { id: 'eurocup', name: 'EuroCup', country: 'Europa', sport: 'basket', tier: 'standard', teams: 20, season: '2024/25', popularity: 65 }
    ]
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    popularity: 80,
    totalMatches: 2100,
    leagues: [
      { id: 'atp-tour', name: 'ATP Tour', country: 'Mondiale', sport: 'tennis', tier: 'premium', teams: 128, season: '2024', popularity: 90 },
      { id: 'wta-tour', name: 'WTA Tour', country: 'Mondiale', sport: 'tennis', tier: 'premium', teams: 128, season: '2024', popularity: 85 },
      { id: 'grand-slam', name: 'Grand Slam', country: 'Mondiale', sport: 'tennis', tier: 'premium', teams: 128, season: '2024', popularity: 98 },
      { id: 'atp-challengers', name: 'ATP Challengers', country: 'Mondiale', sport: 'tennis', tier: 'standard', teams: 64, season: '2024', popularity: 60 }
    ]
  },
  {
    id: 'football-americano',
    name: 'Football Americano',
    icon: '🏈',
    popularity: 70,
    totalMatches: 450,
    leagues: [
      { id: 'nfl', name: 'NFL', country: 'USA', sport: 'football-americano', tier: 'premium', teams: 32, season: '2024', popularity: 95 },
      { id: 'ncaa-football', name: 'NCAA Football', country: 'USA', sport: 'football-americano', tier: 'standard', teams: 130, season: '2024', popularity: 80 }
    ]
  },
  {
    id: 'hockey',
    name: 'Hockey su Ghiaccio',
    icon: '🏒',
    popularity: 65,
    totalMatches: 650,
    leagues: [
      { id: 'nhl', name: 'NHL', country: 'USA/Canada', sport: 'hockey', tier: 'premium', teams: 32, season: '2024/25', popularity: 90 },
      { id: 'khl', name: 'KHL', country: 'Russia', sport: 'hockey', tier: 'standard', teams: 24, season: '2024/25', popularity: 70 }
    ]
  },
  {
    id: 'baseball',
    name: 'Baseball',
    icon: '⚾',
    popularity: 60,
    totalMatches: 1200,
    leagues: [
      { id: 'mlb', name: 'MLB', country: 'USA', sport: 'baseball', tier: 'premium', teams: 30, season: '2024', popularity: 85 },
      { id: 'npb', name: 'NPB', country: 'Giappone', sport: 'baseball', tier: 'standard', teams: 12, season: '2024', popularity: 70 }
    ]
  }
];

export default function SportsPage() {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const filteredSports = SPORTS_DATABASE.filter(sport => {
    if (selectedSport !== 'all' && sport.id !== selectedSport) return false;
    
    const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.leagues.some(league => 
                           league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           league.country.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    return matchesSearch;
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'standard': return <Star className="h-4 w-4" />;
      case 'basic': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
      case 'standard': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'basic': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
      default: return 'bg-dark-600 text-dark-400 border-dark-500';
    }
  };

  const totalLeagues = SPORTS_DATABASE.reduce((acc, sport) => acc + sport.leagues.length, 0);
  const totalMatches = SPORTS_DATABASE.reduce((acc, sport) => acc + sport.totalMatches, 0);
  const premiumLeagues = SPORTS_DATABASE.reduce((acc, sport) => 
    acc + sport.leagues.filter(l => l.tier === 'premium').length, 0
  );

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sport e Campionati
          </h1>
          <p className="text-xl text-dark-300 mb-6">
            Esplora tutti gli sport e campionati disponibili sulla nostra piattaforma
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{SPORTS_DATABASE.length}</div>
              <div className="text-sm text-dark-400">Sport</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-primary-400">{totalLeagues}</div>
              <div className="text-sm text-dark-400">Campionati</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent-400">{premiumLeagues}</div>
              <div className="text-sm text-dark-400">Premium</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-success-400">{totalMatches.toLocaleString()}</div>
              <div className="text-sm text-dark-400">Partite/Anno</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Cerca sport o campionati..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sport Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-dark-400" />
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tutti gli sport</option>
                {SPORTS_DATABASE.map(sport => (
                  <option key={sport.id} value={sport.id}>
                    {sport.icon} {sport.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Filter */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-dark-400" />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tutti i livelli</option>
                <option value="premium">Premium</option>
                <option value="standard">Standard</option>
                <option value="basic">Basic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sports Grid */}
        <div className="space-y-8">
          {filteredSports.map((sport) => {
            const filteredLeagues = sport.leagues.filter(league => 
              tierFilter === 'all' || league.tier === tierFilter
            );

            if (filteredLeagues.length === 0) return null;

            return (
              <div key={sport.id} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
                {/* Sport Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{sport.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{sport.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-dark-400">
                        <span className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4" />
                          <span>{filteredLeagues.length} campionati</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{sport.totalMatches.toLocaleString()} partite/anno</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{sport.popularity}% popolarità</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Popularity Bar */}
                  <div className="text-right">
                    <div className="text-sm text-dark-400 mb-1">Popolarità</div>
                    <div className="w-24 bg-dark-700 rounded-full h-2">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        style={{ width: `${sport.popularity}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Leagues Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredLeagues.map((league) => (
                    <div
                      key={league.id}
                      className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 hover:border-dark-500 transition-all duration-200 hover:scale-105"
                    >
                      {/* League Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {league.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-dark-400">
                            <MapPin className="h-3 w-3" />
                            <span>{league.country}</span>
                          </div>
                        </div>
                        
                        {/* Tier Badge */}
                        <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center space-x-1 ${getTierColor(league.tier)}`}>
                          {getTierIcon(league.tier)}
                          <span className="capitalize">{league.tier}</span>
                        </div>
                      </div>

                      {/* League Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{league.teams}</div>
                          <div className="text-xs text-dark-400">Squadre</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-400">{league.popularity}%</div>
                          <div className="text-xs text-dark-400">Popolarità</div>
                        </div>
                      </div>

                      {/* Season Info */}
                      <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                        <div className="text-xs text-dark-400 mb-1">Stagione</div>
                        <div className="text-sm font-medium text-white">{league.season}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nessuno sport trovato
            </h3>
            <p className="text-dark-400 mb-4">
              Prova a modificare i filtri di ricerca
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('all');
                setTierFilter('all');
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Resetta filtri
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 