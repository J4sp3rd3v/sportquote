// Test finale per verificare che tutti i bookmaker aggiornati funzionino
const https = require('https');
const { URL } = require('url');

// Lista finale dei bookmaker (da bookmakerLinks.ts)
const FINAL_BOOKMAKERS = {
  // Bookmaker italiani verificati e funzionanti
  'Sisal': 'https://www.sisal.com',
  'Betflag': 'https://www.betflag.it',
  'Betaland': 'https://www.betaland.it',
  'Vincitu': 'https://www.vincitu.it',
  'Stanleybet': 'https://www.stanleybet.it',
  
  // Bookmaker internazionali con licenza italiana
  'William Hill': 'https://www.williamhill.it',
  'Betclic': 'https://www.betclic.it',
  'Betway': 'https://www.betway.it',
  'NetBet': 'https://www.netbet.it',
  'Marathonbet': 'https://www.marathonbet.it',
  '888sport': 'https://www.888sport.it',
  'Betsson': 'https://www.betsson.it',
  'Betfred': 'https://www.betfred.it'
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
          success: res.statusCode >= 200 && res.statusCode < 400,
          redirected: res.statusCode >= 300 && res.statusCode < 400
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

// Test finale
async function testFinalBookmakers() {
  console.log('🎯 TEST FINALE BOOKMAKER AGGIORNATI\n');
  console.log(`📊 Testando ${Object.keys(FINAL_BOOKMAKERS).length} bookmaker...\n`);

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const [name, url] of Object.entries(FINAL_BOOKMAKERS)) {
    process.stdout.write(`🔄 ${name}... `);
    
    const result = await testUrl(url);
    
    if (result.success) {
      console.log(`✅ OK (${result.status})`);
      successCount++;
    } else {
      console.log(`❌ ERRORE (${result.status})`);
      failureCount++;
    }
    
    results.push({ name, ...result });
    
    // Pausa per evitare rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n📋 RISULTATI FINALI:\n');
  console.log(`✅ Bookmaker funzionanti: ${successCount}`);
  console.log(`❌ Bookmaker con problemi: ${failureCount}`);
  console.log(`📈 Percentuale successo: ${Math.round((successCount / results.length) * 100)}%\n`);

  if (failureCount > 0) {
    console.log('❌ BOOKMAKER CON PROBLEMI:\n');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  • ${result.name}: ${result.status} ${result.error || ''}`);
    });
    console.log('');
  }

  if (successCount === results.length) {
    console.log('🎉 PERFETTO! Tutti i bookmaker funzionano correttamente!\n');
    console.log('✅ SISTEMA PRONTO PER PRODUZIONE:');
    console.log('• Tutti i link sono stati verificati');
    console.log('• Nessun errore 404/403/timeout');
    console.log('• Tutti puntano alla homepage');
    console.log('• Esperienza utente ottimale garantita');
  } else {
    console.log('⚠️ ATTENZIONE: Alcuni bookmaker hanno problemi');
    console.log('Rimuovi o correggi i bookmaker problematici prima del deploy');
  }

  console.log('\n💡 PROSSIMI PASSI:');
  console.log('1. Testa l\'applicazione in locale');
  console.log('2. Verifica che i click sui bookmaker funzionino');
  console.log('3. Deploy in produzione');
  console.log('4. Monitora i click e feedback utenti');
}

// Esegui il test
testFinalBookmakers().catch(console.error); 