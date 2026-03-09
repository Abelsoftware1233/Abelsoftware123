document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Voorkom de 405 error (geen POST naar HTML)

            // Haal de waarden uit de velden
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            // Jouw Admin Gegevens
            const ADMIN_USER = "admin";
            const ADMIN_PASS = "admin123"; 

            if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
                // 1. Zet de login-vinkjes in de browser (localStorage)
                localStorage.setItem('isLoggedIn', 'true');
                
                // 2. Sla de profielgegevens op voor de profielpagina
                const userData = {
                    username: usernameInput,
                    email: "admin@abelsoftware.nl", // Jouw email
                    role: 'Admin',
                    loginTime: new Date().toLocaleString()
                };
                localStorage.setItem('currentUser', JSON.stringify(userData));

                // 3. Direct door naar het dashboard
                window.location.href = 'admin.html';
            } else {
                // Neon-stijl alert
                alert('❌ Onjuiste gebruikersnaam of wachtwoord.');
            }
        });
    }
});
