// Sistema di Gestione Stagioni Attive
// Filtra automaticamente i campionati in base alla stagione corrente

interface SeasonInfo {
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  nextSeasonStart?: Date;
}

interface LeagueConfig {
  key: string;
  name: string;
  sport: string;
  country: string;
  priority: number;
  seasonInfo: SeasonInfo;
  enabled: boolean;
}

export class ActiveSeasonsManager {
  private static instance: ActiveSeasonsManager;
  
  // Configurazione campionati con date reali 2024/25
  private readonly LEAGUES_CONFIG: LeagueConfig[] = [
    // CALCIO - Stagioni 2024/25 (Agosto 2024 - Maggio 2025)
    {
      key: 'soccer_epl',
      name: 'Premier League',
      sport: 'calcio',
      country: 'Inghilterra',
      priority: 1,
      seasonInfo: {
        startDate: new Date('2024-08-17'),
        endDate: new Date('2025-05-25'),
        isActive: true,
        nextSeasonStart: new Date('2025-08-16')
      },
      enabled: true
    },
    {
      key: 'soccer_spain_la_liga',
      name: 'La Liga',
      sport: 'calcio',
      country: 'Spagna',
      priority: 2,
      seasonInfo: {
        startDate: new Date('2024-08-18'),
        endDate: new Date('2025-05-25'),
        isActive: true,
        nextSeasonStart: new Date('2025-08-17')
      },
      enabled: true
    },
    {
      key: 'soccer_germany_bundesliga',
      name: 'Bundesliga',
      sport: 'calcio',
      country: 'Germania',
      priority: 3,
      seasonInfo: {
        startDate: new Date('2024-08-23'),
        endDate: new Date('2025-05-24'),
        isActive: true,
        nextSeasonStart: new Date('2025-08-22')
      },
      enabled: true
    },
    {
      key: 'soccer_france_ligue_one',
      name: 'Ligue 1',
      sport: 'calcio',
      country: 'Francia',
      priority: 4,
      seasonInfo: {
        startDate: new Date('2024-08-16'),
        endDate: new Date('2025-05-24'),
        isActive: true,
        nextSeasonStart: new Date('2025-08-15')
      },
      enabled: true
    },
    
    // SERIE A - FINITA (Maggio 2024)
    {
      key: 'soccer_italy_serie_a',
      name: 'Serie A',
      sport: 'calcio',
      country: 'Italia',
      priority: 5,
      seasonInfo: {
        startDate: new Date('2023-08-19'),
        endDate: new Date('2024-05-26'), // FINITA!
        isActive: false,
        nextSeasonStart: new Date('2024-08-17') // Prossima stagione
      },
      enabled: false // DISABILITATA
    },
    
    // CHAMPIONS LEAGUE 2024/25 (Settembre 2024 - Giugno 2025)
    {
      key: 'soccer_uefa_champs_league',
      name: 'Champions League',
      sport: 'calcio',
      country: 'Europa',
      priority: 6,
      seasonInfo: {
        startDate: new Date('2024-09-17'),
        endDate: new Date('2025-06-01'),
        isActive: true,
        nextSeasonStart: new Date('2025-09-16')
      },
      enabled: true
    },
    
    // BASKET - NBA 2024/25 (Ottobre 2024 - Giugno 2025)
    {
      key: 'basketball_nba',
      name: 'NBA',
      sport: 'basket',
      country: 'USA',
      priority: 7,
      seasonInfo: {
        startDate: new Date('2024-10-15'),
        endDate: new Date('2025-06-15'),
        isActive: true,
        nextSeasonStart: new Date('2025-10-14')
      },
      enabled: true
    },
    
    // TENNIS - Tornei tutto l'anno
    {
      key: 'tennis_atp_wimbledon',
      name: 'Wimbledon ATP',
      sport: 'tennis',
      country: 'Inghilterra',
      priority: 8,
      seasonInfo: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2025-01-01')
      },
      enabled: true
    },
    
