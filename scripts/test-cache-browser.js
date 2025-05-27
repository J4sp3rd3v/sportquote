// Test Cache Browser - Verifica localStorage
console.log('🧪 TEST CACHE BROWSER');
console.log('====================');

// Verifica se siamo nel browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('✅ Browser environment detected');
  
  // Controlla cache
  const cache = localStorage.getItem('realOddsCache');
  const lastUpdate = localStorage.getItem('realOddsLastUpdate');
  
  console.log('📦 Cache presente:', !!cache);
  console.log('📅 LastUpdate presente:', !!lastUpdate);
  
  if (cache) {
    try {
      const cacheData = JSON.parse(cache);
      const cacheKeys = Object.keys(cacheData);
      console.log('🔑 Chiavi cache:', cacheKeys.length);
      
      // Conta partite
      let totalMatches = 0;
      cacheKeys.forEach(key => {
        if (key.includes('/odds?') && Array.isArray(cacheData[key].data)) {
          totalMatches += cacheData[key].data.length;
        }
      });
      
      console.log('🏆 Partite totali in cache:', totalMatches);
      
      if (lastUpdate) {
        const updateTime = new Date(parseInt(lastUpdate));
        console.log('📅 Ultimo aggiornamento:', updateTime.toLocaleString('it-IT'));
      }
      
    } catch (error) {
      console.error('❌ Errore parsing cache:', error);
    }
  } else {
    console.log('⚠️ Nessuna cache trovata nel localStorage');
  }
  
} else {
  console.log('❌ Non siamo nel browser o localStorage non disponibile');
}

// Istruzioni per l'utente
console.log('\n📋 ISTRUZIONI:');
console.log('1. Apri questo script nella console del browser (F12)');
console.log('2. Verifica che ci siano partite in cache');
console.log('3. Se cache vuota, esegui: npm run update-odds');
console.log('4. Ricarica la pagina e ricontrolla'); 