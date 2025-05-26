import { Bookmaker, Match, League, Sport } from '@/types';

export const bookmakers: Bookmaker[] = [
  // TOP 5 bookmaker italiani più affidabili e funzionanti
  { id: '1', name: 'Bet365', logo: '/logos/bet365.png', rating: 4.9, bonus: 'Fino a €100', website: 'bet365.it', isPopular: true, country: 'UK' },
  { id: '2', name: 'Sisal', logo: '/logos/sisal.png', rating: 4.8, bonus: 'Fino a €250', website: 'sisal.it', isPopular: true, country: 'Italia' },
  { id: '3', name: 'Snai', logo: '/logos/snai.png', rating: 4.7, bonus: 'Fino a €15', website: 'snai.it', isPopular: true, country: 'Italia' },
  { id: '4', name: 'Eurobet', logo: '/logos/eurobet.png', rating: 4.6, bonus: 'Fino a €50', website: 'eurobet.it', isPopular: true, country: 'Italia' },
  { id: '5', name: 'Lottomatica', logo: '/logos/lottomatica.png', rating: 4.5, bonus: 'Fino a €200', website: 'lottomatica.it', isPopular: true, country: 'Italia' },
  
  // Bookmaker internazionali top con licenza italiana
  { id: '6', name: 'William Hill', logo: '/logos/williamhill.png', rating: 4.4, bonus: 'Fino a €50', website: 'williamhill.it', isPopular: true, country: 'UK' },
  { id: '7', name: 'Betfair', logo: '/logos/betfair.png', rating: 4.3, bonus: 'Fino a €200', website: 'betfair.it', isPopular: true, country: 'UK' },
  { id: '8', name: 'Unibet', logo: '/logos/unibet.png', rating: 4.2, bonus: 'Fino a €100', website: 'unibet.it', isPopular: true, country: 'Malta' },
  { id: '9', name: 'Bwin', logo: '/logos/bwin.png', rating: 4.1, bonus: 'Fino a €50', website: 'bwin.it', isPopular: true, country: 'Austria' },
  { id: '10', name: 'Betclic', logo: '/logos/betclic.png', rating: 4.0, bonus: 'Fino a €100', website: 'betclic.it', isPopular: true, country: 'Francia' },
  
  // Bookmaker specializzati con quote competitive
  { id: '11', name: 'Pinnacle', logo: '/logos/pinnacle.png', rating: 4.6, bonus: 'Quote migliori', website: 'pinnacle.com', isPopular: true, country: 'Malta' },
  { id: '12', name: 'Betway', logo: '/logos/betway.png', rating: 4.0, bonus: 'Fino a €30', website: 'betway.it', isPopular: true, country: 'Malta' },
  { id: '13', name: 'NetBet', logo: '/logos/netbet.png', rating: 3.9, bonus: 'Fino a €50', website: 'netbet.it', isPopular: true, country: 'Malta' },
  { id: '14', name: 'Marathonbet', logo: '/logos/marathonbet.png', rating: 3.8, bonus: 'Fino a €100', website: 'marathonbet.it', isPopular: true, country: 'Malta' },
  { id: '15', name: 'Betano', logo: '/logos/betano.png', rating: 4.2, bonus: 'Fino a €100', website: 'betano.it', isPopular: true, country: 'Malta' },
  
  // Bookmaker italiani affidabili aggiuntivi
  { id: '16', name: 'Better', logo: '/logos/better.png', rating: 3.7, bonus: 'Fino a €100', website: 'better.it', isPopular: true, country: 'Italia' },
  { id: '17', name: 'Goldbet', logo: '/logos/goldbet.png', rating: 3.6, bonus: 'Fino a €500', website: 'goldbet.it', isPopular: true, country: 'Italia' },
  { id: '18', name: 'Planetwin365', logo: '/logos/planetwin365.png', rating: 3.5, bonus: 'Fino a €200', website: 'planetwin365.it', isPopular: true, country: 'Italia' },
  { id: '19', name: 'Admiral', logo: '/logos/admiral.png', rating: 3.4, bonus: 'Fino a €100', website: 'admiralbet.it', isPopular: true, country: 'Italia' },
  { id: '20', name: 'Stanleybet', logo: '/logos/stanleybet.png', rating: 3.3, bonus: 'Fino a €250', website: 'stanleybet.it', isPopular: true, country: 'Italia' },
  
  // Bookmaker UK premium
  { id: '21', name: 'Ladbrokes', logo: '/logos/ladbrokes.png', rating: 4.3, bonus: 'Fino a €100', website: 'ladbrokes.it', country: 'UK' },
  { id: '22', name: 'Paddy Power', logo: '/logos/paddypower.png', rating: 4.1, bonus: 'Fino a €100', website: 'paddypower.it', country: 'Irlanda' },
  { id: '23', name: 'Coral', logo: '/logos/coral.png', rating: 3.9, bonus: 'Fino a €100', website: 'coral.it', country: 'UK' },
  { id: '24', name: '888sport', logo: '/logos/888sport.png', rating: 3.8, bonus: 'Fino a €100', website: '888sport.it', country: 'Malta' },
  { id: '25', name: 'LeoVegas', logo: '/logos/leovegas.png', rating: 3.7, bonus: 'Fino a €1000', website: 'leovegas.it', country: 'Malta' }
];

