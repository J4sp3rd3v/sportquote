import { Match, Bookmaker } from '@/types';

// Mapping dei bookmaker con i loro pattern URL per le partite
const BOOKMAKER_URL_PATTERNS = {
  'Bet365': {
    baseUrl: 'https://www.bet365.it',
    sportPaths: {
      calcio: '/sport/calcio',
      tennis: '/sport/tennis',
      basket: '/sport/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} vs ${awayTeam}`)}`
  },
  'William Hill': {
    baseUrl: 'https://www.williamhill.it',
    sportPaths: {
      calcio: '/scommesse/calcio',
      tennis: '/scommesse/tennis',
      basket: '/scommesse/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?q=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  },
  'Betfair': {
    baseUrl: 'https://www.betfair.it',
    sportPaths: {
      calcio: '/exchange/football',
      tennis: '/exchange/tennis',
      basket: '/exchange/basketball'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?query=${encodeURIComponent(`${homeTeam} v ${awayTeam}`)}`
  },
  'Unibet': {
    baseUrl: 'https://www.unibet.it',
    sportPaths: {
      calcio: '/scommesse/calcio',
      tennis: '/scommesse/tennis',
      basket: '/scommesse/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  },
  'Bwin': {
    baseUrl: 'https://www.bwin.it',
    sportPaths: {
      calcio: '/it/scommesse/calcio',
      tennis: '/it/scommesse/tennis',
      basket: '/it/scommesse/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} vs ${awayTeam}`)}`
  },
  'Sisal': {
    baseUrl: 'https://www.sisal.it',
    sportPaths: {
      calcio: '/scommesse-sportive/calcio',
      tennis: '/scommesse-sportive/tennis',
      basket: '/scommesse-sportive/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?cerca=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  },
  'Snai': {
    baseUrl: 'https://www.snai.it',
    sportPaths: {
      calcio: '/sport/calcio',
      tennis: '/sport/tennis',
      basket: '/sport/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  },
  'Eurobet': {
    baseUrl: 'https://www.eurobet.it',
    sportPaths: {
      calcio: '/it/scommesse/calcio',
      tennis: '/it/scommesse/tennis',
      basket: '/it/scommesse/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?q=${encodeURIComponent(`${homeTeam} vs ${awayTeam}`)}`
  },
  'Lottomatica': {
    baseUrl: 'https://www.lottomatica.it',
    sportPaths: {
      calcio: '/scommesse/calcio',
      tennis: '/scommesse/tennis',
      basket: '/scommesse/basket'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  },
  'Betclic': {
    baseUrl: 'https://www.betclic.it',
    sportPaths: {
      calcio: '/calcio-s1',
      tennis: '/tennis-s2',
      basket: '/basket-s3'
    },
    searchPattern: (homeTeam: string, awayTeam: string) => 
      `?search=${encodeURIComponent(`${homeTeam} ${awayTeam}`)}`
  }
};

// Funzione per generare URL diretto alla partita
export function generateMatchUrl(
  match: Match, 
  bookmakerName: string, 
  betType: 'home' | 'away' | 'draw' = 'home'
): string {
  const pattern = BOOKMAKER_URL_PATTERNS[bookmakerName as keyof typeof BOOKMAKER_URL_PATTERNS];
  
  if (!pattern) {
    // Fallback per bookmaker non configurati
    return generateFallbackUrl(bookmakerName);
  }

  const sportPath = pattern.sportPaths[match.sport as keyof typeof pattern.sportPaths] || '';
  const searchQuery = pattern.searchPattern(match.homeTeam, match.awayTeam);
  
  // Aggiungi parametri UTM per tracking
  const utmParams = `&utm_source=sitosport&utm_medium=referral&utm_campaign=quote_comparison&utm_content=${betType}`;
  
  return `${pattern.baseUrl}${sportPath}${searchQuery}${utmParams}`;
}

// URL di fallback per bookmaker non configurati
function generateFallbackUrl(bookmakerName: string): string {
  const fallbackUrls: { [key: string]: string } = {
    'NetBet': 'https://www.netbet.it',
    'LeoVegas': 'https://www.leovegas.it',
    'Pokerstars': 'https://www.pokerstars.it',
    'Better': 'https://www.better.it',
    'Goldbet': 'https://www.goldbet.it',
    'Planetwin365': 'https://www.planetwin365.it',
    'Betaland': 'https://www.betaland.it',
    'Betway': 'https://www.betway.it',
    'Stanleybet': 'https://www.stanleybet.it',
    'Betflag': 'https://www.betflag.it'
  };

  return fallbackUrls[bookmakerName] || `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive`)}`;
}

// Funzione per aprire il link con gestione errori (deprecata - usa openMatchInFrame)
export function openMatchUrl(
  match: Match, 
  bookmakerName: string, 
  betType: 'home' | 'away' | 'draw' = 'home'
): void {
  try {
    const url = generateMatchUrl(match, bookmakerName, betType);
    console.log(`Aprendo ${bookmakerName} per ${match.homeTeam} vs ${match.awayTeam} (${betType}):`, url);
    
    // Apri in nuova finestra
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      // Popup bloccato
      console.warn('Popup bloccato, provo con location.href');
      window.location.href = url;
    }
  } catch (error) {
    console.error('Errore apertura URL:', error);
    alert(`Errore nell'aprire ${bookmakerName}: ${error}`);
  }
}

// Nuova funzione per aprire in iframe
export function openMatchInFrame(
  match: Match, 
  bookmakerName: string, 
  betType: 'home' | 'away' | 'draw' = 'home',
  onOpenFrame: (url: string, bookmakerName: string, matchInfo: any) => void
): void {
  try {
    const url = generateMatchUrl(match, bookmakerName, betType);
    console.log(`Aprendo ${bookmakerName} in iframe per ${match.homeTeam} vs ${match.awayTeam} (${betType}):`, url);
    
    const matchInfo = {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      sport: match.sport
    };
    
    onOpenFrame(url, bookmakerName, matchInfo);
  } catch (error) {
    console.error('Errore apertura iframe:', error);
    alert(`Errore nell'aprire ${bookmakerName}: ${error}`);
  }
}

// Tipo per le informazioni del bookmaker
export interface BookmakerInfo {
  hasDirectLink: boolean;
  baseUrl: string;
  supportedSports: string[];
}

// Funzione per ottenere informazioni sul bookmaker
export function getBookmakerInfo(bookmakerName: string): BookmakerInfo {
  const hasDirectLink = bookmakerName in BOOKMAKER_URL_PATTERNS;
  const pattern = BOOKMAKER_URL_PATTERNS[bookmakerName as keyof typeof BOOKMAKER_URL_PATTERNS];
  
  return {
    hasDirectLink,
    baseUrl: pattern?.baseUrl || generateFallbackUrl(bookmakerName),
    supportedSports: pattern ? Object.keys(pattern.sportPaths) : []
  };
}

// Funzione per generare link di affiliazione (per future implementazioni)
export function generateAffiliateUrl(
  match: Match, 
  bookmakerName: string, 
  affiliateId?: string
): string {
  const baseUrl = generateMatchUrl(match, bookmakerName);
  
  if (affiliateId) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}affiliate=${affiliateId}`;
  }
  
  return baseUrl;
} 