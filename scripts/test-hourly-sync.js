// Script di test per il sistema di aggiornamento sincronizzato con l'orologio
console.log('🕐 Test Sistema Aggiornamento Sincronizzato\n');

function testHourlySyncSystem() {
  const now = new Date();
  
  console.log(`⏰ Ora attuale: ${now.toLocaleString('it-IT')}`);
  console.log(`📅 Data: ${now.toLocaleDateString('it-IT')}`);
  console.log(`🕐 Ora: ${now.toLocaleTimeString('it-IT')}\n`);

  // Calcola la prossima ora intera
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  
  const timeUntilNextHour = nextHour.getTime() - now.getTime();
  const minutesUntilNextHour = Math.floor(timeUntilNextHour / (1000 * 60));
  const secondsUntilNextHour = Math.floor((timeUntilNextHour % (1000 * 60)) / 1000);

  console.log('🎯 SISTEMA SINCRONIZZATO:');
  console.log(`✅ Prossimo aggiornamento: ${nextHour.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`);
  console.log(`⏱️  Tempo rimanente: ${minutesUntilNextHour}m ${secondsUntilNextHour}s`);
  console.log(`📊 Millisecondi: ${timeUntilNextHour}ms\n`);

  // Simula una giornata di aggiornamenti
  console.log('📋 PROGRAMMA AGGIORNAMENTI GIORNALIERI:');
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  
  for (let hour = 0; hour < 24; hour++) {
    const updateTime = new Date(startOfDay);
    updateTime.setHours(hour, 0, 0, 0);
    
    const isPast = updateTime.getTime() < now.getTime();
    const isCurrent = hour === now.getHours();
    const isNext = hour === nextHour.getHours();
    
    let status = '';
    if (isPast) status = '✅ Completato';
    else if (isCurrent) status = '🔄 In corso';
    else if (isNext) status = '⏰ Prossimo';
    else status = '⏳ Programmato';
    
    console.log(`   ${updateTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${status}`);
  }

  console.log('\n💡 VANTAGGI SISTEMA SINCRONIZZATO:');
  console.log('• Aggiornamenti prevedibili a orari fissi');
  console.log('• Tutti gli utenti ricevono aggiornamenti contemporaneamente');
  console.log('• Facile da monitorare e debuggare');
  console.log('• Ottimizzazione cache e risorse server');
  
  console.log('\n🔄 ESEMPI PRATICI:');
  console.log('• Se ti connetti alle 16:30, prossimo aggiornamento alle 17:00');
  console.log('• Se ti connetti alle 16:59, prossimo aggiornamento tra 1 minuto');
  console.log('• Se ti connetti alle 17:00, aggiornamento immediato + prossimo alle 18:00');

  // Test calcolo tempo rimanente per diversi orari
  console.log('\n🧪 TEST CALCOLI TEMPO RIMANENTE:');
  
  const testTimes = [
    { hour: 14, minute: 30 }, // 14:30 -> prossimo alle 15:00
    { hour: 16, minute: 45 }, // 16:45 -> prossimo alle 17:00  
    { hour: 23, minute: 55 }, // 23:55 -> prossimo alle 00:00
    { hour: 0, minute: 15 },  // 00:15 -> prossimo alle 01:00
  ];

  testTimes.forEach(time => {
    const testDate = new Date(now);
    testDate.setHours(time.hour, time.minute, 0, 0);
    
    const testNextHour = new Date(testDate);
    testNextHour.setHours(testDate.getHours() + 1, 0, 0, 0);
    
    const testTimeRemaining = testNextHour.getTime() - testDate.getTime();
    const testMinutes = Math.floor(testTimeRemaining / (1000 * 60));
    const testSeconds = Math.floor((testTimeRemaining % (1000 * 60)) / 1000);
    
    console.log(`   ${testDate.toLocaleTimeString('it-IT')} -> prossimo alle ${testNextHour.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} (${testMinutes}m ${testSeconds}s)`);
  });
}

// Test formattazione countdown per orari fissi
function testHourlyCountdownFormatting() {
  console.log('\n⏱️  TEST FORMATTAZIONE COUNTDOWN ORARIO:\n');

  const testCases = [
    { minutes: 59, seconds: 30, description: 'Quasi un\'ora intera' },
    { minutes: 30, seconds: 0, description: 'Metà ora' },
    { minutes: 15, seconds: 45, description: 'Un quarto d\'ora' },
    { minutes: 5, seconds: 0, description: 'Cinque minuti' },
    { minutes: 1, seconds: 30, description: 'Ultimo minuto' },
    { minutes: 0, seconds: 30, description: 'Ultimi secondi' },
    { minutes: 0, seconds: 0, description: 'Aggiornamento in corso' }
  ];

  testCases.forEach(testCase => {
    const totalMs = (testCase.minutes * 60 + testCase.seconds) * 1000;
    let formatted;
    
    if (totalMs === 0) {
      formatted = 'In corso...';
    } else {
      const hours = Math.floor(totalMs / (1000 * 60 * 60));
      const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

      if (hours > 0) {
        formatted = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        formatted = `${minutes}m ${seconds}s`;
      } else {
        formatted = `${seconds}s`;
      }
    }
    
    console.log(`${testCase.description}: "${formatted}"`);
  });
}

// Esegui i test
testHourlySyncSystem();
testHourlyCountdownFormatting();

console.log('\n✅ Test sistema sincronizzato completato!');
console.log('\n🎯 RIEPILOGO MODIFICHE:');
console.log('• Aggiornamenti sincronizzati con l\'orologio (ogni ora alle :00)');
console.log('• Calcolo tempo rimanente basato sulla prossima ora intera');
console.log('• Tutti gli utenti ricevono aggiornamenti contemporaneamente');
console.log('• Sistema prevedibile e facile da monitorare'); 