    // NFL 2024/25 (Settembre 2024 - Febbraio 2025)
    {
      key: 'americanfootball_nfl',
      name: 'NFL',
      sport: 'football-americano',
      country: 'USA',
      priority: 9,
      seasonInfo: {
        startDate: new Date('2024-09-05'),
        endDate: new Date('2025-02-09'),
        isActive: true,
        nextSeasonStart: new Date('2025-09-04')
      },
      enabled: true
    }
  ];

  private constructor() {
    this.updateActiveStatus();
  }

  static getInstance(): ActiveSeasonsManager {
    if (!ActiveSeasonsManager.instance) {
      ActiveSeasonsManager.instance = new ActiveSeasonsManager();
    }
    return ActiveSeasonsManager.instance;
  }

  // Aggiorna lo status attivo dei campionati
  private updateActiveStatus(): void {
    const now = new Date();
    
    this.LEAGUES_CONFIG.forEach(league => {
      const isInSeason = now >= league.seasonInfo.startDate && now <= league.seasonInfo.endDate;
      league.seasonInfo.isActive = isInSeason;
      league.enabled = isInSeason;
    });
    
    console.log(`[SEASONS] 📅 Aggiornato status campionati - ${this.getActiveLeagues().length} attivi`);
  }

  // Ottieni solo i campionati attivi
  getActiveLeagues(): LeagueConfig[] {
    return this.LEAGUES_CONFIG.filter(league => league.enabled && league.seasonInfo.isActive);
  }

  // Ottieni tutti i campionati (attivi e non)
  getAllLeagues(): LeagueConfig[] {
    return this.LEAGUES_CONFIG;
  }

  // Verifica se un campionato è attivo
  isLeagueActive(leagueKey: string): boolean {
    const league = this.LEAGUES_CONFIG.find(l => l.key === leagueKey);
    return league ? league.enabled && league.seasonInfo.isActive : false;
  }

  // Ottieni info stagione per un campionato
  getSeasonInfo(leagueKey: string): SeasonInfo | null {
    const league = this.LEAGUES_CONFIG.find(l => l.key === leagueKey);
    return league ? league.seasonInfo : null;
  }

  // Ottieni campionati per sport
  getActiveLeaguesBySport(sport: string): LeagueConfig[] {
    return this.getActiveLeagues().filter(league => league.sport === sport);
  }

  // Ottieni prossimi campionati che inizieranno
  getUpcomingLeagues(): LeagueConfig[] {
    const now = new Date();
    return this.LEAGUES_CONFIG.filter(league => 
      !league.seasonInfo.isActive && 
      league.seasonInfo.nextSeasonStart && 
      league.seasonInfo.nextSeasonStart > now
    ).sort((a, b) => 
      (a.seasonInfo.nextSeasonStart?.getTime() || 0) - (b.seasonInfo.nextSeasonStart?.getTime() || 0)
    );
  }

  // Ottieni statistiche stagioni
  getSeasonsStats() {
    const active = this.getActiveLeagues();
    const inactive = this.LEAGUES_CONFIG.filter(l => !l.seasonInfo.isActive);
    const upcoming = this.getUpcomingLeagues();
    
    return {
      total: this.LEAGUES_CONFIG.length,
      active: active.length,
      inactive: inactive.length,
      upcoming: upcoming.length,
      activeLeagues: active.map(l => ({
        key: l.key,
        name: l.name,
        sport: l.sport,
        country: l.country,
        endDate: l.seasonInfo.endDate
      })),
      upcomingLeagues: upcoming.slice(0, 3).map(l => ({
        key: l.key,
        name: l.name,
        sport: l.sport,
        country: l.country,
        startDate: l.seasonInfo.nextSeasonStart
      }))
    };
  }

  // Forza aggiornamento (per test)
  forceUpdate(): void {
    this.updateActiveStatus();
    console.log('[SEASONS] 🔄 Aggiornamento forzato completato');
  }
}

// Istanza singleton
export const activeSeasonsManager = ActiveSeasonsManager.getInstance(); 