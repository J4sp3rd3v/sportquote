// Sistema Ottimizzato di Gestione Bookmaker - 2025
// Sostituisce bookmakerLinks.ts con gestione verificata e pulita

export interface BookmakerConfig {
  id: string;
  name: string;
  displayName: string;
  baseUrl: string;
  country: string;
  license: string;
  verified: boolean;
  priority: number;
  category: 'premium' | 'standard' | 'international';
  features: string[];
}

export interface BookmakerStats {
  total: number;
  verified: number;
  premium: number;
  italian: number;
  international: number;
}

export class OptimizedBookmakerManager {
  private static instance: OptimizedBookmakerManager;
  
  // Bookmaker verificati e ottimizzati (Gennaio 2025)
  private readonly VERIFIED_BOOKMAKERS: BookmakerConfig[] = [
    // PREMIUM - Bookmaker top italiani
    {
      id: 'bet365',
      name: 'bet365',
      displayName: 'Bet365',
      baseUrl: 'https://www.bet365.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 1,
      category: 'premium',
      features: ['Live Streaming', 'Cash Out', 'Mobile App']
    },
    {
      id: 'sisal',
      name: 'sisal',
      displayName: 'Sisal',
      baseUrl: 'https://www.sisal.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 2,
      category: 'premium',
      features: ['Storico Italiano', 'SuperEnalotto', 'Mobile App']
    },
    {
      id: 'snai',
      name: 'snai',
      displayName: 'Snai',
      baseUrl: 'https://www.snai.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 3,
      category: 'premium',
      features: ['Marchio Storico', 'Casinò Live', 'Mobile App']
    },
    {
      id: 'eurobet',
      name: 'eurobet',
      displayName: 'Eurobet',
      baseUrl: 'https://www.eurobet.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 4,
      category: 'premium',
      features: ['Quote Competitive', 'Live Betting', 'Mobile App']
    },
    {
      id: 'lottomatica',
      name: 'lottomatica',
      displayName: 'Lottomatica',
      baseUrl: 'https://www.lottomatica.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 5,
      category: 'premium',
      features: ['Leader Italiano', 'Lotto', 'Mobile App']
    },

    // STANDARD - Bookmaker italiani verificati
    {
      id: 'betflag',
      name: 'betflag',
      displayName: 'Betflag',
      baseUrl: 'https://www.betflag.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 6,
      category: 'standard',
      features: ['Bonus Competitivi', 'Live Betting']
    },
    {
      id: 'goldbet',
      name: 'goldbet',
      displayName: 'Goldbet',
      baseUrl: 'https://www.goldbet.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 7,
      category: 'standard',
      features: ['Quote Interessanti', 'Promozioni']
    },
    {
      id: 'planetwin365',
      name: 'planetwin365',
      displayName: 'Planetwin365',
      baseUrl: 'https://www.planetwin365.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 8,
      category: 'standard',
      features: ['Ampia Gamma Sport', 'Live Streaming']
    },
    {
      id: 'admiral',
      name: 'admiral',
      displayName: 'Admiral',
      baseUrl: 'https://www.admiralbet.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 9,
      category: 'standard',
      features: ['Casinò Integrato', 'Bonus Benvenuto']
    },
    {
      id: 'better',
      name: 'better',
      displayName: 'Better',
      baseUrl: 'https://www.better.it',
      country: 'Italia',
      license: 'AAMS/ADM',
      verified: true,
      priority: 10,
      category: 'standard',
      features: ['Design Moderno', 'User Experience']
    },

    // INTERNATIONAL - Bookmaker internazionali con licenza italiana
    {
      id: 'william-hill',
      name: 'williamhill',
      displayName: 'William Hill',
      baseUrl: 'https://www.williamhill.it',
      country: 'Regno Unito',
      license: 'AAMS/ADM',
      verified: true,
      priority: 11,
      category: 'international',
      features: ['Esperienza Storica', 'Quote Competitive']
    },
    {
      id: 'betfair',
      name: 'betfair',
      displayName: 'Betfair',
      baseUrl: 'https://www.betfair.it',
      country: 'Regno Unito',
      license: 'AAMS/ADM',
      verified: true,
      priority: 12,
      category: 'international',
      features: ['Exchange', 'Trading', 'Live Streaming']
    },
    {
      id: 'unibet',
      name: 'unibet',
      displayName: 'Unibet',
      baseUrl: 'https://www.unibet.it',
      country: 'Malta',
      license: 'AAMS/ADM',
      verified: true,
      priority: 13,
      category: 'international',
      features: ['Ampia Offerta', 'Live Betting']
    },
    {
      id: 'bwin',
      name: 'bwin',
      displayName: 'Bwin',
      baseUrl: 'https://www.bwin.it',
      country: 'Austria',
      license: 'AAMS/ADM',
      verified: true,
      priority: 14,
      category: 'international',
      features: ['Brand Globale', 'Tecnologia Avanzata']
    },
    {
      id: 'betway',
      name: 'betway',
      displayName: 'Betway',
      baseUrl: 'https://www.betway.it',
      country: 'Malta',
      license: 'AAMS/ADM',
      verified: true,
      priority: 15,
      category: 'international',
      features: ['Sponsorizzazioni Sport', 'Mobile First']
    },
    {
      id: 'pinnacle',
      name: 'pinnacle',
      displayName: 'Pinnacle',
      baseUrl: 'https://www.pinnacle.com',
      country: 'Curaçao',
      license: 'Curaçao eGaming',
      verified: true,
      priority: 16,
      category: 'international',
      features: ['Quote Imbattibili', 'Limiti Alti', 'Pro Friendly']
    }
  ];

