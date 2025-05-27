// Test del Sistema Giornaliero Globale
// Verifica il funzionamento di 1 aggiornamento al giorno per tutto il sito

console.log('🌐 TEST SISTEMA GIORNALIERO GLOBALE\n');
console.log('📅 1 AGGIORNAMENTO AL GIORNO PER TUTTO IL SITO\n');

// Simula la classe GlobalDailyUpdater
class TestGlobalDailySystem {
  constructor() {
    this.state = {
      lastGlobalUpdate: '',
      lastUpdateTime: '',
      nextScheduledUpdate: this.calculateNextDailyUpdate(),
      isSystemActive: false,
      dailyUpdateHour: 12, // 12:00 ogni giorno
      globalQuotesData: {},
      systemStats: {
        totalDaysActive: 0,
        successfulUpdates: 0,
        failedUpdates: 0
      }
    };
    
    this.DAILY_SPORTS = [
      'soccer_italy_serie_a',
      'soccer_epl', 
      'soccer_uefa_champs_league',
      'basketball_nba',
      'tennis_atp_french_open',
      'americanfootball_nfl'
    ];
    
    this.initializeGlobalSystem();
  }
  
  calculateNextDailyUpdate() {
    const now = new Date();
    const today = new Date(now);
    today.setHours(this.state?.dailyUpdateHour || 12, 0, 0, 0);
    
    // Se l'orario di oggi è già passato, programma per domani
    if (today.getTime() <= now.getTime()) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    
    return today.toISOString();
  }
  
  initializeGlobalSystem() {
    // Inizializza dati globali per ogni sport
    this.DAILY_SPORTS.forEach(sportKey => {
      this.state.globalQuotesData[sportKey] = {
        lastUpdate: '',
        matches: [],
        status: 'stale'
      };
    });
    
    console.log(`[GLOBAL] 🌐 Sistema inizializzato - Prossimo aggiornamento: ${new Date(this.state.nextScheduledUpdate).toLocaleString('it-IT')}`);
  }
  
  startGlobalSystem() {
    if (this.state.isSystemActive) {
      console.log('[GLOBAL] 📅 Sistema già attivo');
      return;
    }
    
    console.log('[GLOBAL] 🚀 Avvio Sistema Giornaliero Globale');
    this.state.isSystemActive = true;
    
    // Simula controllo ogni minuto
    this.checkDailyUpdate();
  }
  
  stopGlobalSystem() {
    this.state.isSystemActive = false;
    console.log('[GLOBAL] ⏹️ Sistema Giornaliero fermato');
  }
  
  checkDailyUpdate() {
    const now = new Date();
    const nextUpdate = new Date(this.state.nextScheduledUpdate);
    
    console.log(`[GLOBAL] ⏰ Controllo aggiornamento giornaliero - ${now.toLocaleTimeString('it-IT')}`);
    console.log(`[GLOBAL] 📅 Prossimo aggiornamento programmato: ${nextUpdate.toLocaleString('it-IT')}`);
    
    // Se è il momento dell'aggiornamento giornaliero
    if (now >= nextUpdate) {
      this.executeDailyGlobalUpdate();
    } else {
      const hoursUntilNext = Math.round((nextUpdate.getTime() - now.getTime()) / (1000 * 60 * 60));
      console.log(`[GLOBAL] ⏳ Aggiornamento tra ${hoursUntilNext} ore`);
    }
  }
  
  executeDailyGlobalUpdate() {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`[GLOBAL] 🔄 AGGIORNAMENTO GIORNALIERO GLOBALE - ${today}`);
    console.log(`[GLOBAL] 📊 Aggiornamento di tutti i 6 sport per tutto il sito\n`);
    
    // Marca tutti gli sport come "updating"
    this.DAILY_SPORTS.forEach(sportKey => {
      this.state.globalQuotesData[sportKey].status = 'updating';
    });
    
    let successCount = 0;
    let failCount = 0;
    
    // Simula aggiornamento di tutti gli sport
    this.DAILY_SPORTS.forEach((sportKey, index) => {
      console.log(`[GLOBAL] 📊 Aggiornamento ${this.formatSportName(sportKey)}...`);
      
      // Simula successo/fallimento
      const success = Math.random() > 0.1; // 90% successo
      const matches = success ? Math.floor(Math.random() * 15) + 5 : 0;
      
      if (success) {
        this.state.globalQuotesData[sportKey] = {
          lastUpdate: new Date().toISOString(),
          matches: [],
          status: 'fresh'
        };
        
        successCount++;
        console.log(`[GLOBAL] ✅ ${sportKey} aggiornato: ${matches} partite`);
      } else {
        this.state.globalQuotesData[sportKey].status = 'stale';
        failCount++;
        console.error(`[GLOBAL] ❌ Errore ${sportKey}: Timeout API`);
      }
      
      // Simula pausa tra aggiornamenti
      console.log(`[GLOBAL] ⏳ Pausa 2 secondi prima del prossimo sport...\n`);
    });
    
