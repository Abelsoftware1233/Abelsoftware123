document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // Hardcoded Admin Gegevens (pas deze aan indien nodig)
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin1501";

    if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
        // Sessie opslaan
        localStorage.setItem('isLoggedIn', 'true');
        const userData = {
            username: usernameInput,
            email: "admin@abelsoftware.nl",
            role: 'Admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Doorsturen naar admin paneel
        window.location.href = 'admin.html';
    } else {
        alert('Foutieve inloggegevens!');
    }
});
