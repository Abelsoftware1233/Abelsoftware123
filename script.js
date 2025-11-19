// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('statusMessage');

    // Functie om de statusboodschap te tonen
    const showStatus = (message, isError) => {
        statusMessage.textContent = message;
        // Gebruik de kleur die je hebt gedefinieerd in de CSS, of gebruik groen/rood
        statusMessage.style.color = isError ? 'red' : 'green'; 
        statusMessage.style.display = 'block';
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Standaard actie stoppen
        
        statusMessage.style.display = 'none'; // Verberg vorige melding

        const password = form.password.value;
        const passwordConfirm = form.password_confirm.value;

        // **1. Wachtwoorden Vergelijken**
        if (password !== passwordConfirm) {
            showStatus('❌ Wachtwoorden komen niet overeen. Probeer het opnieuw.', true);
            form.password.focus();
            return;
        }
        
        // **2. Maak het JSON-object aan**
        const registrationData = {
            username: form.username.value,
            email: form.email.value,
            password: password // Alleen het 'password' veld sturen!
        };

        // **3. Stuur data naar de server**
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(registrationData)
            });

            const resultText = await response.text();

            if (response.ok) {
                // Succes! Stuur door naar de login pagina
                showStatus(resultText, false); 
                form.reset(); 
                
                // Stuur de gebruiker door na 3 seconden
                setTimeout(() => {
                    window.location.href = 'login.html'; 
                }, 3000);

            } else {
                // Fout van de server (bijv. gebruiker bestaat al)
                showStatus(resultText, true);
            }
        } catch (error) {
            // Netwerkfout
            console.error('Netwerkfout bij registratie:', error);
            showStatus('❌ Er is een netwerkfout opgetreden. Server niet bereikbaar.', true);
        }
    });
});
