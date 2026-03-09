document.addEventListener('DOMContentLoaded', function() {
    // 1. Haal de gebruikers op zodra de pagina laadt
    fetchUsers();

    // 2. Toon de naam van de ingelogde admin (optioneel)
    // Dit haalt gegevens op van je profiel endpoint
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('adminName').textContent = data.username;
        })
        .catch(err => console.error('Fout bij ophalen admin profiel:', err));
});

function fetchUsers() {
    fetch('/api/admin/users')
        .then(response => {
            if (!response.ok) throw new Error('Geen toegang tot gebruikerslijst');
            return response.json();
        })
        .then(users => {
            const tableBody = document.getElementById('userTableBody');
            tableBody.innerHTML = ''; // Maak tabel leeg voor het laden

            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td><span class="badge">${user.role}</span></td>
                        <td>
                            <button class="btn-delete" onclick="deleteUser(${user.id})">Verwijderen</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Fout:', error);
            alert('Kon gebruikers niet laden. Ben je wel ingelogd als Admin?');
        });
}

function deleteUser(id) {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchUsers(); // Herlaad de lijst
                } else {
                    alert('Verwijderen mislukt.');
                }
            });
    }
}
