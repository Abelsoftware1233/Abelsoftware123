// auth.js
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !currentUser || currentUser.role !== 'Admin') {
        alert("Toegang geweigerd: Je bent geen Admin.");
        localStorage.clear(); // Wis foute sessies direct
        window.location.replace('login.html');
        return false;
    }
    return true;
}

function logout() {
    localStorage.clear();
    window.location.replace('login.html');
}
