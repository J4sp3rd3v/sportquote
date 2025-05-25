// Test semplice API senza dipendenze esterne
const https = require('https');

const ODDS_API_KEY = 'f9fddbc4c5be58bd8e9e13ad9c91a3cc';
const BASE_URL = 'api.the-odds-api.com';

console.log('🔍 TEST SEMPLICE API QUOTE REALI\n');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'SitoSport/1.0'
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
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            error: 'Invalid JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testApi() {
  console.log('📊 1. Test connessione API...');
  
  try {
    const result = await makeRequest(`/v4/sports/?apiKey=${ODDS_API_KEY}`);
    
    console.log(`Status: ${result.status}`);
    console.log(`Richieste rimanenti: ${result.headers['x-requests-remaining'] || 'N/A'}`);
    console.log(`Richieste usate: ${result.headers['x-requests-used'] || 'N/A'}`);
    
    if (result.status === 200) {
      console.log(`✅ API funzionante - ${result.data.length} sport disponibili`);
      
      // Test sport specifico
      console.log('\n🎯 2. Test Serie A...');
      const serieAResult = await makeRequest(`/v4/sports/soccer_italy_serie_a/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      
      console.log(`Status Serie A: ${serieAResult.status}`);
      
      if (serieAResult.status === 200) {
        console.log(`✅ Serie A: ${serieAResult.data.length} partite trovate`);
        
        if (serieAResult.data.length > 0) {
          const firstMatch = serieAResult.data[0];
          console.log(`Esempio: ${firstMatch.home_team} vs ${firstMatch.away_team}`);
          console.log(`Bookmaker: ${firstMatch.bookmakers.length}`);
        }
      } else {
        console.log(`❌ Errore Serie A: ${serieAResult.data}`);
      }
      
    } else {
      console.log(`❌ Errore API: ${result.status}`);
      console.log('Risposta:', result.data);
    }
    
  } catch (error) {
    console.log('❌ Errore di connessione:', error.message);
  }
  
  console.log('\n✅ Test completato!');
}

testApi(); 