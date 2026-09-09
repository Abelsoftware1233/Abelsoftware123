document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('statusMessage');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Voorkomt de 405 error

            // 1. Haal de waarden op uit jouw HTML velden
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password_confirm').value;

            // 2. Controleer of wachtwoorden gelijk zijn
            if (password !== passwordConfirm) {
                showStatus("❌ Wachtwoorden komen niet overeen!", "error");
                return;
            }

            // 3. Haal de bestaande gebruikerslijst op uit de browser (localStorage)
            // Als er nog niets is, maken we een lijst met de standaard Admin
            let users = JSON.parse(localStorage.getItem('echo_users')) || [
                { id: 1, username: 'Abel_Admin', email: 'info@abelsoftware123.com', role: 'Admin' }
            ];

            // 4. Check of de gebruikersnaam of e-mail al bestaat
            const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
            
            if (userExists) {
                showStatus("❌ Gebruikersnaam of e-mail is al bezet!", "error");
                return;
            }

            // 5. Maak de nieuwe gebruiker aan
            const newUser = {
                id: users.length + 1,
                username: username,
                email: email,
                password: password, // In een echte app wordt dit versleuteld
                role: 'User',
                regDate: new Date().toLocaleDateString()
            };

            // 6. Opslaan in de 'database' van de browser
            users.push(newUser);
            localStorage.setItem('echo_users', JSON.stringify(users));

            // 7. Succesmelding tonen in jouw Neon stijl
            showStatus("✅ Account aangemaakt! Je wordt doorgestuurd naar login...", "success");

            // Na 2 seconden automatisch naar de inlogpagina
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Functie om de statusmeldingen te tonen (Neon Style)
    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = type; // Gebruikt .error of .success uit je CSS
        statusMessage.style.display = 'block';
        
        // Scroll naar boven zodat de gebruiker de melding ziet
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
