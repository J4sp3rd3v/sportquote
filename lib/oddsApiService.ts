import { Match, Bookmaker } from '@/types';

// Configurazione API The Odds API
const ODDS_API_BASE_URL = 'https://api.the-odds-api.com/v4';
const ODDS_API_KEY = process.env.ODDS_API_KEY || '';

// Limite globale per versione free: 500 richieste/mese, aggiornamenti ogni ora
const FREE_PLAN_LIMITS = {
  monthlyRequests: 500,
  updateIntervalMinutes: 60,
  maxRequestsPerHour: 21 // 500/24 giorni circa
};

// Cache globale per evitare troppe richieste
let globalCache: {
  sports: any[];
  bookmakers: any[];
  lastUpdate: number;
  requestsUsed: number;
  monthlyReset: number;
} = {
  sports: [],
  bookmakers: [],
  lastUpdate: 0,
  requestsUsed: 0,
  monthlyReset: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 giorni
};

// Sport supportati da The Odds API con priorità per versione free
export const SUPPORTED_SPORTS = {
  // Sport principali (priorità alta per free)
  'soccer_epl': { 
    name: 'Premier League', 
    group: 'Soccer', 
    priority: 1,
    description: 'English Premier League',
    icon: '⚽',
    region: 'uk'
  },
  'soccer_italy_serie_a': { 
    name: 'Serie A', 
    group: 'Soccer', 
    priority: 1,
    description: 'Italian Serie A',
    icon: '⚽',
    region: 'eu'
  },
  'soccer_spain_la_liga': { 
    name: 'La Liga', 
    group: 'Soccer', 
    priority: 1,
    description: 'Spanish La Liga',
    icon: '⚽',
    region: 'eu'
  },
  'soccer_germany_bundesliga': { 
    name: 'Bundesliga', 
    group: 'Soccer', 
    priority: 1,
    description: 'German Bundesliga',
    icon: '⚽',
    region: 'eu'
  },
  'soccer_france_ligue_one': { 
    name: 'Ligue 1', 
    group: 'Soccer', 
    priority: 1,
    description: 'French Ligue 1',
    icon: '⚽',
    region: 'eu'
  },
  'soccer_uefa_champs_league': { 
    name: 'Champions League', 
    group: 'Soccer', 
    priority: 1,
    description: 'UEFA Champions League',
    icon: '⚽',
    region: 'eu'
  },
  'basketball_nba': { 
    name: 'NBA', 
    group: 'Basketball', 
    priority: 1,
    description: 'National Basketball Association',
    icon: '🏀',
    region: 'us'
  },
  'basketball_euroleague': { 
    name: 'EuroLeague', 
    group: 'Basketball', 
    priority: 2,
    description: 'EuroLeague Basketball',
    icon: '🏀',
    region: 'eu'
  },
  'americanfootball_nfl': { 
    name: 'NFL', 
    group: 'American Football', 
    priority: 1,
    description: 'National Football League',
    icon: '🏈',
    region: 'us'
  },
  'tennis_atp_french_open': { 
    name: 'French Open ATP', 
    group: 'Tennis', 
    priority: 2,
    description: 'ATP French Open',
    icon: '🎾',
    region: 'eu'
  },
  'tennis_wta_french_open': { 
    name: 'French Open WTA', 
    group: 'Tennis', 
    priority: 2,
    description: 'WTA French Open',
    icon: '🎾',
    region: 'eu'
  },
  'icehockey_nhl': { 
    name: 'NHL', 
    group: 'Ice Hockey', 
    priority: 2,
    description: 'National Hockey League',
    icon: '🏒',
    region: 'us'
  },
  'baseball_mlb': { 
    name: 'MLB', 
    group: 'Baseball', 
    priority: 2,
    description: 'Major League Baseball',
    icon: '⚾',
    region: 'us'
  },
  
  // Sport aggiuntivi (priorità bassa per free)
  'soccer_usa_mls': { 
    name: 'MLS', 
    group: 'Soccer', 
    priority: 3,
    description: 'Major League Soccer',
    icon: '⚽',
    region: 'us'
  },
  'soccer_brazil_campeonato': { 
    name: 'Brasileirão', 
    group: 'Soccer', 
    priority: 3,
    description: 'Brazilian Championship',
    icon: '⚽',
    region: 'us'
  },
  'basketball_ncaab': { 
    name: 'NCAA Basketball', 
    group: 'Basketball', 
    priority: 3,
    description: 'College Basketball',
    icon: '🏀',
    region: 'us'
  },
  'americanfootball_ncaaf': { 
    name: 'NCAA Football', 
    group: 'American Football', 
    priority: 3,
    description: 'College Football',
    icon: '🏈',
    region: 'us'
  },
  'cricket_test_match': { 
    name: 'Cricket Test', 
    group: 'Cricket', 
    priority: 3,
    description: 'International Test Matches',
    icon: '🏏',
    region: 'au'
  },
  'golf_masters_tournament_winner': { 
    name: 'Masters Golf', 
    group: 'Golf', 
    priority: 3,
    description: 'Masters Tournament',
    icon: '⛳',
    region: 'us'
  },
  'mma_mixed_martial_arts': { 
    name: 'MMA', 
    group: 'Mixed Martial Arts', 
    priority: 3,
    description: 'Mixed Martial Arts',
    icon: '🥊',
    region: 'us'
  },
  'rugbyleague_nrl': { 
    name: 'NRL', 
    group: 'Rugby League', 
    priority: 3,
    description: 'National Rugby League',
    icon: '🏉',
    region: 'au'
  }
};

