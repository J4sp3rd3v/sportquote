// Servizio per integrare The Odds API
const ODDS_API_KEY = 'e8d4b5e534a34c76916de8016efa690d';
const BASE_URL = 'https://api.the-odds-api.com/v4';

export interface OddsApiSport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface OddsApiBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: {
    key: string;
    outcomes: {
      name: string;
      price: number;
    }[];
  }[];
}

export interface OddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}

// Mappatura sport API -> categorie app
const SPORT_MAPPING = {
  // Calcio
  'soccer_italy_serie_a': { sport: 'calcio', league: 'serie-a', name: 'Serie A' },
  'soccer_epl': { sport: 'calcio', league: 'premier-league', name: 'Premier League' },
  'soccer_spain_la_liga': { sport: 'calcio', league: 'la-liga', name: 'La Liga' },
  'soccer_germany_bundesliga': { sport: 'calcio', league: 'bundesliga', name: 'Bundesliga' },
  'soccer_france_ligue_one': { sport: 'calcio', league: 'ligue-1', name: 'Ligue 1' },
  'soccer_uefa_champs_league': { sport: 'calcio', league: 'champions-league', name: 'Champions League' },
  'soccer_uefa_europa_league': { sport: 'calcio', league: 'europa-league', name: 'Europa League' },
  
  // Tennis
  'tennis_atp_french_open': { sport: 'tennis', league: 'atp', name: 'ATP French Open' },
  'tennis_atp_wimbledon': { sport: 'tennis', league: 'atp', name: 'ATP Wimbledon' },
  'tennis_atp_us_open': { sport: 'tennis', league: 'atp', name: 'ATP US Open' },
  'tennis_atp_australian_open': { sport: 'tennis', league: 'atp', name: 'ATP Australian Open' },
  'tennis_wta_french_open': { sport: 'tennis', league: 'wta', name: 'WTA French Open' },
  'tennis_wta_wimbledon': { sport: 'tennis', league: 'wta', name: 'WTA Wimbledon' },
  
  // Basket
  'basketball_nba': { sport: 'basket', league: 'nba', name: 'NBA' },
  'basketball_euroleague': { sport: 'basket', league: 'euroleague', name: 'EuroLeague' },
  'basketball_italy_lega_a': { sport: 'basket', league: 'serie-a-basket', name: 'Serie A Basket' },
  
  // Altri sport
  'americanfootball_nfl': { sport: 'football-americano', league: 'nfl', name: 'NFL' },
  'icehockey_nhl': { sport: 'hockey', league: 'nhl', name: 'NHL' },
  'baseball_mlb': { sport: 'baseball', league: 'mlb', name: 'MLB' }
};

