document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('statusMessage');

    // Functie om de statusboodschap te tonen
    const showStatus = (message, isError) => {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'red' : 'green';
        statusMessage.style.display = 'block';
    };

    form.addEventListener('submit', async (event) => {
        // Stop de standaard formulier actie (zodat we het met JavaScript kunnen doen)
        event.preventDefault(); 
        
        statusMessage.style.display = 'none'; // Verberg vorige melding

        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const passwordConfirm = form.password_confirm.value;

        // **STAP 1: Wachtwoorden Vergelijken (Client-Side Validatie)**
        if (password !== passwordConfirm) {
            showStatus('❌ Wachtwoorden komen niet overeen. Probeer het opnieuw.', true);
            form.password.focus();
            return; // Stop het verzenden
        }
        
        // **STAP 2: Maak het data-object aan voor de server**
        // BELANGRIJK: Hier wordt 'password_confirm' NIET meegestuurd!
        const registrationData = {
            username: username,
            email: email,
            password: password
        };

        // **STAP 3: Stuur de data naar de server (POST /api/register)**
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // We versturen JSON
                },
                body: JSON.stringify(registrationData) // De gegevens als JSON string
            });

            const resultText = await response.text();

            if (response.ok) {
                // HTTP 200 OK - Registratie is gelukt
                showStatus(resultText, false); 
                form.reset(); // Maak het formulier leeg
                
                // Optioneel: Stuur de gebruiker door naar de inlogpagina na 3 seconden
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 3000);

            } else {
                // HTTP 400 Bad Request of andere fout
                showStatus(resultText, true);
            }
        } catch (error) {
            // Fout bij de netwerkverbinding of de server reageert niet
            console.error('Fout bij registratie:', error);
            showStatus('❌ Er is een netwerkfout opgetreden. Controleer de verbinding.', true);
        }
    });
});
