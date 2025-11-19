// script.js (Afhandeling van Registratie, Login, en Logout)

document.addEventListener('DOMContentLoaded', () => {
    
    // Functie om statusboodschappen te tonen
    const showStatus = (statusElement, message, isError) => {
        statusElement.textContent = message;
        // Gebruik de kleur die je hebt gedefinieerd in de CSS
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
            
            // 1. Client-side validatie: Wachtwoorden vergelijken
            if (password !== passwordConfirm) {
                showStatus(statusMessage, '❌ Wachtwoorden komen niet overeen. Probeer het opnieuw.', true);
                return; 
            }
            
            // Data klaarmaken voor de server (stuurt GEEN password_confirm mee)
            const registrationData = {
                username: registrationForm.username.value,
                email: registrationForm.email.value,
                password: password
            };

            try {
                // POST-verzoek naar de backend
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                const resultText = await response.text();

                if (response.ok) {
                    showStatus(statusMessage, resultText, false); 
                    registrationForm.reset(); 
                    // Stuur door naar de login-pagina na succes
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
                // POST-verzoek naar de backend
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json(); // We verwachten een JSON object met een token

                if (response.ok) {
                    // 1. Inloggen succesvol! Sla de token op in de browser
                    localStorage.setItem('authToken', result.token); 
                    
                    showStatus(statusMessage, '✅ Succesvol ingelogd! U wordt doorgestuurd...', false); 
                    loginForm.reset();
                    
                    // 2. Stuur door naar de profielpagina
                    setTimeout(() => {
                        window.location.href = 'profile.html'; 
                    }, 1500);

                } else {
                    // Inloggegevens zijn onjuist (status 401 of 400)
                    showStatus(statusMessage, '❌ Login mislukt: ' + (result.message || 'Onjuiste inloggegevens.'), true);
                }
            } catch (error) {
                showStatus(statusMessage, '❌ Er is een netwerkfout opgetreden bij het inloggen.', true);
            }
        });
    }


    // --- LOGICA VOOR UITLOGGEN (logout.html) ---
    // Dit controleert of de huidige pagina eindigt op 'logout.html'
    if (window.location.pathname.endsWith('logout.html')) {
        
        // 1. Verwijder het token uit de lokale opslag (de belangrijkste stap!)
        localStorage.removeItem('authToken'); 
        console.log("Token verwijderd. Gebruiker is uitgelogd.");
        
        // 2. Stuur een bericht naar de server (voor server-side cleanup, optioneel)
        fetch('/api/logout', {
            method: 'POST'
        })
        .catch(error => {
            console.log("Netwerkfout bij server logout, maar browser is al uitgelogd.");
        })
        .finally(() => {
            // 3. Stuur de gebruiker door naar de homepage
            setTimeout(() => {
                window.location.href = 'index.html'; // Of 'login.html'
            }, 2000); // 2 seconden wachten
        });
    }


    // --- LOGICA VOOR PROFIEL PAGINA (profile.html) ---
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            // Als er geen token is, stuur dan terug naar de login-pagina
            alert('U bent niet ingelogd. U wordt doorgestuurd naar de login pagina.');
            window.location.href = 'login.html';
            return;
        }

        // Functie om de gebruikersgegevens op te halen en in te vullen
        async function loadUserProfile() {
            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Stuur het authenticatie token mee met het verzoek!
                        'Authorization': 'Bearer ' + authToken 
                    }
                });

                if (response.ok) {
                    const user = await response.json(); 
                    
                    // Vul de HTML-velden in
                    document.getElementById('username').value = user.username || '';
                    document.getElementById('email').value = user.email || '';
                    document.getElementById('firstName').value = user.firstName || '';
                    document.getElementById('lastName').value = user.lastName || '';
                    
                } else {
                    console.error('Fout bij het laden van profiel:', response.statusText);
                    alert('❌ Token verlopen of ongeldig. Log opnieuw in.');
                    // window.location.href = 'login.html'; // Stuur terug naar login
                }
            } catch (error) {
                console.error('Netwerkfout:', error);
                alert('❌ Kan geen verbinding maken met de server om profiel op te halen.');
            }
        }

        loadUserProfile();

        // Functie om de wijzigingen op te slaan
        profileForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validatie van wachtwoord wijziging
            if (newPassword && newPassword !== confirmPassword) {
                alert('❌ Het nieuwe wachtwoord en de bevestiging komen niet overeen.');
                return;
            }

            // Maak het data-object voor de POST-aanvraag
            const updateData = {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                newPassword: newPassword || null 
            };

            try {
                const response = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken
                    },
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    alert('✅ Profiel succesvol bijgewerkt!');
                    // Maak de wachtwoordvelden leeg na succesvolle update
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                } else {
                    const errorText = await response.text();
                    alert('❌ Update mislukt: ' + errorText);
                }
            } catch (error) {
                alert('❌ Kan de wijzigingen niet opslaan. Probeer het later opnieuw.');
            }
        });
    }
});
