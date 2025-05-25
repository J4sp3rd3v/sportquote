import { Match, Bookmaker } from '@/types';

// Mapping aggiornato dei bookmaker con URL corretti e nomi allineati ai dati mock
const BOOKMAKER_BASE_URLS: { [key: string]: string } = {
  // Top bookmaker italiani con URL corretti
  'Bet365': 'https://www.bet365.it',
  'William Hill': 'https://sports.williamhill.it',
  'Betfair': 'https://www.betfair.it',
  'Unibet': 'https://www.unibet.it',
  'Bwin': 'https://sports.bwin.it',
  'Sisal': 'https://www.sisal.it/scommesse-sportive',
  'Snai': 'https://www.snai.it',
  'Eurobet': 'https://www.eurobet.it',
  'Lottomatica': 'https://www.lottomatica.it/scommesse-sportive',
  'Betclic': 'https://www.betclic.it',
  'NetBet': 'https://www.netbet.it',
  'LeoVegas': 'https://www.leovegas.it/it/scommesse-sportive',
  'Pokerstars': 'https://www.pokerstars.it/sports',
  'Better': 'https://www.better.it',
  'Goldbet': 'https://www.goldbet.it',
  'Planetwin365': 'https://www.planetwin365.it',
  'Betaland': 'https://www.betaland.it',
  'Betway': 'https://betway.it',
  'Stanleybet': 'https://www.stanleybet.it',
  'Betflag': 'https://www.betflag.it',
  
  // Altri bookmaker internazionali
  'Admiral': 'https://www.admiralbet.it',
  'Bet-at-home': 'https://www.bet-at-home.it',
  'Betsson': 'https://www.betsson.it',
  'Betsafe': 'https://www.betsafe.it',
  'Nordicbet': 'https://www.nordicbet.it',
  'Interwetten': 'https://www.interwetten.it',
  'Tipico': 'https://www.tipico.it',
  'Bet3000': 'https://www.bet3000.it',
  'Mybet': 'https://www.mybet.it',
  'Sportingbet': 'https://www.sportingbet.it'
};

// Funzione migliorata per ottenere l'URL del bookmaker
export function getBookmakerUrl(bookmakerName: string): string {
  // Normalizza il nome del bookmaker (rimuovi spazi extra, converti in formato corretto)
  const normalizedName = bookmakerName.trim();
  
  // Cerca prima con il nome esatto
  let baseUrl = BOOKMAKER_BASE_URLS[normalizedName];
  
  // Se non trovato, prova con variazioni del nome
  if (!baseUrl) {
    // Prova senza spazi e case-insensitive
    const nameVariations = [
      normalizedName.toLowerCase(),
      normalizedName.replace(/\s+/g, ''),
      normalizedName.replace(/\s+/g, '').toLowerCase()
    ];
    
    for (const variation of nameVariations) {
      const foundKey = Object.keys(BOOKMAKER_BASE_URLS).find(key => 
        key.toLowerCase().replace(/\s+/g, '') === variation
      );
      if (foundKey) {
        baseUrl = BOOKMAKER_BASE_URLS[foundKey];
        break;
      }
    }
  }
  
  if (baseUrl) {
    // Aggiungi parametri UTM per tracking (solo se l'URL non li ha già)
    const separator = baseUrl.includes('?') ? '&' : '?';
    const utmParams = `utm_source=sitosport&utm_medium=referral&utm_campaign=quote_comparison`;
    
    // Controlla se l'URL ha già parametri UTM
    if (!baseUrl.includes('utm_source')) {
      return `${baseUrl}${separator}${utmParams}`;
    }
    return baseUrl;
  }
  
  // Fallback migliorato per bookmaker non configurati
  console.warn(`Bookmaker non configurato: ${normalizedName}`);
  return `https://www.google.com/search?q=${encodeURIComponent(`${normalizedName} scommesse sportive Italia`)}`;
}

// Funzione per aprire il bookmaker in iframe con gestione errori migliorata
export function openBookmakerInFrame(
  bookmakerName: string,
  onOpenFrame: (url: string, bookmakerName: string, matchInfo?: any) => void,
  matchInfo?: { homeTeam: string; awayTeam: string; sport: string }
): void {
  try {
    const url = getBookmakerUrl(bookmakerName);
    console.log(`Aprendo ${bookmakerName} in iframe:`, url);
    
    // Verifica che l'URL sia valido
    if (url.includes('google.com/search')) {
      console.warn(`URL di fallback per ${bookmakerName}, potrebbe non funzionare in iframe`);
    }
    
    onOpenFrame(url, bookmakerName, matchInfo);
  } catch (error) {
    console.error('Errore apertura iframe:', error);
    alert(`Errore nell'aprire ${bookmakerName}: ${error}`);
  }
}

// Funzione migliorata per aprire il bookmaker in nuova finestra
export function openBookmakerInNewTab(bookmakerName: string): void {
  try {
    const url = getBookmakerUrl(bookmakerName);
    console.log(`Aprendo ${bookmakerName} in nuova finestra:`, url);
    
    // Prova ad aprire in nuova finestra
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      // Popup bloccato, prova con location.href
      console.warn('Popup bloccato per', bookmakerName);
      
      // Salva i dati di navigazione prima del redirect
      try {
        sessionStorage.setItem('sitosport_navigation', JSON.stringify({
          bookmakerName: bookmakerName,
          originalUrl: window.location.href,
          timestamp: Date.now()
        }));
      } catch (storageError) {
        console.warn('Impossibile salvare dati di navigazione:', storageError);
      }
      
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
  isSupported: boolean;
  normalizedName: string;
}

// Funzione migliorata per ottenere informazioni sul bookmaker
export function getBookmakerInfo(bookmakerName: string): BookmakerInfo {
  const normalizedName = bookmakerName.trim();
  const hasDirectLink = normalizedName in BOOKMAKER_BASE_URLS;
  const baseUrl = getBookmakerUrl(normalizedName);
  const isSupported = !baseUrl.includes('google.com/search');
  
  return {
    hasDirectLink,
    baseUrl,
    isSupported,
    normalizedName
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

// Funzione per validare e correggere URL bookmaker
export function validateBookmakerUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.length > 0;
  } catch {
    return false;
  }
} 