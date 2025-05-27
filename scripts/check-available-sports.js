// Script per verificare sport disponibili in The Odds API
// Esegui con: node scripts/check-available-sports.js

const API_KEY = '4815fd45ad14363aea162bef71a91b06';
const BASE_URL = 'https://api.the-odds-api.com/v4';

async function checkAvailableSports() {
  console.log('🔍 === VERIFICA SPORT DISPONIBILI ===\n');

  try {
    // 1. Ottieni tutti gli sport disponibili
    console.log('📡 Recupero lista sport dall\'API...');
    const sportsResponse = await fetch(`${BASE_URL}/sports?apiKey=${API_KEY}`);
    
    if (!sportsResponse.ok) {
      throw new Error(`HTTP ${sportsResponse.status}`);
    }

    const allSports = await sportsResponse.json();
    console.log(`✅ ${allSports.length} sport totali disponibili\n`);

    // 2. Categorizza sport
    const categories = {
      soccer: [],
      basketball: [],
      tennis: [],
      americanfootball: [],
      icehockey: [],
      mma: [],
      baseball: [],
      cricket: [],
      golf: [],
      other: []
    };

    allSports.forEach(sport => {
      const key = sport.key.toLowerCase();
      
      if (key.includes('soccer')) {
        categories.soccer.push(sport);
      } else if (key.includes('basketball')) {
        categories.basketball.push(sport);
      } else if (key.includes('tennis')) {
        categories.tennis.push(sport);
      } else if (key.includes('americanfootball')) {
        categories.americanfootball.push(sport);
      } else if (key.includes('icehockey')) {
        categories.icehockey.push(sport);
      } else if (key.includes('mma') || key.includes('mixed_martial_arts')) {
        categories.mma.push(sport);
      } else if (key.includes('baseball')) {
        categories.baseball.push(sport);
      } else if (key.includes('cricket')) {
        categories.cricket.push(sport);
      } else if (key.includes('golf')) {
        categories.golf.push(sport);
      } else {
        categories.other.push(sport);
      }
    });

    // 3. Stampa categorie
    Object.entries(categories).forEach(([category, sports]) => {
      if (sports.length > 0) {
        console.log(`📂 ${category.toUpperCase()} (${sports.length} sport):`);
        sports.forEach(sport => {
          console.log(`  • ${sport.key} - ${sport.title}`);
        });
        console.log('');
      }
    });

    // 4. Verifica sport prioritari con partite
    console.log('🎯 === VERIFICA PARTITE ATTIVE ===\n');
    
    const prioritySports = [
      'soccer_epl',
      'soccer_italy_serie_a', 
      'soccer_spain_la_liga',
      'soccer_germany_bundesliga',
      'soccer_france_ligue_one',
      'soccer_uefa_champs_league',
      'basketball_nba',
      'americanfootball_nfl',
      'icehockey_nhl',
      'mma_mixed_martial_arts',
      'tennis_atp_wimbledon',
      'tennis_wta_wimbledon'
    ];

    const sportsWithMatches = [];
    let requestCount = 0;

    for (const sportKey of prioritySports) {
      const sportExists = allSports.some(sport => sport.key === sportKey);
      
      if (!sportExists) {
        console.log(`❌ ${sportKey}: Non disponibile nell'API`);
        continue;
      }

      try {
        console.log(`🔄 Verifico ${sportKey}...`);
        
        const oddsResponse = await fetch(
          `${BASE_URL}/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`
        );
        
        requestCount++;
        
        if (oddsResponse.ok) {
          const data = await oddsResponse.json();
          
          if (Array.isArray(data) && data.length > 0) {
            // Filtra partite future
            const now = new Date();
            const futureMatches = data.filter(match => {
              const matchDate = new Date(match.commence_time);
              return matchDate > now;
            });
            
            if (futureMatches.length > 0) {
              sportsWithMatches.push({
                key: sportKey,
                total: data.length,
                future: futureMatches.length,
                nextMatch: futureMatches[0]
              });
              console.log(`✅ ${sportKey}: ${futureMatches.length} partite future (${data.length} totali)`);
              
              // Mostra prossima partita
              if (futureMatches[0]) {
                const nextMatch = futureMatches[0];
                const matchDate = new Date(nextMatch.commence_time);
                console.log(`   📅 Prossima: ${nextMatch.home_team} vs ${nextMatch.away_team} - ${matchDate.toLocaleDateString('it-IT')} ${matchDate.toLocaleTimeString('it-IT')}`);
              }
            } else {
              console.log(`⚠️ ${sportKey}: ${data.length} partite totali, ma nessuna futura`);
            }
          } else {
            console.log(`⚠️ ${sportKey}: Nessuna partita disponibile`);
          }
        } else {
          console.log(`❌ ${sportKey}: Errore HTTP ${oddsResponse.status}`);
        }
        
        // Pausa per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ ${sportKey}: Errore - ${error.message}`);
      }
    }

    // 5. Riassunto finale
    console.log('\n📊 === RIASSUNTO ===');
    console.log(`🔢 Richieste API utilizzate: ${requestCount}`);
    console.log(`✅ Sport con partite future: ${sportsWithMatches.length}`);
    
    if (sportsWithMatches.length > 0) {
      console.log('\n🎯 Sport attivi:');
      sportsWithMatches.forEach(sport => {
        console.log(`  ✓ ${sport.key} - ${sport.future} partite future`);
      });
    } else {
      console.log('\n❌ Nessuno sport con partite future trovato');
    }

    // 6. Raccomandazioni
    console.log('\n💡 === RACCOMANDAZIONI ===');
    if (sportsWithMatches.length > 0) {
      console.log('✅ Configura il sistema con questi sport:');
      sportsWithMatches.forEach(sport => {
        console.log(`   ${sport.key}`);
      });
    } else {
      console.log('⚠️ Potrebbe essere necessario:');
      console.log('   • Verificare la chiave API');
      console.log('   • Controllare se ci sono eventi in corso');
      console.log('   • Provare sport diversi');
    }

  } catch (error) {
    console.error('❌ Errore generale:', error.message);
  }
}

// Esegui verifica
checkAvailableSports().catch(console.error); 