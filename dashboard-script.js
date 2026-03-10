document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Beveiliging: check of er iemand is ingelogd
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Naam aanpassen
    const nameToDisplay = currentUser.firstName ? currentUser.firstName : currentUser.username;
    document.getElementById('welcomeGreeting').textContent = `Welkom terug, ${nameToDisplay}!`;

    // 2. Rol badge aanpassen
    const roleBadge = document.getElementById('userRoleBadge');
    roleBadge.textContent = currentUser.role || 'Gebruiker';
    if(currentUser.role === 'Admin') {
        roleBadge.style.borderColor = '#00f0ff';
        roleBadge.style.color = '#00f0ff';
    }

    // 3. Profielfoto inladen
    if (currentUser.profilePic) {
        document.getElementById('displayPic').src = currentUser.profilePic;
    }

    // 4. Datum van vandaag tonen
    const opties = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('nl-NL', opties);
});