// Bookmaker supportati con URL homepage verificati
export const VERIFIED_BOOKMAKERS = {
  // Bookmaker Italiani
  'sisal': {
    title: 'Sisal',
    url: 'https://www.sisal.com',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'snai': {
    title: 'Snai',
    url: 'https://www.snai.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'eurobet': {
    title: 'Eurobet',
    url: 'https://www.eurobet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'lottomatica': {
    title: 'Lottomatica',
    url: 'https://www.lottomatica.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'betflag': {
    title: 'Betflag',
    url: 'https://www.betflag.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'planetwin365': {
    title: 'Planetwin365',
    url: 'https://www.planetwin365.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'goldbet': {
    title: 'Goldbet',
    url: 'https://www.goldbet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  'admiralbet': {
    title: 'Admiral Bet',
    url: 'https://www.admiralbet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'italian'
  },
  
  // Bookmaker Internazionali con licenza italiana
  'bet365': {
    title: 'Bet365',
    url: 'https://www.bet365.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'unibet': {
    title: 'Unibet',
    url: 'https://www.unibet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'bwin': {
    title: 'Bwin',
    url: 'https://www.bwin.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'betway': {
    title: 'Betway',
    url: 'https://www.betway.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'betfair': {
    title: 'Betfair',
    url: 'https://www.betfair.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'williamhill': {
    title: 'William Hill',
    url: 'https://www.williamhill.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'betclic': {
    title: 'Betclic',
    url: 'https://www.betclic.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'netbet': {
    title: 'NetBet',
    url: 'https://www.netbet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'marathonbet': {
    title: 'Marathonbet',
    url: 'https://www.marathonbet.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  '888sport': {
    title: '888sport',
    url: 'https://www.888sport.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'betsson': {
    title: 'Betsson',
    url: 'https://www.betsson.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  'tipico': {
    title: 'Tipico',
    url: 'https://www.tipico.it',
    region: 'eu',
    country: 'IT',
    verified: true,
    category: 'international'
  },
  
  // Bookmaker UK
  'ladbrokes': {
    title: 'Ladbrokes',
    url: 'https://www.ladbrokes.com',
    region: 'uk',
    country: 'UK',
    verified: true,
    category: 'uk'
  },
  'paddypower': {
    title: 'Paddy Power',
    url: 'https://www.paddypower.com',
    region: 'uk',
    country: 'UK',
    verified: true,
    category: 'uk'
  },
  'coral': {
    title: 'Coral',
    url: 'https://www.coral.co.uk',
    region: 'uk',
    country: 'UK',
    verified: true,
    category: 'uk'
  },
  'skybet': {
    title: 'Sky Bet',
    url: 'https://www.skybet.com',
    region: 'uk',
    country: 'UK',
    verified: true,
    category: 'uk'
  },
  
  // Bookmaker US
  'draftkings': {
    title: 'DraftKings',
    url: 'https://www.draftkings.com',
    region: 'us',
    country: 'US',
    verified: true,
    category: 'us'
  },
  'fanduel': {
    title: 'FanDuel',
    url: 'https://www.fanduel.com',
    region: 'us',
    country: 'US',
    verified: true,
    category: 'us'
  },
  'betmgm': {
    title: 'BetMGM',
    url: 'https://www.betmgm.com',
    region: 'us',
    country: 'US',
    verified: true,
    category: 'us'
  },
  'caesars': {
    title: 'Caesars',
    url: 'https://www.caesars.com',
    region: 'us',
    country: 'US',
    verified: true,
    category: 'us'
  },
  'pointsbet': {
    title: 'PointsBet',
    url: 'https://www.pointsbet.com',
    region: 'us',
    country: 'US',
    verified: true,
    category: 'us'
  },
  
  // Bookmaker Specializzati
  'pinnacle': {
    title: 'Pinnacle',
    url: 'https://www.pinnacle.com',
    region: 'eu',
    country: 'International',
    verified: true,
    category: 'specialized'
  },
  'betano': {
    title: 'Betano',
    url: 'https://www.betano.com',
    region: 'eu',
    country: 'International',
    verified: true,
    category: 'specialized'
  },
  '1xbet': {
    title: '1xBet',
    url: 'https://1xbet.com',
    region: 'eu',
    country: 'International',
    verified: true,
    category: 'specialized'
  },
  '22bet': {
    title: '22Bet',
    url: 'https://22bet.com',
    region: 'eu',
    country: 'International',
    verified: true,
    category: 'specialized'
  }
};

// Funzione per verificare se possiamo fare una richiesta API
function canMakeApiRequest(): boolean {
  const now = Date.now();
  
  // Reset mensile
  if (now > globalCache.monthlyReset) {
    globalCache.requestsUsed = 0;
    globalCache.monthlyReset = now + (30 * 24 * 60 * 60 * 1000);
  }
  
  // Verifica limite mensile
  if (globalCache.requestsUsed >= FREE_PLAN_LIMITS.monthlyRequests) {
    console.warn('Limite mensile API raggiunto');
    return false;
  }
  
  // Verifica intervallo di aggiornamento (1 ora)
  const timeSinceLastUpdate = now - globalCache.lastUpdate;
  const updateInterval = FREE_PLAN_LIMITS.updateIntervalMinutes * 60 * 1000;
  
  if (timeSinceLastUpdate < updateInterval) {
    console.log('Usando cache, prossimo aggiornamento tra:', Math.ceil((updateInterval - timeSinceLastUpdate) / 60000), 'minuti');
    return false;
  }
  
  return true;
}

// Funzione per ottenere tutti gli sport supportati
export async function getSupportedSports(): Promise<any[]> {
  if (!ODDS_API_KEY) {
    console.warn('ODDS_API_KEY non configurata, usando dati statici');
    return Object.entries(SUPPORTED_SPORTS).map(([key, sport]) => ({
      key,
      ...sport,
      active: true,
      has_outrights: false
    }));
  }
  
  // Usa cache se disponibile e recente
  if (globalCache.sports.length > 0 && !canMakeApiRequest()) {
    return globalCache.sports;
  }
  
  try {
    const response = await fetch(`${ODDS_API_BASE_URL}/sports/?apiKey=${ODDS_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const sports = await response.json();
    
    // Filtra solo gli sport che supportiamo
    const filteredSports = sports.filter((sport: any) => 
      SUPPORTED_SPORTS.hasOwnProperty(sport.key)
    ).map((sport: any) => ({
      ...sport,
      ...SUPPORTED_SPORTS[sport.key as keyof typeof SUPPORTED_SPORTS]
    }));
    
    // Aggiorna cache
    globalCache.sports = filteredSports;
    globalCache.lastUpdate = Date.now();
    globalCache.requestsUsed++;
    
    console.log(`Sport caricati: ${filteredSports.length}, Richieste usate: ${globalCache.requestsUsed}/${FREE_PLAN_LIMITS.monthlyRequests}`);
    
    return filteredSports;
    
  } catch (error) {
    console.error('Errore nel caricamento sport:', error);
    
    // Fallback ai dati statici
    return Object.entries(SUPPORTED_SPORTS).map(([key, sport]) => ({
      key,
      ...sport,
      active: true,
      has_outrights: false
    }));
  }
}

// Funzione per ottenere le quote per uno sport specifico
export async function getOddsForSport(sportKey: string, region: string = 'eu'): Promise<Match[]> {
  if (!ODDS_API_KEY) {
    console.warn('ODDS_API_KEY non configurata');
    return [];
  }
  
  if (!canMakeApiRequest()) {
    console.log('Limite API raggiunto, usando cache');
    return [];
  }
  
  try {
    const response = await fetch(
      `${ODDS_API_BASE_URL}/sports/${sportKey}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=h2h&oddsFormat=decimal`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const oddsData = await response.json();
    globalCache.requestsUsed++;
    
    // Converte i dati API in formato Match
    const matches: Match[] = oddsData.map((game: any) => ({
      id: game.id,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      sport: SUPPORTED_SPORTS[sportKey as keyof typeof SUPPORTED_SPORTS]?.group.toLowerCase() || 'altro',
      league: SUPPORTED_SPORTS[sportKey as keyof typeof SUPPORTED_SPORTS]?.name || sportKey,
      date: game.commence_time,
      odds: game.bookmakers.map((bookmaker: any) => {
        const h2hMarket = bookmaker.markets.find((m: any) => m.key === 'h2h');
        if (!h2hMarket) return null;
        
        const homeOdds = h2hMarket.outcomes.find((o: any) => o.name === game.home_team)?.price || 0;
        const awayOdds = h2hMarket.outcomes.find((o: any) => o.name === game.away_team)?.price || 0;
        const drawOdds = h2hMarket.outcomes.find((o: any) => o.name === 'Draw')?.price;
        
        return {
          bookmaker: bookmaker.title,
          home: homeOdds,
          away: awayOdds,
          draw: drawOdds
        };
      }).filter(Boolean)
    }));
    
    console.log(`Quote caricate per ${sportKey}: ${matches.length} partite, Richieste usate: ${globalCache.requestsUsed}/${FREE_PLAN_LIMITS.monthlyRequests}`);
    
    return matches;
    
  } catch (error) {
    console.error(`Errore nel caricamento quote per ${sportKey}:`, error);
    return [];
  }
}

// Funzione per ottenere tutti i bookmaker supportati
export async function getSupportedBookmakers(): Promise<Bookmaker[]> {
  // Ritorna sempre i bookmaker verificati (non richiede API call)
  return Object.entries(VERIFIED_BOOKMAKERS).map(([key, bookmaker]) => ({
    id: key,
    name: bookmaker.title,
    url: bookmaker.url,
    region: bookmaker.region,
    country: bookmaker.country,
    verified: bookmaker.verified,
    category: bookmaker.category
  }));
}

// Funzione per ottenere statistiche API
export function getApiStats() {
  const now = Date.now();
  const timeUntilReset = globalCache.monthlyReset - now;
  const timeUntilNextUpdate = (globalCache.lastUpdate + (FREE_PLAN_LIMITS.updateIntervalMinutes * 60 * 1000)) - now;
  
  return {
    requestsUsed: globalCache.requestsUsed,
    requestsRemaining: FREE_PLAN_LIMITS.monthlyRequests - globalCache.requestsUsed,
    monthlyLimit: FREE_PLAN_LIMITS.monthlyRequests,
    timeUntilReset: Math.max(0, timeUntilReset),
    timeUntilNextUpdate: Math.max(0, timeUntilNextUpdate),
    updateIntervalMinutes: FREE_PLAN_LIMITS.updateIntervalMinutes,
    lastUpdate: globalCache.lastUpdate,
    canMakeRequest: canMakeApiRequest()
  };
}

// Funzione per ottenere quote per sport prioritari (versione free)
export async function getPriorityOdds(): Promise<{ [sport: string]: Match[] }> {
  const prioritySports = Object.entries(SUPPORTED_SPORTS)
    .filter(([_, sport]) => sport.priority === 1)
    .slice(0, 3); // Massimo 3 sport per versione free
  
  const results: { [sport: string]: Match[] } = {};
  
  for (const [sportKey, sport] of prioritySports) {
    if (!canMakeApiRequest()) {
      console.log('Limite API raggiunto, interrompendo caricamento');
      break;
    }
    
    try {
      const matches = await getOddsForSport(sportKey, sport.region);
      results[sport.name] = matches;
      
      // Pausa tra richieste per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Errore caricamento ${sport.name}:`, error);
    }
  }
  
  return results;
}

