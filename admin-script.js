document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('userTableBody');

    async function loadAllUsers() {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const users = await response.json();
                tableBody.innerHTML = ''; // Maak tabel leeg

                users.forEach(user => {
                    const row = `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td><span class="badge">Actief</span></td>
                            <td>
                                <button class="btn-delete" onclick="deleteUser(${user.id})">Verwijderen</button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                alert("❌ Geen toegang tot admin gegevens.");
                window.location.href = "/profiel";
            }
        } catch (error) {
            console.error("Fout bij laden gebruikers:", error);
        }
    }

    loadAllUsers();
});

async function deleteUser(id) {
    if(confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if(response.ok) {
            location.reload(); // Ververs de lijst
        }
    }
}
