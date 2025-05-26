// Script per trovare gli URL corretti dei bookmaker principali
const https = require('https');
const { URL } = require('url');

// Lista dei bookmaker principali con possibili URL alternativi
const BOOKMAKER_ALTERNATIVES = {
  'Bet365': [
    'https://www.bet365.com',
    'https://mobile.bet365.com',
    'https://www.bet365.it',
    'https://bet365.it'
  ],
  'Sisal': [
    'https://www.sisal.it',
    'https://sisal.it',
    'https://www.sisal.com'
  ],
  'Eurobet': [
    'https://www.eurobet.it',
    'https://eurobet.it',
    'https://www.eurobet.com'
  ],
  'Lottomatica': [
    'https://www.lottomatica.it',
    'https://lottomatica.it',
    'https://www.better.it'
  ],
  'Betfair': [
    'https://www.betfair.com',
    'https://www.betfair.it',
    'https://betfair.it'
  ],
  'Unibet': [
    'https://www.unibet.it',
    'https://www.unibet.com',
    'https://unibet.it'
  ],
  'Bwin': [
    'https://www.bwin.it',
    'https://www.bwin.com',
    'https://sports.bwin.com'
  ],
  'Pinnacle': [
    'https://www.pinnacle.com',
    'https://pinnacle.com'
  ],
  'Betano': [
    'https://www.betano.it',
    'https://betano.it',
    'https://www.betano.com'
  ],
  'Winamax': [
    'https://www.winamax.fr',
    'https://www.winamax.it',
    'https://winamax.fr'
  ],
  'Better': [
    'https://www.better.it',
    'https://better.it',
    'https://www.lottomatica.it'
  ],
  'Goldbet': [
    'https://www.goldbet.it',
    'https://goldbet.it',
    'https://www.goldbet.com'
  ],
  'Admiral': [
    'https://www.admiralbet.it',
    'https://admiralbet.it',
    'https://www.admiral.it'
  ],
  'LeoVegas': [
    'https://www.leovegas.com',
    'https://www.leovegas.it',
    'https://leovegas.com'
  ]
};

// Funzione per testare un URL
function testUrl(url, timeout = 8000) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      
      const req = https.request({
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8'
        }
      }, (res) => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          redirected: res.statusCode >= 300 && res.statusCode < 400,
          location: res.headers.location,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          status: 'ERROR',
          error: error.message,
          success: false
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 'TIMEOUT',
          error: 'Request timeout',
          success: false
        });
      });

      req.end();
    } catch (error) {
      resolve({
        url,
        status: 'INVALID',
        error: error.message,
        success: false
      });
    }
  });
}

// Funzione per seguire i redirect
async function getFinalUrl(url, maxRedirects = 3) {
  let currentUrl = url;
  let redirectCount = 0;
  let lastResult = null;
  
  while (redirectCount < maxRedirects) {
    const result = await testUrl(currentUrl);
    lastResult = result;
    
    if (!result.success) {
      return result;
    }
    
    if (result.redirected && result.location) {
      currentUrl = result.location.startsWith('http') ? result.location : new URL(result.location, currentUrl).href;
      redirectCount++;
    } else {
      return { ...result, finalUrl: currentUrl, redirectCount };
    }
  }
  
  return { ...lastResult, finalUrl: currentUrl, redirectCount, status: 'TOO_MANY_REDIRECTS' };
}

// Funzione principale
async function findCorrectUrls() {
  console.log('🔍 Ricerca URL Corretti per Bookmaker Principali\n');

  const workingBookmakers = [];
  const failedBookmakers = [];

  for (const [bookmakerName, urls] of Object.entries(BOOKMAKER_ALTERNATIVES)) {
    console.log(`\n🎯 Testando ${bookmakerName}:`);
    
    let foundWorking = false;
    
    for (const url of urls) {
      process.stdout.write(`  🔄 ${url}... `);
      
      const result = await getFinalUrl(url);
      
      if (result.success) {
        console.log(`✅ OK (${result.status})`);
        if (result.finalUrl !== url) {
          console.log(`    → Redirect a: ${result.finalUrl}`);
        }
        
        if (!foundWorking) {
          workingBookmakers.push({
            name: bookmakerName,
            url: result.finalUrl || url,
            originalUrl: url,
            status: result.status,
            redirectCount: result.redirectCount || 0
          });
          foundWorking = true;
        }
      } else {
        console.log(`❌ ${result.status} ${result.error || ''}`);
      }
      
      // Pausa per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (!foundWorking) {
      failedBookmakers.push(bookmakerName);
      console.log(`  ❌ Nessun URL funzionante trovato per ${bookmakerName}`);
    }
  }

  // Aggiungi i bookmaker che già funzionano dal test precedente
  const alreadyWorking = [
    { name: 'Snai', url: 'https://www.snai.it' },
    { name: 'William Hill', url: 'https://www.williamhill.it' },
    { name: 'Betclic', url: 'https://www.betclic.it' },
    { name: 'Betway', url: 'https://www.betway.it' },
    { name: 'NetBet', url: 'https://www.netbet.it' },
    { name: 'Marathonbet', url: 'https://www.marathonbet.it' },
    { name: 'Stanleybet', url: 'https://www.stanleybet.it' },
    { name: '888sport', url: 'https://www.888sport.it' },
    { name: 'Betsson', url: 'https://www.betsson.it' },
    { name: 'Betflag', url: 'https://www.betflag.it' },
    { name: 'Betaland', url: 'https://www.betaland.it' },
    { name: 'Vincitu', url: 'https://www.vincitu.it' },
    { name: 'Betfred', url: 'https://www.betfred.it' }
  ];

  // Combina i risultati
  const allWorkingBookmakers = [...workingBookmakers, ...alreadyWorking];

  console.log('\n📊 RISULTATI FINALI:\n');
  console.log(`✅ Bookmaker funzionanti trovati: ${allWorkingBookmakers.length}`);
  console.log(`❌ Bookmaker non funzionanti: ${failedBookmakers.length}\n`);

  if (failedBookmakers.length > 0) {
    console.log('❌ BOOKMAKER NON FUNZIONANTI:');
    failedBookmakers.forEach(name => console.log(`  • ${name}`));
    console.log('');
  }

  console.log('✅ LISTA AGGIORNATA BOOKMAKER FUNZIONANTI:\n');
  console.log('const BOOKMAKER_BASE_URLS = {');
  
  // Ordina per nome
  allWorkingBookmakers
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(bm => {
      console.log(`  '${bm.name}': '${bm.url}',`);
    });
  
  console.log('};\n');

  console.log('💡 RACCOMANDAZIONI:');
  console.log('1. Usa questa lista aggiornata in lib/bookmakerLinks.ts');
  console.log('2. Rimuovi i bookmaker non funzionanti dal mockData.ts');
  console.log('3. Tutti gli URL puntano alla homepage per massima compatibilità');
  console.log('4. Testa periodicamente per mantenere la lista aggiornata');
}

// Esegui la ricerca
findCorrectUrls().catch(console.error); 