// Test del Sistema di Aggiornamento Giornaliero Automatico
// Simula il funzionamento del DailyUpdateScheduler

console.log('🚀 TEST SISTEMA AGGIORNAMENTO GIORNALIERO AUTOMATICO\n');

// Simula la classe DailyUpdateScheduler
class TestDailyScheduler {
  constructor() {
    this.state = {
      lastDailyUpdate: '',
      sportsSchedule: {},
      isRunning: false,
      intervalId: null
    };
    
    this.SPORT_SCHEDULE = {
      'soccer_italy_serie_a': '08:00',      // Serie A - 8:00
      'soccer_epl': '09:00',                // Premier League - 9:00
      'soccer_uefa_champs_league': '10:00', // Champions League - 10:00
      'basketball_nba': '11:00',            // NBA - 11:00
      'tennis_atp_french_open': '12:00',    // ATP Tennis - 12:00
      'americanfootball_nfl': '13:00'       // NFL - 13:00
    };
    
    this.initializeSchedule();
  }
  
  initializeSchedule() {
    const today = new Date().toISOString().split('T')[0];
    
    // Inizializza schedule per ogni sport
    Object.entries(this.SPORT_SCHEDULE).forEach(([sportKey, scheduledTime]) => {
      this.state.sportsSchedule[sportKey] = {
        scheduledTime,
        lastUpdate: '',
        nextUpdate: this.calculateNextUpdate(scheduledTime),
        status: 'pending'
      };
    });
    
    // Reset giornaliero se necessario
    if (this.state.lastDailyUpdate !== today) {
      this.resetDailySchedule();
    }
  }
  
