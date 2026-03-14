/**
 * Echo AI - Permanente Database
 * Versie: 1.1
 * Eigenaar: Abelsoftware123
 * * Instructie: Voeg hier handmatig gebruikers toe die je via EmailJS binnenkrijgt.
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

/**
 * Deze functie zorgt dat de admin-paneel en login-pagina de data kunnen lezen.
 * NIET VERWIJDEREN.
 */
function getPermanentUsers() {
    return PERMANENT_USERS;
}

// Log ter bevestiging in de console (optioneel)
console.log("Echo AI Database geladen: " + PERMANENT_USERS.length + " vaste gebruikers.");
