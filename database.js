/**
 * Echo AI - Permanente Database
 * Versie: 1.1
 * Eigenaar: Abelsoftware123
 * * Instructie: Voeg hier handmatig gebruikers toe die je via EmailJS binnenkrijgt.
 */

// Wachtwoorden staan hier NIET meer leesbaar, alleen als PBKDF2-SHA256 hash.
// Hash maken voor een nieuw wachtwoord: zie hashPassword() hieronder (in de browserconsole:
//   await hashPassword("jouw-nieuwe-wachtwoord")  en plak de uitkomst hier).
const ADMIN_PW_SALT = 'abelsoftware123-admin-v1';
const ADMIN_PW_ITERATIONS = 200000;
const ADMIN_PASSWORD_HASH = '32950f27231d1825f4df412b604782039925a8dd3adf2333328276cd5951c4c4';

async function hashPassword(password) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Veilige context (https) nodig om in te loggen.');
    }
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(ADMIN_PW_SALT), iterations: ADMIN_PW_ITERATIONS },
        key, 256
    );
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const PERMANENT_USERS = [
    { 
        id: 1, 
        username: 'Abelsoftware123_Admin', 
        email: 'abelsoftware123@hotmail.nl', 
        role: 'Admin', 
        passwordHash: ADMIN_PASSWORD_HASH 
    },
    { 
        id: 2, 
        username: 'admin', 
        email: 'info@abelsoftware.nl', 
        role: 'Admin', 
        passwordHash: ADMIN_PASSWORD_HASH 
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