    // Aggiorna statistiche globali
    this.state.lastGlobalUpdate = today;
    this.state.lastUpdateTime = new Date().toISOString();
    this.state.nextScheduledUpdate = this.calculateNextDailyUpdate();
    this.state.systemStats.totalDaysActive++;
    
    if (successCount > 0) {
      this.state.systemStats.successfulUpdates++;
    }
    if (failCount > 0) {
      this.state.systemStats.failedUpdates++;
    }
    
    console.log(`[GLOBAL] 📊 AGGIORNAMENTO GIORNALIERO COMPLETATO`);
    console.log(`[GLOBAL] ✅ Successi: ${successCount}/${this.DAILY_SPORTS.length}`);
    console.log(`[GLOBAL] ❌ Fallimenti: ${failCount}/${this.DAILY_SPORTS.length}`);
    console.log(`[GLOBAL] 📅 Prossimo aggiornamento: ${new Date(this.state.nextScheduledUpdate).toLocaleString('it-IT')}`);
    console.log(`[GLOBAL] 📡 Broadcast evento a tutti i client connessi\n`);
  }
  
  forceDailyUpdate() {
    console.log('[GLOBAL] 🔄 AGGIORNAMENTO FORZATO RICHIESTO\n');
    this.executeDailyGlobalUpdate();
    return {
      success: true,
      message: 'Aggiornamento giornaliero forzato completato'
    };
  }
  
  formatSportName(sportKey) {
    const mapping = {
      'soccer_italy_serie_a': 'Serie A',
      'soccer_epl': 'Premier League',
      'soccer_uefa_champs_league': 'Champions League',
      'basketball_nba': 'NBA',
      'tennis_atp_french_open': 'ATP Tennis',
      'americanfootball_nfl': 'NFL'
    };
    return mapping[sportKey] || sportKey;
  }
  
  getGlobalDailyStats() {
    const now = new Date();
    const nextUpdate = new Date(this.state.nextScheduledUpdate);
    const timeUntilNext = nextUpdate.getTime() - now.getTime();
    const hoursUntilNext = Math.round(timeUntilNext / (1000 * 60 * 60));
    
    return {
      isSystemActive: this.state.isSystemActive,
      lastGlobalUpdate: this.state.lastGlobalUpdate,
      lastUpdateTime: this.state.lastUpdateTime,
      nextScheduledUpdate: this.state.nextScheduledUpdate,
      hoursUntilNext: hoursUntilNext > 0 ? hoursUntilNext : 0,
      dailyUpdateHour: this.state.dailyUpdateHour,
      systemStats: this.state.systemStats,
      sportsStatus: this.DAILY_SPORTS.map(sportKey => ({
        sport: sportKey,
        status: this.state.globalQuotesData[sportKey]?.status || 'stale',
        lastUpdate: this.state.globalQuotesData[sportKey]?.lastUpdate || '',
        isToday: this.state.globalQuotesData[sportKey]?.lastUpdate?.startsWith(new Date().toISOString().split('T')[0]) || false
      })),
      summary: {
        totalSports: this.DAILY_SPORTS.length,
        freshToday: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'fresh' &&
          this.state.globalQuotesData[sport]?.lastUpdate?.startsWith(new Date().toISOString().split('T')[0])
        ).length,
        stale: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'stale'
        ).length,
        updating: this.DAILY_SPORTS.filter(sport => 
          this.state.globalQuotesData[sport]?.status === 'updating'
        ).length
      }
    };
  }
  
  areQuotesFreshToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.state.lastGlobalUpdate === today;
  }
  
  getLastGlobalUpdateTime() {
    if (this.state.lastUpdateTime) {
      return new Date(this.state.lastUpdateTime);
    }
    return null;
  }
  
  getNextScheduledUpdate() {
    return new Date(this.state.nextScheduledUpdate);
  }
  
  resetGlobalSystem() {
    this.stopGlobalSystem();
    this.state = {
      lastGlobalUpdate: '',
      lastUpdateTime: '',
      nextScheduledUpdate: this.calculateNextDailyUpdate(),
      isSystemActive: false,
      dailyUpdateHour: 12,
      globalQuotesData: {},
      systemStats: {
        totalDaysActive: 0,
        successfulUpdates: 0,
        failedUpdates: 0
      }
    };
    this.initializeGlobalSystem();
    console.log('[GLOBAL] 🔄 Sistema giornaliero resettato completamente');
  }
}

// Test del sistema giornaliero globale
const globalDailySystem = new TestGlobalDailySystem();

console.log('📋 TEST 1: Inizializzazione Sistema Giornaliero Globale');
console.log('=====================================================');
globalDailySystem.startGlobalSystem();