export const sports: Sport[] = [
  { id: 'calcio', name: 'Calcio', icon: '⚽', isPopular: true },
  { id: 'tennis', name: 'Tennis', icon: '🎾', isPopular: true },
  { id: 'basket', name: 'Basket', icon: '🏀', isPopular: true },
  { id: 'volley', name: 'Volley', icon: '🏐', isPopular: true },
  { id: 'rugby', name: 'Rugby', icon: '🏉', isPopular: false },
  { id: 'hockey', name: 'Hockey', icon: '🏒', isPopular: false },
  { id: 'baseball', name: 'Baseball', icon: '⚾', isPopular: false },
  { id: 'golf', name: 'Golf', icon: '⛳', isPopular: false },
  { id: 'boxe', name: 'Boxe', icon: '🥊', isPopular: false },
  { id: 'mma', name: 'MMA', icon: '🥋', isPopular: false },
];

export const leagues: League[] = [
  // Calcio Italiano
  { id: 'serie-a', name: 'Serie A', country: 'Italia', sport: 'calcio', logo: '/leagues/serie-a.png', isPopular: true },
  { id: 'serie-b', name: 'Serie B', country: 'Italia', sport: 'calcio', logo: '/leagues/serie-b.png', isPopular: true },
  { id: 'coppa-italia', name: 'Coppa Italia', country: 'Italia', sport: 'calcio', logo: '/leagues/coppa-italia.png', isPopular: true },
  
  // Calcio Internazionale Top
  { id: 'premier-league', name: 'Premier League', country: 'Inghilterra', sport: 'calcio', logo: '/leagues/premier-league.png', isPopular: true },
  { id: 'la-liga', name: 'La Liga', country: 'Spagna', sport: 'calcio', logo: '/leagues/la-liga.png', isPopular: true },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germania', sport: 'calcio', logo: '/leagues/bundesliga.png', isPopular: true },
  { id: 'ligue-1', name: 'Ligue 1', country: 'Francia', sport: 'calcio', logo: '/leagues/ligue-1.png', isPopular: true },
  
  // Competizioni Europee
  { id: 'champions-league', name: 'Champions League', country: 'Europa', sport: 'calcio', logo: '/leagues/champions-league.png', isPopular: true },
  { id: 'europa-league', name: 'Europa League', country: 'Europa', sport: 'calcio', logo: '/leagues/europa-league.png', isPopular: true },
  { id: 'conference-league', name: 'Conference League', country: 'Europa', sport: 'calcio', logo: '/leagues/conference-league.png', isPopular: true },
  
  // Altri campionati importanti
  { id: 'eredivisie', name: 'Eredivisie', country: 'Olanda', sport: 'calcio', logo: '/leagues/eredivisie.png', isPopular: false },
  { id: 'primeira-liga', name: 'Primeira Liga', country: 'Portogallo', sport: 'calcio', logo: '/leagues/primeira-liga.png', isPopular: false },
  
  // Tennis
  { id: 'atp', name: 'ATP Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/atp.png', isPopular: true },
  { id: 'wta', name: 'WTA Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/wta.png', isPopular: true },
  { id: 'grand-slam', name: 'Grand Slam', country: 'Mondiale', sport: 'tennis', logo: '/leagues/grand-slam.png', isPopular: true },
  
  // Basket
  { id: 'nba', name: 'NBA', country: 'USA', sport: 'basket', logo: '/leagues/nba.png', isPopular: true },
  { id: 'euroleague', name: 'EuroLeague', country: 'Europa', sport: 'basket', logo: '/leagues/euroleague.png', isPopular: true },
  { id: 'serie-a-basket', name: 'Serie A Basket', country: 'Italia', sport: 'basket', logo: '/leagues/serie-a-basket.png', isPopular: true },
];

