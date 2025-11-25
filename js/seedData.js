// Seed Data - Database Temporaneo Clienti
// Questo file popola il localStorage con clienti e appuntamenti di esempio

// ============================================
// CLIENTI DI ESEMPIO
// ============================================

const sampleClients = [
    {
        id: '1700000001',
        name: 'Mario Rossi',
        email: 'mario.rossi@email.it',
        phone: '333 123 4567',
        password: 'password123',
        createdAt: '2025-11-20T10:00:00.000Z'
    },
    {
        id: '1700000002',
        name: 'Laura Bianchi',
        email: 'laura.bianchi@email.it',
        phone: '347 234 5678',
        password: 'password123',
        createdAt: '2025-11-20T11:30:00.000Z'
    },
    {
        id: '1700000003',
        name: 'Giuseppe Verdi',
        email: 'giuseppe.verdi@email.it',
        phone: '340 345 6789',
        password: 'password123',
        createdAt: '2025-11-21T09:15:00.000Z'
    },
    {
        id: '1700000004',
        name: 'Anna Ferrari',
        email: 'anna.ferrari@email.it',
        phone: '338 456 7890',
        password: 'password123',
        createdAt: '2025-11-21T14:20:00.000Z'
    },
    {
        id: '1700000005',
        name: 'Marco Colombo',
        email: 'marco.colombo@email.it',
        phone: '349 567 8901',
        password: 'password123',
        createdAt: '2025-11-22T08:45:00.000Z'
    },
    {
        id: '1700000006',
        name: 'Francesca Romano',
        email: 'francesca.romano@email.it',
        phone: '335 678 9012',
        password: 'password123',
        createdAt: '2025-11-22T16:30:00.000Z'
    },
    {
        id: '1700000007',
        name: 'Alessandro Greco',
        email: 'alessandro.greco@email.it',
        phone: '342 789 0123',
        password: 'password123',
        createdAt: '2025-11-23T10:10:00.000Z'
    },
    {
        id: '1700000008',
        name: 'Sofia Marino',
        email: 'sofia.marino@email.it',
        phone: '348 890 1234',
        password: 'password123',
        createdAt: '2025-11-23T13:50:00.000Z'
    },
    {
        id: '1700000009',
        name: 'Luca Ricci',
        email: 'luca.ricci@email.it',
        phone: '339 901 2345',
        password: 'password123',
        createdAt: '2025-11-24T09:00:00.000Z'
    },
    {
        id: '1700000010',
        name: 'Elena Costa',
        email: 'elena.costa@email.it',
        phone: '346 012 3456',
        password: 'password123',
        createdAt: '2025-11-24T15:25:00.000Z'
    }
];

// ============================================
// APPUNTAMENTI DI ESEMPIO
// ============================================

const sampleAppointments = [
    {
        id: '2700000001',
        userId: '1700000001',
        date: '2025-11-26',
        time: '09:00',
        service: 'Consulenza Farmaceutica',
        status: 'confirmed',
        createdAt: '2025-11-20T10:15:00.000Z'
    },
    {
        id: '2700000002',
        userId: '1700000002',
        date: '2025-11-26',
        time: '10:00',
        service: 'Misurazione Pressione',
        status: 'confirmed',
        createdAt: '2025-11-20T11:45:00.000Z'
    },
    {
        id: '2700000003',
        userId: '1700000003',
        date: '2025-11-26',
        time: '14:00',
        service: 'Vaccinazione',
        status: 'pending',
        createdAt: '2025-11-21T09:30:00.000Z'
    },
    {
        id: '2700000004',
        userId: '1700000004',
        date: '2025-11-27',
        time: '09:00',
        service: 'Test Rapido',
        status: 'confirmed',
        createdAt: '2025-11-21T14:35:00.000Z'
    },
    {
        id: '2700000005',
        userId: '1700000005',
        date: '2025-11-27',
        time: '11:00',
        service: 'Consulenza Farmaceutica',
        status: 'pending',
        createdAt: '2025-11-22T09:00:00.000Z'
    },
    {
        id: '2700000006',
        userId: '1700000006',
        date: '2025-11-27',
        time: '15:00',
        service: 'Misurazione Glicemia',
        status: 'confirmed',
        createdAt: '2025-11-22T16:45:00.000Z'
    },
    {
        id: '2700000007',
        userId: '1700000007',
        date: '2025-11-28',
        time: '10:00',
        service: 'Vaccinazione',
        status: 'pending',
        createdAt: '2025-11-23T10:25:00.000Z'
    },
    {
        id: '2700000008',
        userId: '1700000008',
        date: '2025-11-28',
        time: '14:00',
        service: 'Consulenza Farmaceutica',
        status: 'confirmed',
        createdAt: '2025-11-23T14:05:00.000Z'
    },
    {
        id: '2700000009',
        userId: '1700000009',
        date: '2025-11-29',
        time: '09:00',
        service: 'Test Rapido',
        status: 'cancelled',
        createdAt: '2025-11-24T09:15:00.000Z'
    },
    {
        id: '2700000010',
        userId: '1700000010',
        date: '2025-11-29',
        time: '16:00',
        service: 'Misurazione Pressione',
        status: 'pending',
        createdAt: '2025-11-24T15:40:00.000Z'
    }
];

