// Authentication System for Farmacia App
// Manages user registration, login, session, and profile updates

// ============================================
// VALIDATION UTILITIES
// ============================================

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (Italian format)
function isValidPhone(phone) {
    // Accept Italian phone numbers: +39 xxx xxx xxxx or xxx xxx xxxx or xxxxxxxxxx
    const phoneRegex = /^(\+39)?[\s]?[0-9]{3}[\s]?[0-9]{3,4}[\s]?[0-9]{3,4}$/;
    return phoneRegex.test(phone.trim());
}

// Validate password strength
function isValidPassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;

    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

// Safe localStorage operations with error handling
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
        return false;
    }
}

// ============================================
// STORAGE INITIALIZATION
// ============================================

// Initialize users storage
function initStorage() {
    try {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('appointments')) {
            localStorage.setItem('appointments', JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
}

// ============================================
// USER AUTHENTICATION
// ============================================

// Register new user
function register(name, email, phone, password) {
    try {
        initStorage();

        // Validate inputs
        if (!name || name.trim().length < 2) {
            return {
                success: false,
                message: 'Il nome deve contenere almeno 2 caratteri'
            };
        }

        if (!isValidEmail(email)) {
            return {
                success: false,
                message: 'Formato email non valido'
            };
        }

        if (!isValidPhone(phone)) {
            return {
                success: false,
                message: 'Formato telefono non valido (es: 333 123 4567)'
            };
        }

        if (!isValidPassword(password)) {
            return {
                success: false,
                message: 'La password deve contenere almeno 6 caratteri'
            };
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(name.trim());
        const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
        const sanitizedPhone = sanitizeInput(phone.trim());

        const users = safeLocalStorageGet('users', []);

        // Check if email already exists
        if (users.find(u => u.email === sanitizedEmail)) {
            return {
                success: false,
                message: 'Email già registrata'
            };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            password: password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        if (!safeLocalStorageSet('users', users)) {
            return {
                success: false,
                message: 'Errore durante la registrazione. Riprova.'
            };
        }

        // Auto login after registration
        setCurrentUser(newUser);

        return {
            success: true,
            message: 'Account creato con successo!'
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Errore durante la registrazione. Riprova.'
        };
    }
}

// Login user
function login(email, password) {
    try {
        initStorage();

        // Validate inputs
        if (!email || !password) {
            return {
                success: false,
                message: 'Email e password sono obbligatori'
            };
        }

        const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
        const users = safeLocalStorageGet('users', []);
        const user = users.find(u => u.email === sanitizedEmail && u.password === password);

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
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Errore durante il login. Riprova.'
        };
    }
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
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Utente non autenticato'
            };
        }

        // Validate inputs
        if (!name || name.trim().length < 2) {
            return {
                success: false,
                message: 'Il nome deve contenere almeno 2 caratteri'
            };
        }

        if (!isValidEmail(email)) {
            return {
                success: false,
                message: 'Formato email non valido'
            };
        }

        if (!isValidPhone(phone)) {
            return {
                success: false,
                message: 'Formato telefono non valido'
            };
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(name.trim());
        const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
        const sanitizedPhone = sanitizeInput(phone.trim());

        const users = safeLocalStorageGet('users', []);
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'Utente non trovato'
            };
        }

        // Check if new email is already taken by another user
        const emailExists = users.find(u => u.email === sanitizedEmail && u.id !== currentUser.id);
        if (emailExists) {
            return {
                success: false,
                message: 'Email già utilizzata da un altro account'
            };
        }

        // Update user data
        users[userIndex].name = sanitizedName;
        users[userIndex].email = sanitizedEmail;
        users[userIndex].phone = sanitizedPhone;

        if (!safeLocalStorageSet('users', users)) {
            return {
                success: false,
                message: 'Errore durante l\'aggiornamento. Riprova.'
            };
        }

        // Update current session
        setCurrentUser(users[userIndex]);

        return {
            success: true,
            message: 'Profilo aggiornato con successo!'
        };
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            message: 'Errore durante l\'aggiornamento. Riprova.'
        };
    }
}

// Change password
function changePassword(currentPassword, newPassword) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Utente non autenticato'
            };
        }

        // Validate new password
        if (!isValidPassword(newPassword)) {
            return {
                success: false,
                message: 'La nuova password deve contenere almeno 6 caratteri'
            };
        }

        if (currentPassword === newPassword) {
            return {
                success: false,
                message: 'La nuova password deve essere diversa da quella attuale'
            };
        }

        const users = safeLocalStorageGet('users', []);
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

        if (!safeLocalStorageSet('users', users)) {
            return {
                success: false,
                message: 'Errore durante la modifica. Riprova.'
            };
        }

        return {
            success: true,
            message: 'Password modificata con successo!'
        };
    } catch (error) {
        console.error('Change password error:', error);
        return {
            success: false,
            message: 'Errore durante la modifica. Riprova.'
        };
    }
}

