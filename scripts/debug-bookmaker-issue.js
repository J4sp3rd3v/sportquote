// Script per debuggare il problema "Bookmaker non trovato"
// Simula il comportamento del sistema per identificare il problema

// Lista bookmaker dai dati mock (solo 13)
const mockBookmakers = [
  'Sisal', 'Betflag', 'Betaland', 'Vincitu', 'Stanleybet',
  'William Hill', 'Betclic', 'Betway', 'NetBet', 'Marathonbet',
  '888sport', 'Betsson', 'Betfred'
];

// Lista bookmaker configurati in bookmakerLinks.ts (54)
const configuredBookmakers = [
  // TOP 5 bookmaker italiani più popolari
  'Bet365', 'Sisal', 'Snai', 'Eurobet', 'Lottomatica',
  
  // Bookmaker italiani verificati e funzionanti
  'Betflag', 'Betaland', 'Vincitu', 'Stanleybet', 'Better',
  'Goldbet', 'Planetwin365', 'Admiral', 'Cplay',
  
  // Bookmaker internazionali con licenza italiana
  'William Hill', 'Betfair', 'Unibet', 'Bwin', 'Betclic',
  'Betway', 'NetBet', 'Marathonbet', '888sport', 'Betsson',
  'Betfred', 'Nordicbet', 'Betsafe', 'Interwetten', 'Tipico',
  'Sportingbet', 'Betvictor', 'Sky Bet', '10Bet', 'Bet-at-home',
  
  // Bookmaker specializzati
  'Pinnacle', 'Betano', 'Winamax', 'LeoVegas',
  
  // Bookmaker UK/Internazionali
  'Ladbrokes', 'Paddy Power', 'Coral',
  
  // Bookmaker francesi
  'Winamax Fr', 'Parions Sport Fr', 'ZEbet', 'PMU',
  
  // Bookmaker tedeschi
  'Winamax De', 'Tipico De', 'Bet3000', 'Mybet',
  
  // Bookmaker internazionali
  '1xBet', '22Bet', 'Parimatch', 'Melbet', 'Betwinner'
];

console.log('🔍 DEBUG: Problema "Bookmaker non trovato"\n');

console.log('📊 STATISTICHE:');
console.log(`• Bookmaker nei dati mock: ${mockBookmakers.length}`);
console.log(`• Bookmaker configurati: ${configuredBookmakers.length}`);

console.log('\n✅ BOOKMAKER PRESENTI IN ENTRAMBE LE LISTE:');
const presentInBoth = mockBookmakers.filter(name => 
  configuredBookmakers.includes(name)
);
presentInBoth.forEach(name => {
  console.log(`  ✓ ${name}`);
});

console.log('\n❌ BOOKMAKER SOLO NEI DATI MOCK (potrebbero causare errori):');
const onlyInMock = mockBookmakers.filter(name => 
  !configuredBookmakers.includes(name)
);
onlyInMock.forEach(name => {
  console.log(`  ✗ ${name} - NON configurato in bookmakerLinks.ts`);
});

console.log('\n🆕 BOOKMAKER SOLO IN CONFIGURAZIONE (non usati nelle quote):');
const onlyInConfig = configuredBookmakers.filter(name => 
  !mockBookmakers.includes(name)
);
onlyInConfig.slice(0, 10).forEach(name => {
  console.log(`  + ${name} - Disponibile ma non usato`);
});
if (onlyInConfig.length > 10) {
  console.log(`  ... e altri ${onlyInConfig.length - 10} bookmaker`);
}

console.log('\n🎯 ANALISI DEL PROBLEMA:');
if (onlyInMock.length === 0) {
  console.log('✅ Tutti i bookmaker nei dati mock sono configurati correttamente!');
  console.log('   Il problema potrebbe essere altrove...');
} else {
  console.log(`❌ ${onlyInMock.length} bookmaker nei dati mock NON sono configurati!`);
  console.log('   Questi causano il messaggio "Bookmaker non trovato"');
}

console.log('\n💡 SOLUZIONI:');
console.log('1. Verificare che tutti i bookmaker nei dati mock siano in bookmakerLinks.ts');
console.log('2. Controllare la normalizzazione dei nomi (case-sensitive, spazi, ecc.)');
console.log('3. Aggiungere log di debug per vedere quale bookmaker causa l\'errore');

console.log('\n🧪 TEST FUNZIONE getBookmakerInfo:');
// Simula la funzione getBookmakerInfo
function testGetBookmakerInfo(bookmakerName) {
  const isConfigured = configuredBookmakers.includes(bookmakerName);
  const baseUrl = isConfigured 
    ? `https://www.${bookmakerName.toLowerCase().replace(/\s+/g, '')}.it`
    : `https://www.google.com/search?q=${encodeURIComponent(bookmakerName)}`;
  
  return {
    isSupported: isConfigured,
    baseUrl: baseUrl,
    hasDirectLink: isConfigured
  };
}

mockBookmakers.forEach(name => {
  const info = testGetBookmakerInfo(name);
  const status = info.isSupported ? '✅' : '❌';
  console.log(`${status} ${name} → ${info.isSupported ? 'SUPPORTATO' : 'NON SUPPORTATO'}`);
  if (!info.isSupported) {
    console.log(`    Fallback URL: ${info.baseUrl}`);
  }
});

console.log('\n🔧 RACCOMANDAZIONI:');
console.log('1. Aggiungere debug nel browser per vedere quale bookmaker viene cliccato');
console.log('2. Verificare che SmartBookmakerHandler riceva il nome corretto');
console.log('3. Controllare se il problema è nella normalizzazione del nome');
console.log('4. Testare con un bookmaker specifico per isolare il problema'); 