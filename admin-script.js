document.addEventListener('DOMContentLoaded', function() {
    // 1. Controleer of de admin wel is "ingelogd"
    // We checken of er een sessie-vinkje in de browser staat
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Toegang geweigerd. Log eerst in.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Zet de admin naam op het scherm
    const adminData = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Admin' };
    document.getElementById('adminName').textContent = adminData.username;

    // 3. Haal de gebruikers op
    renderUsers();
});

// Simuleer een database met een lijstje in JavaScript
function getStoredUsers() {
    const savedUsers = localStorage.getItem('echo_users');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // Standaard data als de lijst nog leeg is
        const defaultUsers = [
            { id: 1, username: 'Abel_Admin', email: 'abelsoftware123@hotmail.com', role: 'Admin' },
            { id: 2, username: 'Kevin', email: 'kevin@echoai.com', role: 'User' }
        ];
        localStorage.setItem('echo_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    },
{ id: 3, username: 'Samantha', email: 'samantha.sabrina@gmail.com', role: 'User' }
        ];
        localStorage.setItem('echo_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    },
{ id: 4, username: 'Britney', email: 'britneypears@live.be', role: 'User' }
        ];
        localStorage.setItem('echo_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

function renderUsers() {
    const users = getStoredUsers();
    const tableBody = document.getElementById('userTableBody');
    
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

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
}

function deleteUser(id) {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        let users = getStoredUsers();
        // Filter de gebruiker eruit
        users = users.filter(user => user.id !== id);
        // Sla de nieuwe lijst op
        localStorage.setItem('echo_users', JSON.stringify(users));
        // Update de tabel
        renderUsers();
    }
}

// Uitlog functie koppelen aan je knop
window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
