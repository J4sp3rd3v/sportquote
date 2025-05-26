// Script per testare la normalizzazione dei nomi dei bookmaker
const ODDS_API_KEY = 'e8d4b5e534a34c76916de8016efa690d';
const BASE_URL = 'https://api.the-odds-api.com/v4';

// Mappatura nomi bookmaker dall'API ai nostri nomi standardizzati (copia da oddsApi.ts)
const BOOKMAKER_NAME_MAPPING = {
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
  'betway': 'Betway',
  'nordicbet': 'Nordicbet',
  'marathonbet': 'Marathonbet',
  'betano': 'Betano',
  'pinnacle': 'Pinnacle',
  'winamax': 'Winamax',
  'coral': 'Coral',
  'ladbrokes': 'Ladbrokes',
  '888sport': '888sport',
  
  // Mappature aggiuntive per gestire prefissi "Bookmaker"
  'bookmaker bet365': 'Bet365',
  'bookmaker williamhill': 'William Hill',
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
  
  // Mappature per bookmaker con suffissi paese
  'parionssport_fr': 'Parions Sport Fr',
  'parions sport (fr)': 'Parions Sport Fr',
  'tipico_de': 'Tipico',
  'winamax_fr': 'Winamax Fr',
  'winamax (fr)': 'Winamax Fr',
  'winamax_de': 'Winamax De',
  'winamax (de)': 'Winamax De',
  'nordic bet': 'Nordicbet',
  'marathon bet': 'Marathonbet'
};

// URL base dei bookmaker (copia da bookmakerLinks.ts)
const BOOKMAKER_BASE_URLS = {
  'Bet365': 'https://www.bet365.it/scommesse-sportive',
  'Sisal': 'https://www.sisal.it/scommesse-sportive',
  'Snai': 'https://www.snai.it/scommesse-sportive',
  'Eurobet': 'https://www.eurobet.it/scommesse-sportive',
  'Lottomatica': 'https://www.lottomatica.it/scommesse-sportive',
  'William Hill': 'https://www.williamhill.it/scommesse-sportive',
  'Betfair': 'https://www.betfair.it/sport',
  'Unibet': 'https://www.unibet.it/scommesse',
  'Bwin': 'https://sports.bwin.it/it/sports',
  'Betclic': 'https://www.betclic.it/scommesse-sportive',
  'Pinnacle': 'https://www.pinnacle.com/it/soccer',
  'Betway': 'https://betway.it/sports',
  'NetBet': 'https://www.netbet.it/scommesse-sportive',
  'Marathonbet': 'https://www.marathonbet.it/it/betting',
  'Betano': 'https://www.betano.it/sport',
  'Winamax': 'https://www.winamax.it/scommesse-sportive',
  'Better': 'https://www.better.it/scommesse',
  'Goldbet': 'https://www.goldbet.it/scommesse-sportive',
  'Planetwin365': 'https://www.planetwin365.it/scommesse',
  'Admiral': 'https://www.admiralbet.it/scommesse-sportive',
  'Stanleybet': 'https://www.stanleybet.it/it/sports',
  'Ladbrokes': 'https://sports.ladbrokes.com/it/calcio',
  'Paddy Power': 'https://www.paddypower.it/scommesse',
  'Coral': 'https://sports.coral.co.uk/it/calcio',
  '888sport': 'https://www.888sport.it/scommesse',
  'LeoVegas': 'https://www.leovegas.it/it/sports',
  'Nordicbet': 'https://www.nordicbet.it/scommesse',
  'Betsson': 'https://www.betsson.it/scommesse',
  'Tipico': 'https://www.tipico.it/scommesse',
  'Winamax Fr': 'https://www.winamax.fr/paris-sportifs',
  'Winamax De': 'https://www.winamax.de/sportwetten',
  'Parions Sport Fr': 'https://www.parionssport.fdj.fr/paris-sportifs'
};

// Funzione di normalizzazione (copia da oddsApi.ts)
function normalizeBookmakerName(bookmakerKey, bookmakerTitle) {
  // Prima prova con la key (più affidabile)
  const normalizedFromKey = BOOKMAKER_NAME_MAPPING[bookmakerKey.toLowerCase()];
  if (normalizedFromKey) {
    return normalizedFromKey;
  }

  // Poi prova con il title
  const normalizedFromTitle = BOOKMAKER_NAME_MAPPING[bookmakerTitle.toLowerCase()];
  if (normalizedFromTitle) {
    return normalizedFromTitle;
  }

  // Rimuovi prefissi comuni e pulisci il nome
  let cleanName = bookmakerTitle
    .replace(/^Bookmaker\s+/i, '') // Rimuove "Bookmaker " all'inizio
    .replace(/^The\s+/i, '') // Rimuove "The " all'inizio
    .replace(/\s+(IT|FR|UK|DE|ES|NL|PT|US|CA|AU)$/i, '') // Rimuove codici paese alla fine
    .replace(/[^a-zA-Z0-9\s]/g, '') // Rimuove caratteri speciali
    .trim();

  // Se il nome pulito è nella mappatura, usalo
  const cleanMapped = BOOKMAKER_NAME_MAPPING[cleanName.toLowerCase()];
  if (cleanMapped) {
    return cleanMapped;
  }

  // Prova anche con variazioni del nome pulito
  const variations = [
    cleanName,
    cleanName.replace(/\s+/g, ''), // Senza spazi
    cleanName.toLowerCase(),
    cleanName.replace(/bet/i, 'Bet'), // Capitalizza "Bet"
    cleanName.replace(/win/i, 'Win'), // Capitalizza "Win"
  ];

  for (const variation of variations) {
    const mapped = BOOKMAKER_NAME_MAPPING[variation.toLowerCase()];
    if (mapped) {
      return mapped;
    }
  }

  // Se ancora non trovato, capitalizza la prima lettera di ogni parola
  const capitalizedName = cleanName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Altrimenti usa il nome capitalizzato
  return capitalizedName || bookmakerTitle;
}

