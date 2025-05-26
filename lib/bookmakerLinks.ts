import { Match, Bookmaker } from '@/types';

// Mapping completo dei bookmaker con URL corretti e verificati (Dicembre 2024)
// Solo i migliori e più affidabili bookmaker con licenza italiana o europea
const BOOKMAKER_BASE_URLS: { [key: string]: string } = {
  // TOP 5 bookmaker italiani più affidabili - URL verificati
  'Bet365': 'https://www.bet365.it/scommesse-sportive',
  'Sisal': 'https://www.sisal.it/scommesse-sportive',
  'Snai': 'https://www.snai.it/scommesse-sportive',
  'Eurobet': 'https://www.eurobet.it/scommesse-sportive',
  'Lottomatica': 'https://www.lottomatica.it/scommesse-sportive',
  
  // Bookmaker internazionali top con licenza italiana
  'William Hill': 'https://www.williamhill.it/scommesse-sportive',
  'Betfair': 'https://www.betfair.it/sport',
  'Unibet': 'https://www.unibet.it/scommesse',
  'Bwin': 'https://sports.bwin.it/it/sports',
  'Betclic': 'https://www.betclic.it/scommesse-sportive',
  
  // Bookmaker specializzati con quote competitive
  'Pinnacle': 'https://www.pinnacle.com/it/soccer',
  'Betway': 'https://betway.it/sports',
  'NetBet': 'https://www.netbet.it/scommesse-sportive',
  'Marathonbet': 'https://www.marathonbet.it/it/betting',
  'Betano': 'https://www.betano.it/sport',
  'Winamax': 'https://www.winamax.it/scommesse-sportive',
  
  // Bookmaker italiani affidabili aggiuntivi
  'Better': 'https://www.better.it/scommesse',
  'Goldbet': 'https://www.goldbet.it/scommesse-sportive',
  'Planetwin365': 'https://www.planetwin365.it/scommesse',
  'Admiral': 'https://www.admiralbet.it/scommesse-sportive',
  'Stanleybet': 'https://www.stanleybet.it/it/sports',
  
  // Bookmaker UK premium
  'Ladbrokes': 'https://sports.ladbrokes.com/it/calcio',
  'Paddy Power': 'https://www.paddypower.it/scommesse',
  'Coral': 'https://sports.coral.co.uk/it/calcio',
  '888sport': 'https://www.888sport.it/scommesse',
  'LeoVegas': 'https://www.leovegas.it/it/sports',
  
  // Bookmaker aggiuntivi che potrebbero apparire nell'API
  'Nordicbet': 'https://www.nordicbet.it/scommesse',
  'Betsson': 'https://www.betsson.it/scommesse',
  'Betsafe': 'https://www.betsafe.it/scommesse',
  'Interwetten': 'https://www.interwetten.it/scommesse',
  'Tipico': 'https://www.tipico.it/scommesse',
  'Sportingbet': 'https://www.sportingbet.it/scommesse',
  'Betflag': 'https://www.betflag.it/scommesse',
  'Betaland': 'https://www.betaland.it/scommesse',
  'Vincitu': 'https://www.vincitu.it/scommesse',
  'Cplay': 'https://www.cplay.it/scommesse',
  'Betvictor': 'https://www.betvictor.it/scommesse',
  'Betfred': 'https://www.betfred.it/scommesse',
  'Sky Bet': 'https://www.skybet.it/scommesse',
  '10Bet': 'https://www.10bet.it/scommesse',
  'Bet-at-home': 'https://www.bet-at-home.it/scommesse',
  
  // Bookmaker internazionali con versioni italiane
  'Winamax Fr': 'https://www.winamax.fr/paris-sportifs',
  'Winamax De': 'https://www.winamax.de/sportwetten',
  'Parions Sport Fr': 'https://www.parionssport.fdj.fr/paris-sportifs'
};

// Lista di bookmaker che potrebbero bloccare iframe (aggiornata)
const IFRAME_BLOCKED_BOOKMAKERS = [
  'Bet365', 'Betfair', 'William Hill', 'Ladbrokes', 'Paddy Power',
  'Coral', 'Pinnacle', 'Bwin'
];

// Funzione per normalizzare il nome del bookmaker
function normalizeBookmakerName(name: string): string {
  return name.trim()
    .replace(/^Bookmaker\s+/i, '') // Rimuove "Bookmaker " all'inizio
    .replace(/^The\s+/i, '') // Rimuove "The " all'inizio
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .toLowerCase();
}

