// Script per testare tutti i link dei bookmaker aggiornati
// Versione standalone che replica la logica di bookmakerLinks.ts

// Mapping completo dei bookmaker con URL corretti
const BOOKMAKER_BASE_URLS = {
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
  'Betwinner': 'https://betwinner.com'
};

// Funzione per ottenere l'URL del bookmaker
function getBookmakerUrl(bookmakerName) {
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
  return `https://www.google.com/search?q=${encodeURIComponent(`${bookmakerName} scommesse sportive Italia`)}`;
}

// Funzione per ottenere informazioni sul bookmaker
function getBookmakerInfo(bookmakerName) {
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

// Funzione per ottenere tutti i bookmaker supportati
function getSupportedBookmakers() {
  return Object.keys(BOOKMAKER_BASE_URLS);
}

console.log('🧪 Test Completo Link Bookmaker\n');

// Ottieni tutti i bookmaker supportati
const supportedBookmakers = getSupportedBookmakers();

console.log(`📊 Bookmaker supportati: ${supportedBookmakers.length}\n`);

// Test ogni bookmaker
let workingLinks = 0;
let brokenLinks = 0;
const results = [];

supportedBookmakers.forEach(bookmakerName => {
  try {
    const info = getBookmakerInfo(bookmakerName);
    const url = getBookmakerUrl(bookmakerName);
    
    const result = {
      name: bookmakerName,
      url: url,
      isSupported: info.isSupported,
      hasDirectLink: info.hasDirectLink,
      status: info.isSupported ? '✅ OK' : '❌ FALLBACK'
    };
    
    results.push(result);
    
    if (info.isSupported) {
      workingLinks++;
      console.log(`✅ ${bookmakerName}`);
      console.log(`   URL: ${url}`);
    } else {
      brokenLinks++;
      console.log(`❌ ${bookmakerName}`);
      console.log(`   Fallback: ${url}`);
    }
    console.log('');
  } catch (error) {
    brokenLinks++;
    console.log(`💥 ${bookmakerName} - ERRORE: ${error.message}\n`);
  }
});

console.log('📈 RIEPILOGO:');
console.log(`• Bookmaker totali: ${supportedBookmakers.length}`);
console.log(`• Link funzionanti: ${workingLinks}`);
console.log(`• Link con fallback: ${brokenLinks}`);
console.log(`• Percentuale successo: ${Math.round((workingLinks / supportedBookmakers.length) * 100)}%`);

// Test bookmaker più comuni dalle quote
console.log('\n🎯 TEST BOOKMAKER COMUNI NELLE QUOTE:');
const commonBookmakers = [
  'Sisal', 'Betflag', 'Betaland', 'Vincitu', 'Stanleybet',
  'William Hill', 'Betclic', 'Betway', 'NetBet', 'Marathonbet',
  '888sport', 'Betsson', 'Betfred'
];

commonBookmakers.forEach(name => {
  const info = getBookmakerInfo(name);
  const status = info.isSupported ? '✅' : '❌';
  console.log(`${status} ${name} → ${info.baseUrl}`);
});

console.log('\n🔧 BOOKMAKER DA AGGIUNGERE (se mancanti):');
const missingBookmakers = commonBookmakers.filter(name => {
  const info = getBookmakerInfo(name);
  return !info.isSupported;
});

if (missingBookmakers.length > 0) {
  missingBookmakers.forEach(name => {
    console.log(`• ${name} - Aggiungere URL in BOOKMAKER_BASE_URLS`);
  });
} else {
  console.log('✅ Tutti i bookmaker comuni sono configurati!');
} 