// Mappatura nomi bookmaker dall'API ai nostri nomi standardizzati
const BOOKMAKER_NAME_MAPPING: { [key: string]: string } = {
  // Mappatura key API -> nome standardizzato (aggiornata Gennaio 2025)
  'bet365': 'Bet365',
  'williamhill': 'William Hill',
  'betfair': 'Betfair',
  'unibet': 'Unibet',
  'bwin': 'Bwin',
  'sisal': 'Sisal',
  'snai': 'Snai',
  'eurobet': 'Eurobet',
  'lottomatica': 'Lottomatica',
  'betclic': 'Betclic',
  'netbet': 'NetBet',
  'leovegas': 'LeoVegas',
  'pokerstars': 'PokerStars',
  'better': 'Better',
  'goldbet': 'Goldbet',
  'planetwin365': 'Planetwin365',
  'betaland': 'Betaland',
  'betway': 'Betway',
  'stanleybet': 'Stanleybet',
  'betflag': 'Betflag',
  'admiral': 'Admiral',
  'admiralbet': 'Admiral',
  'betathome': 'Bet-at-home',
  'betsson': 'Betsson',
  'betsafe': 'Betsafe',
  'nordicbet': 'Nordicbet',
  'interwetten': 'Interwetten',
  'tipico': 'Tipico',
  'bet3000': 'Bet3000',
  'mybet': 'Mybet',
  'sportingbet': 'Sportingbet',
  'marathonbet': 'Marathonbet',
  'vincitu': 'Vincitu',
  'cplay': 'Cplay',
  'betfair_ex': 'Betfair Exchange',
  'bet90': 'Bet90',
  'bethard': 'Bethard',
  'betrebels': 'Betrebels',
  'bettilt': 'Bettilt',
  'betwinner': 'Betwinner',
  '1xbet': '1xBet',
  '22bet': '22Bet',
  'parimatch': 'Parimatch',
  'melbet': 'Melbet',
  'rabona': 'Rabona',
  'librabet': 'Librabet',
  'betano': 'Betano',
  'betfinal': 'Betfinal',
  'betmaster': 'Betmaster',
  'betpawa': 'Betpawa',
  'campobet': 'Campobet',
  'dafabet': 'Dafabet',
  'pinnacle': 'Pinnacle',
  'sbobet': 'Sbobet',
  'bet9ja': 'Bet9ja',
  'betika': 'Betika',
  'supabets': 'Supabets',
  'hollywoodbets': 'Hollywoodbets',
  'betlion': 'Betlion',
  'betin': 'Betin',
  'fortuna': 'Fortuna',
  'tipsport': 'Tipsport',
  'synottip': 'Synottip',
  'chance': 'Chance',
  'merkur': 'Merkur',
  'cashpoint': 'Cashpoint',
  'winamax': 'Winamax',
  'pmu': 'PMU',
  'zebet': 'ZEbet',
  'parionssport': 'ParionsSport',
  'rizk': 'Rizk',
  'mrgreen': 'Mr Green',
  'casumo': 'Casumo',
  'videoslots': 'Videoslots',
  'genesis': 'Genesis',
  'spinit': 'Spinit',
  'guts': 'Guts',
  'betspin': 'Betspin',
  'thrills': 'Thrills',
  'kaboo': 'Kaboo',
  'betit': 'Betit',
  'kindred': 'Kindred',
  'flutter': 'Flutter',
  'entain': 'Entain',
  'betfred': 'Betfred',
  'coral': 'Coral',
  'ladbrokes': 'Ladbrokes',
  'paddypower': 'Paddy Power',
  'skybet': 'Sky Bet',
  'boylesports': 'Boylesports',
  'betvictor': 'Betvictor',
  '888sport': '888sport',
  '10bet': '10Bet',
  '32red': '32Red',
  'redbet': 'Redbet',
  'betdaq': 'Betdaq',
  'matchbook': 'Matchbook',
  'smarkets': 'Smarkets',
  'betconnect': 'Betconnect',
  
  // Mappature aggiuntive per gestire prefissi "Bookmaker" (problema comune API)
  'bookmaker bet365': 'Bet365',
  'bookmaker williamhill': 'William Hill',
  'bookmaker william hill': 'William Hill',
  'bookmaker betfair': 'Betfair',
  'bookmaker unibet': 'Unibet',
  'bookmaker bwin': 'Bwin',
  'bookmaker sisal': 'Sisal',
  'bookmaker snai': 'Snai',
  'bookmaker eurobet': 'Eurobet',
  'bookmaker lottomatica': 'Lottomatica',
  'bookmaker betclic': 'Betclic',
  'bookmaker netbet': 'NetBet',
  'bookmaker leovegas': 'LeoVegas',
  'bookmaker betway': 'Betway',
  'bookmaker nordicbet': 'Nordicbet',
  'bookmaker marathonbet': 'Marathonbet',
  'bookmaker betano': 'Betano',
  'bookmaker pinnacle': 'Pinnacle',
  'bookmaker winamax': 'Winamax',
  'bookmaker coral': 'Coral',
  'bookmaker ladbrokes': 'Ladbrokes',
  'bookmaker 888sport': '888sport',
  'bookmaker betflag': 'Betflag',
  'bookmaker goldbet': 'Goldbet',
  'bookmaker admiral': 'Admiral',
  'bookmaker better': 'Better',
  'bookmaker planetwin365': 'Planetwin365',
  'bookmaker stanleybet': 'Stanleybet',
  'bookmaker vincitu': 'Vincitu',
  
  // Mappature per bookmaker con suffissi paese
  'parionssport_fr': 'Parions Sport Fr',
  'parions sport (fr)': 'Parions Sport Fr',
  'parions sport fr': 'Parions Sport Fr',
  'tipico_de': 'Tipico',
  'tipico de': 'Tipico',
  'winamax_fr': 'Winamax Fr',
  'winamax (fr)': 'Winamax Fr',
  'winamax fr': 'Winamax Fr',
  'winamax_de': 'Winamax De',
  'winamax (de)': 'Winamax De',
  'winamax de': 'Winamax De',
  'nordic bet': 'Nordicbet',
  'marathon bet': 'Marathonbet',
  
  // Variazioni comuni di nomi
  'william hill': 'William Hill',
  'bet 365': 'Bet365',
  'bet-365': 'Bet365',
  'net bet': 'NetBet',
  'net-bet': 'NetBet',
  'leo vegas': 'LeoVegas',
  'leo-vegas': 'LeoVegas',
  'planet win 365': 'Planetwin365',
  'planet-win-365': 'Planetwin365',
  'stanley bet': 'Stanleybet',
  'stanley-bet': 'Stanleybet',
  'bet flag': 'Betflag',
  'bet-flag': 'Betflag',
  'gold bet': 'Goldbet',
  'gold-bet': 'Goldbet',
  'bet at home': 'Bet-at-home',
  'bet-at-home': 'Bet-at-home',
  'paddy power': 'Paddy Power',
  'sky bet': 'Sky Bet',
  'bet victor': 'Betvictor',
  'bet-victor': 'Betvictor',
  '888 sport': '888sport',
  '888-sport': '888sport',
  '10 bet': '10Bet',
  '10-bet': '10Bet',
  '32 red': '32Red',
  '32-red': '32Red',
  'mr green': 'Mr Green',
  'mr-green': 'Mr Green',
  '1x bet': '1xBet',
  '1x-bet': '1xBet',
  '22 bet': '22Bet',
  '22-bet': '22Bet',
  
  // Nomi con caratteri speciali o encoding
  'bet365_it': 'Bet365',
  'sisal_it': 'Sisal',
  'snai_it': 'Snai',
  'eurobet_it': 'Eurobet',
  'lottomatica_it': 'Lottomatica',
  'betflag_it': 'Betflag',
  'goldbet_it': 'Goldbet',
  'admiral_it': 'Admiral',
  'better_it': 'Better',
  'planetwin365_it': 'Planetwin365',
  'stanleybet_it': 'Stanleybet',
  'vincitu_it': 'Vincitu',
  'betaland_it': 'Betaland'
};

