// script.js (Deel van je gedeelde script.js file)

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const statusMessage = document.getElementById('profileStatusMessage'); // Voeg dit element toe aan je HTML

    // --- Functie om profielgegevens te laden bij het openen van de pagina ---
    function loadProfile() {
        fetch('/api/profile/me', {
            method: 'GET',
            headers: {
                // Vervang dit door de daadwerkelijke token van de ingelogde gebruiker
                'Authorization': 'Bearer YOUR_AUTH_TOKEN' 
            }
        })
        .then(response => {
            if (response.status === 401) { // Ongeautoriseerd
                throw new Error('You must be logged in to view this profile.');
            }
            if (!response.ok) {
                throw new Error('Failed to load profile data.');
            }
            return response.json();
        })
        .then(data => {
            // Vul de formulier velden
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            if (statusMessage) {
                statusMessage.textContent = error.message;
                statusMessage.style.display = 'block';
            } else {
                alert(error.message);
            }
        });
    }

    // --- Functie om het profiel op te slaan ---
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            // Data verzamelen voor de API (als JSON)
            const formData = {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                newPassword: newPassword,
                confirmPassword: confirmPassword // Hoewel de backend dit ook valideert, is dit consistent met de DTO
            };

            fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // CRUCIAAL voor de Java Controller
                    'Authorization': 'Bearer YOUR_AUTH_TOKEN'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    alert('Profile successfully updated!');
                    // Wachtwoord velden leegmaken na succesvolle update
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                } else {
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage || 'Failed to update profile.');
                    });
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert(`Error: ${error.message}`);
            });
        });

        // Start het laden van het profiel zodra het script wordt uitgevoerd
        loadProfile();
    }
});
