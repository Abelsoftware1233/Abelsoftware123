document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Voorkom dat de pagina herlaadt of een POST probeert

            // Haal de waarden uit de invoervelden
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            // Hardcoded Admin Gegevens (zoals je aangaf dat je deze al had)
            const ADMIN_USER = "admin";
            const ADMIN_PASS = "admin123"; // Pas dit aan naar jouw wachtwoord

            if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
                // 1. Sla de login-status op zodat admin.html weet dat we binnen mogen
                localStorage.setItem('isLoggedIn', 'true');
                
                // 2. Sla de gebruikersnaam op voor het profiel-gedeelte
                const userData = {
                    username: usernameInput,
                    role: 'Admin',
                    loginTime: new Date().toLocaleString()
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));

                // 3. Verwijs door naar de admin pagina
                window.location.href = 'admin.html';
            } else {
                // Foutmelding als de gegevens niet kloppen
                alert('Onjuiste gebruikersnaam of wachtwoord. Probeer het opnieuw.');
            }
        });
    }
});