// Mappatura nomi squadre per normalizzazione
const TEAM_NAME_MAPPING: { [key: string]: string } = {
  // Serie A
  'AC Milan': 'Milan',
  'Internazionale': 'Inter',
  'AS Roma': 'Roma',
  'SS Lazio': 'Lazio',
  'Juventus FC': 'Juventus',
  'SSC Napoli': 'Napoli',
  'Atalanta BC': 'Atalanta',
  'ACF Fiorentina': 'Fiorentina',
  
  // Premier League
  'Manchester City FC': 'Manchester City',
  'Arsenal FC': 'Arsenal',
  'Liverpool FC': 'Liverpool',
  'Chelsea FC': 'Chelsea',
  'Tottenham Hotspur': 'Tottenham',
  'Manchester United FC': 'Manchester United',
  'Newcastle United': 'Newcastle',
  'West Ham United': 'West Ham',
  
  // La Liga
  'Real Madrid CF': 'Real Madrid',
  'FC Barcelona': 'Barcelona',
  'Atletico Madrid': 'Atletico Madrid',
  'Athletic Club': 'Athletic Bilbao',
  'Real Sociedad': 'Real Sociedad',
  'Valencia CF': 'Valencia',
  'Real Betis': 'Betis',
  'Sevilla FC': 'Sevilla',
  
  // Bundesliga
  'FC Bayern Munich': 'Bayern Munich',
  'Borussia Dortmund': 'Borussia Dortmund',
  'RB Leipzig': 'RB Leipzig',
  'Bayer 04 Leverkusen': 'Bayer Leverkusen',
  'Eintracht Frankfurt': 'Eintracht Frankfurt',
  'SC Freiburg': 'Freiburg',
  'TSG Hoffenheim': 'Hoffenheim',
  
  // NBA
  'Los Angeles Lakers': 'Lakers',
  'Boston Celtics': 'Celtics',
  'Golden State Warriors': 'Warriors',
  'Miami Heat': 'Heat',
  'Milwaukee Bucks': 'Bucks',
  'Phoenix Suns': 'Suns',
  'Philadelphia 76ers': '76ers',
  'Brooklyn Nets': 'Nets',
  'Denver Nuggets': 'Nuggets',
  'Memphis Grizzlies': 'Grizzlies',
  'Dallas Mavericks': 'Mavericks',
  'New York Knicks': 'Knicks'
};

