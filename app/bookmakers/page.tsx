'use client';

import React, { useState } from 'react';
import { 
  Star, 
  Shield, 
  ExternalLink, 
  Search, 
  Filter,
  Award,
  TrendingUp,
  Users,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Bookmaker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  url: string;
  country: string;
  founded: number;
  license: string;
  features: string[];
  bonusWelcome: string;
  minDeposit: string;
  paymentMethods: string[];
  sports: string[];
  liveStreaming: boolean;
  cashOut: boolean;
  mobileApp: boolean;
  description: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  popular: boolean;
}

const bookmakers: Bookmaker[] = [
  {
    id: 'bet365',
    name: 'Bet365',
    logo: '🎯',
    rating: 4.8,
    url: 'https://www.bet365.it',
    country: 'Regno Unito',
    founded: 2000,
    license: 'AAMS/ADM',
    features: ['Live Streaming', 'Cash Out', 'Bet Builder'],
    bonusWelcome: 'Fino a €100',
    minDeposit: '€5',
    paymentMethods: ['Carta di Credito', 'PayPal', 'Skrill', 'Neteller'],
    sports: ['Calcio', 'Tennis', 'Basket', 'Formula 1', 'MMA'],
    liveStreaming: true,
    cashOut: true,
    mobileApp: true,
    description: 'Uno dei bookmaker più famosi al mondo con un\'ampia gamma di mercati sportivi.',
    pros: ['Streaming live gratuito', 'Quote competitive', 'Interfaccia user-friendly'],
    cons: ['Bonus di benvenuto limitato', 'Assistenza clienti non sempre rapida'],
    verified: true,
    popular: true
  },
  {
    id: 'sisal',
    name: 'Sisal',
    logo: '🇮🇹',
    rating: 4.6,
    url: 'https://www.sisal.it',
    country: 'Italia',
    founded: 1946,
    license: 'AAMS/ADM',
    features: ['SuperEnalotto', 'Casinò Live', 'Virtual Sports'],
    bonusWelcome: 'Fino a €200',
    minDeposit: '€10',
    paymentMethods: ['Carta di Credito', 'PostePay', 'Bonifico'],
    sports: ['Calcio', 'Tennis', 'Basket', 'Pallavolo'],
    liveStreaming: false,
    cashOut: true,
    mobileApp: true,
    description: 'Storico operatore italiano con forte presenza nel mercato nazionale.',
    pros: ['Marchio storico italiano', 'Buoni bonus', 'Assistenza in italiano'],
    cons: ['Meno mercati internazionali', 'No live streaming'],
    verified: true,
    popular: true
  },
  {
    id: 'betfair',
    name: 'Betfair',
    logo: '💱',
    rating: 4.7,
    url: 'https://www.betfair.it',
    country: 'Regno Unito',
    founded: 1999,
    license: 'AAMS/ADM',
    features: ['Exchange', 'Trading', 'Lay Betting'],
    bonusWelcome: 'Fino a €20',
    minDeposit: '€5',
    paymentMethods: ['Carta di Credito', 'PayPal', 'Skrill'],
    sports: ['Calcio', 'Tennis', 'Ippica', 'Cricket'],
    liveStreaming: true,
    cashOut: true,
    mobileApp: true,
    description: 'Pioniere del betting exchange con possibilità di fare trading sulle quote.',
    pros: ['Exchange unico', 'Quote migliori', 'Trading avanzato'],
    cons: ['Commissioni sull\'exchange', 'Interfaccia complessa per principianti'],
    verified: true,
    popular: false
  },
  {
    id: 'william-hill',
    name: 'William Hill',
    logo: '🏆',
    rating: 4.5,
    url: 'https://www.williamhill.it',
    country: 'Regno Unito',
    founded: 1934,
    license: 'AAMS/ADM',
    features: ['Radio Commentary', 'Enhanced Odds', 'Acca Insurance'],
    bonusWelcome: 'Fino a €100',
    minDeposit: '€10',
    paymentMethods: ['Carta di Credito', 'PayPal', 'Paysafecard'],
    sports: ['Calcio', 'Tennis', 'Golf', 'Snooker'],
    liveStreaming: true,
    cashOut: true,
    mobileApp: true,
    description: 'Bookmaker storico con oltre 80 anni di esperienza nel settore.',
    pros: ['Esperienza consolidata', 'Buone quote', 'Promozioni frequenti'],
    cons: ['Interfaccia datata', 'Meno innovativo'],
    verified: true,
    popular: false
  },
  {
    id: 'pinnacle',
    name: 'Pinnacle',
    logo: '📈',
    rating: 4.9,
    url: 'https://www.pinnacle.com',
    country: 'Curaçao',
    founded: 1998,
    license: 'Curaçao eGaming',
    features: ['Highest Limits', 'Best Odds', 'No Bet Limits'],
    bonusWelcome: 'Nessun bonus',
    minDeposit: '€20',
    paymentMethods: ['Carta di Credito', 'Bitcoin', 'Skrill'],
    sports: ['Calcio', 'Tennis', 'Basket', 'Esports'],
    liveStreaming: false,
    cashOut: false,
    mobileApp: true,
    description: 'Il bookmaker preferito dai professionisti per le quote più alte del mercato.',
    pros: ['Quote imbattibili', 'Limiti alti', 'Accetta vincitori'],
    cons: ['Nessun bonus', 'No cash out', 'No streaming'],
    verified: true,
    popular: false
  },
  {
    id: 'betsson',
    name: 'Betsson',
    logo: '⭐',
    rating: 4.4,
    url: 'https://www.betsson.com',
    country: 'Svezia',
    founded: 1963,
    license: 'Malta Gaming Authority',
    features: ['Live Casino', 'Poker', 'Bingo'],
    bonusWelcome: 'Fino a €50',
    minDeposit: '€10',
    paymentMethods: ['Carta di Credito', 'Trustly', 'Neteller'],
    sports: ['Calcio', 'Hockey', 'Tennis', 'Handball'],
    liveStreaming: true,
    cashOut: true,
    mobileApp: true,
    description: 'Operatore nordico con forte presenza nei mercati europei.',
    pros: ['Design moderno', 'Buone promozioni', 'Casinò integrato'],
    cons: ['Meno popolare in Italia', 'Assistenza limitata'],
    verified: true,
    popular: false
  }
];

