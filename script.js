document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    const status = document.getElementById('statusMessage');
    
    // 1. Check of gebruiker is ingelogd
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Velden vullen met opgeslagen data (zodat ze niet leeg zijn bij verversen)
    if (document.getElementById('username')) document.getElementById('username').value = currentUser.username || '';
    if (document.getElementById('email')) document.getElementById('email').value = currentUser.email || '';
    if (document.getElementById('firstName')) document.getElementById('firstName').value = currentUser.firstName || '';
    if (document.getElementById('lastName')) document.getElementById('lastName').value = currentUser.lastName || '';
    
    // 3. Formulier verwerken
    if(profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gegevens ophalen uit de velden
            currentUser.email = document.getElementById('email').value;
            currentUser.firstName = document.getElementById('firstName').value;
            currentUser.lastName = document.getElementById('lastName').value;
            
            // Wachtwoord check (optioneel)
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            
            if (newPass !== "" && newPass !== confirmPass) {
                status.textContent = "❌ Wachtwoorden komen niet overeen!";
                status.style.display = "block";
                status.className = "error";
                return;
            }

            // Gegevens echt opslaan in de browser
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Succes melding in jouw Neon stijl
            status.textContent = "✅ Profiel succesvol bijgewerkt!";
            status.style.display = "block";
            status.className = "success";

            // Scroll naar boven om de melding te zien
            window.scrollTo(0, 0);
        });
    }
});

// Logout functie die aangeroepen wordt door de knop in HTML
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
