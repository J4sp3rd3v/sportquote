import { Match, Bookmaker } from '@/types';

// Mapping semplificato dei bookmaker con solo i loro URL base
const BOOKMAKER_BASE_URLS: { [key: string]: string } = {
  'Bet365': 'https://www.bet365.it',
  'William Hill': 'https://www.williamhill.it',
  'Betfair': 'https://www.betfair.it',
  'Unibet': 'https://www.unibet.it',
  'Bwin': 'https://www.bwin.it',
  'Sisal': 'https://www.sisal.it',
  'Snai': 'https://www.snai.it',
  'Eurobet': 'https://www.eurobet.it',
  'Lottomatica': 'https://www.lottomatica.it',
  'Betclic': 'https://www.betclic.it',
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

// Funzione semplificata per ottenere l'URL base del bookmaker
export function getBookmakerUrl(bookmakerName: string): string {
  const baseUrl = BOOKMAKER_BASE_URLS[bookmakerName];
  
  if (baseUrl) {
    // Aggiungi parametri UTM per tracking
    const utmParams = `?utm_source=sitosport&utm_medium=referral&utm_campaign=quote_comparison`;
    return `${baseUrl}${utmParams}`;
  }
  
  // Fallback per bookmaker non configurati
  return `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive`)}`;
}

// Funzione per aprire il bookmaker in iframe
export function openBookmakerInFrame(
  bookmakerName: string,
  onOpenFrame: (url: string, bookmakerName: string, matchInfo?: any) => void,
  matchInfo?: { homeTeam: string; awayTeam: string; sport: string }
): void {
  try {
    const url = getBookmakerUrl(bookmakerName);
    console.log(`Aprendo ${bookmakerName} in iframe:`, url);
    
    onOpenFrame(url, bookmakerName, matchInfo);
  } catch (error) {
    console.error('Errore apertura iframe:', error);
    alert(`Errore nell'aprire ${bookmakerName}: ${error}`);
  }
}

// Funzione per aprire il bookmaker in nuova finestra
export function openBookmakerInNewTab(bookmakerName: string): void {
  try {
    const url = getBookmakerUrl(bookmakerName);
    console.log(`Aprendo ${bookmakerName} in nuova finestra:`, url);
    
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

// Tipo per le informazioni del bookmaker
export interface BookmakerInfo {
  hasDirectLink: boolean;
  baseUrl: string;
}

// Funzione per ottenere informazioni sul bookmaker
export function getBookmakerInfo(bookmakerName: string): BookmakerInfo {
  const hasDirectLink = bookmakerName in BOOKMAKER_BASE_URLS;
  const baseUrl = BOOKMAKER_BASE_URLS[bookmakerName] || `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive`)}`;
  
  return {
    hasDirectLink,
    baseUrl
  };
}

// Funzione per verificare se un bookmaker è supportato
export function isBookmakerSupported(bookmakerName: string): boolean {
  return bookmakerName in BOOKMAKER_BASE_URLS;
} 