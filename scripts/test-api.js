const fetch = require('node-fetch');

const ODDS_API_KEY = '9640f946c5bb763f61fd8105717aad6b';
const BASE_URL = 'https://api.the-odds-api.com/v4';

console.log('🔍 TEST API QUOTE REALI\n');

async function testApiStatus() {
  console.log('📊 1. Controllo stato API...');
  
  try {
    const response = await fetch(`${BASE_URL}/sports/?apiKey=${ODDS_API_KEY}`);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Richieste rimanenti: ${response.headers.get('x-requests-remaining') || 'N/A'}`);
    console.log(`Richieste usate: ${response.headers.get('x-requests-used') || 'N/A'}`);
    console.log(`Rate limit: ${response.headers.get('x-ratelimit-requests-remaining') || 'N/A'}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API attiva - ${data.length} sport disponibili`);
      
      // Mostra alcuni sport disponibili
      const soccerSports = data.filter(sport => sport.key.includes('soccer')).slice(0, 5);
      console.log('\n⚽ Sport calcio disponibili:');
      soccerSports.forEach(sport => {
        console.log(`  - ${sport.key}: ${sport.title} (${sport.active ? 'Attivo' : 'Inattivo'})`);
      });
      
      return true;
    } else {
      console.log('❌ API non disponibile');
      const errorText = await response.text();
      console.log('Errore:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Errore di connessione:', error.message);
    return false;
  }
}

async function testSpecificSport(sportKey = 'soccer_italy_serie_a') {
  console.log(`\n🎯 2. Test sport specifico: ${sportKey}`);
  
  try {
    const url = `${BASE_URL}/sports/${sportKey}/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
    console.log('URL:', url);
    
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${data.length} eventi trovati per ${sportKey}`);
      
      if (data.length > 0) {
        const firstEvent = data[0];
        console.log('\n📋 Primo evento:');
        console.log(`  Partita: ${firstEvent.home_team} vs ${firstEvent.away_team}`);
        console.log(`  Data: ${new Date(firstEvent.commence_time).toLocaleString('it-IT')}`);
        console.log(`  Bookmaker: ${firstEvent.bookmakers.length}`);
        
        if (firstEvent.bookmakers.length > 0) {
          const firstBookmaker = firstEvent.bookmakers[0];
          console.log(`  Primo bookmaker: ${firstBookmaker.title}`);
          
          const h2hMarket = firstBookmaker.markets.find(m => m.key === 'h2h');
          if (h2hMarket) {
            console.log('  Quote H2H:');
            h2hMarket.outcomes.forEach(outcome => {
              console.log(`    ${outcome.name}: ${outcome.price}`);
            });
          }
        }
      }
      
      return data.length > 0;
    } else {
      console.log('❌ Errore nel recupero eventi');
      const errorText = await response.text();
      console.log('Errore:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Errore di connessione:', error.message);
    return false;
  }
}

async function testMultipleSports() {
  console.log('\n🌍 3. Test sport multipli...');
  
  const sportsToTest = [
    'soccer_italy_serie_a',
    'soccer_epl',
    'soccer_spain_la_liga',
    'basketball_nba',
    'tennis_atp_french_open'
  ];
  
  let totalEvents = 0;
  
  for (const sport of sportsToTest) {
    try {
      const url = `${BASE_URL}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ${sport}: ${data.length} eventi`);
        totalEvents += data.length;
      } else {
        console.log(`  ${sport}: Errore ${response.status}`);
      }
      
      // Pausa per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`  ${sport}: Errore connessione`);
    }
  }
  
  console.log(`\n📊 Totale eventi trovati: ${totalEvents}`);
  return totalEvents > 0;
}

async function checkApiLimits() {
  console.log('\n💳 4. Controllo limiti API...');
  
  try {
    // Fai una richiesta semplice per controllare i limiti
    const response = await fetch(`${BASE_URL}/sports/?apiKey=${ODDS_API_KEY}`);
    
    const remainingRequests = response.headers.get('x-requests-remaining');
    const usedRequests = response.headers.get('x-requests-used');
    const rateLimit = response.headers.get('x-ratelimit-requests-remaining');
    
    console.log('📈 Statistiche utilizzo:');
    console.log(`  Richieste rimanenti: ${remainingRequests || 'N/A'}`);
    console.log(`  Richieste usate: ${usedRequests || 'N/A'}`);
    console.log(`  Rate limit rimanente: ${rateLimit || 'N/A'}`);
    
    if (remainingRequests && parseInt(remainingRequests) < 10) {
      console.log('⚠️  ATTENZIONE: Poche richieste rimanenti!');
      return false;
    }
    
    if (rateLimit && parseInt(rateLimit) < 5) {
      console.log('⚠️  ATTENZIONE: Rate limit quasi raggiunto!');
      return false;
    }
    
    console.log('✅ Limiti API OK');
    return true;
  } catch (error) {
    console.log('❌ Errore nel controllo limiti:', error.message);
    return false;
  }
}

async function runFullTest() {
  console.log('🚀 AVVIO TEST COMPLETO API\n');
  
  const results = {
    apiStatus: false,
    specificSport: false,
    multipleSports: false,
    apiLimits: false
  };
  
  // Test 1: Stato API
  results.apiStatus = await testApiStatus();
  
  if (results.apiStatus) {
    // Test 2: Sport specifico
    results.specificSport = await testSpecificSport();
    
    // Test 3: Sport multipli
    results.multipleSports = await testMultipleSports();
    
    // Test 4: Limiti API
    results.apiLimits = await checkApiLimits();
  }
  
  // Riepilogo finale
  console.log('\n📋 RIEPILOGO TEST:');
  console.log(`  ✅ API Status: ${results.apiStatus ? 'OK' : 'ERRORE'}`);
  console.log(`  ✅ Sport Specifico: ${results.specificSport ? 'OK' : 'ERRORE'}`);
  console.log(`  ✅ Sport Multipli: ${results.multipleSports ? 'OK' : 'ERRORE'}`);
  console.log(`  ✅ Limiti API: ${results.apiLimits ? 'OK' : 'ERRORE'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 TUTTI I TEST SUPERATI!');
    console.log('L\'API funziona correttamente. Il problema potrebbe essere:');
    console.log('- Errore temporaneo di rete');
    console.log('- Problema nel codice dell\'applicazione');
    console.log('- Configurazione CORS o proxy');
  } else {
    console.log('\n❌ ALCUNI TEST FALLITI');
    console.log('Possibili cause:');
    console.log('- Chiave API non valida o scaduta');
    console.log('- Limiti di richieste raggiunti');
    console.log('- Servizio API temporaneamente non disponibile');
    console.log('- Problemi di connessione internet');
  }
  
  console.log('\n🔧 AZIONI CONSIGLIATE:');
  if (!results.apiStatus) {
    console.log('1. Verifica la chiave API');
    console.log('2. Controlla la connessione internet');
  }
  if (!results.apiLimits) {
    console.log('3. Attendi il reset dei limiti API');
  }
  if (results.apiStatus && !results.specificSport) {
    console.log('4. Verifica i parametri delle richieste');
  }
  
  console.log('\n✅ Test completato!');
}

// Esegui il test
runFullTest().catch(console.error); 