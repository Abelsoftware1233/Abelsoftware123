// script.js
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Functie om de gebruikersgegevens op te halen en in te vullen
    async function loadUserProfile() {
        try {
            // 1. Haal de gegevens van de ingelogde gebruiker op
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // BELANGRIJK: Hier moet je eventueel een authenticatie token toevoegen
                    // 'Authorization': 'Bearer ' + localStorage.getItem('authToken') 
                }
            });

            if (response.ok) {
                const user = await response.json(); // De server stuurt de gebruikersgegevens (JSON)
                
                // 2. Vul de HTML-velden in met de ontvangen gegevens
                usernameInput.value = user.username || '';
                emailInput.value = user.email || '';
                firstNameInput.value = user.firstName || '';
                lastNameInput.value = user.lastName || '';
                
                // Optioneel: Update de profielfoto als de API deze linkt
                // document.querySelector('img').src = user.profilePictureUrl || 'default.png';

            } else {
                // Als de server een fout geeft (bijv. 401 Unauthorized), stuur dan naar login
                console.error('Fout bij het laden van profiel:', response.statusText);
                alert('❌ Fout bij het laden van profielgegevens. Log opnieuw in.');
                // window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Netwerkfout:', error);
            alert('❌ Kan geen verbinding maken met de server om profiel op te halen.');
        }
    }

    // Roep de functie aan zodra de pagina geladen is
    loadUserProfile();


    // Functie om de wijzigingen op te slaan
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Voorkom standaard formulier verzending
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // 1. Validatie van wachtwoord wijziging
        if (newPassword && newPassword !== confirmPassword) {
            alert('❌ Het nieuwe wachtwoord en de bevestiging komen niet overeen.');
            confirmPasswordInput.focus();
            return;
        }

        // 2. Maak het data-object voor de POST-aanvraag
        const updateData = {
            email: emailInput.value,
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            // Stuur het nieuwe wachtwoord alleen mee als het is ingevuld
            newPassword: newPassword || null 
        };

        // 3. Stuur de data naar de server
        try {
            const response = await fetch('/api/profile/update', {
                method: 'POST', // Dit komt overeen met action="/api/profile/update" method="POST"
                headers: {
                    'Content-Type': 'application/json',
                    // BELANGRIJK: Vergeet de authenticatie token niet!
                    // 'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                alert('✅ Profiel succesvol bijgewerkt!');
                // Maak de wachtwoordvelden leeg na succesvolle update
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
            } else {
                const errorText = await response.text();
                alert('❌ Update mislukt: ' + errorText);
            }
        } catch (error) {
            console.error('Netwerkfout bij opslaan:', error);
            alert('❌ Kan de wijzigingen niet opslaan. Probeer het later opnieuw.');
        }
    });
});
