// Script per verificare tutti i link dei bookmaker
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Lista completa dei bookmaker da verificare
const BOOKMAKER_URLS = {
  // TOP 5 bookmaker italiani
  'Bet365': 'https://www.bet365.it',
  'Sisal': 'https://www.sisal.it',
  'Snai': 'https://www.snai.it',
  'Eurobet': 'https://www.eurobet.it',
  'Lottomatica': 'https://www.lottomatica.it',
  
  // Bookmaker internazionali con licenza italiana
  'William Hill': 'https://www.williamhill.it',
  'Betfair': 'https://www.betfair.it',
  'Unibet': 'https://www.unibet.it',
  'Bwin': 'https://www.bwin.it',
  'Betclic': 'https://www.betclic.it',
  
  // Bookmaker specializzati
  'Pinnacle': 'https://www.pinnacle.com',
  'Betway': 'https://betway.it',
  'NetBet': 'https://www.netbet.it',
  'Marathonbet': 'https://www.marathonbet.it',
  'Betano': 'https://www.betano.it',
  'Winamax': 'https://www.winamax.it',
  
  // Bookmaker italiani aggiuntivi
  'Better': 'https://www.better.it',
  'Goldbet': 'https://www.goldbet.it',
  'Planetwin365': 'https://www.planetwin365.it',
  'Admiral': 'https://www.admiralbet.it',
  'Stanleybet': 'https://www.stanleybet.it',
  
  // Bookmaker UK/Internazionali
  'Ladbrokes': 'https://www.ladbrokes.com',
  'Paddy Power': 'https://www.paddypower.com',
  'Coral': 'https://www.coral.co.uk',
  '888sport': 'https://www.888sport.it',
  'LeoVegas': 'https://www.leovegas.it',
  
  // Altri bookmaker
  'Nordicbet': 'https://www.nordicbet.it',
  'Betsson': 'https://www.betsson.it',
  'Betsafe': 'https://www.betsafe.it',
  'Interwetten': 'https://www.interwetten.it',
  'Tipico': 'https://www.tipico.it',
  'Sportingbet': 'https://www.sportingbet.it',
  'Betflag': 'https://www.betflag.it',
  'Betaland': 'https://www.betaland.it',
  'Vincitu': 'https://www.vincitu.it',
  'Cplay': 'https://www.cplay.it',
  'Betvictor': 'https://www.betvictor.it',
  'Betfred': 'https://www.betfred.it',
  'Sky Bet': 'https://www.skybet.it',
  '10Bet': 'https://www.10bet.it',
  'Bet-at-home': 'https://www.bet-at-home.it'
};

// Funzione per testare un singolo URL
function testUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }, (res) => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          redirected: res.statusCode >= 300 && res.statusCode < 400,
          location: res.headers.location
        });
      });

      req.on('error', (error) => {
        resolve({
          status: 'ERROR',
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: 'TIMEOUT',
          error: 'Request timeout'
        });
      });

      req.end();
    } catch (error) {
      resolve({
        status: 'INVALID',
        error: error.message
      });
    }
  });
}

// Funzione per seguire i redirect e ottenere l'URL finale
async function getFinalUrl(url, maxRedirects = 5) {
  let currentUrl = url;
  let redirectCount = 0;
  
  while (redirectCount < maxRedirects) {
    const result = await testUrl(currentUrl);
    
    if (result.status === 'ERROR' || result.status === 'TIMEOUT' || result.status === 'INVALID') {
      return { finalUrl: currentUrl, error: result.error, status: result.status };
    }
    
    if (result.redirected && result.location) {
      currentUrl = result.location.startsWith('http') ? result.location : new URL(result.location, currentUrl).href;
      redirectCount++;
    } else {
      return { finalUrl: currentUrl, status: result.status, redirectCount };
    }
  }
  
  return { finalUrl: currentUrl, status: 'TOO_MANY_REDIRECTS', redirectCount };
}

