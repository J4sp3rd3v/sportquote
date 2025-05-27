// API Route per Sistema Globale di Aggiornamento
// Gestisce le operazioni del sistema server-side

import { NextRequest, NextResponse } from 'next/server';
import { serverSideScheduler } from '@/lib/serverSideScheduler';

// GET - Ottieni statistiche del sistema globale
export async function GET() {
  try {
    const stats = serverSideScheduler.getGlobalStats();
    const nextUpdate = serverSideScheduler.getNextScheduledUpdate();
    const isActive = serverSideScheduler.isGlobalSystemActive();
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        nextUpdate,
        isActive,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore API global-scheduler GET:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// POST - Operazioni sul sistema globale
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'start':
        serverSideScheduler.startGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema globale avviato',
          timestamp: new Date().toISOString()
        });
        
      case 'stop':
        serverSideScheduler.stopGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema globale fermato',
          timestamp: new Date().toISOString()
        });
        
      case 'force-update':
        await serverSideScheduler.forceGlobalUpdateAll();
        return NextResponse.json({
          success: true,
          message: 'Aggiornamento globale forzato completato',
          timestamp: new Date().toISOString()
        });
        
      case 'reset':
        serverSideScheduler.resetGlobalSystem();
        return NextResponse.json({
          success: true,
          message: 'Sistema globale resettato',
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
    console.error('Errore API global-scheduler POST:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// PUT - Aggiorna configurazione sistema
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { config } = body;
    
    // In futuro qui si potranno modificare configurazioni come:
    // - Orari di aggiornamento
    // - Intervalli di controllo
    // - Numero massimo di retry
    // - Sport abilitati/disabilitati
    
    return NextResponse.json({
      success: true,
      message: 'Configurazione aggiornata (feature futura)',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore API global-scheduler PUT:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Operazioni di pulizia
export async function DELETE() {
  try {
    // Ferma il sistema e pulisce tutti i dati
    serverSideScheduler.stopGlobalSystem();
    serverSideScheduler.resetGlobalSystem();
    
    return NextResponse.json({
      success: true,
      message: 'Sistema globale fermato e pulito completamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore API global-scheduler DELETE:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      },
      { status: 500 }
    );
  }
} 