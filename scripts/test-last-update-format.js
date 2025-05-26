// Script di test per la formattazione dell'ultimo aggiornamento
console.log('🕒 Test Formattazione Ultimo Aggiornamento\n');

// Simula diverse date per testare la formattazione
function testLastUpdateFormatting() {
  const now = new Date();
  
  // Test cases con diverse date
  const testCases = [
    {
      name: 'Appena aggiornato (30 secondi fa)',
      date: new Date(now.getTime() - 30 * 1000)
    },
    {
      name: '5 minuti fa',
      date: new Date(now.getTime() - 5 * 60 * 1000)
    },
    {
      name: '30 minuti fa',
      date: new Date(now.getTime() - 30 * 60 * 1000)
    },
    {
      name: '2 ore fa',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      name: '12 ore fa',
      date: new Date(now.getTime() - 12 * 60 * 60 * 1000)
    },
    {
      name: 'Ieri',
      date: new Date(now.getTime() - 25 * 60 * 60 * 1000)
    },
    {
      name: '3 giorni fa',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      name: 'Mai eseguito',
      date: null
    }
  ];

  console.log('📅 Test formattazione date:\n');

  testCases.forEach(testCase => {
    const formatted = formatLastUpdate(testCase.date);
    console.log(`${testCase.name}: "${formatted}"`);
  });
}

// Funzione di formattazione (copia della logica dal servizio)
function formatLastUpdate(lastUpdate) {
  if (!lastUpdate) {
    return 'Mai eseguito';
  }

  const now = new Date();
  const diffMs = now.getTime() - lastUpdate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Appena aggiornato';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minuti fa`;
  } else if (diffHours < 24) {
    return `${diffHours} ore fa`;
  } else if (diffDays === 1) {
    return 'Ieri alle ' + lastUpdate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  } else {
    return lastUpdate.toLocaleString('it-IT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

// Test countdown formattazione (per aggiornamenti ogni ora)
function testCountdownFormatting() {
  console.log('\n⏱️  Test formattazione countdown:\n');

  const testTimes = [
    { name: '59 minuti e 30 secondi', ms: 59 * 60 * 1000 + 30 * 1000 },
    { name: '30 minuti', ms: 30 * 60 * 1000 },
    { name: '5 minuti e 15 secondi', ms: 5 * 60 * 1000 + 15 * 1000 },
    { name: '45 secondi', ms: 45 * 1000 },
    { name: '0 secondi (in corso)', ms: 0 },
    { name: 'Non programmato', ms: null }
  ];

  testTimes.forEach(test => {
    const formatted = formatTimeToNextUpdate(test.ms);
    console.log(`${test.name}: "${formatted}"`);
  });
}

function formatTimeToNextUpdate(timeRemaining) {
  if (timeRemaining === null) {
    return 'Non programmato';
  }

  if (timeRemaining === 0) {
    return 'In corso...';
  }

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Esegui i test
testLastUpdateFormatting();
testCountdownFormatting();

console.log('\n✅ Test formattazione completato!');
console.log('\n💡 Caratteristiche implementate:');
console.log('• Aggiornamento automatico ogni ora (60 minuti)');
console.log('• Formattazione intelligente dell\'ultimo aggiornamento');
console.log('• Countdown con ore, minuti e secondi');
console.log('• Visualizzazione user-friendly delle date'); 