// ============================================
// APPOINTMENT MANAGEMENT
// ============================================

// Get user's appointments
function getUserAppointments() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];

        const appointments = safeLocalStorageGet('appointments', []);
        return appointments.filter(apt => apt.userId === currentUser.id);
    } catch (error) {
        console.error('Get user appointments error:', error);
        return [];
    }
}

// Save appointment for current user
function saveAppointment(appointmentData) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Utente non autenticato'
            };
        }

        // Validate appointment data
        if (!appointmentData.date || !appointmentData.time || !appointmentData.service) {
            return {
                success: false,
                message: 'Tutti i campi sono obbligatori'
            };
        }

        const appointments = safeLocalStorageGet('appointments', []);

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

        if (!safeLocalStorageSet('appointments', appointments)) {
            return {
                success: false,
                message: 'Errore durante la prenotazione. Riprova.'
            };
        }

        return {
            success: true,
            message: 'Appuntamento prenotato con successo!',
            appointment: newAppointment
        };
    } catch (error) {
        console.error('Save appointment error:', error);
        return {
            success: false,
            message: 'Errore durante la prenotazione. Riprova.'
        };
    }
}

// Get available time slots for a specific date
function getAvailableTimeSlots(date) {
    try {
        const allTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
        const appointments = safeLocalStorageGet('appointments', []);

        // Get taken time slots for this date (excluding cancelled)
        const takenSlots = appointments
            .filter(apt => apt.date === date && apt.status !== 'cancelled')
            .map(apt => apt.time);

        // Return available slots
        return allTimeSlots.filter(slot => !takenSlots.includes(slot));
    } catch (error) {
        console.error('Get available time slots error:', error);
        return [];
    }
}

// Delete appointment
function deleteAppointment(appointmentId) {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return false;

        let appointments = safeLocalStorageGet('appointments', []);
        appointments = appointments.filter(apt => !(apt.id === appointmentId && apt.userId === currentUser.id));

        return safeLocalStorageSet('appointments', appointments);
    } catch (error) {
        console.error('Delete appointment error:', error);
        return false;
    }
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
    try {
        const users = safeLocalStorageGet('users', []);
        // Don't include passwords in the list
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt
        }));
    } catch (error) {
        console.error('Get all users error:', error);
        return [];
    }
}

// Get all appointments (admin only) - Security handled by admin.html login
function getAllAppointments() {
    try {
        const appointments = safeLocalStorageGet('appointments', []);
        const users = safeLocalStorageGet('users', []);

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
    } catch (error) {
        console.error('Get all appointments error:', error);
        return [];
    }
}

// Update appointment status (admin only)
function updateAppointmentStatus(appointmentId, status) {
    try {
        let appointments = safeLocalStorageGet('appointments', []);
        const aptIndex = appointments.findIndex(apt => apt.id === appointmentId);

        if (aptIndex === -1) {
            return {
                success: false,
                message: 'Appuntamento non trovato'
            };
        }

        appointments[aptIndex].status = status;
        appointments[aptIndex].updatedAt = new Date().toISOString();

        if (!safeLocalStorageSet('appointments', appointments)) {
            return {
                success: false,
                message: 'Errore durante l\'aggiornamento. Riprova.'
            };
        }

        return {
            success: true,
            message: 'Stato aggiornato con successo!'
        };
    } catch (error) {
        console.error('Update appointment status error:', error);
        return {
            success: false,
            message: 'Errore durante l\'aggiornamento. Riprova.'
        };
    }
}

// Delete any appointment (admin only)
function adminDeleteAppointment(appointmentId) {
    try {
        let appointments = safeLocalStorageGet('appointments', []);
        appointments = appointments.filter(apt => apt.id !== appointmentId);
        return safeLocalStorageSet('appointments', appointments);
    } catch (error) {
        console.error('Admin delete appointment error:', error);
        return false;
    }
}

// Get dashboard statistics (admin only)
function getAdminStats() {
    try {
        const users = safeLocalStorageGet('users', []);
        const appointments = safeLocalStorageGet('appointments', []);

        const today = new Date().toISOString().split('T')[0];
        const appointmentsToday = appointments.filter(apt => apt.date === today);
        const pendingAppointments = appointments.filter(apt => !apt.status || apt.status === 'pending');

        return {
            totalUsers: users.length,
            totalAppointments: appointments.length,
            appointmentsToday: appointmentsToday.length,
            pendingAppointments: pendingAppointments.length
        };
    } catch (error) {
        console.error('Get admin stats error:', error);
        return {
            totalUsers: 0,
            totalAppointments: 0,
            appointmentsToday: 0,
            pendingAppointments: 0
        };
    }
}
