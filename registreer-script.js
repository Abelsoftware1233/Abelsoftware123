document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Haal de waarden op uit de velden
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // 2. Basis controles
            if (password !== confirmPassword) {
                alert("❌ Wachtwoorden komen niet overeen!");
                return;
            }

            // 3. Haal de bestaande gebruikers op (of maak een lege lijst)
            let users = JSON.parse(localStorage.getItem('echo_users')) || [
                { id: 1, username: 'Abel_Admin', email: 'info@abelsoftware123.com', role: 'Admin' }
            ];

            // 4. Controleer of de gebruikersnaam of email al bestaat
            const exists = users.some(u => u.username === username || u.email === email);
            if (exists) {
                alert("❌ Gebruikersnaam of e-mail is al in gebruik!");
                return;
            }

            // 5. Voeg de nieuwe gebruiker toe
            const newUser = {
                id: users.length + 1,
                username: username,
                email: email,
                role: 'User', // Nieuwe registraties zijn standaard 'User'
                registrationDate: new Date().toLocaleDateString()
            };

            users.push(newUser);

            // 6. Sla de bijgewerkte lijst op in localStorage
            localStorage.setItem('echo_users', JSON.stringify(users));

            // 7. Succes melding en doorsturen
            alert("✅ Registratie succesvol! Je kunt nu inloggen.");
            window.location.href = 'login.html';
        });
    }
});
