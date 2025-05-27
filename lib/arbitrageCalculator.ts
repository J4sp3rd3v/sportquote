// Sistema di calcolo arbitraggio per identificare opportunità di scommessa sicura
import { Match, Odds } from '@/types';

export interface ArbitrageOpportunity {
  matchId: string;
  match: Match;
  type: 'tennis' | 'calcio_1x2' | 'calcio_handicap' | 'basket' | 'other';
  percentage: number; // Percentuale di arbitraggio (sotto 100% = opportunità)
  profit: number; // Profitto potenziale in percentuale
  bestOdds: {
    outcome1: { bookmaker: string; odds: number; label: string };
    outcome2?: { bookmaker: string; odds: number; label: string };
    outcome3?: { bookmaker: string; odds: number; label: string };
  };
  calculation: string; // Formula utilizzata
  recommendation: string; // Raccomandazione per l'utente
  riskLevel: 'low' | 'medium' | 'high';
}

export class ArbitrageCalculator {
  
  /**
   * Calcola arbitraggio per tennis (2 esiti)
   * Formula: (100/quota1) + (100/quota2)
   */
  static calculateTennisArbitrage(match: Match): ArbitrageOpportunity | null {
    if (match.sport !== 'tennis' || match.odds.length < 2) return null;

    // Trova le migliori quote per ogni giocatore
    const homeOdds = match.odds.map(odd => ({ 
      bookmaker: odd.bookmaker, 
      odds: odd.home,
      percentage: 100 / odd.home
    }));
    
    const awayOdds = match.odds.map(odd => ({ 
      bookmaker: odd.bookmaker, 
      odds: odd.away,
      percentage: 100 / odd.away
    }));

    // Trova le quote più alte (percentuali più basse)
    const bestHome = homeOdds.reduce((best, current) => 
      current.odds > best.odds ? current : best
    );
    
    const bestAway = awayOdds.reduce((best, current) => 
      current.odds > best.odds ? current : best
    );

    // Calcola percentuale di arbitraggio
    const arbitragePercentage = bestHome.percentage + bestAway.percentage;
    
    // Solo se è un'opportunità (sotto 100%)
    if (arbitragePercentage >= 100) return null;

    const profit = 100 - arbitragePercentage;

    return {
      matchId: match.id,
      match,
      type: 'tennis',
      percentage: arbitragePercentage,
      profit,
      bestOdds: {
        outcome1: { 
          bookmaker: bestHome.bookmaker, 
          odds: bestHome.odds, 
          label: match.homeTeam 
        },
        outcome2: { 
          bookmaker: bestAway.bookmaker, 
          odds: bestAway.odds, 
          label: match.awayTeam 
        }
      },
      calculation: `(100/${bestHome.odds.toFixed(2)}) + (100/${bestAway.odds.toFixed(2)}) = ${arbitragePercentage.toFixed(2)}%`,
      recommendation: `Scommetti ${(bestHome.percentage / arbitragePercentage * 100).toFixed(1)}% su ${match.homeTeam} e ${(bestAway.percentage / arbitragePercentage * 100).toFixed(1)}% su ${match.awayTeam}`,
      riskLevel: profit > 5 ? 'low' : profit > 2 ? 'medium' : 'high'
    };
  }

