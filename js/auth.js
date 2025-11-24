// Authentication System for Farmacia App
// Manages user registration, login, session, and profile updates

// Initialize users storage
function initStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Register new user
function register(name, email, phone, password) {
    initStorage();

    const users = JSON.parse(localStorage.getItem('users'));

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return {
            success: false,
            message: 'Email già registrata'
        };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    setCurrentUser(newUser);

    return {
        success: true,
        message: 'Account creato con successo!'
    };
}

// Login user
function login(email, password) {
    initStorage();

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return {
            success: false,
            message: 'Email o password non corretti'
        };
    }

    setCurrentUser(user);

    return {
        success: true,
        message: 'Login effettuato con successo!'
    };
}

// Set current user session
function setCurrentUser(user) {
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
}

// Get current logged in user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Logout user
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Protect page - redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Update user profile
function updateProfile(name, email, phone) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'Utente non autenticato'
        };
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
        return {
            success: false,
            message: 'Utente non trovato'
        };
    }

    // Check if new email is already taken by another user
    const emailExists = users.find(u => u.email === email && u.id !== currentUser.id);
    if (emailExists) {
        return {
            success: false,
            message: 'Email già utilizzata da un altro account'
        };
    }

    // Update user data
    users[userIndex].name = name;
    users[userIndex].email = email;
    users[userIndex].phone = phone;

    localStorage.setItem('users', JSON.stringify(users));

    // Update current session
    setCurrentUser(users[userIndex]);

    return {
        success: true,
        message: 'Profilo aggiornato con successo!'
    };
}

// Change password
function changePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'Utente non autenticato'
        };
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
        return {
            success: false,
            message: 'Utente non trovato'
        };
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
        return {
            success: false,
            message: 'Password attuale non corretta'
        };
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    return {
        success: true,
        message: 'Password modificata con successo!'
    };
}

// Get user's appointments
function getUserAppointments() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return appointments.filter(apt => apt.userId === currentUser.id);
}

// Save appointment for current user
function saveAppointment(appointmentData) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return {
            success: false,
            message: 'Utente non autenticato'
        };
    }

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Check if the time slot is already taken
    const isTimeSlotTaken = appointments.some(apt =>
        apt.date === appointmentData.date &&
        apt.time === appointmentData.time &&
        apt.status !== 'cancelled' // Don't count cancelled appointments
    );

    if (isTimeSlotTaken) {
        return {
            success: false,
            message: 'Questa ora non è disponibile. Scegli un\'altra ora o un altro giorno.'
        };
    }

    const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
        userId: currentUser.id,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return {
        success: true,
        message: 'Appuntamento prenotato con successo!',
        appointment: newAppointment
    };
}

// Get available time slots for a specific date
function getAvailableTimeSlots(date) {
    const allTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // Get taken time slots for this date (excluding cancelled)
    const takenSlots = appointments
        .filter(apt => apt.date === date && apt.status !== 'cancelled')
        .map(apt => apt.time);

    // Return available slots
    return allTimeSlots.filter(slot => !takenSlots.includes(slot));
}


// Delete appointment
function deleteAppointment(appointmentId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments = appointments.filter(apt => !(apt.id === appointmentId && apt.userId === currentUser.id));
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return true;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

// Admin credentials
const ADMIN_EMAIL = 'admin@farmacia.it';
const ADMIN_PASSWORD = 'admin123';

// Check if current user is admin
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.email === ADMIN_EMAIL;
}

// Admin login
function adminLogin(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
            id: 'admin',
            name: 'Amministratore',
            email: ADMIN_EMAIL,
            phone: '',
            isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return {
            success: true,
            message: 'Login admin effettuato con successo!'
        };
    }
    return {
        success: false,
        message: 'Credenziali admin non corrette'
    };
}

// Protect admin pages (for future admin-only pages, not admin.html itself)
function requireAdmin() {
    if (!isAdmin()) {
        window.location.href = 'login.html';
    }
}

// Get all users (admin only) - Security handled by admin.html login
function getAllUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Don't include passwords in the list
    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt
    }));
}

// Get all appointments (admin only) - Security handled by admin.html login
function getAllAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Enrich appointments with user data
    return appointments.map(apt => {
        const user = users.find(u => u.id === apt.userId);
        return {
            ...apt,
            userName: user ? user.name : 'Utente sconosciuto',
            userEmail: user ? user.email : '',
            userPhone: user ? user.phone : apt.phone || ''
        };
    });
}

// Update appointment status (admin only)
function updateAppointmentStatus(appointmentId, status) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const aptIndex = appointments.findIndex(apt => apt.id === appointmentId);

    if (aptIndex === -1) {
        return {
            success: false,
            message: 'Appuntamento non trovato'
        };
    }

    appointments[aptIndex].status = status;
    appointments[aptIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return {
        success: true,
        message: 'Stato aggiornato con successo!'
    };
}

// Delete any appointment (admin only)
function adminDeleteAppointment(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments = appointments.filter(apt => apt.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return true;
}

// Get dashboard statistics (admin only)
function getAdminStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    const today = new Date().toISOString().split('T')[0];
    const appointmentsToday = appointments.filter(apt => apt.date === today);
    const pendingAppointments = appointments.filter(apt => !apt.status || apt.status === 'pending');

    return {
        totalUsers: users.length,
        totalAppointments: appointments.length,
        appointmentsToday: appointmentsToday.length,
        pendingAppointments: pendingAppointments.length
    };
}