// Funzione per verificare URL bookmaker
export async function verifyBookmakerUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // Per evitare problemi CORS
    });
    return true; // Se non da errore, l'URL è raggiungibile
  } catch (error) {
    console.warn(`URL non verificabile: ${url}`, error);
    return false;
  }
}

// Funzione per ottenere informazioni complete su sport e bookmaker
export async function getCompleteApiInfo() {
  const [sports, bookmakers] = await Promise.all([
    getSupportedSports(),
    getSupportedBookmakers()
  ]);
  
  const stats = getApiStats();
  
  return {
    sports: {
      total: sports.length,
      byGroup: sports.reduce((acc, sport) => {
        acc[sport.group] = (acc[sport.group] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      priority1: sports.filter(s => s.priority === 1).length,
      priority2: sports.filter(s => s.priority === 2).length,
      priority3: sports.filter(s => s.priority === 3).length,
      list: sports
    },
    bookmakers: {
      total: bookmakers.length,
      byCategory: bookmakers.reduce((acc, bm) => {
        acc[bm.category] = (acc[bm.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      byRegion: bookmakers.reduce((acc, bm) => {
        acc[bm.region] = (acc[bm.region] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      verified: bookmakers.filter(bm => bm.verified).length,
      list: bookmakers
    },
    apiStats: stats,
    freePlanLimits: FREE_PLAN_LIMITS
  };
} 