const countries = ['Tutti', 'Italia', 'Regno Unito', 'Svezia', 'Curaçao'];
const sortOptions = ['Rating', 'Nome', 'Anno di fondazione', 'Popolarità'];

export default function BookmakersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Tutti');
  const [sortBy, setSortBy] = useState('Rating');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  // Filtra e ordina i bookmaker
  const filteredBookmakers = bookmakers
    .filter(bookmaker => {
      const matchesSearch = bookmaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bookmaker.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'Tutti' || bookmaker.country === selectedCountry;
      const matchesVerified = !showVerifiedOnly || bookmaker.verified;
      const matchesPopular = !showPopularOnly || bookmaker.popular;
      
      return matchesSearch && matchesCountry && matchesVerified && matchesPopular;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Rating':
          return b.rating - a.rating;
        case 'Nome':
          return a.name.localeCompare(b.name);
        case 'Anno di fondazione':
          return b.founded - a.founded;
        case 'Popolarità':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            Bookmaker Verificati
          </h1>
          <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
            Scopri i migliori bookmaker del mercato con recensioni dettagliate, 
            rating verificati e informazioni complete su bonus e caratteristiche.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-400">{bookmakers.length}</div>
              <div className="text-sm text-dark-400">Bookmaker Totali</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-success-400">{bookmakers.filter(b => b.verified).length}</div>
              <div className="text-sm text-dark-400">Verificati</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-warning-400">{bookmakers.filter(b => b.popular).length}</div>
              <div className="text-sm text-dark-400">Più Popolari</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent-400">4.6</div>
              <div className="text-sm text-dark-400">Rating Medio</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cerca bookmaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full py-2 px-4 bg-dark-700 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
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

            {/* Quick Filters */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  showVerifiedOnly 
                    ? 'bg-success-500/20 text-success-400 border border-success-500/30' 
                    : 'bg-dark-700 text-dark-400 border border-dark-600 hover:bg-dark-600'
                }`}
              >
                <CheckCircle className="h-4 w-4 inline mr-1" />
                Verificati
              </button>
              <button
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  showPopularOnly 
                    ? 'bg-warning-500/20 text-warning-400 border border-warning-500/30' 
                    : 'bg-dark-700 text-dark-400 border border-dark-600 hover:bg-dark-600'
                }`}
              >
                <Star className="h-4 w-4 inline mr-1" />
                Popolari
              </button>
            </div>
          </div>
          
          <div className="text-sm text-dark-400">
            Mostrando {filteredBookmakers.length} di {bookmakers.length} bookmaker
          </div>
        </div>

        {/* Bookmakers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmakers.map((bookmaker) => (
            <div
              key={bookmaker.id}
              className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition-all duration-200 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{bookmaker.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{bookmaker.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(bookmaker.rating)}
                      </div>
                      <span className="text-sm text-dark-400">({bookmaker.rating})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  {bookmaker.verified && (
                    <div className="flex items-center space-x-1 text-xs text-success-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verificato</span>
                    </div>
                  )}
                  {bookmaker.popular && (
                    <div className="bg-warning-500/20 text-warning-400 px-2 py-1 rounded text-xs font-medium">
                      POPOLARE
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Paese:</span>
                  <span className="text-white">{bookmaker.country}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Fondato:</span>
                  <span className="text-white">{bookmaker.founded}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Bonus:</span>
                  <span className="text-primary-400 font-medium">{bookmaker.bonusWelcome}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Deposito min:</span>
                  <span className="text-white">{bookmaker.minDeposit}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {bookmaker.liveStreaming && (
                    <span className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-xs">Live TV</span>
                  )}
                  {bookmaker.cashOut && (
                    <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs">Cash Out</span>
                  )}
                  {bookmaker.mobileApp && (
                    <span className="bg-success-500/20 text-success-400 px-2 py-1 rounded text-xs">App Mobile</span>
                  )}
                </div>
                <p className="text-sm text-dark-300">{bookmaker.description}</p>
              </div>

              {/* Action Button */}
              <a
                href={bookmaker.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-gradient text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Visita Sito</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBookmakers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-dark-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nessun bookmaker trovato
            </h3>
            <p className="text-dark-300 mb-6">
              Prova a modificare i filtri di ricerca
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('Tutti');
                setShowVerifiedOnly(false);
                setShowPopularOnly(false);
              }}
              className="bg-primary-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
            >
              Cancella Filtri
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-dark-800 border border-dark-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Come Scegliere il Bookmaker Giusto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sicurezza</h3>
              <p className="text-dark-300 text-sm">
                Verifica sempre che il bookmaker abbia licenze valide e sia regolamentato dalle autorità competenti.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-success-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-success-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quote</h3>
              <p className="text-dark-300 text-sm">
                Confronta le quote offerte sui tuoi sport preferiti per massimizzare i potenziali guadagni.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-warning-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-warning-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bonus</h3>
              <p className="text-dark-300 text-sm">
                Leggi sempre i termini e condizioni dei bonus per capire i requisiti di scommessa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 