  // Mapping per normalizzazione nomi dall'API
  private readonly API_NAME_MAPPING: { [key: string]: string } = {
    // Mapping API key -> bookmaker ID
    'bet365': 'bet365',
    'sisal': 'sisal',
    'snai': 'snai',
    'eurobet': 'eurobet',
    'lottomatica': 'lottomatica',
    'betflag': 'betflag',
    'goldbet': 'goldbet',
    'planetwin365': 'planetwin365',
    'admiral': 'admiral',
    'admiralbet': 'admiral',
    'better': 'better',
    'williamhill': 'william-hill',
    'william hill': 'william-hill',
    'betfair': 'betfair',
    'unibet': 'unibet',
    'bwin': 'bwin',
    'betway': 'betway',
    'pinnacle': 'pinnacle',
    
    // Gestione prefissi "Bookmaker" dall'API
    'bookmaker bet365': 'bet365',
    'bookmaker sisal': 'sisal',
    'bookmaker snai': 'snai',
    'bookmaker eurobet': 'eurobet',
    'bookmaker lottomatica': 'lottomatica',
    'bookmaker betflag': 'betflag',
    'bookmaker goldbet': 'goldbet',
    'bookmaker planetwin365': 'planetwin365',
    'bookmaker admiral': 'admiral',
    'bookmaker better': 'better',
    'bookmaker williamhill': 'william-hill',
    'bookmaker william hill': 'william-hill',
    'bookmaker betfair': 'betfair',
    'bookmaker unibet': 'unibet',
    'bookmaker bwin': 'bwin',
    'bookmaker betway': 'betway',
    'bookmaker pinnacle': 'pinnacle'
  };

  constructor() {}

  static getInstance(): OptimizedBookmakerManager {
    if (!OptimizedBookmakerManager.instance) {
      OptimizedBookmakerManager.instance = new OptimizedBookmakerManager();
    }
    return OptimizedBookmakerManager.instance;
  }

  // Normalizza nome bookmaker dall'API
  normalizeBookmakerName(apiName: string): string {
    const cleanName = apiName.toLowerCase().trim();
    
    // Cerca mapping diretto
    if (this.API_NAME_MAPPING[cleanName]) {
      return this.API_NAME_MAPPING[cleanName];
    }
    
    // Rimuovi prefissi comuni e riprova
    const withoutPrefix = cleanName
      .replace(/^bookmaker\s+/i, '')
      .replace(/^the\s+/i, '')
      .trim();
    
    if (this.API_NAME_MAPPING[withoutPrefix]) {
      return this.API_NAME_MAPPING[withoutPrefix];
    }
    
    // Fallback: ritorna nome pulito
    return withoutPrefix.replace(/\s+/g, '-');
  }

  // Ottieni configurazione bookmaker
  getBookmakerConfig(bookmakerName: string): BookmakerConfig | null {
    const normalizedName = this.normalizeBookmakerName(bookmakerName);
    return this.VERIFIED_BOOKMAKERS.find(b => b.id === normalizedName) || null;
  }