  calculateNextUpdate(scheduledTime) {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const scheduledToday = new Date(now);
    scheduledToday.setHours(hours, minutes, 0, 0);
    
    // Se l'orario di oggi è già passato, programma per domani
    if (scheduledToday.getTime() <= now.getTime()) {
      const tomorrow = new Date(scheduledToday);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    
    return scheduledToday.toISOString();
  }
  
  resetDailySchedule() {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🔄 Reset schedule giornaliero - ${today}`);
    
    this.state.lastDailyUpdate = today;
    
    // Reset status di tutti gli sport
    Object.keys(this.state.sportsSchedule).forEach(sportKey => {
      this.state.sportsSchedule[sportKey].status = 'pending';
      this.state.sportsSchedule[sportKey].nextUpdate = this.calculateNextUpdate(
        this.state.sportsSchedule[sportKey].scheduledTime
      );
    });
  }
  
  start() {
    if (this.state.isRunning) {
      console.log('📅 Scheduler già in esecuzione');
      return;
    }
    
    console.log('🚀 Avvio Daily Update Scheduler');
    this.state.isRunning = true;
    
    // Simula controllo ogni minuto
    this.checkAndExecuteUpdates();
  }
  
  checkAndExecuteUpdates() {
    const now = new Date();
    
    console.log(`⏰ Controllo aggiornamenti - ${now.toLocaleTimeString('it-IT')}\n`);
    
    for (const [sportKey, schedule] of Object.entries(this.state.sportsSchedule)) {
      const nextUpdate = new Date(schedule.nextUpdate);
      const timeUntilNext = nextUpdate.getTime() - now.getTime();
      const minutesUntilNext = Math.round(timeUntilNext / (1000 * 60));
      
      console.log(`📊 ${this.formatSportName(sportKey)}:`);
      console.log(`   • Orario programmato: ${schedule.scheduledTime}`);
      console.log(`   • Status: ${schedule.status}`);
      console.log(`   • Prossimo aggiornamento: ${nextUpdate.toLocaleString('it-IT')}`);
      console.log(`   • Tempo rimanente: ${minutesUntilNext > 0 ? minutesUntilNext + ' minuti' : 'Ora!'}`);
      
      // Se è il momento di aggiornare
      if (now >= nextUpdate && schedule.status === 'pending') {
        this.simulateUpdate(sportKey);
      }
      
      console.log('');
    }
  }
  
  simulateUpdate(sportKey) {
    console.log(`🔄 AGGIORNAMENTO AUTOMATICO: ${this.formatSportName(sportKey)}`);
    
    // Simula aggiornamento
    const success = Math.random() > 0.2; // 80% successo
    const matches = success ? Math.floor(Math.random() * 15) + 1 : 0;
    
    if (success) {
      this.state.sportsSchedule[sportKey].status = 'completed';
      this.state.sportsSchedule[sportKey].lastUpdate = new Date().toISOString();
      this.state.sportsSchedule[sportKey].nextUpdate = this.calculateNextUpdate(
        this.state.sportsSchedule[sportKey].scheduledTime
      );
      
      console.log(`✅ Aggiornamento completato: ${matches} partite caricate`);
    } else {
      this.state.sportsSchedule[sportKey].status = 'failed';
      console.log(`❌ Aggiornamento fallito`);
    }
    
    console.log('');
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
  
  getScheduleStats() {
    const now = new Date();
    const stats = {
      isRunning: this.state.isRunning,
      lastDailyUpdate: this.state.lastDailyUpdate,
      sports: Object.entries(this.state.sportsSchedule).map(([sportKey, schedule]) => {
        const nextUpdate = new Date(schedule.nextUpdate);
        const timeUntilNext = nextUpdate.getTime() - now.getTime();
        
        return {
          sport: sportKey,
          scheduledTime: schedule.scheduledTime,
          status: schedule.status,
          lastUpdate: schedule.lastUpdate,
          nextUpdate: schedule.nextUpdate,
          timeUntilNext: timeUntilNext > 0 ? Math.round(timeUntilNext / (1000 * 60)) : 0,
          isOverdue: timeUntilNext < 0 && schedule.status === 'pending'
        };
      }),
      summary: {
        total: Object.keys(this.state.sportsSchedule).length,
        completed: Object.values(this.state.sportsSchedule).filter(s => s.status === 'completed').length,
        pending: Object.values(this.state.sportsSchedule).filter(s => s.status === 'pending').length,
        failed: Object.values(this.state.sportsSchedule).filter(s => s.status === 'failed').length
      }
    };
    
    return stats;
  }
  
  forceUpdateAll() {
    console.log('🔄 AGGIORNAMENTO FORZATO DI TUTTI GLI SPORT\n');
    
    Object.keys(this.state.sportsSchedule).forEach(sportKey => {
      this.simulateUpdate(sportKey);
    });
  }
}

// Test del sistema
const scheduler = new TestDailyScheduler();

console.log('📋 TEST 1: Inizializzazione Sistema');
console.log('=====================================');
scheduler.start();

console.log('\n📊 TEST 2: Statistiche Iniziali');
console.log('=================================');
const initialStats = scheduler.getScheduleStats();
console.log(`• Sport totali: ${initialStats.summary.total}`);
console.log(`• In attesa: ${initialStats.summary.pending}`);
console.log(`• Completati: ${initialStats.summary.completed}`);
console.log(`• Falliti: ${initialStats.summary.failed}`);
console.log(`• Sistema attivo: ${initialStats.isRunning ? 'Sì' : 'No'}`);

console.log('\n⚡ TEST 3: Aggiornamento Forzato');
console.log('=================================');
scheduler.forceUpdateAll();

console.log('📊 TEST 4: Statistiche Finali');
console.log('==============================');
const finalStats = scheduler.getScheduleStats();
console.log(`• Sport totali: ${finalStats.summary.total}`);
console.log(`• In attesa: ${finalStats.summary.pending}`);
console.log(`• Completati: ${finalStats.summary.completed}`);
console.log(`• Falliti: ${finalStats.summary.failed}`);

console.log('\n📋 RIEPILOGO SISTEMA AGGIORNAMENTO GIORNALIERO');
console.log('===============================================');
console.log('✅ CARATTERISTICHE:');
console.log('• Aggiornamento automatico distribuito (8:00-13:00)');
console.log('• 1 aggiornamento per sport al giorno');
console.log('• Reset automatico a mezzanotte');
console.log('• Controllo ogni minuto per aggiornamenti programmati');
console.log('• Gestione errori e retry automatico');
console.log('• Preservazione 500 richieste mensili (6 giornaliere)');
console.log('• Monitoraggio real-time con dashboard');

console.log('\n🎯 ORARI AGGIORNAMENTO:');
Object.entries(scheduler.SPORT_SCHEDULE).forEach(([sport, time]) => {
  console.log(`• ${scheduler.formatSportName(sport)}: ${time}`);
});

console.log('\n💡 VANTAGGI:');
console.log('• Quote sempre aggiornate senza intervento manuale');
console.log('• Distribuzione carico API nell\'arco della giornata');
console.log('• Monitoraggio preciso utilizzo richieste');
console.log('• Sistema resiliente con gestione errori');
console.log('• Dashboard di controllo completa');

console.log('\n🔧 CONTROLLI DISPONIBILI:');
console.log('• Avvio/Stop scheduler automatico');
console.log('• Aggiornamento forzato singolo sport');
console.log('• Aggiornamento forzato tutti gli sport');
console.log('• Reset completo sistema');
console.log('• Monitoraggio real-time stato');

console.log('\n✨ Sistema di Aggiornamento Giornaliero Automatico - ATTIVO! ✨'); 