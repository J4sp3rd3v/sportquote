// Bookmaker disponibili (copiati da mockData.ts)
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

console.log('🧪 Test Matching Bookmaker\n');

// Simula la funzione getBookmakerInfo dal componente MatchDetails
const getBookmakerInfo = (bookmakerName) => {
  console.log(`Cercando: "${bookmakerName}"`);
  
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
  
  console.log(`❌ Non trovato`);
  return undefined;
};

// Test con nomi esatti
console.log('=== Test Nomi Esatti ===');
const exactNames = ['Sisal', 'Betflag', 'William Hill'];
exactNames.forEach(name => {
  getBookmakerInfo(name);
  console.log('');
});

// Test con nomi case-insensitive
console.log('=== Test Case-Insensitive ===');
const caseNames = ['sisal', 'BETFLAG', 'william hill'];
caseNames.forEach(name => {
  getBookmakerInfo(name);
  console.log('');
});

// Test con nomi parziali
console.log('=== Test Match Parziali ===');
const partialNames = ['Bet365', 'Eurobet', 'Lottomatica'];
partialNames.forEach(name => {
  getBookmakerInfo(name);
  console.log('');
});

// Mostra tutti i bookmaker disponibili
console.log('=== Bookmaker Disponibili ===');
bookmakers.forEach((b, i) => {
  console.log(`${i + 1}. ${b.name} (${b.website})`);
});

console.log(`\n📊 Totale bookmaker: ${bookmakers.length}`); 