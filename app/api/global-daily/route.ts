// API Route per Sistema Giornaliero Globale
// Gestisce 1 aggiornamento al giorno per tutto il sito

import { NextRequest, NextResponse } from 'next/server';
import { globalDailyUpdater } from '@/lib/globalDailyUpdater';

// GET - Ottieni statistiche del sistema giornaliero globale
export async function GET() {
  try {
    const stats = globalDailyUpdater.getGlobalDailyStats();
    const areQuotesFresh = globalDailyUpdater.areQuotesFreshToday();
    const lastUpdateTime = globalDailyUpdater.getLastGlobalUpdateTime();
    const nextUpdate = globalDailyUpdater.getNextScheduledUpdate();
    const isActive = globalDailyUpdater.isSystemActive();
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        areQuotesFresh,
        lastUpdateTime: lastUpdateTime?.toISOString() || null,
        nextUpdate: nextUpdate.toISOString(),
        isActive,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore API global-daily GET:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// POST - Operazioni sul sistema giornaliero globale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'start':
        globalDailyUpdater.startGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema giornaliero globale avviato',
          timestamp: new Date().toISOString()
        });
        
      case 'stop':
        globalDailyUpdater.stopGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema giornaliero globale fermato',
          timestamp: new Date().toISOString()
        });
        
      case 'force-update':
        const result = await globalDailyUpdater.forceDailyUpdate();
        return NextResponse.json({
          success: result.success,
          message: result.message,
          timestamp: new Date().toISOString()
        });
        
      case 'reset':
        globalDailyUpdater.resetGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema giornaliero globale resettato',
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: `Azione non riconosciuta: ${action}` 
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Errore API global-daily POST:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Ferma e pulisce il sistema
export async function DELETE() {
  try {
    globalDailyUpdater.stopGlobalSystem();
    globalDailyUpdater.resetGlobalSystem();
    
    return NextResponse.json({
      success: true,
      message: 'Sistema giornaliero globale fermato e pulito completamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore API global-daily DELETE:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
} 