// Database squadre reali aggiornato per categoria
const REAL_TEAMS = {
  'serie-a': [
    'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino', 'Udinese', 'Sassuolo', 'Verona', 'Genoa', 'Cagliari', 'Lecce',
    'Empoli', 'Monza', 'Frosinone', 'Salernitana'
  ],
  'serie-b': [
    'Parma', 'Como', 'Venezia', 'Cremonese', 'Catanzaro', 'Palermo', 'Sampdoria', 'Brescia',
    'Pisa', 'Spezia', 'Modena', 'Reggiana', 'Cosenza', 'Cittadella', 'Bari', 'Ternana',
    'Ascoli', 'Feralpisalò', 'Sudtirol', 'Lecco'
  ],
  'premier-league': [
    'Manchester City', 'Arsenal', 'Liverpool', 'Aston Villa', 'Tottenham', 'Chelsea',
    'Newcastle', 'Manchester United', 'West Ham', 'Crystal Palace', 'Brighton', 'Bournemouth',
    'Fulham', 'Wolves', 'Everton', 'Brentford', 'Nottingham Forest', 'Luton Town',
    'Burnley', 'Sheffield United'
  ],
  'la-liga': [
    'Real Madrid', 'Barcelona', 'Girona', 'Atletico Madrid', 'Athletic Bilbao', 'Real Sociedad',
    'Valencia', 'Betis', 'Las Palmas', 'Getafe', 'Alaves', 'Sevilla', 'Osasuna', 'Villarreal',
    'Rayo Vallecano', 'Celta Vigo', 'Mallorca', 'Cadiz', 'Granada', 'Almeria'
  ],
  'bundesliga': [
    'Bayer Leverkusen', 'Bayern Munich', 'VfB Stuttgart', 'RB Leipzig', 'Borussia Dortmund',
    'Eintracht Frankfurt', 'Freiburg', 'Hoffenheim', 'Heidenheim', 'Werder Bremen',
    'Augsburg', 'Monchengladbach', 'Wolfsburg', 'Mainz', 'Union Berlin', 'Bochum',
    'Koln', 'Darmstadt'
  ],
  'ligue-1': [
    'PSG', 'Monaco', 'Brest', 'Lille', 'Nice', 'Lens', 'Lyon', 'Marseille', 'Montpellier',
    'Rennes', 'Reims', 'Strasbourg', 'Le Havre', 'Toulouse', 'Nantes', 'Lorient',
    'Metz', 'Clermont'
  ],
  'champions-league': [
    'Real Madrid', 'Manchester City', 'Bayern Munich', 'PSG', 'Arsenal', 'Barcelona',
    'Atletico Madrid', 'Borussia Dortmund', 'Inter', 'Napoli', 'AC Milan', 'Porto',
    'Benfica', 'PSV', 'Lazio', 'Real Sociedad'
  ],
  'eredivisie': [
    'PSV', 'Feyenoord', 'Ajax', 'AZ Alkmaar', 'Twente', 'Go Ahead Eagles', 'NEC',
    'Utrecht', 'Fortuna Sittard', 'Heerenveen', 'PEC Zwolle', 'Sparta Rotterdam',
    'Vitesse', 'RKC Waalwijk', 'Almere City', 'Volendam', 'Excelsior', 'Heracles'
  ],
  'primeira-liga': [
    'Sporting CP', 'Porto', 'Benfica', 'Braga', 'Vitoria Guimaraes', 'Moreirense',
    'Casa Pia', 'Gil Vicente', 'Famalicao', 'Estoril', 'Boavista', 'Arouca',
    'Rio Ave', 'Vizela', 'Portimonense', 'Farense', 'Chaves', 'Estrela'
  ]
};

