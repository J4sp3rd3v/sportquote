import { Bookmaker, Match, League, Sport } from '@/types';

export const bookmakers: Bookmaker[] = [
  // Top 20 bookmakers più popolari
  { id: '1', name: 'Bet365', logo: '/logos/bet365.png', rating: 4.8, bonus: 'Fino a €100', website: 'bet365.it', isPopular: true, country: 'UK' },
  { id: '2', name: 'William Hill', logo: '/logos/williamhill.png', rating: 4.7, bonus: 'Fino a €50', website: 'williamhill.it', isPopular: true, country: 'UK' },
  { id: '3', name: 'Betfair', logo: '/logos/betfair.png', rating: 4.6, bonus: 'Fino a €200', website: 'betfair.it', isPopular: true, country: 'UK' },
  { id: '4', name: 'Unibet', logo: '/logos/unibet.png', rating: 4.5, bonus: 'Fino a €100', website: 'unibet.it', isPopular: true, country: 'Malta' },
  { id: '5', name: 'Bwin', logo: '/logos/bwin.png', rating: 4.4, bonus: 'Fino a €50', website: 'bwin.it', isPopular: true, country: 'Austria' },
  { id: '6', name: 'Sisal', logo: '/logos/sisal.png', rating: 4.3, bonus: 'Fino a €250', website: 'sisal.it', isPopular: true, country: 'Italia' },
  { id: '7', name: 'Snai', logo: '/logos/snai.png', rating: 4.2, bonus: 'Fino a €15', website: 'snai.it', isPopular: true, country: 'Italia' },
  { id: '8', name: 'Eurobet', logo: '/logos/eurobet.png', rating: 4.1, bonus: 'Fino a €50', website: 'eurobet.it', isPopular: true, country: 'Italia' },
  { id: '9', name: 'Lottomatica', logo: '/logos/lottomatica.png', rating: 4.0, bonus: 'Fino a €200', website: 'lottomatica.it', isPopular: true, country: 'Italia' },
  { id: '10', name: 'Betclic', logo: '/logos/betclic.png', rating: 3.9, bonus: 'Fino a €100', website: 'betclic.it', isPopular: true, country: 'Francia' },
  { id: '11', name: 'NetBet', logo: '/logos/netbet.png', rating: 3.8, bonus: 'Fino a €50', website: 'netbet.it', isPopular: true, country: 'Malta' },
  { id: '12', name: 'LeoVegas', logo: '/logos/leovegas.png', rating: 3.7, bonus: 'Fino a €1000', website: 'leovegas.it', isPopular: true, country: 'Malta' },
  { id: '13', name: 'Pokerstars', logo: '/logos/pokerstars.png', rating: 3.6, bonus: 'Fino a €30', website: 'pokerstars.it', isPopular: true, country: 'Malta' },
  { id: '14', name: 'Better', logo: '/logos/better.png', rating: 3.5, bonus: 'Fino a €100', website: 'better.it', isPopular: true, country: 'Italia' },
  { id: '15', name: 'Goldbet', logo: '/logos/goldbet.png', rating: 3.4, bonus: 'Fino a €500', website: 'goldbet.it', isPopular: true, country: 'Italia' },
  { id: '16', name: 'Planetwin365', logo: '/logos/planetwin365.png', rating: 3.3, bonus: 'Fino a €200', website: 'planetwin365.it', isPopular: true, country: 'Italia' },
  { id: '17', name: 'Betaland', logo: '/logos/betaland.png', rating: 3.2, bonus: 'Fino a €50', website: 'betaland.it', isPopular: true, country: 'Italia' },
  { id: '18', name: 'Betway', logo: '/logos/betway.png', rating: 3.1, bonus: 'Fino a €30', website: 'betway.it', isPopular: true, country: 'Malta' },
  { id: '19', name: 'Stanleybet', logo: '/logos/stanleybet.png', rating: 3.0, bonus: 'Fino a €250', website: 'stanleybet.it', isPopular: true, country: 'Italia' },
  { id: '20', name: 'Betflag', logo: '/logos/betflag.png', rating: 2.9, bonus: 'Fino a €500', website: 'betflag.it', isPopular: true, country: 'Italia' },
  
  // Altri 80 bookmakers
  { id: '21', name: 'Admiral', logo: '/logos/admiral.png', rating: 2.8, bonus: 'Fino a €100', website: 'admiral.it', country: 'Italia' },
  { id: '22', name: 'Bet-at-home', logo: '/logos/betathome.png', rating: 2.7, bonus: 'Fino a €100', website: 'bet-at-home.it', country: 'Austria' },
  { id: '23', name: 'Betsson', logo: '/logos/betsson.png', rating: 2.6, bonus: 'Fino a €50', website: 'betsson.it', country: 'Svezia' },
  { id: '24', name: 'Betsafe', logo: '/logos/betsafe.png', rating: 2.5, bonus: 'Fino a €100', website: 'betsafe.it', country: 'Malta' },
  { id: '25', name: 'Nordicbet', logo: '/logos/nordicbet.png', rating: 2.4, bonus: 'Fino a €200', website: 'nordicbet.it', country: 'Malta' },
  { id: '26', name: 'Interwetten', logo: '/logos/interwetten.png', rating: 2.3, bonus: 'Fino a €100', website: 'interwetten.it', country: 'Austria' },
  { id: '27', name: 'Tipico', logo: '/logos/tipico.png', rating: 2.2, bonus: 'Fino a €100', website: 'tipico.it', country: 'Germania' },
  { id: '28', name: 'Bet3000', logo: '/logos/bet3000.png', rating: 2.1, bonus: 'Fino a €100', website: 'bet3000.it', country: 'Germania' },
  { id: '29', name: 'Mybet', logo: '/logos/mybet.png', rating: 2.0, bonus: 'Fino a €100', website: 'mybet.it', country: 'Germania' },
  { id: '30', name: 'Sportingbet', logo: '/logos/sportingbet.png', rating: 1.9, bonus: 'Fino a €50', website: 'sportingbet.it', country: 'UK' },
  
  // Continuo con altri bookmakers per arrivare a 100
  ...Array.from({ length: 70 }, (_, i) => ({
    id: (31 + i).toString(),
    name: `Bookmaker${31 + i}`,
    logo: `/logos/bookmaker${31 + i}.png`,
    rating: Math.round((Math.random() * 3 + 1) * 10) / 10,
    bonus: `Fino a €${Math.floor(Math.random() * 500 + 50)}`,
    website: `bookmaker${31 + i}.com`,
    country: ['Italia', 'Malta', 'UK', 'Germania', 'Francia', 'Spagna'][Math.floor(Math.random() * 6)]
  }))
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
  // Calcio
  { id: 'serie-a', name: 'Serie A', country: 'Italia', sport: 'calcio', logo: '/leagues/serie-a.png', isPopular: true },
  { id: 'premier-league', name: 'Premier League', country: 'Inghilterra', sport: 'calcio', logo: '/leagues/premier-league.png', isPopular: true },
  { id: 'la-liga', name: 'La Liga', country: 'Spagna', sport: 'calcio', logo: '/leagues/la-liga.png', isPopular: true },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germania', sport: 'calcio', logo: '/leagues/bundesliga.png', isPopular: true },
  { id: 'ligue-1', name: 'Ligue 1', country: 'Francia', sport: 'calcio', logo: '/leagues/ligue-1.png', isPopular: true },
  { id: 'champions-league', name: 'Champions League', country: 'Europa', sport: 'calcio', logo: '/leagues/champions-league.png', isPopular: true },
  { id: 'europa-league', name: 'Europa League', country: 'Europa', sport: 'calcio', logo: '/leagues/europa-league.png', isPopular: true },
  
  // Tennis
  { id: 'atp', name: 'ATP Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/atp.png', isPopular: true },
  { id: 'wta', name: 'WTA Tour', country: 'Mondiale', sport: 'tennis', logo: '/leagues/wta.png', isPopular: true },
  { id: 'grand-slam', name: 'Grand Slam', country: 'Mondiale', sport: 'tennis', logo: '/leagues/grand-slam.png', isPopular: true },
  
  // Basket
  { id: 'nba', name: 'NBA', country: 'USA', sport: 'basket', logo: '/leagues/nba.png', isPopular: true },
  { id: 'euroleague', name: 'EuroLeague', country: 'Europa', sport: 'basket', logo: '/leagues/euroleague.png', isPopular: true },
  { id: 'serie-a-basket', name: 'Serie A Basket', country: 'Italia', sport: 'basket', logo: '/leagues/serie-a-basket.png', isPopular: true },
];

