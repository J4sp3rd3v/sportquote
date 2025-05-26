// Simula i dati che arrivano al componente MatchDetails
const bookmakers = [
  { id: '1', name: 'Sisal', logo: '/logos/sisal.png', rating: 4.8, bonus: 'Fino a €250', website: 'sisal.com', isPopular: true, country: 'Italia' },
  { id: '2', name: 'Betflag', logo: '/logos/betflag.png', rating: 4.2, bonus: 'Fino a €100', website: 'betflag.it', isPopular: true, country: 'Italia' },
  { id: '3', name: 'Betaland', logo: '/logos/betaland.png', rating: 4.1, bonus: 'Fino a €200', website: 'betaland.it', isPopular: true, country: 'Italia' },
  { id: '4', name: 'Vincitu', logo: '/logos/vincitu.png', rating: 4.0, bonus: 'Fino a €150', website: 'vincitu.it', isPopular: true, country: 'Italia' },
  { id: '5', name: 'Stanleybet', logo: '/logos/stanleybet.png', rating: 3.9, bonus: 'Fino a €250', website: 'stanleybet.it', isPopular: true, country: 'Italia' },
  { id: '6', name: 'William Hill', logo: '/logos/williamhill.png', rating: 4.4, bonus: 'Fino a €50', website: 'williamhill.it', isPopular: true, country: 'UK' },
  { id: '7', name: 'Betclic', logo: '/logos/betclic.png', rating: 4.3, bonus: 'Fino a €100', website: 'betclic.it', isPopular: true, country: 'Francia' },
  { id: '8', name: 'Betway', logo: '/logos/betway.png', rating: 4.2, bonus: 'Fino a €30', website: 'betway.it', isPopular: true, country: 'Malta' },
  { id: '9', name: 'NetBet', logo: '/logos/netbet.png', rating: 4.1, bonus: 'Fino a €50', website: 'netbet.it', isPopular: true, country: 'Malta' },
  { id: '10', name: 'Marathonbet', logo: '/logos/marathonbet.png', rating: 4.0, bonus: 'Fino a €100', website: 'marathonbet.it', isPopular: true, country: 'Malta' },
  { id: '11', name: '888sport', logo: '/logos/888sport.png', rating: 3.9, bonus: 'Fino a €100', website: '888sport.it', isPopular: true, country: 'Malta' },
  { id: '12', name: 'Betsson', logo: '/logos/betsson.png', rating: 3.8, bonus: 'Fino a €100', website: 'betsson.it', isPopular: true, country: 'Malta' },
  { id: '13', name: 'Betfred', logo: '/logos/betfred.png', rating: 3.7, bonus: 'Fino a €50', website: 'betfred.it', isPopular: true, country: 'UK' }
];

// Simula le quote di una partita (come vengono generate in mockData.ts)
const sampleOdds = [
  { bookmaker: 'Sisal', home: 2.10, away: 3.40, draw: 3.20 },
  { bookmaker: 'Betflag', home: 2.15, away: 3.35, draw: 3.25 },
  { bookmaker: 'William Hill', home: 2.08, away: 3.45, draw: 3.18 },
  { bookmaker: 'Betclic', home: 2.12, away: 3.38, draw: 3.22 },
  { bookmaker: 'Betway', home: 2.09, away: 3.42, draw: 3.19 }
];

console.log('🔍 Debug MatchDetails Component\n');

// Simula la funzione getBookmakerInfo dal componente
const getBookmakerInfo = (bookmakerName) => {
  console.log(`🔍 Cercando bookmaker: "${bookmakerName}"`);
  
  // Cerca prima per nome esatto
  let found = bookmakers.find(b => b.name === bookmakerName);
  if (found) {
    console.log(`✅ Trovato per nome esatto: ${found.name}`);
    return found;
  }
  
  // Se non trovato, cerca per nome case-insensitive
  found = bookmakers.find(b => b.name.toLowerCase() === bookmakerName.toLowerCase());
  if (found) {
    console.log(`✅ Trovato case-insensitive: ${found.name}`);
    return found;
  }
  
  // Se ancora non trovato, cerca per nome parziale
  found = bookmakers.find(b => 
    b.name.toLowerCase().includes(bookmakerName.toLowerCase()) ||
    bookmakerName.toLowerCase().includes(b.name.toLowerCase())
  );
  if (found) {
    console.log(`✅ Trovato per match parziale: ${found.name}`);
    return found;
  }
  
  console.log(`❌ NON TROVATO!`);
  return undefined;
};

// Simula quello che succede nel componente quando si renderizza la tabella
console.log('=== Simulazione Rendering Tabella Quote ===\n');

sampleOdds.forEach((odds, index) => {
  console.log(`--- Riga ${index + 1} ---`);
  console.log(`Quote: ${odds.bookmaker} - Home: ${odds.home}, Away: ${odds.away}, Draw: ${odds.draw}`);
  
  const bookmaker = getBookmakerInfo(odds.bookmaker);
  
  if (bookmaker) {
    console.log(`✅ Bookmaker trovato: ${bookmaker.name} (${bookmaker.website})`);
    console.log(`📊 Rating: ${bookmaker.rating}, Bonus: ${bookmaker.bonus}`);
  } else {
    console.log(`❌ ERRORE: Bookmaker "${odds.bookmaker}" non trovato nella lista!`);
    console.log(`🔧 Questo causerebbe l'errore "Bookmaker non trovato"`);
  }
  
  console.log('');
});

// Verifica che tutti i nomi nelle quote esistano nella lista bookmaker
console.log('=== Verifica Consistenza Dati ===\n');

const bookmakerNamesInOdds = [...new Set(sampleOdds.map(o => o.bookmaker))];
const bookmakerNamesInList = bookmakers.map(b => b.name);

console.log('Bookmaker nelle quote:', bookmakerNamesInOdds);
console.log('Bookmaker nella lista:', bookmakerNamesInList);

const missingBookmakers = bookmakerNamesInOdds.filter(name => 
  !bookmakerNamesInList.includes(name)
);

if (missingBookmakers.length > 0) {
  console.log(`❌ PROBLEMA: Questi bookmaker sono nelle quote ma non nella lista:`, missingBookmakers);
} else {
  console.log('✅ Tutti i bookmaker nelle quote esistono nella lista');
}

console.log('\n📋 Riassunto:');
console.log(`- Bookmaker nella lista: ${bookmakers.length}`);
console.log(`- Bookmaker nelle quote: ${bookmakerNamesInOdds.length}`);
console.log(`- Bookmaker mancanti: ${missingBookmakers.length}`); 