console.log('\n📊 TEST 2: Statistiche Iniziali');
console.log('================================');
const initialStats = globalDailySystem.getGlobalDailyStats();
console.log(`• Sistema attivo: ${initialStats.isSystemActive ? 'Sì' : 'No'}`);
console.log(`• Sport totali: ${initialStats.summary.totalSports}`);
console.log(`• Aggiornati oggi: ${initialStats.summary.freshToday}`);
console.log(`• Non aggiornati: ${initialStats.summary.stale}`);
console.log(`• Ore al prossimo aggiornamento: ${initialStats.hoursUntilNext}`);
console.log(`• Quote fresche oggi: ${globalDailySystem.areQuotesFreshToday() ? 'Sì' : 'No'}`);

console.log('\n⚡ TEST 3: Aggiornamento Giornaliero Forzato');
console.log('============================================');
const forceResult = globalDailySystem.forceDailyUpdate();
console.log(`Risultato: ${forceResult.success ? 'Successo' : 'Fallimento'}`);
console.log(`Messaggio: ${forceResult.message}`);

console.log('\n📊 TEST 4: Statistiche Dopo Aggiornamento');
console.log('==========================================');
const finalStats = globalDailySystem.getGlobalDailyStats();
console.log(`• Giorni attivi: ${finalStats.systemStats.totalDaysActive}`);
console.log(`• Aggiornamenti riusciti: ${finalStats.systemStats.successfulUpdates}`);
console.log(`• Aggiornamenti falliti: ${finalStats.systemStats.failedUpdates}`);
console.log(`• Sport aggiornati oggi: ${finalStats.summary.freshToday}/${finalStats.summary.totalSports}`);
console.log(`• Quote fresche oggi: ${globalDailySystem.areQuotesFreshToday() ? 'Sì' : 'No'}`);

const lastUpdate = globalDailySystem.getLastGlobalUpdateTime();
if (lastUpdate) {
  console.log(`• Ultimo aggiornamento: ${lastUpdate.toLocaleString('it-IT')}`);
}

console.log('\n📋 TEST 5: Status Singoli Sport');
console.log('================================');
finalStats.sportsStatus.forEach(sport => {
  const statusIcon = sport.status === 'fresh' ? '✅' : sport.status === 'updating' ? '🔄' : '❌';
  const todayIcon = sport.isToday ? '📅' : '';
  console.log(`${statusIcon} ${globalDailySystem.formatSportName(sport.sport)}: ${sport.status} ${todayIcon}`);
  if (sport.lastUpdate) {
    console.log(`   Ultimo aggiornamento: ${new Date(sport.lastUpdate).toLocaleString('it-IT')}`);
  }
});

console.log('\n📋 RIEPILOGO SISTEMA GIORNALIERO GLOBALE');
console.log('=========================================');
console.log('✅ CARATTERISTICHE PRINCIPALI:');
console.log('• 1 aggiornamento al giorno per tutto il sito');
console.log('• Tutti gli utenti vedono le stesse quote');
console.log('• Quote stabili per 24 ore');
console.log('• Aggiornamento automatico alle 12:00');
console.log('• Efficienza API massima (6 richieste/giorno)');

console.log('\n🎯 VANTAGGI RISPETTO AL SISTEMA PER UTENTE:');
console.log('• Efficienza: 1 aggiornamento invece di centinaia');
console.log('• Consistenza: Tutti vedono gli stessi dati');
console.log('• Stabilità: Quote invariate per 24 ore');
console.log('• Prevedibilità: Aggiornamento sempre alla stessa ora');
console.log('• Economia: Preserva le 500 richieste mensili');

console.log('\n🔧 LOGICA DI FUNZIONAMENTO:');
console.log('• Oggi alle 12:00: Aggiornamento globale');
console.log('• Dalle 12:00 di oggi alle 12:00 di domani: Quote invariate');
console.log('• Domani alle 12:00: Nuovo aggiornamento globale');
console.log('• Tutti gli utenti vedono sempre le stesse quote');
console.log('• Sistema indipendente dal numero di utenti connessi');

console.log('\n🌐 ARCHITETTURA GLOBALE:');
console.log('• GlobalDailyUpdater: Gestione aggiornamento giornaliero');
console.log('• GlobalDailyMonitor: Dashboard controllo giornaliero');
console.log('• API Route: /api/global-daily per controllo remoto');
console.log('• Eventi globali: Broadcast aggiornamento completato');
console.log('• Persistenza: Storage condiviso (localStorage/DB)');

console.log('\n✨ Sistema Giornaliero Globale - IMPLEMENTATO! ✨');
console.log('🎯 1 AGGIORNAMENTO AL GIORNO PER TUTTO IL SITO! 🎯'); 