// Database squadre reali per categoria
const REAL_TEAMS = {
  'serie-a': [
    'Juventus', 'Inter', 'Milan', 'Napoli', 'Roma', 'Lazio', 'Atalanta', 'Fiorentina',
    'Bologna', 'Torino', 'Udinese', 'Sassuolo', 'Verona', 'Genoa', 'Cagliari', 'Lecce',
    'Empoli', 'Monza', 'Frosinone', 'Salernitana'
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

// Genera partite con nomi reali
export const matches: Match[] = [
  // SERIE A - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('serie-a');
    return {
      id: `serie-a-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'serie-a',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000), // Prossimi giorni
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 15 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'serie-a', b.id)
      )
    };
  }),

  // PREMIER LEAGUE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('premier-league');
    return {
      id: `premier-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'premier-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'premier-league', b.id)
      )
    };
  }),

  // LA LIGA - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('la-liga');
    return {
      id: `laliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'la-liga',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 10)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'la-liga', b.id)
      )
    };
  }),

  // BUNDESLIGA - 6 partite
  ...Array.from({ length: 6 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('bundesliga');
    return {
      id: `bundesliga-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'bundesliga',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 16 + Math.floor(Math.random() * 8)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'bundesliga', b.id)
      )
    };
  }),

  // CHAMPIONS LEAGUE - 8 partite
  ...Array.from({ length: 8 }, (_, i) => {
    const [homeTeam, awayTeam] = getRandomTeams('champions-league');
    return {
      id: `ucl-${i + 1}`,
      homeTeam,
      awayTeam,
      league: 'champions-league',
      sport: 'calcio',
      date: new Date(Date.now() + (i + 2) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 25 + Math.floor(Math.random() * 15)).map(b => 
        generateRealisticOdds(homeTeam, awayTeam, 'champions-league', b.id)
      )
    };
  }),

  // TENNIS ATP - 12 partite
  ...Array.from({ length: 12 }, (_, i) => {
    const players = [...TENNIS_PLAYERS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `atp-${i + 1}`,
      homeTeam: players[0],
      awayTeam: players[1],
      league: 'atp',
      sport: 'tennis',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 20 + Math.floor(Math.random() * 10)).map(b => 
        generateTennisOdds(players[0], players[1], b.id)
      )
    };
  }),

  // NBA - 10 partite
  ...Array.from({ length: 10 }, (_, i) => {
    const teams = [...NBA_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `nba-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'nba',
      sport: 'basket',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 18 + Math.floor(Math.random() * 8)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.id)
      )
    };
  }),

  // EUROLEAGUE - 6 partite
  ...Array.from({ length: 6 }, (_, i) => {
    const teams = [...EUROLEAGUE_TEAMS].sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      id: `euroleague-${i + 1}`,
      homeTeam: teams[0],
      awayTeam: teams[1],
      league: 'euroleague',
      sport: 'basket',
      date: new Date(Date.now() + (i + 1) * 86400000),
      status: 'upcoming' as const,
      odds: bookmakers.slice(0, 15 + Math.floor(Math.random() * 8)).map(b => 
        generateBasketOdds(teams[0], teams[1], b.id)
      )
    };
  })
]; 