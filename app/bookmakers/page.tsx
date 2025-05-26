'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Filter,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { BOOKMAKER_BASE_URLS } from '@/lib/bookmakerLinks';
import SmartBookmakerHandler from '@/components/SmartBookmakerHandler';

interface BookmakerInfo {
  name: string;
  url: string;
  country: string;
  rating: number;
  bonus: string;
  features: string[];
  category: 'italian' | 'international' | 'specialized';
  verified: boolean;
}

// Database completo dei bookmaker con informazioni dettagliate
const BOOKMAKER_DATABASE: BookmakerInfo[] = [
  // TOP Bookmaker Italiani
  {
    name: 'Bet365',
    url: BOOKMAKER_BASE_URLS['Bet365'] || '',
    country: 'IT',
    rating: 4.8,
    bonus: 'Fino a €100',
    features: ['Live Streaming', 'Cash Out', 'Quote Migliorate'],
    category: 'italian',
    verified: true
  },
  {
    name: 'Sisal',
    url: BOOKMAKER_BASE_URLS['Sisal'] || '',
    country: 'IT',
    rating: 4.6,
    bonus: 'Bonus Benvenuto €50',
    features: ['App Mobile', 'Statistiche Live', 'Multibet'],
    category: 'italian',
    verified: true
  },
  {
    name: 'Snai',
    url: BOOKMAKER_BASE_URLS['Snai'] || '',
    country: 'IT',
    rating: 4.5,
    bonus: 'Bonus Sport €25',
    features: ['Punti Vendita', 'Live Betting', 'Cashback'],
    category: 'italian',
    verified: true
  },
  {
    name: 'Eurobet',
    url: BOOKMAKER_BASE_URLS['Eurobet'] || '',
    country: 'IT',
    rating: 4.4,
    bonus: 'Bonus €50 + €50',
    features: ['Quote Maggiorate', 'Live TV', 'Combo Boost'],
    category: 'italian',
    verified: true
  },
  {
    name: 'Lottomatica',
    url: BOOKMAKER_BASE_URLS['Lottomatica'] || '',
    country: 'IT',
    rating: 4.3,
    bonus: 'Bonus Benvenuto €100',
    features: ['Rete Capillare', 'Gioco Responsabile', 'Promozioni'],
    category: 'italian',
    verified: true
  },

  // Bookmaker Internazionali
  {
    name: 'William Hill',
    url: BOOKMAKER_BASE_URLS['William Hill'] || '',
    country: 'UK',
    rating: 4.7,
    bonus: 'Bet €10 Get €30',
    features: ['Tradizione', 'Quote Competitive', 'Live Streaming'],
    category: 'international',
    verified: true
  },
  {
    name: 'Betfair',
    url: BOOKMAKER_BASE_URLS['Betfair'] || '',
    country: 'UK',
    rating: 4.6,
    bonus: 'Exchange + Sportsbook',
    features: ['Betting Exchange', 'Migliori Quote', 'Cash Out'],
    category: 'international',
    verified: true
  },
  {
    name: 'Unibet',
    url: BOOKMAKER_BASE_URLS['Unibet'] || '',
    country: 'SE',
    rating: 4.5,
    bonus: 'Bonus €100',
    features: ['Live Streaming', 'Statistiche', 'App Premiata'],
    category: 'international',
    verified: true
  },

  // Bookmaker Specializzati
  {
    name: 'Pinnacle',
    url: BOOKMAKER_BASE_URLS['Pinnacle'] || '',
    country: 'CW',
    rating: 4.9,
    bonus: 'Quote Più Alte',
    features: ['Quote Massime', 'Limiti Alti', 'No Limits'],
    category: 'specialized',
    verified: true
  },
  {
    name: 'Betano',
    url: BOOKMAKER_BASE_URLS['Betano'] || '',
    country: 'MT',
    rating: 4.4,
    bonus: 'Bonus Sport €50',
    features: ['Live Streaming', 'Cash Out', 'Promozioni'],
    category: 'specialized',
    verified: true
  }
];

