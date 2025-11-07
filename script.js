// script.js

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');

    // Functie om profielgegevens te laden wanneer de pagina wordt geopend
    function loadProfile() {
        // Normaal gesproken zou de user ID uit een beveiligde sessie/JWT worden gehaald.
        // Voor dit voorbeeld simuleren we een GET-aanroep.
        fetch('/api/profile/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Vervang dit door echte authenticatie
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load profile.');
            }
            return response.json();
        })
        .then(data => {
            // Vul de formulier velden met de ontvangen gegevens
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            console.log('Profile loaded successfully.');
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            alert('Could not load user profile.');
        });
    }

    // Functie om het profiel op te slaan
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = {
                // We sturen alleen bewerkbare velden en de wachtwoorden
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                newPassword: document.getElementById('newPassword').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };

            if (formData.newPassword !== formData.confirmPassword) {
                alert('New passwords do not match!');
                return;
            }

            fetch(this.action, { // De actie is ingesteld op '/api/profile/update'
                method: 'POST', // Of PUT, afhankelijk van je REST-conventie
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Vervang dit
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
                    return response.json().then(err => {
                        throw new Error(err.message || 'Failed to update profile.');
                    });
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert(`Error: ${error.message}`);
            });
        });

        // Laad profiel bij het starten van de pagina
        loadProfile();
    }
});