// Funzione migliorata per ottenere l'URL del bookmaker
export function getBookmakerUrl(bookmakerName: string): string {
  const cleanName = bookmakerName.trim();
  
  // 1. Cerca prima con il nome esatto
  let baseUrl = BOOKMAKER_BASE_URLS[cleanName];
  
  if (!baseUrl) {
    // 2. Rimuovi prefissi comuni e riprova
    const cleanedName = cleanName
      .replace(/^Bookmaker\s+/i, '')
      .replace(/^The\s+/i, '')
      .trim();
    
    baseUrl = BOOKMAKER_BASE_URLS[cleanedName];
  }
  
  if (!baseUrl) {
    // 3. Cerca con normalizzazione completa
    const normalizedInput = normalizeBookmakerName(cleanName);
    const foundKey = Object.keys(BOOKMAKER_BASE_URLS).find(key => 
      normalizeBookmakerName(key) === normalizedInput
    );
    if (foundKey) {
      baseUrl = BOOKMAKER_BASE_URLS[foundKey];
    }
  }
  
  if (!baseUrl) {
    // 4. Cerca con variazioni del nome
    const variations = [
      cleanName,
      cleanName.replace(/\s+/g, ''), // Senza spazi
      cleanName.replace(/bet/i, 'Bet'), // Capitalizza "Bet"
      cleanName.replace(/win/i, 'Win'), // Capitalizza "Win"
      cleanName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') // Capitalizza ogni parola
    ];
    
    for (const variation of variations) {
      if (BOOKMAKER_BASE_URLS[variation]) {
        baseUrl = BOOKMAKER_BASE_URLS[variation];
        break;
      }
    }
  }
  
  if (baseUrl) {
    // Aggiungi parametri UTM per tracking
    const separator = baseUrl.includes('?') ? '&' : '?';
    const utmParams = `utm_source=sitosport&utm_medium=referral&utm_campaign=quote_comparison`;
    
    if (!baseUrl.includes('utm_source')) {
      return `${baseUrl}${separator}${utmParams}`;
    }
    return baseUrl;
  }
  
  // Fallback per bookmaker non configurati
  console.warn(`Bookmaker non configurato: ${bookmakerName}`);
  return `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive Italia`)}`;
}

// Funzione per verificare se un bookmaker supporta iframe
export function supportsIframe(bookmakerName: string): boolean {
  return !IFRAME_BLOCKED_BOOKMAKERS.some(blocked => 
    normalizeBookmakerName(blocked) === normalizeBookmakerName(bookmakerName)
  );
}

// Funzione per aprire il bookmaker con strategia intelligente
export function openBookmaker(
  bookmakerName: string,
  matchInfo?: { homeTeam: string; awayTeam: string; sport: string; league?: string }
): void {
  try {
    const url = getBookmakerUrl(bookmakerName);
    
    // Salva i dati di navigazione
    const navigationData = {
      bookmakerName,
      originalUrl: window.location.href,
      timestamp: Date.now(),
      matchInfo
    };
    
    try {
      sessionStorage.setItem('navigationData', JSON.stringify(navigationData));
    } catch (storageError) {
      console.warn('Impossibile salvare dati di navigazione:', storageError);
    }
    
    console.log(`Aprendo ${bookmakerName}:`, url);
    
    // Strategia multi-livello per apertura
    // 1. Prova window.open
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // 2. Popup bloccato - mostra dialog di conferma
      const userConfirmed = confirm(
        `Il popup è stato bloccato dal browser.\n\n` +
        `Vuoi aprire ${bookmakerName} in questa scheda?\n\n` +
        `Potrai tornare a SitoSport usando il pulsante "Torna al Sito" che apparirà.`
      );
      
      if (userConfirmed) {
        // 3. Redirect con dati salvati
        window.location.href = url;
      }
    }
  } catch (error) {
    console.error('Errore apertura bookmaker:', error);
    
    // Fallback finale - redirect diretto
    const fallbackConfirmed = confirm(
      `Si è verificato un errore.\n\n` +
      `Vuoi comunque aprire ${bookmakerName}?`
    );
    
    if (fallbackConfirmed) {
      try {
        const url = getBookmakerUrl(bookmakerName);
        window.location.href = url;
      } catch (fallbackError) {
        alert(`Impossibile aprire ${bookmakerName}. Riprova più tardi.`);
      }
    }
  }
}

// Funzione legacy per compatibilità
export function openBookmakerInNewTab(bookmakerName: string): void {
  openBookmaker(bookmakerName);
}

// Funzione legacy per compatibilità iframe
export function openBookmakerInFrame(
  bookmakerName: string,
  onOpenFrame: (url: string, bookmakerName: string, matchInfo?: any) => void,
  matchInfo?: { homeTeam: string; awayTeam: string; sport: string }
): void {
  if (supportsIframe(bookmakerName)) {
    const url = getBookmakerUrl(bookmakerName);
    onOpenFrame(url, bookmakerName, matchInfo);
  } else {
    // Se non supporta iframe, apri in nuova scheda
    openBookmaker(bookmakerName, matchInfo);
  }
}

// Tipo per le informazioni del bookmaker
export interface BookmakerInfo {
  hasDirectLink: boolean;
  baseUrl: string;
  isSupported: boolean;
  normalizedName: string;
  supportsIframe: boolean;
}

// Funzione per ottenere informazioni complete sul bookmaker
export function getBookmakerInfo(bookmakerName: string): BookmakerInfo {
  const normalizedName = bookmakerName.trim();
  const hasDirectLink = normalizedName in BOOKMAKER_BASE_URLS;
  const baseUrl = getBookmakerUrl(normalizedName);
  const isSupported = !baseUrl.includes('google.com/search');
  const iframeSupport = supportsIframe(normalizedName);
  
  return {
    hasDirectLink,
    baseUrl,
    isSupported,
    normalizedName,
    supportsIframe: iframeSupport
  };
}

// Funzione per verificare se un bookmaker è supportato
export function isBookmakerSupported(bookmakerName: string): boolean {
  const info = getBookmakerInfo(bookmakerName);
  return info.isSupported;
}

// Funzione per ottenere tutti i bookmaker supportati
export function getSupportedBookmakers(): string[] {
  return Object.keys(BOOKMAKER_BASE_URLS);
}

// Funzione per validare un URL
export function validateBookmakerUrl(url: string): boolean {
  try {
    new URL(url);
    return !url.includes('google.com/search');
  } catch {
    return false;
  }
}

// Funzione per ottenere statistiche sui bookmaker
export function getBookmakerStats() {
  const total = Object.keys(BOOKMAKER_BASE_URLS).length;
  const iframeBlocked = IFRAME_BLOCKED_BOOKMAKERS.length;
  const iframeSupported = total - iframeBlocked;
  
  return {
    total,
    iframeSupported,
    iframeBlocked,
    supportedPercentage: Math.round((iframeSupported / total) * 100)
  };
} 