const fs = require('fs');
const path = require('path');

// Simula l'import del modulo bookmakerLinks
const bookmakerLinksPath = path.join(__dirname, '../lib/bookmakerLinks.ts');
const mockDataPath = path.join(__dirname, '../data/mockData.ts');

console.log('🔍 ANALISI COMPLETA URL BOOKMAKER\n');

// Leggi il contenuto dei file
const bookmakerLinksContent = fs.readFileSync(bookmakerLinksPath, 'utf8');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Estrai gli URL da bookmakerLinks.ts
const urlMatches = bookmakerLinksContent.match(/'([^']+)':\s*'(https?:\/\/[^']+)'/g);
const bookmakerUrls = {};

if (urlMatches) {
  urlMatches.forEach(match => {
    const [, name, url] = match.match(/'([^']+)':\s*'(https?:\/\/[^']+)'/);
    bookmakerUrls[name] = url;
  });
}

// Estrai i bookmaker da mockData.ts
const mockMatches = mockDataContent.match(/name:\s*'([^']+)'[^}]*website:\s*'([^']+)'/g);
const mockUrls = {};

if (mockMatches) {
  mockMatches.forEach(match => {
    const [, name, website] = match.match(/name:\s*'([^']+)'[^}]*website:\s*'([^']+)'/);
    mockUrls[name] = website;
  });
}

console.log('📊 STATISTICHE GENERALI:');
console.log(`- Bookmaker in bookmakerLinks.ts: ${Object.keys(bookmakerUrls).length}`);
console.log(`- Bookmaker in mockData.ts: ${Object.keys(mockUrls).length}`);
console.log('');

// Analizza discrepanze
console.log('🔍 ANALISI DISCREPANZE URL:\n');

const issues = [];

Object.keys(mockUrls).forEach(name => {
  const mockUrl = mockUrls[name];
  const configUrl = bookmakerUrls[name];
  
  if (configUrl) {
    // Normalizza gli URL per il confronto
    const normalizedMock = mockUrl.replace(/^https?:\/\/(www\.)?/, '');
    const normalizedConfig = configUrl.replace(/^https?:\/\/(www\.)?/, '');
    
    if (normalizedMock !== normalizedConfig) {
      issues.push({
        type: 'URL_MISMATCH',
        name,
        mockUrl,
        configUrl,
        severity: 'HIGH'
      });
    }
  } else {
    issues.push({
      type: 'MISSING_CONFIG',
      name,
      mockUrl,
      configUrl: null,
      severity: 'MEDIUM'
    });
  }
});

// Analizza URL potenzialmente problematici
console.log('⚠️  PROBLEMI IDENTIFICATI:\n');

issues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue.name}`);
  console.log(`   Tipo: ${issue.type}`);
  console.log(`   Severità: ${issue.severity}`);
  
  if (issue.type === 'URL_MISMATCH') {
    console.log(`   Mock: ${issue.mockUrl}`);
    console.log(`   Config: ${issue.configUrl}`);
  } else if (issue.type === 'MISSING_CONFIG') {
    console.log(`   Mock: ${issue.mockUrl}`);
    console.log(`   Config: MANCANTE`);
  }
  console.log('');
});

// Analizza pattern URL sospetti
console.log('🚨 URL POTENZIALMENTE PROBLEMATICI:\n');

const suspiciousPatterns = [
  { pattern: /\.it$/, description: 'Dominio .it per bookmaker internazionali' },
  { pattern: /^[^.]+\.it$/, description: 'Dominio .it senza www' },
  { pattern: /sports?\./i, description: 'Sottodominio sports' },
  { pattern: /\/[^\/]+$/, description: 'Path specifico' }
];

Object.entries(bookmakerUrls).forEach(([name, url]) => {
  suspiciousPatterns.forEach(({ pattern, description }) => {
    if (pattern.test(url)) {
      console.log(`⚠️  ${name}: ${url}`);
      console.log(`   Motivo: ${description}`);
      console.log('');
    }
  });
});

// Suggerimenti di correzione
console.log('💡 SUGGERIMENTI DI CORREZIONE:\n');

const corrections = [
  {
    name: 'Bwin',
    current: 'https://sports.bwin.it',
    suggested: 'https://www.bwin.it',
    reason: 'Sottodominio sports potrebbe non essere necessario'
  },
  {
    name: 'Parimatch',
    current: 'https://parimatch.it',
    suggested: 'https://www.parimatch.it',
    reason: 'Aggiungere www per consistenza'
  }
];

corrections.forEach(correction => {
  if (bookmakerUrls[correction.name] === correction.current) {
    console.log(`🔧 ${correction.name}:`);
    console.log(`   Attuale: ${correction.current}`);
    console.log(`   Suggerito: ${correction.suggested}`);
    console.log(`   Motivo: ${correction.reason}`);
    console.log('');
  }
});

// Riepilogo finale
console.log('📋 RIEPILOGO FINALE:\n');
console.log(`✅ URL corretti: ${Object.keys(bookmakerUrls).length - issues.length}`);
console.log(`⚠️  Problemi trovati: ${issues.length}`);
console.log(`🔧 Correzioni suggerite: ${corrections.length}`);

if (issues.length === 0) {
  console.log('\n🎉 Tutti gli URL sembrano corretti!');
} else {
  console.log('\n📝 Azioni raccomandate:');
  console.log('1. Correggere le discrepanze URL tra mock e config');
  console.log('2. Aggiungere configurazioni mancanti');
  console.log('3. Verificare manualmente gli URL sospetti');
  console.log('4. Testare tutti gli URL con il pannello di test');
}

console.log('\n✅ Analisi completata!'); 