const TENNIS_PLAYERS = [
  'Novak Djokovic', 'Carlos Alcaraz', 'Daniil Medvedev', 'Jannik Sinner', 'Andrey Rublev',
  'Stefanos Tsitsipas', 'Holger Rune', 'Casper Ruud', 'Hubert Hurkacz', 'Taylor Fritz',
  'Alex de Minaur', 'Grigor Dimitrov', 'Tommy Paul', 'Ben Shelton', 'Frances Tiafoe',
  'Iga Swiatek', 'Aryna Sabalenka', 'Coco Gauff', 'Elena Rybakina', 'Jessica Pegula',
  'Ons Jabeur', 'Marketa Vondrousova', 'Qinwen Zheng', 'Maria Sakkari', 'Barbora Krejcikova'
];

const NBA_TEAMS = [
  'Los Angeles Lakers', 'Boston Celtics', 'Golden State Warriors', 'Miami Heat',
  'Milwaukee Bucks', 'Phoenix Suns', 'Philadelphia 76ers', 'Brooklyn Nets',
  'Denver Nuggets', 'Memphis Grizzlies', 'Dallas Mavericks', 'New York Knicks',
  'Cleveland Cavaliers', 'New Orleans Pelicans', 'Sacramento Kings', 'Atlanta Hawks',
  'Minnesota Timberwolves', 'Los Angeles Clippers', 'Chicago Bulls', 'Toronto Raptors',
  'Indiana Pacers', 'Orlando Magic', 'Utah Jazz', 'Washington Wizards',
  'Oklahoma City Thunder', 'Houston Rockets', 'San Antonio Spurs', 'Portland Trail Blazers',
  'Charlotte Hornets', 'Detroit Pistons'
];

const EUROLEAGUE_TEAMS = [
  'Real Madrid', 'Barcelona', 'Fenerbahce', 'Panathinaikos', 'Olympiacos',
  'Zalgiris Kaunas', 'Crvena Zvezda', 'Partizan', 'CSKA Moscow', 'Anadolu Efes',
  'Bayern Munich', 'Alba Berlin', 'Virtus Bologna', 'EA7 Emporio Armani Milano',
  'ASVEL', 'Monaco', 'Maccabi Tel Aviv', 'Baskonia'
];

