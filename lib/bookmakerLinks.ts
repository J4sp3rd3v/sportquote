import { Match, Bookmaker } from '@/types';

// Mapping completo dei bookmaker con URL corretti e verificati (Dicembre 2024)
const BOOKMAKER_BASE_URLS: { [key: string]: string } = {
  // Top bookmaker italiani con licenza AAMS/ADM - URL verificati
  'Bet365': 'https://www.bet365.it',
  'Sisal': 'https://www.sisal.it',
  'Snai': 'https://www.snai.it',
  'Eurobet': 'https://www.eurobet.it',
  'Lottomatica': 'https://www.lottomatica.it',
  'William Hill': 'https://www.williamhill.it',
  'Betfair': 'https://www.betfair.it',
  'Unibet': 'https://www.unibet.it',
  'Bwin': 'https://www.bwin.it',
  'Betclic': 'https://www.betclic.it',
  
  // Bookmaker italiani verificati e funzionanti
  'Better': 'https://www.better.it',
  'Goldbet': 'https://www.goldbet.it',
  'Planetwin365': 'https://www.planetwin365.it',
  'Betflag': 'https://www.betflag.it',
  'Stanleybet': 'https://www.stanleybet.it',
  'Admiral': 'https://www.admiralbet.it',
  'Vincitu': 'https://www.vincitu.it',
  'Cplay': 'https://www.cplay.it',
  'Betaland': 'https://www.betaland.it',
  
  // Bookmaker internazionali con versione italiana
  'Pinnacle': 'https://www.pinnacle.com',
  'Betway': 'https://betway.it',
  'NetBet': 'https://www.netbet.it',
  'LeoVegas': 'https://www.leovegas.it',
  'Marathonbet': 'https://www.marathonbet.it',
  'Betano': 'https://www.betano.it',
  '888sport': 'https://www.888sport.it',
  'Pokerstars': 'https://www.pokerstars.it',
  '1xBet': 'https://1xbet.it',
  '22Bet': 'https://22bet.it',
  
  // Bookmaker UK con presenza italiana
  'Ladbrokes': 'https://www.ladbrokes.it',
  'Paddy Power': 'https://www.paddypower.it',
  'Betvictor': 'https://www.betvictor.it',
  'Coral': 'https://www.coral.it',
  'Betfred': 'https://www.betfred.it',
  
  // Bookmaker europei affidabili
  'Betsson': 'https://www.betsson.it',
  'Betsafe': 'https://www.betsafe.it',
  'Nordicbet': 'https://www.nordicbet.it',
  'Tipico': 'https://www.tipico.it',
  'Interwetten': 'https://www.interwetten.it',
  'Winamax': 'https://www.winamax.it',
  
  // Exchange e bookmaker specializzati
  'Betfair Exchange': 'https://www.betfair.it/exchange',
  'Smarkets': 'https://smarkets.com',
  'Betdaq': 'https://www.betdaq.com',
  'Matchbook': 'https://www.matchbook.com',
  
  // Bookmaker emergenti verificati
  '10Bet': 'https://www.10bet.it',
  'Parimatch': 'https://www.parimatch.it',
  'Librabet': 'https://www.librabet.com',
  'Rabona': 'https://www.rabona.com',
  'Campobet': 'https://www.campobet.com',
  '32Red': 'https://www.32red.com'
};

// Lista di bookmaker che potrebbero bloccare iframe
const IFRAME_BLOCKED_BOOKMAKERS = [
  'Bet365', 'Betfair', 'William Hill', 'Ladbrokes', 'Paddy Power',
  'Coral', 'Betfred', 'Pinnacle', 'Smarkets', 'Betdaq', 'Matchbook'
];

// Funzione per normalizzare il nome del bookmaker
function normalizeBookmakerName(name: string): string {
  return name.trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .toLowerCase();
}

// Funzione migliorata per ottenere l'URL del bookmaker
export function getBookmakerUrl(bookmakerName: string): string {
  const normalizedInput = normalizeBookmakerName(bookmakerName);
  
  // Cerca prima con il nome esatto
  let baseUrl = BOOKMAKER_BASE_URLS[bookmakerName.trim()];
  
  // Se non trovato, prova con variazioni del nome
  if (!baseUrl) {
    const foundKey = Object.keys(BOOKMAKER_BASE_URLS).find(key => 
      normalizeBookmakerName(key) === normalizedInput
    );
    if (foundKey) {
      baseUrl = BOOKMAKER_BASE_URLS[foundKey];
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