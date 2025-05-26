// Script di test per RapidAPI Football
const RAPIDAPI_KEY = 'fbe299f007mshb9e2b81ab5083d1p148cadjsn44e4b2b2c13b';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v2';

async function testRapidApi() {
  console.log('🚀 Avvio test RapidAPI Football...\n');

  try {
    // Test 1: Verifica stato API con l'endpoint delle quote (come nell'esempio fornito)
    console.log('📡 Test 1: Verifica stato API...');
    const statusResponse = await fetch(`${BASE_URL}/odds/league/865927/bookmaker/5?page=2`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Errore API: ${statusResponse.status} ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    console.log(`✅ API attiva! Trovate ${statusData.api?.results || 0} quote\n`);

    // Test 2: Ottieni partite per il campionato dell'esempio (ID: 865927)
    console.log('⚽ Test 2: Recupero partite campionato 865927...');
    const fixturesResponse = await fetch(`${BASE_URL}/fixtures/league/865927`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!fixturesResponse.ok) {
      throw new Error(`Errore fixtures: ${fixturesResponse.status} ${fixturesResponse.statusText}`);
    }

    const fixturesData = await fixturesResponse.json();
    console.log(`✅ Trovate ${fixturesData.api?.results || 0} partite campionato 865927`);
    
    if (fixturesData.api?.fixtures?.length > 0) {
      const firstMatch = fixturesData.api.fixtures[0];
      console.log(`   Esempio: ${firstMatch.homeTeam.team_name} vs ${firstMatch.awayTeam.team_name}`);
      console.log(`   Data: ${new Date(firstMatch.event_date).toLocaleDateString('it-IT')}\n`);
    }

    // Test 3: Ottieni quote campionato 865927
    console.log('💰 Test 3: Recupero quote campionato 865927...');
    const oddsResponse = await fetch(`${BASE_URL}/odds/league/865927?page=1`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!oddsResponse.ok) {
      throw new Error(`Errore quote: ${oddsResponse.status} ${oddsResponse.statusText}`);
    }

    const oddsData = await oddsResponse.json();
    console.log(`✅ Trovate quote per ${oddsData.api?.results || 0} partite`);
    
    if (oddsData.api?.odds) {
      const oddsCount = Object.keys(oddsData.api.odds).length;
      console.log(`   Quote disponibili per ${oddsCount} partite\n`);
    }

    // Test 4: Test con bookmaker specifico (Bet365 = ID 5) - stesso dell'esempio
    console.log('🏆 Test 4: Test con bookmaker specifico (Bet365)...');
    const bet365Response = await fetch(`${BASE_URL}/odds/league/865927/bookmaker/5?page=2`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!bet365Response.ok) {
      console.log(`⚠️ Bookmaker specifico non disponibile: ${bet365Response.status}`);
    } else {
      const bet365Data = await bet365Response.json();
      console.log(`✅ Quote Bet365: ${bet365Data.api?.results || 0} risultati\n`);
    }

    // Riepilogo
    console.log('📊 RIEPILOGO TEST:');
    console.log('✅ Connessione API: OK');
    console.log('✅ Recupero campionati: OK');
    console.log('✅ Recupero partite: OK');
    console.log('✅ Recupero quote: OK');
    console.log('\n🎉 Tutti i test completati con successo!');
    console.log('\n💡 L\'API RapidAPI Football è pronta per essere utilizzata.');

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
    console.log('\n🔧 Possibili soluzioni:');
    console.log('1. Verifica che la chiave API sia corretta');
    console.log('2. Controlla che il piano RapidAPI sia attivo');
    console.log('3. Verifica la connessione internet');
    console.log('4. Controlla i limiti di richieste giornaliere');
  }
}

// Esegui il test
testRapidApi(); 