// Funzione per generare quote realistiche basate sulla forza delle squadre
const generateRealisticOdds = (homeTeam: string, awayTeam: string, league: string, bookmaker: string) => {
  // Coefficienti di forza per le squadre (più alto = più forte)
  const getTeamStrength = (team: string, league: string): number => {
    const strengthMap: { [key: string]: { [team: string]: number } } = {
      'serie-a': {
        'Juventus': 85, 'Inter': 88, 'Milan': 82, 'Napoli': 84, 'Roma': 78, 'Lazio': 76,
        'Atalanta': 80, 'Fiorentina': 72, 'Bologna': 68, 'Torino': 65
      },
      'premier-league': {
        'Manchester City': 95, 'Arsenal': 88, 'Liverpool': 90, 'Chelsea': 82, 'Tottenham': 80,
        'Manchester United': 78, 'Newcastle': 76, 'West Ham': 70
      },
      'la-liga': {
        'Real Madrid': 92, 'Barcelona': 88, 'Atletico Madrid': 85, 'Athletic Bilbao': 75,
        'Real Sociedad': 73, 'Valencia': 70, 'Betis': 72, 'Sevilla': 74
      },
      'bundesliga': {
        'Bayern Munich': 90, 'Borussia Dortmund': 82, 'RB Leipzig': 80, 'Bayer Leverkusen': 85,
        'Eintracht Frankfurt': 72, 'Freiburg': 68, 'Hoffenheim': 65
      }
    };

    return strengthMap[league]?.[team] || 70; // Default strength
  };

  const homeStrength = getTeamStrength(homeTeam, league);
  const awayStrength = getTeamStrength(awayTeam, league);
  
  // Vantaggio casa
  const homeAdvantage = 5;
  const adjustedHomeStrength = homeStrength + homeAdvantage;
  
  // Calcola probabilità
  const totalStrength = adjustedHomeStrength + awayStrength;
  const homeProbability = adjustedHomeStrength / totalStrength;
  const awayProbability = awayStrength / totalStrength;
  const drawProbability = 0.25; // 25% probabilità pareggio per il calcio
  
  // Converti in quote (con margine bookmaker del 5-8%)
  const margin = 1.05 + Math.random() * 0.03; // 5-8% margine
  
  let homeOdds = (1 / homeProbability) * margin;
  let awayOdds = (1 / awayProbability) * margin;
  let drawOdds = (1 / drawProbability) * margin;
  
  // Aggiungi variazione casuale per simulare differenze tra bookmaker
  const variation = 0.95 + Math.random() * 0.1; // ±5% variazione
  homeOdds *= variation;
  awayOdds *= variation;
  drawOdds *= variation;
  
  return {
    home: Math.round(homeOdds * 100) / 100,
    draw: Math.round(drawOdds * 100) / 100,
    away: Math.round(awayOdds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000) // Ultimo aggiornamento entro 1 ora
  };
};

// Funzione per generare quote tennis (senza pareggio)
const generateTennisOdds = (player1: string, player2: string, bookmaker: string) => {
  const player1Odds = 1.3 + Math.random() * 2.5; // 1.3 - 3.8
  const player2Odds = 1.3 + Math.random() * 2.5; // 1.3 - 3.8
  
  return {
    home: Math.round(player1Odds * 100) / 100,
    away: Math.round(player2Odds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000)
  };
};

// Funzione per generare quote basket (senza pareggio)
const generateBasketOdds = (team1: string, team2: string, bookmaker: string) => {
  const team1Odds = 1.4 + Math.random() * 2.0; // 1.4 - 3.4
  const team2Odds = 1.4 + Math.random() * 2.0; // 1.4 - 3.4
  
  return {
    home: Math.round(team1Odds * 100) / 100,
    away: Math.round(team2Odds * 100) / 100,
    bookmaker,
    lastUpdated: new Date(Date.now() - Math.random() * 3600000)
  };
};