  // Ottieni URL bookmaker
  getBookmakerUrl(bookmakerName: string): string {
    const config = this.getBookmakerConfig(bookmakerName);
    
    if (config) {
      return config.baseUrl;
    }
    
    // Fallback per bookmaker non configurati
    console.warn(`Bookmaker non configurato: ${bookmakerName}`);
    return `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive Italia`)}`;
  }

  // Verifica se bookmaker è supportato
  isBookmakerSupported(bookmakerName: string): boolean {
    return this.getBookmakerConfig(bookmakerName) !== null;
  }

  // Ottieni tutti i bookmaker per categoria
  getBookmakersByCategory(category?: 'premium' | 'standard' | 'international'): BookmakerConfig[] {
    if (!category) {
      return this.VERIFIED_BOOKMAKERS;
    }
    
    return this.VERIFIED_BOOKMAKERS.filter(b => b.category === category);
  }

  // Ottieni bookmaker premium (top 5)
  getPremiumBookmakers(): BookmakerConfig[] {
    return this.getBookmakersByCategory('premium');
  }

  // Ottieni bookmaker italiani
  getItalianBookmakers(): BookmakerConfig[] {
    return this.VERIFIED_BOOKMAKERS.filter(b => b.country === 'Italia');
  }

  // Ottieni statistiche bookmaker
  getBookmakerStats(): BookmakerStats {
    const total = this.VERIFIED_BOOKMAKERS.length;
    const verified = this.VERIFIED_BOOKMAKERS.filter(b => b.verified).length;
    const premium = this.getBookmakersByCategory('premium').length;
    const italian = this.getItalianBookmakers().length;
    const international = this.getBookmakersByCategory('international').length;
    
    return {
      total,
      verified,
      premium,
      italian,
      international
    };
  }

  // Apri bookmaker in modo sicuro
  openBookmaker(
    bookmakerName: string,
    matchInfo?: { homeTeam: string; awayTeam: string; sport: string }
  ): void {
    const config = this.getBookmakerConfig(bookmakerName);
    
    if (!config) {
      console.warn(`Bookmaker ${bookmakerName} non configurato`);
      return;
    }
    
    try {
      // Salva dati di navigazione
      const navigationData = {
        bookmaker: config.displayName,
        originalUrl: window.location.href,
        timestamp: Date.now(),
        matchInfo
      };
      
      try {
        sessionStorage.setItem('bookmakerNavigation', JSON.stringify(navigationData));
      } catch (error) {
        console.warn('Impossibile salvare dati navigazione:', error);
      }
      
      console.log(`🔗 Apertura ${config.displayName}: ${config.baseUrl}`);
      
      // Apertura sicura in nuova scheda
      window.open(config.baseUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Errore apertura bookmaker:', error);
      
      // Fallback
      const confirmed = confirm(
        `Si è verificato un errore nell'apertura di ${config.displayName}.\n\n` +
        `Vuoi comunque procedere?`
      );
      
      if (confirmed) {
        window.location.href = config.baseUrl;
      }
    }
  }

  // Ottieni informazioni dettagliate bookmaker
  getBookmakerInfo(bookmakerName: string) {
    const config = this.getBookmakerConfig(bookmakerName);
    
    if (!config) {
      return {
        isSupported: false,
        normalizedName: this.normalizeBookmakerName(bookmakerName),
        error: 'Bookmaker non configurato'
      };
    }
    
    return {
      isSupported: true,
      config,
      normalizedName: config.id,
      displayName: config.displayName,
      baseUrl: config.baseUrl,
      verified: config.verified,
      category: config.category,
      features: config.features,
      priority: config.priority
    };
  }

  // Valida URL bookmaker
  validateBookmakerUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' && urlObj.hostname.length > 0;
    } catch {
      return false;
    }
  }

  // Ottieni lista nomi supportati
  getSupportedBookmakerNames(): string[] {
    return this.VERIFIED_BOOKMAKERS.map(b => b.displayName);
  }

  // Cerca bookmaker per nome parziale
  searchBookmakers(query: string): BookmakerConfig[] {
    const lowerQuery = query.toLowerCase();
    
    return this.VERIFIED_BOOKMAKERS.filter(b =>
      b.displayName.toLowerCase().includes(lowerQuery) ||
      b.name.toLowerCase().includes(lowerQuery) ||
      b.id.toLowerCase().includes(lowerQuery)
    );
  }
}

// Istanza singleton
export const optimizedBookmakerManager = OptimizedBookmakerManager.getInstance(); 