// Funzione per verificare se il bookmaker ha un link
function hasBookmakerLink(bookmakerName) {
  return BOOKMAKER_BASE_URLS.hasOwnProperty(bookmakerName);
}

async function testBookmakerNormalization() {
  console.log('🧪 Test Normalizzazione Nomi Bookmaker\n');

  try {
    // Test con dati reali dall'API
    console.log('📡 Recupero dati reali dall\'API...');
    const response = await fetch(`${BASE_URL}/sports/soccer_germany_bundesliga/odds?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
    
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Trovati ${data.length} eventi\n`);

    if (data.length === 0) {
      console.log('⚠️ Nessun evento disponibile per il test\n');
      return;
    }

    // Raccogli tutti i bookmaker unici
    const bookmakerSet = new Set();
    const bookmakerDetails = [];

    data.forEach(event => {
      event.bookmakers?.forEach(bookmaker => {
        const key = bookmaker.key;
        const title = bookmaker.title;
        const normalizedName = normalizeBookmakerName(key, title);
        const hasLink = hasBookmakerLink(normalizedName);

        if (!bookmakerSet.has(key)) {
          bookmakerSet.add(key);
          bookmakerDetails.push({
            key,
            title,
            normalizedName,
            hasLink
          });
        }
      });
    });

    console.log('📊 RISULTATI NORMALIZZAZIONE:\n');
    console.log('Key API → Title API → Nome Normalizzato → Link Disponibile');
    console.log('─'.repeat(80));

    let totalBookmakers = 0;
    let bookmarkersWithLinks = 0;
    let problematicBookmakers = [];

    bookmakerDetails.forEach(bm => {
      totalBookmakers++;
      const status = bm.hasLink ? '✅' : '❌';
      const linkStatus = bm.hasLink ? 'SÌ' : 'NO';
      
      console.log(`${bm.key} → ${bm.title} → ${bm.normalizedName} → ${linkStatus} ${status}`);
      
      if (bm.hasLink) {
        bookmarkersWithLinks++;
      } else {
        problematicBookmakers.push(bm);
      }

      // Verifica se il nome contiene ancora "Bookmaker"
      if (bm.normalizedName.toLowerCase().includes('bookmaker')) {
        console.log(`  ⚠️ ATTENZIONE: Nome contiene ancora "Bookmaker": ${bm.normalizedName}`);
      }
    });

    console.log('\n📈 STATISTICHE:');
    console.log(`• Bookmaker totali trovati: ${totalBookmakers}`);
    console.log(`• Bookmaker con link: ${bookmarkersWithLinks}`);
    console.log(`• Bookmaker senza link: ${totalBookmakers - bookmarkersWithLinks}`);
    console.log(`• Percentuale copertura: ${Math.round((bookmarkersWithLinks / totalBookmakers) * 100)}%`);

    if (problematicBookmakers.length > 0) {
      console.log('\n❌ BOOKMAKER SENZA LINK:');
      problematicBookmakers.forEach(bm => {
        console.log(`  • ${bm.normalizedName} (${bm.key} → ${bm.title})`);
      });
      
      console.log('\n💡 SUGGERIMENTI:');
      console.log('1. Aggiungi questi bookmaker a BOOKMAKER_BASE_URLS in bookmakerLinks.ts');
      console.log('2. Verifica che la normalizzazione sia corretta');
      console.log('3. Controlla se sono bookmaker validi per il mercato italiano');
    }

    // Test casi specifici
    console.log('\n🧪 TEST CASI SPECIFICI:');
    const testCases = [
      { key: 'nordicbet', title: 'Bookmaker Nordicbet' },
      { key: 'bet365', title: 'Bet365' },
      { key: 'williamhill', title: 'Bookmaker William Hill' },
      { key: 'betfair', title: 'Betfair' },
      { key: 'unknown', title: 'Bookmaker Unknown Site' }
    ];

    testCases.forEach(testCase => {
      const normalized = normalizeBookmakerName(testCase.key, testCase.title);
      const hasLink = hasBookmakerLink(normalized);
      const status = hasLink ? '✅' : '❌';
      console.log(`  ${testCase.title} → ${normalized} ${status}`);
    });

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }
}

// Esegui il test
testBookmakerNormalization(); 