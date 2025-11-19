// script.js (Aangepast voor zowel Registratie als Login)

document.addEventListener('DOMContentLoaded', () => {
    
    // Functie om statusboodschappen te tonen (gebruikt op beide pagina's)
    const showStatus = (statusElement, message, isError) => {
        statusElement.textContent = message;
        statusElement.style.color = isError ? 'red' : 'green';
        statusElement.style.display = 'block';
    };

    // --- LOGICA VOOR REGISTRATIE (registreer.html) ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const statusMessage = document.getElementById('statusMessage');

        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            showStatus(statusMessage, '', false); 

            const password = registrationForm.password.value;
            const passwordConfirm = registrationForm.password_confirm.value;
            
            if (password !== passwordConfirm) {
                showStatus(statusMessage, '❌ Wachtwoorden komen niet overeen. Probeer het opnieuw.', true);
                return; 
            }
            
            const registrationData = {
                username: registrationForm.username.value,
                email: registrationForm.email.value,
                password: password
            };

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                const resultText = await response.text();

                if (response.ok) {
                    showStatus(statusMessage, resultText, false); 
                    registrationForm.reset(); 
                    setTimeout(() => {
                        window.location.href = 'login.html'; 
                    }, 3000);
                } else {
                    showStatus(statusMessage, resultText, true);
                }
            } catch (error) {
                showStatus(statusMessage, '❌ Er is een netwerkfout opgetreden.', true);
            }
        });
    }


    // --- LOGICA VOOR INLOGGEN (login.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const statusMessage = document.getElementById('statusMessage');

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            showStatus(statusMessage, '', false); 

            const loginData = {
                usernameOrEmail: loginForm.usernameOrEmail.value,
                password: loginForm.password.value
            };

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json(); // We verwachten nu een JSON object

                if (response.ok) {
                    // 1. Inloggen succesvol! Sla de token op.
                    // Dit token is nodig voor de profielpagina
                    localStorage.setItem('authToken', result.token); 
                    
                    showStatus(statusMessage, '✅ Succesvol ingelogd! U wordt doorgestuurd...', false); 
                    loginForm.reset();
                    
                    // 2. Stuur door naar de profielpagina
                    setTimeout(() => {
                        window.location.href = 'profile.html'; 
                    }, 1500);

                } else {
                    // Inloggegevens zijn onjuist
                    showStatus(statusMessage, '❌ Login mislukt: ' + (result.message || 'Onjuiste inloggegevens.'), true);
                }
            } catch (error) {
                showStatus(statusMessage, '❌ Er is een netwerkfout opgetreden bij het inloggen.', true);
            }
        });
    }
});
