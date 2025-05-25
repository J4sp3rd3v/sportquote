import { Match, Bookmaker } from '@/types';

// Mapping completo dei bookmaker con URL corretti e nomi allineati ai dati mock
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
  
  // Bookmaker italiani aggiuntivi
  'Admiral': 'https://www.admiralbet.it',
  'Bet-at-home': 'https://www.bet-at-home.it',
  'Betsson': 'https://www.betsson.it',
  'Betsafe': 'https://www.betsafe.it',
  'Nordicbet': 'https://www.nordicbet.it',
  'Interwetten': 'https://www.interwetten.it',
  'Tipico': 'https://www.tipico.it',
  'Bet3000': 'https://www.bet3000.it',
  'Mybet': 'https://www.mybet.it',
  'Sportingbet': 'https://www.sportingbet.it',
  'Marathonbet': 'https://www.marathonbet.it',
  'Vincitu': 'https://www.vincitu.it',
  'Cplay': 'https://www.cplay.it',
  'Betfair Exchange': 'https://www.betfair.it/exchange',
  'Bet90': 'https://www.bet90.it',
  'Betfair Sportsbook': 'https://www.betfair.it/sport',
  'Bethard': 'https://www.bethard.it',
  'Betrebels': 'https://www.betrebels.it',
  'Bettilt': 'https://www.bettilt.it',
  'Betwinner': 'https://www.betwinner.it',
  
  // Bookmaker internazionali
  '1xBet': 'https://1xbet.it',
  '22Bet': 'https://22bet.it',
  'Parimatch': 'https://www.parimatch.it',
  'Melbet': 'https://www.melbet.it',
  'Rabona': 'https://www.rabona.it',
  'Librabet': 'https://www.librabet.it',
  'Betano': 'https://www.betano.it',
  'Betfinal': 'https://www.betfinal.it',
  'Betmaster': 'https://www.betmaster.it',
  'Betpawa': 'https://www.betpawa.it',
  'Campobet': 'https://www.campobet.it',
  'Dafabet': 'https://www.dafabet.it',
  'Pinnacle': 'https://www.pinnacle.com/it',
  'Sbobet': 'https://www.sbobet.com',
  'Bet9ja': 'https://www.bet9ja.com',
  'Betika': 'https://www.betika.com',
  'Supabets': 'https://www.supabets.co.za',
  'Hollywoodbets': 'https://www.hollywoodbets.net',
  'Betlion': 'https://www.betlion.co.ke',
  'Betin': 'https://www.betin.co.ke',
  
  // Bookmaker europei
  'Fortuna': 'https://www.ifortuna.it',
  'Tipsport': 'https://www.tipsport.it',
  'Synottip': 'https://www.synottip.it',
  'Chance': 'https://www.chance.it',
  'Merkur': 'https://www.merkur-win.it',
  'Cashpoint': 'https://www.cashpoint.it',
  'Winamax': 'https://www.winamax.it',
  'PMU': 'https://www.pmu.it',
  'ZEbet': 'https://www.zebet.it',
  'ParionsSport': 'https://www.parionssport.it',
  
  // Bookmaker emergenti
  'Rizk': 'https://www.rizk.it',
  'Mr Green': 'https://www.mrgreen.it',
  'Casumo': 'https://www.casumo.it',
  'Videoslots': 'https://www.videoslots.it',
  'Genesis': 'https://www.genesis.it',
  'Spinit': 'https://www.spinit.it',
  'Guts': 'https://www.guts.it',
  'Betspin': 'https://www.betspin.it',
  'Thrills': 'https://www.thrills.it',
  'Kaboo': 'https://www.kaboo.it',
  'Betit': 'https://www.betit.it',
  
  // Grandi gruppi e brand
  'Betsson Group': 'https://www.betsson.it',
  'Kindred': 'https://www.unibet.it',
  'Flutter': 'https://www.paddypower.it',
  'Entain': 'https://www.ladbrokes.it',
  'Betfred': 'https://www.betfred.it',
  'Coral': 'https://www.coral.it',
  'Ladbrokes': 'https://www.ladbrokes.it',
  'Paddy Power': 'https://www.paddypower.it',
  'Sky Bet': 'https://www.skybet.it',
  'Boylesports': 'https://www.boylesports.it',
  'Betvictor': 'https://www.betvictor.it',
  '888sport': 'https://www.888sport.it',
  '10Bet': 'https://www.10bet.it',
  '32Red': 'https://www.32red.it',
  'Redbet': 'https://www.redbet.it',
  'Betdaq': 'https://www.betdaq.it',
  'Matchbook': 'https://www.matchbook.it',
  'Smarkets': 'https://www.smarkets.it',
  'Betconnect': 'https://www.betconnect.it'
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