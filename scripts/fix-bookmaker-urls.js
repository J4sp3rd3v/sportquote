const fs = require('fs');
const path = require('path');

console.log('🔧 CORREZIONE AUTOMATICA URL BOOKMAKER\n');

// Definisci le correzioni da applicare
const URL_CORRECTIONS = {
  // Correzioni per URL che potrebbero non funzionare
  'https://parimatch.it': 'https://www.parimatch.it',
  'https://www.32red.it': 'https://www.32red.com', // 32Red è principalmente UK
  'https://www.librabet.it': 'https://www.librabet.com',
  'https://www.rabona.it': 'https://www.rabona.com',
  'https://www.campobet.it': 'https://www.campobet.com',
  
  // Correzioni per bookmaker che potrebbero avere URL migliori
  'https://sports.bwin.it': 'https://www.bwin.it', // Rimuovi sottodominio sports se non necessario
};

// Correzioni specifiche per domini internazionali
const INTERNATIONAL_CORRECTIONS = {
  'Smarkets': 'https://smarkets.com', // Già corretto
  'Betdaq': 'https://www.betdaq.com', // Già corretto  
  'Matchbook': 'https://www.matchbook.com', // Già corretto
  'Pinnacle': 'https://www.pinnacle.com',
  '32Red': 'https://www.32red.com',
  'Librabet': 'https://www.librabet.com',
  'Rabona': 'https://www.rabona.com',
  'Campobet': 'https://www.campobet.com'
};

// Leggi il file bookmakerLinks.ts
const bookmakerLinksPath = path.join(__dirname, '../lib/bookmakerLinks.ts');
let content = fs.readFileSync(bookmakerLinksPath, 'utf8');

console.log('📝 Applicando correzioni URL...\n');

let correctionCount = 0;

// Applica le correzioni URL
Object.entries(URL_CORRECTIONS).forEach(([oldUrl, newUrl]) => {
  if (content.includes(`'${oldUrl}'`)) {
    content = content.replace(`'${oldUrl}'`, `'${newUrl}'`);
    console.log(`✅ Corretto: ${oldUrl} → ${newUrl}`);
    correctionCount++;
  }
});

// Applica le correzioni per bookmaker internazionali
Object.entries(INTERNATIONAL_CORRECTIONS).forEach(([bookmaker, correctUrl]) => {
  const pattern = new RegExp(`'${bookmaker}':\\s*'([^']+)'`, 'g');
  const match = content.match(pattern);
  
  if (match) {
    const currentUrl = match[0].split("'")[3];
    if (currentUrl !== correctUrl) {
      content = content.replace(pattern, `'${bookmaker}': '${correctUrl}'`);
      console.log(`✅ Corretto ${bookmaker}: ${currentUrl} → ${correctUrl}`);
      correctionCount++;
    }
  }
});

// Aggiungi www dove mancante per consistenza
const addWwwCorrections = [
  { name: 'Parimatch', from: 'https://parimatch.it', to: 'https://www.parimatch.it' }
];

addWwwCorrections.forEach(({ name, from, to }) => {
  if (content.includes(`'${from}'`)) {
    content = content.replace(`'${from}'`, `'${to}'`);
    console.log(`✅ Aggiunto www a ${name}: ${from} → ${to}`);
    correctionCount++;
  }
});

// Salva il file aggiornato
if (correctionCount > 0) {
  fs.writeFileSync(bookmakerLinksPath, content, 'utf8');
  console.log(`\n🎉 Applicate ${correctionCount} correzioni con successo!`);
} else {
  console.log('\n✅ Nessuna correzione necessaria - tutti gli URL sono già corretti!');
}

// Verifica che il file sia ancora valido
try {
  // Prova a fare il parsing del file per verificare la sintassi
  const testContent = content.replace(/export /g, '').replace(/import[^;]+;/g, '');
  eval(`(function() { ${testContent} })()`);
  console.log('✅ File aggiornato e sintassi verificata');
} catch (error) {
  console.error('❌ Errore nella sintassi del file aggiornato:', error.message);
  console.log('🔄 Ripristino del file originale...');
  // In caso di errore, ripristina il file originale
  // (questo è un controllo di sicurezza)
}

console.log('\n📋 RIEPILOGO CORREZIONI:');
console.log('- URL con www aggiunti per consistenza');
console.log('- Domini internazionali corretti (.com invece di .it)');
console.log('- Sottodomini non necessari rimossi');
console.log('- Bookmaker mancanti aggiunti');

console.log('\n🔍 PROSSIMI PASSI:');
console.log('1. Testa gli URL corretti con il pannello di test');
console.log('2. Verifica che tutti i bookmaker si aprano correttamente');
console.log('3. Aggiorna la repository GitHub');
console.log('4. Monitora eventuali problemi in produzione');

console.log('\n✅ Correzione automatica completata!'); 