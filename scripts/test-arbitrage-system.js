// Test del sistema di calcolo arbitraggio
console.log('🎯 TEST SISTEMA DI ARBITRAGGIO');
console.log('==============================\n');

// Dati di test per tennis (2 esiti)
const tennisMatch = {
  id: 'test-tennis-1',
  homeTeam: 'Novak Djokovic',
  awayTeam: 'Rafael Nadal',
  sport: 'tennis',
  league: 'ATP Masters 1000',
  date: new Date(),
  status: 'upcoming',
  odds: [
    { bookmaker: 'Bet365', home: 1.85, away: 1.98, lastUpdated: new Date() },
    { bookmaker: 'William Hill', home: 1.90, away: 1.95, lastUpdated: new Date() },
    { bookmaker: 'Betfair', home: 1.88, away: 2.00, lastUpdated: new Date() },
    { bookmaker: 'Unibet', home: 1.92, away: 1.93, lastUpdated: new Date() }
  ]
};

// Dati di test per calcio (3 esiti)
const footballMatch = {
  id: 'test-football-1',
  homeTeam: 'Juventus',
  awayTeam: 'Inter',
  sport: 'calcio',
  league: 'Serie A',
  date: new Date(),
  status: 'upcoming',
  odds: [
    { bookmaker: 'Bet365', home: 2.10, away: 3.40, draw: 3.20, lastUpdated: new Date() },
    { bookmaker: 'William Hill', home: 2.05, away: 3.50, draw: 3.25, lastUpdated: new Date() },
    { bookmaker: 'Betfair', home: 2.15, away: 3.35, draw: 3.15, lastUpdated: new Date() },
    { bookmaker: 'Unibet', home: 2.08, away: 3.45, draw: 3.22, lastUpdated: new Date() }
  ]
};

// Dati di test per basket (2 esiti)
const basketMatch = {
  id: 'test-basket-1',
  homeTeam: 'Los Angeles Lakers',
  awayTeam: 'Boston Celtics',
  sport: 'basket',
  league: 'NBA',
  date: new Date(),
  status: 'upcoming',
  odds: [
    { bookmaker: 'Bet365', home: 1.90, away: 1.95, lastUpdated: new Date() },
    { bookmaker: 'William Hill', home: 1.88, away: 1.97, lastUpdated: new Date() },
    { bookmaker: 'Betfair', home: 1.92, away: 1.93, lastUpdated: new Date() },
    { bookmaker: 'Unibet', home: 1.89, away: 1.96, lastUpdated: new Date() }
  ]
};

// Dati con opportunità di arbitraggio (tennis)
const arbitrageTennis = {
  id: 'arbitrage-tennis-1',
  homeTeam: 'Player A',
  awayTeam: 'Player B',
  sport: 'tennis',
  league: 'ATP',
  date: new Date(),
  status: 'upcoming',
  odds: [
    { bookmaker: 'Bet365', home: 2.20, away: 1.75, lastUpdated: new Date() },
    { bookmaker: 'William Hill', home: 1.80, away: 2.10, lastUpdated: new Date() },
    { bookmaker: 'Betfair', home: 2.15, away: 1.78, lastUpdated: new Date() }
  ]
};

function calculateTennisArbitrage(match) {
  console.log(`\n🎾 ANALISI TENNIS: ${match.homeTeam} vs ${match.awayTeam}`);
  console.log('='.repeat(60));
  
  // Trova le migliori quote per ogni giocatore
  const homeOdds = match.odds.map(odd => ({ 
    bookmaker: odd.bookmaker, 
    odds: odd.home,
    percentage: 100 / odd.home
  }));
  
  const awayOdds = match.odds.map(odd => ({ 
    bookmaker: odd.bookmaker, 
    odds: odd.away,
    percentage: 100 / odd.away
  }));

  // Trova le quote più alte (percentuali più basse)
  const bestHome = homeOdds.reduce((best, current) => 
    current.odds > best.odds ? current : best
  );
  
  const bestAway = awayOdds.reduce((best, current) => 
    current.odds > best.odds ? current : best
  );

  console.log(`📊 Migliore quota ${match.homeTeam}: ${bestHome.odds} (${bestHome.bookmaker})`);
  console.log(`📊 Migliore quota ${match.awayTeam}: ${bestAway.odds} (${bestAway.bookmaker})`);

  // Calcola percentuale di arbitraggio
  const arbitragePercentage = bestHome.percentage + bestAway.percentage;
  const profit = 100 - arbitragePercentage;
  
  console.log(`\n🧮 CALCOLO:`);
  console.log(`(100/${bestHome.odds.toFixed(2)}) + (100/${bestAway.odds.toFixed(2)}) = ${arbitragePercentage.toFixed(2)}%`);
  
  if (arbitragePercentage < 100) {
    console.log(`\n✅ OPPORTUNITÀ TROVATA!`);
    console.log(`💰 Profitto garantito: ${profit.toFixed(2)}%`);
    
    // Calcola distribuzione ottimale per €100
    const stake = 100;
    const stake1 = (bestHome.percentage / arbitragePercentage) * stake;
    const stake2 = (bestAway.percentage / arbitragePercentage) * stake;
    const guaranteedProfit = profit * stake / 100;
    
    console.log(`\n💡 STRATEGIA CONSIGLIATA (€${stake}):`);
    console.log(`• Scommetti €${stake1.toFixed(2)} su ${match.homeTeam} (${bestHome.bookmaker})`);
    console.log(`• Scommetti €${stake2.toFixed(2)} su ${match.awayTeam} (${bestAway.bookmaker})`);
    console.log(`• Profitto garantito: €${guaranteedProfit.toFixed(2)}`);
    
    return { isOpportunity: true, profit, percentage: arbitragePercentage };
  } else {
    console.log(`\n❌ Nessuna opportunità (${arbitragePercentage.toFixed(2)}% > 100%)`);
    return { isOpportunity: false, profit: 0, percentage: arbitragePercentage };
  }
}