// ============================================
// FUNZIONI DI INIZIALIZZAZIONE
// ============================================

/**
 * Inizializza il database con i dati di esempio
 * @param {boolean} force - Se true, sovrascrive i dati esistenti
 */
function seedDatabase(force = false) {
    try {
        // Controlla se i dati esistono già
        const existingUsers = localStorage.getItem('users');
        const existingAppointments = localStorage.getItem('appointments');

        if (!force && existingUsers && existingAppointments) {
            console.log('⚠️ Database già popolato. Usa seedDatabase(true) per sovrascrivere.');
            return {
                success: false,
                message: 'Database già popolato'
            };
        }

        // Popola gli utenti
        localStorage.setItem('users', JSON.stringify(sampleClients));
        console.log(`✅ ${sampleClients.length} clienti aggiunti al database`);

        // Popola gli appuntamenti
        localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
        console.log(`✅ ${sampleAppointments.length} appuntamenti aggiunti al database`);

        return {
            success: true,
            message: `Database popolato con ${sampleClients.length} clienti e ${sampleAppointments.length} appuntamenti`,
            stats: {
                clients: sampleClients.length,
                appointments: sampleAppointments.length
            }
        };
    } catch (error) {
        console.error('❌ Errore durante il popolamento del database:', error);
        return {
            success: false,
            message: 'Errore durante il popolamento del database'
        };
    }
}

/**
 * Pulisce completamente il database
 */
function clearDatabase() {
    try {
        localStorage.removeItem('users');
        localStorage.removeItem('appointments');
        localStorage.removeItem('currentUser');
        console.log('🗑️ Database pulito completamente');
        return {
            success: true,
            message: 'Database pulito con successo'
        };
    } catch (error) {
        console.error('❌ Errore durante la pulizia del database:', error);
        return {
            success: false,
            message: 'Errore durante la pulizia del database'
        };
    }
}

/**
 * Mostra statistiche del database
 */
function showDatabaseStats() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

        const stats = {
            totalUsers: users.length,
            totalAppointments: appointments.length,
            confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
            pendingAppointments: appointments.filter(a => a.status === 'pending').length,
            cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
            currentUser: currentUser ? currentUser.name : 'Nessuno'
        };

        console.log('📊 Statistiche Database:');
        console.log(`   👥 Clienti totali: ${stats.totalUsers}`);
        console.log(`   📅 Appuntamenti totali: ${stats.totalAppointments}`);
        console.log(`   ✅ Confermati: ${stats.confirmedAppointments}`);
        console.log(`   ⏳ In attesa: ${stats.pendingAppointments}`);
        console.log(`   ❌ Cancellati: ${stats.cancelledAppointments}`);
        console.log(`   👤 Utente corrente: ${stats.currentUser}`);

        return stats;
    } catch (error) {
        console.error('❌ Errore nel recupero delle statistiche:', error);
        return null;
    }
}

/**
 * Esporta i dati del database in formato JSON
 */
function exportDatabase() {
    try {
        const data = {
            users: JSON.parse(localStorage.getItem('users') || '[]'),
            appointments: JSON.parse(localStorage.getItem('appointments') || '[]'),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        console.log('📦 Dati esportati:');
        console.log(dataStr);

        // Crea un file scaricabile
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `farmacia-db-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return data;
    } catch (error) {
        console.error('❌ Errore durante l\'esportazione:', error);
        return null;
    }
}

// ============================================
// AUTO-INIZIALIZZAZIONE
// ============================================

// Inizializza automaticamente il database se vuoto o se contiene liste vuote
(function autoInit() {
    const usersStr = localStorage.getItem('users');
    const appointmentsStr = localStorage.getItem('appointments');

    let shouldSeed = false;

    if (!usersStr || !appointmentsStr) {
        shouldSeed = true;
    } else {
        // Controlla se sono array vuoti
        const users = JSON.parse(usersStr);
        const appointments = JSON.parse(appointmentsStr);
        if (users.length === 0 && appointments.length === 0) {
            shouldSeed = true;
        }
    }

    if (shouldSeed) {
        console.log('🚀 Inizializzazione automatica del database (era vuoto)...');
        const result = seedDatabase(true); // Force seed
        if (result.success) {
            console.log('✅ Database inizializzato con successo!');
            showDatabaseStats();

            // Se siamo sulla pagina admin, ricarica i dati
            if (window.location.pathname.includes('admin.html') && typeof loadDashboardData === 'function') {
                console.log('🔄 Ricarico dati dashboard...');
                loadDashboardData();
            }
        }
    } else {
        console.log('ℹ️ Database già presente con dati.');
        showDatabaseStats();
    }
})();
