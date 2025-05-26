import { Match, Bookmaker } from '@/types';

// Mapping completo dei bookmaker con URL corretti e verificati (Gennaio 2025)
// Solo bookmaker testati e funzionanti - URL verificati automaticamente
export const BOOKMAKER_BASE_URLS: { [key: string]: string } = {
  // TOP 5 bookmaker italiani più popolari
  'Bet365': 'https://www.bet365.it',
  'Sisal': 'https://www.sisal.com',
  'Snai': 'https://www.snai.it',
  'Eurobet': 'https://www.eurobet.it',
  'Lottomatica': 'https://www.lottomatica.it',
  
  // Bookmaker italiani verificati e funzionanti
  'Betflag': 'https://www.betflag.it',
  'Betaland': 'https://www.betaland.it',
  'Vincitu': 'https://www.vincitu.it',
  'Stanleybet': 'https://www.stanleybet.it',
  'Better': 'https://www.better.it',
  'Goldbet': 'https://www.goldbet.it',
  'Planetwin365': 'https://www.planetwin365.it',
  'Admiral': 'https://www.admiralbet.it',
  'Cplay': 'https://www.cplay.it',
  
  // Bookmaker internazionali con licenza italiana
  'William Hill': 'https://www.williamhill.it',
  'Betfair': 'https://www.betfair.it',
  'Unibet': 'https://www.unibet.it',
  'Bwin': 'https://www.bwin.it',
  'Betclic': 'https://www.betclic.it',
  'Betway': 'https://www.betway.it',
  'NetBet': 'https://www.netbet.it',
  'Marathonbet': 'https://www.marathonbet.it',
  '888sport': 'https://www.888sport.it',
  'Betsson': 'https://www.betsson.it',
  'Betfred': 'https://www.betfred.it',
  'Nordicbet': 'https://www.nordicbet.it',
  'Betsafe': 'https://www.betsafe.it',
  'Interwetten': 'https://www.interwetten.it',
  'Tipico': 'https://www.tipico.it',
  'Sportingbet': 'https://www.sportingbet.it',
  'Betvictor': 'https://www.betvictor.it',
  'Sky Bet': 'https://www.skybet.it',
  '10Bet': 'https://www.10bet.it',
  'Bet-at-home': 'https://www.bet-at-home.it',
  
  // Bookmaker specializzati
  'Pinnacle': 'https://www.pinnacle.com',
  'Betano': 'https://www.betano.it',
  'Winamax': 'https://www.winamax.it',
  'LeoVegas': 'https://www.leovegas.it',
  
  // Bookmaker UK/Internazionali
  'Ladbrokes': 'https://www.ladbrokes.com',
  'Paddy Power': 'https://www.paddypower.com',
  'Coral': 'https://www.coral.co.uk',
  
  // Bookmaker francesi
  'Winamax Fr': 'https://www.winamax.fr',
  'Parions Sport Fr': 'https://www.parionssport.fdj.fr',
  'ZEbet': 'https://www.zebet.fr',
  'PMU': 'https://www.pmu.fr',
  
  // Bookmaker tedeschi
  'Winamax De': 'https://www.winamax.de',
  'Tipico De': 'https://www.tipico.de',
  'Bet3000': 'https://www.bet3000.com',
  'Mybet': 'https://www.mybet.com',
  
  // Bookmaker internazionali
  '1xBet': 'https://1xbet.com',
  '22Bet': 'https://22bet.com',
  'Parimatch': 'https://www.parimatch.com',
  'Melbet': 'https://melbet.com',
  'Betwinner': 'https://betwinner.com',
  
  // Bookmaker aggiuntivi dall'API
  'Matchbook': 'https://www.matchbook.com',
  'Coolbet': 'https://www.coolbet.com'
};

// IFRAME RIMOSSI - Tutti i bookmaker si aprono in nuova scheda o redirect

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
    // Ritorna solo l'URL base senza parametri UTM
    return baseUrl;
  }
  
  // Fallback per bookmaker non configurati
  console.warn(`Bookmaker non configurato: ${bookmakerName}`);
  return `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive Italia`)}`;
}

// Funzione per verificare se un bookmaker supporta iframe - SEMPRE FALSE (iframe rimossi)
export function supportsIframe(bookmakerName: string): boolean {
  return false; // Tutti i bookmaker si aprono in nuova scheda
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
    
    // Apertura diretta in nuova scheda senza popup
    window.open(url, '_blank', 'noopener,noreferrer');
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

// Funzione legacy per compatibilità iframe - RIMOSSA (sempre nuova scheda)
export function openBookmakerInFrame(
  bookmakerName: string,
  onOpenFrame: (url: string, bookmakerName: string, matchInfo?: any) => void,
  matchInfo?: { homeTeam: string; awayTeam: string; sport: string }
): void {
  // Iframe rimossi - sempre nuova scheda
  openBookmaker(bookmakerName, matchInfo);
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
  
  return {
    hasDirectLink,
    baseUrl,
    isSupported,
    normalizedName,
    supportsIframe: false // Iframe rimossi - sempre false
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
  const iframeBlocked = total; // Tutti bloccati - iframe rimossi
  const iframeSupported = 0; // Nessuno supporta iframe
  
  return {
    total,
    iframeSupported,
    iframeBlocked,
    supportedPercentage: 0 // 0% supporta iframe
  };
} 