// Funzione principale per verificare tutti i bookmaker
async function verifyAllBookmakers() {
  console.log('🔍 Verifica URL Bookmaker - Inizio Test\n');
  console.log(`📊 Testando ${Object.keys(BOOKMAKER_URLS).length} bookmaker...\n`);

  const results = [];
  const workingBookmakers = [];
  const problematicBookmakers = [];

  for (const [name, url] of Object.entries(BOOKMAKER_URLS)) {
    process.stdout.write(`🔄 Testando ${name}... `);
    
    const result = await getFinalUrl(url);
    
    let status = '';
    let recommendation = '';
    
    if (result.error) {
      status = '❌ ERRORE';
      recommendation = 'RIMUOVERE - Sito non raggiungibile';
      problematicBookmakers.push({ name, url, issue: result.error });
    } else if (result.status === 'TOO_MANY_REDIRECTS') {
      status = '⚠️ TROPPI REDIRECT';
      recommendation = 'VERIFICARE - Possibili problemi di configurazione';
      problematicBookmakers.push({ name, url, issue: 'Troppi redirect' });
    } else if (result.status >= 200 && result.status < 300) {
      status = '✅ OK';
      recommendation = 'MANTENERE';
      workingBookmakers.push({ name, url: result.finalUrl });
    } else if (result.status >= 300 && result.status < 400) {
      status = '🔄 REDIRECT';
      recommendation = `AGGIORNARE URL a: ${result.finalUrl}`;
      workingBookmakers.push({ name, url: result.finalUrl });
    } else if (result.status >= 400 && result.status < 500) {
      status = '❌ NON TROVATO';
      recommendation = 'RIMUOVERE - Pagina non esistente';
      problematicBookmakers.push({ name, url, issue: `HTTP ${result.status}` });
    } else {
      status = '❌ ERRORE SERVER';
      recommendation = 'VERIFICARE - Problemi server';
      problematicBookmakers.push({ name, url, issue: `HTTP ${result.status}` });
    }
    
    console.log(`${status}`);
    
    results.push({
      name,
      originalUrl: url,
      finalUrl: result.finalUrl,
      status: result.status,
      redirectCount: result.redirectCount || 0,
      recommendation
    });

    // Pausa per evitare di sovraccaricare i server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Stampa risultati dettagliati
  console.log('\n📋 RISULTATI DETTAGLIATI:\n');
  
  results.forEach(result => {
    console.log(`${result.name}:`);
    console.log(`  URL originale: ${result.originalUrl}`);
    if (result.finalUrl !== result.originalUrl) {
      console.log(`  URL finale: ${result.finalUrl}`);
    }
    console.log(`  Status: ${result.status}`);
    if (result.redirectCount > 0) {
      console.log(`  Redirect: ${result.redirectCount}`);
    }
    console.log(`  Raccomandazione: ${result.recommendation}`);
    console.log('');
  });

  // Statistiche finali
  console.log('📊 STATISTICHE FINALI:\n');
  console.log(`✅ Bookmaker funzionanti: ${workingBookmakers.length}`);
  console.log(`❌ Bookmaker problematici: ${problematicBookmakers.length}`);
  console.log(`📈 Percentuale successo: ${Math.round((workingBookmakers.length / results.length) * 100)}%\n`);

  // Bookmaker da rimuovere
  if (problematicBookmakers.length > 0) {
    console.log('🗑️ BOOKMAKER DA RIMUOVERE:\n');
    problematicBookmakers.forEach(bm => {
      console.log(`❌ ${bm.name}: ${bm.issue}`);
    });
    console.log('');
  }

  // URL corretti per bookmaker funzionanti
  console.log('✅ URL CORRETTI PER BOOKMAKER FUNZIONANTI:\n');
  console.log('const BOOKMAKER_BASE_URLS = {');
  workingBookmakers.forEach(bm => {
    console.log(`  '${bm.name}': '${bm.url}',`);
  });
  console.log('};\n');

  // Raccomandazioni finali
  console.log('💡 RACCOMANDAZIONI:\n');
  console.log('1. Rimuovi i bookmaker non funzionanti dalla lista');
  console.log('2. Aggiorna gli URL che hanno redirect permanenti');
  console.log('3. Usa sempre HTTPS quando possibile');
  console.log('4. Punta sempre alla homepage, non a sottopagine specifiche');
  console.log('5. Testa periodicamente i link per mantenerli aggiornati');
}

// Esegui la verifica
verifyAllBookmakers().catch(console.error); 