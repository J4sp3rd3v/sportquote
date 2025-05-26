// Test del sistema API ottimizzato
const https = require('https');

// Chiavi API da testare
const API_KEYS = [
  'f9fddbc4c5be58bd8e9e13ad9c91a3cc'  // Chiave attiva (490 richieste rimanenti)
];

const BASE_URL = 'api.the-odds-api.com';

console.log('🚀 TEST SISTEMA API OTTIMIZZATO\n');

function makeRequest(path, keyIndex = 0) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'MonitorQuote-Optimized/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            keyIndex
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            error: 'Invalid JSON',
            keyIndex
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({ error: error.message, keyIndex });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject({ error: 'Request timeout', keyIndex });
    });

    req.end();
  });
}

async function testApiKey(keyIndex) {
  const apiKey = API_KEYS[keyIndex];
  console.log(`\n🔑 TEST CHIAVE ${keyIndex + 1}/${API_KEYS.length}`);
  console.log(`Chiave: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 8)}`);
  
  try {
    // Test connessione base
    const sportsResult = await makeRequest(`/v4/sports/?apiKey=${apiKey}`, keyIndex);
    
    console.log(`Status: ${sportsResult.status}`);
    console.log(`Richieste rimanenti: ${sportsResult.headers['x-requests-remaining'] || 'N/A'}`);
    console.log(`Richieste usate: ${sportsResult.headers['x-requests-used'] || 'N/A'}`);
    
    if (sportsResult.status === 200) {
      console.log(`✅ Connessione OK - ${sportsResult.data.length} sport disponibili`);
      
      // Test quote Serie A
      console.log('\n📊 Test quote Serie A...');
      const serieAResult = await makeRequest(
        `/v4/sports/soccer_italy_serie_a/odds/?apiKey=${apiKey}&regions=eu&markets=h2h&oddsFormat=decimal`,
        keyIndex
      );
      
      console.log(`Status Serie A: ${serieAResult.status}`);
      
      if (serieAResult.status === 200) {
        console.log(`✅ Serie A: ${serieAResult.data.length} partite trovate`);
        
        if (serieAResult.data.length > 0) {
          const firstMatch = serieAResult.data[0];
          console.log(`Esempio: ${firstMatch.home_team} vs ${firstMatch.away_team}`);
          console.log(`Bookmaker: ${firstMatch.bookmakers?.length || 0}`);
        }
      } else if (serieAResult.status === 401) {
        console.log(`❌ Limite raggiunto per questa chiave`);
      } else {
        console.log(`❌ Errore Serie A: ${serieAResult.data}`);
      }
      
      return {
        keyIndex,
        isWorking: true,
        remaining: parseInt(serieAResult.headers['x-requests-remaining'] || '0'),
        used: parseInt(serieAResult.headers['x-requests-used'] || '0'),
        canFetchQuotes: serieAResult.status === 200
      };
      
    } else {
      console.log(`❌ Errore connessione: ${sportsResult.status}`);
      return {
        keyIndex,
        isWorking: false,
        error: `HTTP ${sportsResult.status}`
      };
    }
    
  } catch (error) {
    console.log(`❌ Errore di rete:`, error);
    return {
      keyIndex,
      isWorking: false,
      error: error.error || error.message
    };
  }
}

async function testOptimizedSystem() {
  console.log('🔍 Testing sistema con rotazione chiavi...\n');
  
  const results = [];
  
  // Test tutte le chiavi
  for (let i = 0; i < API_KEYS.length; i++) {
    const result = await testApiKey(i);
    results.push(result);
    
    // Pausa tra test
    if (i < API_KEYS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Riepilogo risultati
  console.log('\n📋 RIEPILOGO RISULTATI');
  console.log('='.repeat(50));
  
  const workingKeys = results.filter(r => r.isWorking);
  const totalRemaining = workingKeys.reduce((sum, r) => sum + (r.remaining || 0), 0);
  const totalUsed = workingKeys.reduce((sum, r) => sum + (r.used || 0), 0);
  const totalLimit = API_KEYS.length * 500;
  
  console.log(`\n🔑 Chiavi funzionanti: ${workingKeys.length}/${API_KEYS.length}`);
  console.log(`📊 Richieste totali: ${totalUsed}/${totalLimit} usate`);
  console.log(`⚡ Richieste rimanenti: ${totalRemaining}`);
  console.log(`📈 Utilizzo: ${Math.round((totalUsed / totalLimit) * 100)}%`);
  
  // Dettaglio per chiave
  results.forEach((result, index) => {
    console.log(`\nChiave ${index + 1}:`);
    if (result.isWorking) {
      console.log(`  ✅ Funzionante`);
      console.log(`  📊 ${result.used}/500 usate (${result.remaining} rimanenti)`);
      console.log(`  🎯 Quote: ${result.canFetchQuotes ? 'Disponibili' : 'Limite raggiunto'}`);
    } else {
      console.log(`  ❌ Non funzionante: ${result.error}`);
    }
  });
  
  // Raccomandazioni
  console.log('\n💡 RACCOMANDAZIONI');
  console.log('='.repeat(50));
  
  if (totalRemaining > 400) {
    console.log('🟢 Situazione ottimale - Aggiornamenti frequenti possibili');
    console.log('   • Serie A: ogni 30 minuti');
    console.log('   • Altri sport: ogni 60 minuti');
  } else if (totalRemaining > 200) {
    console.log('🟡 Situazione buona - Aggiornamenti moderati');
    console.log('   • Serie A: ogni 60 minuti');
    console.log('   • Altri sport: ogni 120 minuti');
  } else if (totalRemaining > 50) {
    console.log('🟠 Attenzione - Modalità risparmio consigliata');
    console.log('   • Solo sport prioritari: ogni 180 minuti');
  } else {
    console.log('🔴 EMERGENZA - Limitare al minimo le richieste');
    console.log('   • Solo aggiornamenti manuali');
  }
  
  // Stima durata
  if (totalRemaining > 0) {
    const daysRemaining = Math.floor(totalRemaining / 10); // Stima 10 richieste al giorno
    console.log(`\n⏱️  Stima durata: ~${daysRemaining} giorni con uso moderato`);
  }
  
  console.log('\n✅ Test completato!');
}

// Esegui test
testOptimizedSystem().catch(console.error); 