// Aggiungi tutti gli altri bookmaker dalla configurazione
Object.keys(BOOKMAKER_BASE_URLS).forEach(name => {
  if (!BOOKMAKER_DATABASE.find(b => b.name === name)) {
    BOOKMAKER_DATABASE.push({
      name,
      url: BOOKMAKER_BASE_URLS[name],
      country: 'IT',
      rating: 4.0,
      bonus: 'Bonus Disponibile',
      features: ['Scommesse Live', 'App Mobile', 'Supporto IT'],
      category: 'italian',
      verified: true
    });
  }
});

export default function BookmakersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'country'>('rating');

  const filteredBookmakers = useMemo(() => {
    let filtered = BOOKMAKER_DATABASE.filter(bookmaker => {
      const matchesSearch = bookmaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookmaker.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bookmaker.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || bookmaker.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'italian': return <Shield className="h-4 w-4" />;
      case 'international': return <Globe className="h-4 w-4" />;
      case 'specialized': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'italian': return 'bg-success-500/20 text-success-400 border-success-500/30';
      case 'international': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'specialized': return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
      default: return 'bg-dark-600 text-dark-400 border-dark-500';
    }
  };

  const stats = {
    total: BOOKMAKER_DATABASE.length,
    italian: BOOKMAKER_DATABASE.filter(b => b.category === 'italian').length,
    international: BOOKMAKER_DATABASE.filter(b => b.category === 'international').length,
    specialized: BOOKMAKER_DATABASE.filter(b => b.category === 'specialized').length,
    verified: BOOKMAKER_DATABASE.filter(b => b.verified).length
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bookmaker Supportati
          </h1>
          <p className="text-xl text-dark-300 mb-6">
            Scopri tutti i {stats.total} bookmaker integrati nella nostra piattaforma
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-dark-400">Totali</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-success-400">{stats.italian}</div>
              <div className="text-sm text-dark-400">Italiani</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-primary-400">{stats.international}</div>
              <div className="text-sm text-dark-400">Internazionali</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent-400">{stats.specialized}</div>
              <div className="text-sm text-dark-400">Specializzati</div>
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
                  placeholder="Cerca bookmaker, paese o caratteristiche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-dark-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tutte le categorie</option>
                <option value="italian">Italiani</option>
                <option value="international">Internazionali</option>
                <option value="specialized">Specializzati</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-dark-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'country')}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Valutazione</option>
                <option value="name">Nome</option>
                <option value="country">Paese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-dark-400">
            Mostrando {filteredBookmakers.length} di {stats.total} bookmaker
          </p>
        </div>

        {/* Bookmakers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmakers.map((bookmaker) => (
            <div
              key={bookmaker.name}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {bookmaker.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {bookmaker.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-dark-400">{bookmaker.country}</span>
                      {bookmaker.verified && (
                        <CheckCircle className="h-4 w-4 text-success-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center space-x-1 ${getCategoryColor(bookmaker.category)}`}>
                  {getCategoryIcon(bookmaker.category)}
                  <span className="capitalize">
                    {bookmaker.category === 'italian' ? 'Italiano' : 
                     bookmaker.category === 'international' ? 'Internazionale' : 'Specializzato'}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(bookmaker.rating)
                          ? 'text-warning-400 fill-current'
                          : 'text-dark-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">
                  {bookmaker.rating.toFixed(1)}
                </span>
              </div>

              {/* Bonus */}
              <div className="bg-dark-700/50 rounded-lg p-3 mb-4">
                <div className="text-xs text-dark-400 mb-1">Bonus Benvenuto</div>
                <div className="text-sm font-medium text-primary-400">
                  {bookmaker.bonus}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="text-xs text-dark-400 mb-2">Caratteristiche principali:</div>
                {bookmaker.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-success-400 flex-shrink-0" />
                    <span className="text-xs text-dark-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <SmartBookmakerHandler
                bookmakerName={bookmaker.name}
                matchInfo={{
                  homeTeam: "Test",
                  awayTeam: "Match",
                  sport: "calcio"
                }}
                className="w-full bg-primary-gradient text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visita {bookmaker.name}</span>
              </SmartBookmakerHandler>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBookmakers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nessun bookmaker trovato
            </h3>
            <p className="text-dark-400 mb-4">
              Prova a modificare i filtri di ricerca
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
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