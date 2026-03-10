document.addEventListener('DOMContentLoaded', function() {
    // 1. Veiligheidscontrole
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Haal de echte data op uit PostgreSQL via je Java API
    loadUsersFromDatabase();
});

// Functie om de lijst te verversen
async function loadUsersFromDatabase() {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Kon gebruikers niet ophalen');
        
        const users = await response.json();
        tableBody.innerHTML = ''; 

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td><span class="badge">${user.role || 'User'}</span></td>
                    <td>
                        <button class="btn-delete" onclick="deleteUserFromServer(${user.id})">Verwijderen</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Databasefout:", error);
        tableBody.innerHTML = '<tr><td colspan="5">Fout bij laden van database...</td></tr>';
    }
}

// Functie om echt uit de database te verwijderen
async function deleteUserFromServer(id) {
    if (confirm('Weet je zeker dat je deze gebruiker permanent uit de database wilt wissen?')) {
        try {
            const response = await fetch(`/api/users/${id}`, { 
                method: 'DELETE' 
            });
            
            if (response.ok) {
                loadUsersFromDatabase(); // Ververs de tabel direct
            } else {
                alert("Verwijderen mislukt op de server.");
            }
        } catch (error) {
            console.error("Netwerkfout bij verwijderen:", error);
        }
    }
}
