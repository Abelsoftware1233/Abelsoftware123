/**
 * Echo AI - Profile Management System
 * Version: 1.3
 * Integratie met ProfileController.java Backend
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Laad de huidige gegevens van de ingelogde gebruiker voor de UI
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Vul de velden in op de pagina
    if (document.getElementById('firstName')) {
        document.getElementById('firstName').value = currentUser.firstName || currentUser.username || "";
    }
    if (document.getElementById('lastName')) {
        document.getElementById('lastName').value = currentUser.lastName || "";
    }
    if (document.getElementById('emailAddress')) {
        document.getElementById('emailAddress').value = currentUser.email || "";
    }
});

/**
 * De hoofdfunctie om wijzigingen op te slaan naar de Java Backend
 */
window.saveProfileChanges = async function() {
    // 1. Haal de waarden op uit de HTML velden
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const email = document.getElementById('emailAddress')?.value;
    const newPass = document.getElementById('newPassword')?.value;
    const confirmPass = document.getElementById('confirmPassword')?.value;

    // 2. Validatie: Wachtwoord controleren
    if (newPass && newPass !== "") {
        if (newPass !== confirmPass) {
            alert("❌ Wachtwoorden komen niet overeen!");
            return;
        }
    }

    // 3. Maak het data object (moet matchen met UpdateProfileRequest.java)
    const updateData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: newPass || null // Stuur null als er geen nieuw wachtwoord is
    };

    // 4. Maak FormData aan (nodig voor @RequestPart in de Controller)
    const formData = new FormData();
    
    // Voeg de JSON data toe als een Blob met type application/json
    formData.append('data', new Blob([JSON.stringify(updateData)], {
        type: "application/json"
    }));

    // Optioneel: Voeg een foto toe als je een input hebt met id 'profilePhoto'
    const photoInput = document.getElementById('profilePhoto');
    if (photoInput && photoInput.files[0]) {
        formData.append('photo', photoInput.files[0]);
    }

    try {
        // Toon een melding dat we bezig zijn
        console.log("Profiel aan het bijwerken via API...");

        // 5. Verstuur naar de backend API
        const response = await fetch('/api/profile/update', {
            method: 'POST',
            body: formData
            // Let op: GEEN Content-Type header zetten, de browser doet dit zelf voor FormData!
        });

        if (response.ok) {
            const result = await response.text();
            alert("✅ " + result);
            
            // 6. Synchroniseer lokale opslag voor het dashboard
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.firstName = firstName;
            currentUser.lastName = lastName;
            currentUser.email = email;
            if (newPass) currentUser.password = newPass;

            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Herlaad de pagina om wijzigingen (zoals naam in sidebar) te tonen
            window.location.reload();
        } else {
            const errorMsg = await response.text();
            alert("❌ Update mislukt: " + errorMsg);
        }
    } catch (error) {
        console.error("Netwerkfout:", error);
        alert("❌ Kan geen verbinding maken met de server. Is de backend gestart?");
    }
};