export class OddsApiService {
  private apiKey: string;
  private baseUrl: string = 'https://api.the-odds-api.com/v4';
  private requestCount: number = 0;
  private maxRequests: number = 500;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY || ODDS_API_KEY;
    if (!this.apiKey) {
      console.warn('ODDS_API_KEY non configurata');
    }
  }

  // Getter per il contatore delle richieste
  getRequestCount(): number {
    return this.requestCount;
  }

  // Getter per il limite massimo
  getMaxRequests(): number {
    return this.maxRequests;
  }

  // Getter per le richieste rimanenti
  getRemainingRequests(): number {
    return this.maxRequests - this.requestCount;
  }

  // Getter per la percentuale di utilizzo
  getUsagePercentage(): number {
    return Math.round((this.requestCount / this.maxRequests) * 100);
  }

  // Incrementa il contatore delle richieste
  private incrementRequestCount(): void {
    this.requestCount++;
    console.log(`API Requests: ${this.requestCount}/${this.maxRequests} (${this.getUsagePercentage()}%)`);
  }

  // Normalizza il nome della squadra
  private normalizeTeamName(teamName: string): string {
    return TEAM_NAME_MAPPING[teamName] || teamName;
  }

  // Normalizza il nome del bookmaker dall'API (migliorata)
  private normalizeBookmakerName(bookmakerKey: string, bookmakerTitle: string): string {
    // Pulisci e normalizza entrambi gli input
    const cleanKey = bookmakerKey.toLowerCase().trim();
    const cleanTitle = bookmakerTitle.toLowerCase().trim();
    
    // 1. Prima prova con la key (più affidabile)
    const normalizedFromKey = BOOKMAKER_NAME_MAPPING[cleanKey];
    if (normalizedFromKey) {
      return normalizedFromKey;
    }

    // 2. Poi prova con il title esatto
    const normalizedFromTitle = BOOKMAKER_NAME_MAPPING[cleanTitle];
    if (normalizedFromTitle) {
      return normalizedFromTitle;
    }

    // 3. Rimuovi prefissi comuni e pulisci il nome
    let cleanName = bookmakerTitle
      .replace(/^Bookmaker\s+/i, '') // Rimuove "Bookmaker " all'inizio
      .replace(/^The\s+/i, '') // Rimuove "The " all'inizio
      .replace(/\s+(IT|FR|UK|DE|ES|NL|PT|US|CA|AU)$/i, '') // Rimuove codici paese alla fine
      .replace(/[^\w\s-]/g, '') // Rimuove caratteri speciali tranne trattini
      .replace(/\s+/g, ' ') // Normalizza spazi multipli
      .trim();

    // 4. Prova con il nome pulito
    const cleanMapped = BOOKMAKER_NAME_MAPPING[cleanName.toLowerCase()];
    if (cleanMapped) {
      return cleanMapped;
    }

    // 5. Prova con variazioni del nome pulito
    const variations = [
      cleanName,
      cleanName.replace(/\s+/g, ''), // Senza spazi
      cleanName.replace(/\s+/g, '-'), // Con trattini
      cleanName.replace(/-/g, ' '), // Trattini -> spazi
      cleanName.replace(/-/g, ''), // Senza trattini
      cleanName.replace(/bet/i, 'Bet'), // Capitalizza "Bet"
      cleanName.replace(/win/i, 'Win'), // Capitalizza "Win"
      cleanName.replace(/sport/i, 'Sport'), // Capitalizza "Sport"
      cleanName.replace(/365/g, ' 365'), // Spazio prima di 365
      cleanName.replace(/365/g, '365'), // Senza spazio prima di 365
    ];

    // Aggiungi anche variazioni con prefisso "bookmaker"
    variations.push(`bookmaker ${cleanName}`);
    variations.push(`bookmaker ${cleanName.replace(/\s+/g, '')}`);

    for (const variation of variations) {
      const mapped = BOOKMAKER_NAME_MAPPING[variation.toLowerCase()];
      if (mapped) {
        return mapped;
      }
    }

    // 6. Prova ricerca fuzzy per nomi simili
    const bookmakerNames = Object.keys(BOOKMAKER_NAME_MAPPING);
    for (const mappedName of bookmakerNames) {
      // Controlla se il nome pulito è contenuto nel nome mappato o viceversa
      if (cleanName.length > 3 && mappedName.includes(cleanName.toLowerCase())) {
        return BOOKMAKER_NAME_MAPPING[mappedName];
      }
      if (mappedName.length > 3 && cleanName.toLowerCase().includes(mappedName)) {
        return BOOKMAKER_NAME_MAPPING[mappedName];
      }
    }

    // 7. Se ancora non trovato, capitalizza la prima lettera di ogni parola
    const capitalizedName = cleanName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Log per debug in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🔍 Bookmaker non mappato: "${bookmakerKey}" -> "${bookmakerTitle}" -> "${capitalizedName}"`);
    }

    // Altrimenti usa il nome capitalizzato
    return capitalizedName || bookmakerTitle;
  }

  // Ottieni tutti gli sport disponibili
  async getSports(): Promise<OddsApiSport[]> {
    try {
      this.incrementRequestCount();
      const response = await fetch(`${this.baseUrl}/sports/?apiKey=${this.apiKey}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Errore nel recupero degli sport:', error);
      return [];
    }
  }

  // Ottieni le quote per uno sport specifico
  async getOdds(
    sport: string = 'soccer_italy_serie_a',
    regions: string = 'eu',
    markets: string = 'h2h',
    oddsFormat: string = 'decimal'
  ): Promise<OddsApiEvent[]> {
    try {
      this.incrementRequestCount();
      const url = `${this.baseUrl}/sports/${sport}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Errore nel recupero delle quote:', error);
      return [];
    }
  }

  // Ottieni quote per sport multipli organizzati per categoria
  async getMultipleSportsOdds(): Promise<OddsApiEvent[]> {
    const sportsToFetch = [
      // Calcio - priorità alta
      'soccer_italy_serie_a',
      'soccer_epl',
      'soccer_spain_la_liga',
      'soccer_germany_bundesliga',
      'soccer_france_ligue_one',
      'soccer_uefa_champs_league',
      
      // Tennis
      'tennis_atp_french_open',
      'tennis_wta_french_open',
      
      // Basket
      'basketball_nba',
      'basketball_euroleague'
    ];

    const allEvents: OddsApiEvent[] = [];

    for (const sport of sportsToFetch) {
      try {
        console.log(`🔄 Recuperando dati per ${SPORT_MAPPING[sport as keyof typeof SPORT_MAPPING]?.name || sport}...`);
        
        const events = await this.getOdds(sport);
        
        if (events.length > 0) {
          allEvents.push(...events);
          console.log(`✅ ${events.length} eventi trovati per ${SPORT_MAPPING[sport as keyof typeof SPORT_MAPPING]?.name || sport}`);
        } else {
          console.log(`⚠️ Nessun evento trovato per ${SPORT_MAPPING[sport as keyof typeof SPORT_MAPPING]?.name || sport}`);
        }
        
        // Piccola pausa per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Errore per sport ${sport}:`, error);
      }
    }

    console.log(`📊 Totale eventi recuperati: ${allEvents.length}`);
    return allEvents;
  }

  // Converti i dati dell'API nel formato dell'app
  convertToAppFormat(apiEvents: OddsApiEvent[]) {
    return apiEvents.map(event => {
      // Ottieni informazioni sport/campionato
      const sportInfo = SPORT_MAPPING[event.sport_key as keyof typeof SPORT_MAPPING];
      
      if (!sportInfo) {
        console.warn(`Sport non mappato: ${event.sport_key}`);
      }

      // Normalizza i nomi delle squadre
      const homeTeam = this.normalizeTeamName(event.home_team);
      const awayTeam = this.normalizeTeamName(event.away_team);

      // Calcola le migliori quote per ogni esito
      const allHomeOdds: { odds: number; bookmaker: string }[] = [];
      const allAwayOdds: { odds: number; bookmaker: string }[] = [];
      const allDrawOdds: { odds: number; bookmaker: string }[] = [];

      const odds = event.bookmakers.map(bookmaker => {
        const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
        if (!h2hMarket) return null;

        const homeOutcome = h2hMarket.outcomes.find(o => 
          o.name === event.home_team || 
          this.normalizeTeamName(o.name) === homeTeam
        );
        const awayOutcome = h2hMarket.outcomes.find(o => 
          o.name === event.away_team || 
          this.normalizeTeamName(o.name) === awayTeam
        );
        const drawOutcome = h2hMarket.outcomes.find(o => 
          o.name === 'Draw' || o.name === 'Tie'
        );

        // Normalizza il nome del bookmaker
        const normalizedBookmakerName = this.normalizeBookmakerName(bookmaker.key, bookmaker.title);

        if (homeOutcome) {
          allHomeOdds.push({ odds: homeOutcome.price, bookmaker: normalizedBookmakerName });
        }
        if (awayOutcome) {
          allAwayOdds.push({ odds: awayOutcome.price, bookmaker: normalizedBookmakerName });
        }
        if (drawOutcome) {
          allDrawOdds.push({ odds: drawOutcome.price, bookmaker: normalizedBookmakerName });
        }

        return {
          home: homeOutcome?.price || 0,
          away: awayOutcome?.price || 0,
          draw: drawOutcome?.price,
          bookmaker: normalizedBookmakerName,
          lastUpdated: new Date(bookmaker.last_update)
        };
      }).filter(Boolean);

      return {
        id: event.id,
        homeTeam,
        awayTeam,
        league: sportInfo?.league || event.sport_key,
        sport: sportInfo?.sport || 'altro',
        date: new Date(event.commence_time),
        status: 'upcoming' as const,
        odds: odds.filter(o => o !== null),
        // Calcola le migliori quote
        bestOdds: {
          home: allHomeOdds.length > 0 
            ? allHomeOdds.reduce((best, current) => current.odds > best.odds ? current : best)
            : { odds: 0, bookmaker: 'N/A' },
          away: allAwayOdds.length > 0
            ? allAwayOdds.reduce((best, current) => current.odds > best.odds ? current : best)
            : { odds: 0, bookmaker: 'N/A' },
          draw: allDrawOdds.length > 0
            ? allDrawOdds.reduce((best, current) => current.odds > best.odds ? current : best)
            : undefined
        }
      };
    }).filter(match => {
      // Filtra partite con dati validi
      return match.homeTeam && match.awayTeam && match.odds.length > 0;
    });
  }

  // Verifica lo stato dell'API e i crediti rimanenti
  async checkApiStatus() {
    try {
      this.incrementRequestCount();
      const response = await fetch(`${this.baseUrl}/sports/?apiKey=${this.apiKey}`);
      
      return {
        status: response.ok ? 'active' : 'error',
        remainingRequests: response.headers.get('x-requests-remaining'),
        usedRequests: response.headers.get('x-requests-used'),
        rateLimit: response.headers.get('x-ratelimit-requests-remaining')
      };
    } catch (error) {
      console.error('Errore nel controllo stato API:', error);
      return {
        status: 'error',
        remainingRequests: null,
        usedRequests: null,
        rateLimit: null
      };
    }
  }

  // Ottieni statistiche per categoria sportiva
  getStatsByCategory(events: OddsApiEvent[]) {
    const stats = {
      calcio: { count: 0, leagues: new Set<string>() },
      tennis: { count: 0, leagues: new Set<string>() },
      basket: { count: 0, leagues: new Set<string>() },
      altro: { count: 0, leagues: new Set<string>() }
    };

    events.forEach(event => {
      const sportInfo = SPORT_MAPPING[event.sport_key as keyof typeof SPORT_MAPPING];
      const category = sportInfo?.sport || 'altro';
      const league = sportInfo?.league || event.sport_key;

      if (stats[category as keyof typeof stats]) {
        stats[category as keyof typeof stats].count++;
        stats[category as keyof typeof stats].leagues.add(league);
      }
    });

    return {
      calcio: { count: stats.calcio.count, leagues: Array.from(stats.calcio.leagues) },
      tennis: { count: stats.tennis.count, leagues: Array.from(stats.tennis.leagues) },
      basket: { count: stats.basket.count, leagues: Array.from(stats.basket.leagues) },
      altro: { count: stats.altro.count, leagues: Array.from(stats.altro.leagues) }
    };
  }
}

export const oddsApi = new OddsApiService(); 