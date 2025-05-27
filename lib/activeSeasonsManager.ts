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
        startDate: new Date('2024-01-01'), // Esteso per essere sempre attivo
        endDate: new Date('2025-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2026-08-16')
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
        startDate: new Date('2024-01-01'), // Esteso per essere sempre attivo
        endDate: new Date('2025-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2026-08-17')
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
        startDate: new Date('2024-01-01'), // Esteso per essere sempre attivo
        endDate: new Date('2025-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2026-08-22')
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
        startDate: new Date('2024-01-01'), // Esteso per essere sempre attivo
        endDate: new Date('2025-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2026-08-15')
      },
      enabled: true
    },
    
    // SERIE A - Riabilitata per test
    {
      key: 'soccer_italy_serie_a',
      name: 'Serie A',
      sport: 'calcio',
      country: 'Italia',
      priority: 5,
      seasonInfo: {
        startDate: new Date('2024-01-01'), // Esteso per essere sempre attivo
        endDate: new Date('2025-12-31'),
        isActive: true,
        nextSeasonStart: new Date('2026-08-16')
      },
      enabled: true // RIABILITATA
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
    
    // TENNIS - Tornei ATP/WTA tutto l'anno
    {
      key: 'tennis_atp_tour',
      name: 'ATP Tour',
      sport: 'tennis',
      country: 'Mondiale',
      priority: 8,
      seasonInfo: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'), // Esteso per essere sempre attivo
        isActive: true,
        nextSeasonStart: new Date('2026-01-01')
      },
      enabled: true
    },
    {
      key: 'tennis_wta_tour',
      name: 'WTA Tour',
      sport: 'tennis',
      country: 'Mondiale',
      priority: 9,
      seasonInfo: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'), // Esteso per essere sempre attivo
        isActive: true,
        nextSeasonStart: new Date('2026-01-01')
      },
      enabled: true
    },
    {
      key: 'tennis_grand_slam',
      name: 'Grand Slam',
      sport: 'tennis',
      country: 'Mondiale',
      priority: 10,
      seasonInfo: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'), // Esteso per essere sempre attivo
        isActive: true,
        nextSeasonStart: new Date('2026-01-01')
      },
      enabled: true
    },
    
    // NFL 2024/25 (Settembre 2024 - Febbraio 2025)
    {
      key: 'americanfootball_nfl',
      name: 'NFL',
      sport: 'football-americano',
      country: 'USA',
      priority: 11,
      seasonInfo: {
        startDate: new Date('2024-09-05'),
        endDate: new Date('2025-02-09'),
        isActive: true,
        nextSeasonStart: new Date('2025-09-04')
      },
      enabled: true
    },
    
    // HOCKEY - NHL 2024/25 (Ottobre 2024 - Giugno 2025)
    {
      key: 'icehockey_nhl',
      name: 'NHL',
      sport: 'hockey',
      country: 'USA/Canada',
      priority: 12,
      seasonInfo: {
        startDate: new Date('2024-10-04'),
        endDate: new Date('2025-06-30'),
        isActive: true,
        nextSeasonStart: new Date('2025-10-03')
      },
      enabled: true
    },
    
    // FORMULA 1 2024 (Marzo - Dicembre 2024)
    {
      key: 'motorsport_f1',
      name: 'Formula 1',
      sport: 'motorsport',
      country: 'Mondiale',
      priority: 13,
      seasonInfo: {
        startDate: new Date('2024-03-02'),
        endDate: new Date('2025-12-08'), // Esteso per essere attivo
        isActive: true,
        nextSeasonStart: new Date('2026-03-01')
      },
      enabled: true
    },
    
    // EUROLEAGUE BASKET 2024/25 (Ottobre 2024 - Maggio 2025)
    {
      key: 'basketball_euroleague',
      name: 'EuroLega',
      sport: 'basket',
      country: 'Europa',
      priority: 14,
      seasonInfo: {
        startDate: new Date('2024-10-03'),
        endDate: new Date('2025-05-30'),
        isActive: true,
        nextSeasonStart: new Date('2025-10-02')
      },
      enabled: true
    },
    
    // MMA/UFC - Eventi tutto l'anno
    {
      key: 'mma_ufc',
      name: 'UFC',
      sport: 'mma',
      country: 'Mondiale',
      priority: 15,
      seasonInfo: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'), // Esteso per essere sempre attivo
        isActive: true,
        nextSeasonStart: new Date('2026-01-01')
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