// Test semplificato per verificare le correzioni all'API
const https = require('https');

const ODDS_API_KEY = 'e8d4b5e534a34c76916de8016efa690d';
const BASE_URL = 'api.the-odds-api.com';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'SITOSPORT/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: result,
            headers: res.headers
          });
        } catch (error) {
          reject(new Error(`Errore parsing JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testApiFix() {
  console.log('🔍 TEST CORREZIONI API\n');
  
  try {
    console.log('📊 1. Test configurazione chiave API...');
    console.log(`Chiave configurata: ${ODDS_API_KEY ? 'SÌ' : 'NO'}`);
    console.log(`Chiave: ${ODDS_API_KEY.substring(0, 8)}...`);
    
    console.log('\n📊 2. Test connessione API...');
    const sportsResult = await makeRequest(`/v4/sports/?apiKey=${ODDS_API_KEY}`);
    console.log(`Status: ${sportsResult.status}`);
    console.log(`Richieste usate: ${sportsResult.headers['x-requests-used'] || 'N/A'}`);
    console.log(`Richieste rimanenti: ${sportsResult.headers['x-requests-remaining'] || 'N/A'}`);
    
    if (sportsResult.status === 200) {
      console.log(`✅ API funzionante - ${sportsResult.data.length} sport disponibili\n`);
      
      console.log('📊 3. Test recupero quote Serie A...');
      const serieAResult = await makeRequest(`/v4/sports/soccer_italy_serie_a/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      console.log(`Status Serie A: ${serieAResult.status}`);
      
      if (serieAResult.status === 200) {
        console.log(`✅ Serie A: ${serieAResult.data.length} partite trovate`);
        
        if (serieAResult.data.length > 0) {
          const firstMatch = serieAResult.data[0];
          console.log(`Esempio partita: ${firstMatch.home_team} vs ${firstMatch.away_team}`);
          console.log(`Bookmaker disponibili: ${firstMatch.bookmakers.length}`);
        }
      } else {
        console.log(`⚠️ Errore Serie A: ${serieAResult.status}`);
      }
      
      console.log('\n📊 4. Test altri sport...');
      const testSports = ['soccer_epl', 'basketball_nba', 'tennis_atp_french_open'];
      
      for (const sport of testSports) {
        try {
          const result = await makeRequest(`/v4/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
          console.log(`${sport}: ${result.status === 200 ? result.data.length + ' partite' : 'Errore ' + result.status}`);
          
          // Pausa per evitare rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.log(`${sport}: Errore - ${error.message}`);
        }
      }
      
    } else {
      console.error(`❌ API non disponibile: ${sportsResult.status}`);
      if (sportsResult.data.message) {
        console.error(`Messaggio: ${sportsResult.data.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }
  
  console.log('\n✅ Test completato!');
}

// Esegui il test
testApiFix().catch(console.error); 