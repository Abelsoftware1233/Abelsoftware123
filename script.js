document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    
    // Check of gebruiker is ingelogd
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Velden vullen
    document.getElementById('username').value = currentUser.username;
    document.getElementById('email').value = currentUser.email || '';
    
    if(profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Gegevens updaten in localStorage
            currentUser.email = document.getElementById('email').value;
            currentUser.firstName = document.getElementById('firstName').value;
            currentUser.lastName = document.getElementById('lastName').value;
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            const status = document.getElementById('statusMessage');
            status.textContent = "✅ Profiel bijgewerkt!";
            status.style.display = "block";
            status.className = "success";
        });
    }
});

// Logout functie
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
