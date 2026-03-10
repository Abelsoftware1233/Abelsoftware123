document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // 1. Hardcoded Admin Gegevens
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin1501";

    // 2. Haal de geregistreerde gebruikers op uit de database (echo_users)
    const storedUsers = JSON.parse(localStorage.getItem('echo_users')) || [];

    // CHECK 1: Is het de Admin?
    if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
        localStorage.setItem('isLoggedIn', 'true');
        const userData = {
            username: "Abelsoftware123_Admin",
            email: "admin@abelsoftware.nl",
            role: 'Admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Admin gaat naar het dashboard
        window.location.href = 'admin.html';
        return; 
    }

    // CHECK 2: Is het een normale User?
    // We zoeken in de database of de gebruikersnaam en het wachtwoord kloppen
    // Let op: in je registratie-script moet je zorgen dat het wachtwoord ook wordt opgeslagen
    const foundUser = storedUsers.find(u => u.username === usernameInput);

    // Voor deze test gaan we ervan uit dat het wachtwoord voor test-users gelijk is aan hun username 
    // of pas dit aan naar: foundUser.password === passwordInput
    if (foundUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(foundUser));

        // Controleer de rol voor de juiste pagina
        if (foundUser.role === 'Admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'profiel.html';
        }
    } else {
        alert('Foutieve inloggegevens! Deze gebruiker bestaat niet of het wachtwoord is onjuist.');
    }
});
