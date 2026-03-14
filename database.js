/**
 * Echo AI - Permanente Database
 * Hier voeg je handmatig gebruikers toe die je via EmailJS binnenkrijgt.
 */

const PERMANENT_USERS = [
    { 
        id: 1, 
        username: 'Abelsoftware123_Admin', 
        email: 'abelsoftware123@hotmail.nl', 
        role: 'Admin', 
        password: 'admin1501' 
    },
    { 
        id: 2, 
        username: 'admin', 
        email: 'info@abelsoftware.nl', 
        role: 'Admin', 
        password: 'admin1501' 
    },
    // --- VOEG HIERONDER NIEUWE GEBRUIKERS TOE UIT JE MAIL ---
    { 
        id: 1000, 
        username: 'VoorbeeldGebruiker', 
        email: 'gebruiker@hotmail.com', 
        role: 'User', 
        password: 'wachtwoord_uit_mail' 
    }
];

// Deze functie zorgt dat de admin-pagina en login-pagina de data kunnen lezen
function getPermanentUsers() {
    return PERMANENT_USERS;
}

/**
 * Echo AI - Vaste Database
 * Voeg hier handmatig gebruikers toe die permanent moeten blijven.
 */
const PERMANENT_USERS = [
    { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.nl', role: 'Admin', password: 'admin1501' },
    { id: 2, username: 'admin', email: 'info@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
    // Voeg hier de volgende toe: { id: 3, username: 'Naam', email: '...', password: '...', role: 'User' },
];

function getPermanentUsers() {
    return PERMANENT_USERS;
}

/**
 * Echo AI - Vaste Database
 * Versie: 1.0
 * Eigenaar: Abelsoftware123
 */

const PERMANENT_USERS = [
    { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.nl', role: 'Admin', password: 'admin1501' },
    { id: 2, username: 'admin', email: 'info@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
];

function getPermanentUsers() {
    return PERMANENT_USERS;
}