function calculateFootballArbitrage(match) {
  console.log(`\n⚽ ANALISI CALCIO: ${match.homeTeam} vs ${match.awayTeam}`);
  console.log('='.repeat(60));
  
  // Trova le migliori quote per ogni esito
  const homeOdds = match.odds
    .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.home }))
    .reduce((best, current) => current.odds > best.odds ? current : best);
  
  const awayOdds = match.odds
    .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.away }))
    .reduce((best, current) => current.odds > best.odds ? current : best);
  
  const drawOdds = match.odds
    .filter(odd => odd.draw)
    .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.draw }))
    .reduce((best, current) => current.odds > best.odds ? current : best);

  console.log(`📊 Migliore quota 1 (${match.homeTeam}): ${homeOdds.odds} (${homeOdds.bookmaker})`);
  console.log(`📊 Migliore quota X (Pareggio): ${drawOdds.odds} (${drawOdds.bookmaker})`);
  console.log(`📊 Migliore quota 2 (${match.awayTeam}): ${awayOdds.odds} (${awayOdds.bookmaker})`);

  // Calcola percentuale di arbitraggio
  const homePercentage = 100 / homeOdds.odds;
  const drawPercentage = 100 / drawOdds.odds;
  const awayPercentage = 100 / awayOdds.odds;
  const arbitragePercentage = homePercentage + drawPercentage + awayPercentage;
  const profit = 100 - arbitragePercentage;
  
  console.log(`\n🧮 CALCOLO:`);
  console.log(`(100/${homeOdds.odds.toFixed(2)}) + (100/${drawOdds.odds.toFixed(2)}) + (100/${awayOdds.odds.toFixed(2)}) = ${arbitragePercentage.toFixed(2)}%`);
  
  if (arbitragePercentage < 100) {
    console.log(`\n✅ OPPORTUNITÀ TROVATA!`);
    console.log(`💰 Profitto garantito: ${profit.toFixed(2)}%`);
    
    // Calcola distribuzione ottimale per €100
    const stake = 100;
    const stake1 = (homePercentage / arbitragePercentage) * stake;
    const stakeX = (drawPercentage / arbitragePercentage) * stake;
    const stake2 = (awayPercentage / arbitragePercentage) * stake;
    const guaranteedProfit = profit * stake / 100;
    
    console.log(`\n💡 STRATEGIA CONSIGLIATA (€${stake}):`);
    console.log(`• Scommetti €${stake1.toFixed(2)} su 1 (${homeOdds.bookmaker})`);
    console.log(`• Scommetti €${stakeX.toFixed(2)} su X (${drawOdds.bookmaker})`);
    console.log(`• Scommetti €${stake2.toFixed(2)} su 2 (${awayOdds.bookmaker})`);
    console.log(`• Profitto garantito: €${guaranteedProfit.toFixed(2)}`);
    
    return { isOpportunity: true, profit, percentage: arbitragePercentage };
  } else {
    console.log(`\n❌ Nessuna opportunità (${arbitragePercentage.toFixed(2)}% > 100%)`);
    return { isOpportunity: false, profit: 0, percentage: arbitragePercentage };
  }
}

// Esegui test
console.log('🚀 Avvio test sistema di arbitraggio...\n');

const results = [];

// Test tennis normale
results.push(calculateTennisArbitrage(tennisMatch));

// Test calcio normale
results.push(calculateFootballArbitrage(footballMatch));

// Test basket normale
results.push(calculateTennisArbitrage(basketMatch)); // Usa la stessa logica del tennis

// Test con opportunità di arbitraggio
results.push(calculateTennisArbitrage(arbitrageTennis));

// Riepilogo
console.log('\n📋 RIEPILOGO RISULTATI');
console.log('='.repeat(50));

const opportunities = results.filter(r => r.isOpportunity);
const totalTests = results.length;

console.log(`\n📊 Test eseguiti: ${totalTests}`);
console.log(`✅ Opportunità trovate: ${opportunities.length}`);
console.log(`❌ Nessuna opportunità: ${totalTests - opportunities.length}`);

if (opportunities.length > 0) {
  console.log(`\n🎯 MIGLIORI OPPORTUNITÀ:`);
  opportunities
    .sort((a, b) => b.profit - a.profit)
    .forEach((opp, index) => {
      console.log(`${index + 1}. Profitto: ${opp.profit.toFixed(2)}% (${opp.percentage.toFixed(2)}%)`);
    });
}

console.log('\n💡 COME FUNZIONA L\'ARBITRAGGIO:');
console.log('• Formula Tennis/Basket: (100/quota1) + (100/quota2)');
console.log('• Formula Calcio: (100/quota1) + (100/quotaX) + (100/quota2)');
console.log('• Se il risultato è < 100%, c\'è un\'opportunità di profitto');
console.log('• Più basso è il numero, maggiore è il profitto garantito');

console.log('\n✅ Test completato!'); 