  /**
   * Calcola arbitraggio per calcio 1X2 (3 esiti)
   * Formula: (100/quota1) + (100/quotaX) + (100/quota2)
   */
  static calculateFootballArbitrage(match: Match): ArbitrageOpportunity | null {
    if (match.sport !== 'calcio' || match.odds.length < 2) return null;

    // Trova le migliori quote per ogni esito
    const homeOdds = match.odds
      .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.home }))
      .reduce((best, current) => current.odds > best.odds ? current : best);
    
    const awayOdds = match.odds
      .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.away }))
      .reduce((best, current) => current.odds > best.odds ? current : best);
    
    const drawOdds = match.odds
      .filter(odd => odd.draw)
      .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.draw! }))
      .reduce((best, current) => current.odds > best.odds ? current : best, { bookmaker: '', odds: 0 });

    if (!drawOdds.odds) return null;

    // Calcola percentuale di arbitraggio
    const homePercentage = 100 / homeOdds.odds;
    const drawPercentage = 100 / drawOdds.odds;
    const awayPercentage = 100 / awayOdds.odds;
    const arbitragePercentage = homePercentage + drawPercentage + awayPercentage;
    
    // Solo se è un'opportunità (sotto 100%)
    if (arbitragePercentage >= 100) return null;

    const profit = 100 - arbitragePercentage;

    return {
      matchId: match.id,
      match,
      type: 'calcio_1x2',
      percentage: arbitragePercentage,
      profit,
      bestOdds: {
        outcome1: { bookmaker: homeOdds.bookmaker, odds: homeOdds.odds, label: `1 (${match.homeTeam})` },
        outcome2: { bookmaker: drawOdds.bookmaker, odds: drawOdds.odds, label: 'X (Pareggio)' },
        outcome3: { bookmaker: awayOdds.bookmaker, odds: awayOdds.odds, label: `2 (${match.awayTeam})` }
      },
      calculation: `(100/${homeOdds.odds.toFixed(2)}) + (100/${drawOdds.odds.toFixed(2)}) + (100/${awayOdds.odds.toFixed(2)}) = ${arbitragePercentage.toFixed(2)}%`,
      recommendation: `Distribuzione: ${(homePercentage / arbitragePercentage * 100).toFixed(1)}% su 1, ${(drawPercentage / arbitragePercentage * 100).toFixed(1)}% su X, ${(awayPercentage / arbitragePercentage * 100).toFixed(1)}% su 2`,
      riskLevel: profit > 3 ? 'low' : profit > 1 ? 'medium' : 'high'
    };
  }

  /**
   * Calcola arbitraggio per basket (2 esiti)
   * Formula: (100/quota1) + (100/quota2)
   */
  static calculateBasketballArbitrage(match: Match): ArbitrageOpportunity | null {
    if (match.sport !== 'basket' || match.odds.length < 2) return null;

    // Trova le migliori quote per ogni squadra
    const homeOdds = match.odds
      .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.home }))
      .reduce((best, current) => current.odds > best.odds ? current : best);
    
    const awayOdds = match.odds
      .map(odd => ({ bookmaker: odd.bookmaker, odds: odd.away }))
      .reduce((best, current) => current.odds > best.odds ? current : best);

    // Calcola percentuale di arbitraggio
    const homePercentage = 100 / homeOdds.odds;
    const awayPercentage = 100 / awayOdds.odds;
    const arbitragePercentage = homePercentage + awayPercentage;
    
    // Solo se è un'opportunità (sotto 100%)
    if (arbitragePercentage >= 100) return null;

    const profit = 100 - arbitragePercentage;

    return {
      matchId: match.id,
      match,
      type: 'basket',
      percentage: arbitragePercentage,
      profit,
      bestOdds: {
        outcome1: { bookmaker: homeOdds.bookmaker, odds: homeOdds.odds, label: match.homeTeam },
        outcome2: { bookmaker: awayOdds.bookmaker, odds: awayOdds.odds, label: match.awayTeam }
      },
      calculation: `(100/${homeOdds.odds.toFixed(2)}) + (100/${awayOdds.odds.toFixed(2)}) = ${arbitragePercentage.toFixed(2)}%`,
      recommendation: `Scommetti ${(homePercentage / arbitragePercentage * 100).toFixed(1)}% su ${match.homeTeam} e ${(awayPercentage / arbitragePercentage * 100).toFixed(1)}% su ${match.awayTeam}`,
      riskLevel: profit > 4 ? 'low' : profit > 2 ? 'medium' : 'high'
    };
  }

  /**
   * Analizza tutte le partite e trova le migliori opportunità di arbitraggio
   */
  static findArbitrageOpportunities(matches: Match[]): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    matches.forEach(match => {
      let opportunity: ArbitrageOpportunity | null = null;

      switch (match.sport) {
        case 'tennis':
          opportunity = this.calculateTennisArbitrage(match);
          break;
        case 'calcio':
          opportunity = this.calculateFootballArbitrage(match);
          break;
        case 'basket':
          opportunity = this.calculateBasketballArbitrage(match);
          break;
      }

      if (opportunity) {
        opportunities.push(opportunity);
      }
    });

    // Ordina per profitto decrescente
    return opportunities.sort((a, b) => b.profit - a.profit);
  }

  /**
   * Filtra solo le migliori opportunità (sopra una soglia di profitto)
   */
  static getBestOpportunities(matches: Match[], minProfit: number = 1): ArbitrageOpportunity[] {
    const opportunities = this.findArbitrageOpportunities(matches);
    return opportunities.filter(opp => opp.profit >= minProfit);
  }

  /**
   * Calcola la distribuzione ottimale delle scommesse per un'opportunità
   */
  static calculateOptimalStakes(opportunity: ArbitrageOpportunity, totalStake: number): {
    outcome1: number;
    outcome2?: number;
    outcome3?: number;
    guaranteedProfit: number;
  } {
    const { bestOdds, percentage } = opportunity;
    
    const stake1 = (100 / bestOdds.outcome1.odds / percentage) * totalStake;
    const stake2 = bestOdds.outcome2 ? (100 / bestOdds.outcome2.odds / percentage) * totalStake : undefined;
    const stake3 = bestOdds.outcome3 ? (100 / bestOdds.outcome3.odds / percentage) * totalStake : undefined;
    
    const guaranteedProfit = (opportunity.profit / 100) * totalStake;

    return {
      outcome1: Math.round(stake1 * 100) / 100,
      outcome2: stake2 ? Math.round(stake2 * 100) / 100 : undefined,
      outcome3: stake3 ? Math.round(stake3 * 100) / 100 : undefined,
      guaranteedProfit: Math.round(guaranteedProfit * 100) / 100
    };
  }

  /**
   * Genera un report dettagliato per un'opportunità
   */
  static generateOpportunityReport(opportunity: ArbitrageOpportunity, stake: number = 100): string {
    const stakes = this.calculateOptimalStakes(opportunity, stake);
    
    let report = `
🎯 OPPORTUNITÀ DI ARBITRAGGIO IDENTIFICATA
==========================================

📊 Partita: ${opportunity.match.homeTeam} vs ${opportunity.match.awayTeam}
🏆 Sport: ${opportunity.match.sport.toUpperCase()}
📅 Data: ${new Date(opportunity.match.date).toLocaleDateString('it-IT')}

💰 ANALISI PROFITTO:
• Percentuale arbitraggio: ${opportunity.percentage.toFixed(2)}%
• Profitto garantito: ${opportunity.profit.toFixed(2)}%
• Livello rischio: ${opportunity.riskLevel.toUpperCase()}

🧮 CALCOLO:
${opportunity.calculation}

💡 STRATEGIA CONSIGLIATA (con €${stake}):
• ${opportunity.bestOdds.outcome1.label}: €${stakes.outcome1} su ${opportunity.bestOdds.outcome1.bookmaker} (quota ${opportunity.bestOdds.outcome1.odds})`;

    if (stakes.outcome2 && opportunity.bestOdds.outcome2) {
      report += `\n• ${opportunity.bestOdds.outcome2.label}: €${stakes.outcome2} su ${opportunity.bestOdds.outcome2.bookmaker} (quota ${opportunity.bestOdds.outcome2.odds})`;
    }

    if (stakes.outcome3 && opportunity.bestOdds.outcome3) {
      report += `\n• ${opportunity.bestOdds.outcome3.label}: €${stakes.outcome3} su ${opportunity.bestOdds.outcome3.bookmaker} (quota ${opportunity.bestOdds.outcome3.odds})`;
    }

    report += `\n\n💵 PROFITTO GARANTITO: €${stakes.guaranteedProfit}`;
    
    return report;
  }
}

// Utility per formattare le opportunità per l'UI
export const formatArbitrageOpportunity = (opportunity: ArbitrageOpportunity) => ({
  ...opportunity,
  formattedProfit: `+${opportunity.profit.toFixed(2)}%`,
  formattedPercentage: `${opportunity.percentage.toFixed(2)}%`,
  riskColor: opportunity.riskLevel === 'low' ? 'green' : 
             opportunity.riskLevel === 'medium' ? 'yellow' : 'red',
  riskIcon: opportunity.riskLevel === 'low' ? '🟢' : 
            opportunity.riskLevel === 'medium' ? '🟡' : '🔴'
}); 