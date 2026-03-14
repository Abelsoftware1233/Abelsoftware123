/**
 * Echo AI - Profile Management System
 * Version: 1.2
 * Integratie met Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Laad de huidige gegevens van de ingelogde gebruiker
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Vul de velden in op de pagina (indien aanwezig)
    // We splitsen de username even op voor First/Last name velden als test
    if (document.getElementById('firstName')) {
        document.getElementById('firstName').value = currentUser.firstName || currentUser.username;
    }
    if (document.getElementById('lastName')) {
        document.getElementById('lastName').value = currentUser.lastName || "";
    }
    if (document.getElementById('emailAddress')) {
        document.getElementById('emailAddress').value = currentUser.email;
    }
});

// 3. De hoofdfunctie om wijzigingen op te slaan
window.saveProfileChanges = function() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let allUsers = JSON.parse(localStorage.getItem('echo_users')) || [];

    // Haal de nieuwe waarden uit de velden
    const newFirst = document.getElementById('firstName').value;
    const newLast = document.getElementById('lastName').value;
    const newEmail = document.getElementById('emailAddress').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    // Validatie: Wachtwoord wijzigen
    if (newPass !== "") {
        if (newPass !== confirmPass) {
            alert("Wachtwoorden komen niet overeen!");
            return;
        }
        currentUser.password = newPass;
    }

    // Update currentUser object
    currentUser.firstName = newFirst;
    currentUser.lastName = newLast;
    currentUser.username = newFirst; // We houden username gelijk aan First Name voor het dashboard
    currentUser.email = newEmail;

    // 4. Synchroniseer met de hoofd-database (echo_users)
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...currentUser };
    }

    // 5. Alles permanent opslaan in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('echo_users', JSON.stringify(allUsers));

    // Feedback aan de gebruiker
    alert("Gegevens succesvol bijgewerkt!");
    
    // Optioneel: herlaad de pagina om de nieuwe naam in de sidebar te zien
    window.location.reload();
};