// Funzione per ottenere squadre casuali da un campionato
const getRandomTeams = (league: string, count: number = 2): string[] => {
  const teams = REAL_TEAMS[league as keyof typeof REAL_TEAMS] || [];
  const shuffled = [...teams].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Genera partite con nomi reali - Database completo
export const matches: Match[] = [
  // SERIE A - 15 partite (giornata completa)
  ...Array.from({ length: 15 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('serie-a');
    return {
      id: `serie-a-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'serie-a',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 3 + 1) * 86400000), // Distribuiti su 3 giorni
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 5)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'serie-a', b.name)
      )
    };
  }),

  // SERIE B - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('serie-b');
    return {
      id: `serie-b-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'serie-b',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 15 + Math.floor(Math.random() * 8)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'serie-b', b.name)
      )
    };
  }),

  // PREMIER LEAGUE - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('premier-league');
    return {
      id: `premier-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'premier-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 3 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 22 + Math.floor(Math.random() * 3)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'premier-league', b.name)
      )
    };
  }),

  // LA LIGA - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('la-liga');
    return {
      id: `laliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'la-liga',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 3 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 5)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'la-liga', b.name)
      )
    };
  }),

  // BUNDESLIGA - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('bundesliga');
    return {
      id: `bundesliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'bundesliga',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 5)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'bundesliga', b.name)
      )
    };
  }),

  // LIGUE 1 - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('ligue-1');
    return {
      id: `ligue1-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'ligue-1',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 16 + Math.floor(Math.random() * 6)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'ligue-1', b.name)
      )
    };
  }),

  // CHAMPIONS LEAGUE - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('champions-league');
    return {
      id: `ucl-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'champions-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 2) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'champions-league', b.name)
      )
    };
  }),

  // EUROPA LEAGUE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const teams = ['Roma', 'Milan', 'Atalanta', 'Fiorentina', 'Liverpool', 'Arsenal', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Villarreal', 'Eintracht Frankfurt', 'Bayer Leverkusen'];
    const [homeTeam, awayTeam] = [...teams].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `uel-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'europa-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 3) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 5)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'europa-league', b.name)
      )
    };
  }),

  // EREDIVISIE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('eredivisie');
    return {
      id: `eredivisie-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'eredivisie',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 12 + Math.floor(Math.random() * 8)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'eredivisie', b.name)
      )
    };
  }),

  // PRIMEIRA LIGA - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('primeira-liga');
    return {
      id: `primeira-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'primeira-liga',
      sport: 'calcio',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 14 + Math.floor(Math.random() * 6)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'primeira-liga', b.name)
      )
    };
  }),

  // TENNIS ATP - 16 partite
  ...Array.from({ length: 16 }, (_, i) => {
    const players = [...TENNIS_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `atp-${i + 1}`,
      homeTeam: players[0],
      awayTeam: players[1],
      league: 'atp',
      sport: 'tennis',
      date: new Date(Date.now() + (i % 4 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 7)).map(b => 
        generateTennisOdds(players[0], players[1], b.name)
      )
    };
  }),

  // TENNIS WTA - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const players = [...TENNIS_PLAYERS.filter(p => ['Iga Swiatek', 'Aryna Sabalenka', 'Coco Gauff', 'Elena Rybakina', 'Jessica Pegula', 'Ons Jabeur', 'Marketa Vondrousova', 'Qinwen Zheng', 'Maria Sakkari', 'Barbora Krejcikova'].includes(p))].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `wta-${i + 1}`,
      homeTeam: players[0],
      awayTeam: players[1],
      league: 'wta',
      sport: 'tennis',
      date: new Date(Date.now() + (i % 3 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 16 + Math.floor(Math.random() * 6)).map(b => 
        generateTennisOdds(players[0], players[1], b.name)
      )
    };
  }),

  // NBA - 15 partite
  ...Array.from({ length: 15 }, (_, i) => {
    const teams = [...NBA_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `nba-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'nba',
      sport: 'basket',
      date: new Date(Date.now() + (i % 3 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 5)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.name)
      )
    };
  }),

  // EUROLEAGUE - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const teams = [...EUROLEAGUE_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `euroleague-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'euroleague',
      sport: 'basket',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 16 + Math.floor(Math.random() * 6)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.name)
      )
    };
  }),

  // SERIE A BASKET - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const teams = ['Virtus Bologna', 'EA7 Emporio Armani Milano', 'Umana Reyer Venezia', 'Dolomiti Energia Trentino', 'Germani Brescia', 'Pallacanestro Reggiana', 'Napoli Basket', 'Bertram Tortona'];
    const [homeTeam, awayTeam] = [...teams].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `lba-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'serie-a-basket',
      sport: 'basket',
      date: new Date(Date.now() + (i % 2 + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 12 + Math.floor(Math.random() * 8)).map(b => 
        generateBasketOdds(homeTeam, awayTeam, b.name)
      )
    };
  })
]; 