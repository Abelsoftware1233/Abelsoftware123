document.addEventListener('DOMContentLoaded', function() {
    // 1. Controleer of de admin is ingelogd (veiligheid)
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Haal de gebruikers op uit je Java Database
    fetchUsersFromDatabase();
});

// Haal gebruikers op via je Java Controller (@GetMapping("/api/users"))
async function fetchUsersFromDatabase() {
    try {
        const response = await fetch('/api/users'); 
        if (!response.ok) throw new Error('Netwerk respons was niet ok');
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error("Fout bij ophalen gebruikers:", error);
        // Optioneel: toon een foutmelding in de tabel
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge">${user.role || 'User'}</span></td>
                <td>
                    <button class="btn-delete" onclick="confirmDelete(${user.id})">Verwijderen</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Verwijder gebruiker via je Java Controller (@DeleteMapping("/api/users/{id}"))
async function confirmDelete(userId) {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen uit de database?')) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchUsersFromDatabase(); // Ververs de lijst na verwijderen
            } else {
                alert("Verwijderen mislukt.");
            }
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
        }
    }
}
