document.addEventListener('DOMContentLoaded', function() {
    // 1. Controleer login status
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Toegang geweigerd. Log eerst in.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Admin naam weergeven
    const adminData = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Admin' };
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = adminData.username;
    }

    // 3. Zoekfunctie initialiseren
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            renderUsers(searchTerm);
        });
    }

    renderUsers();
});

function getStoredUsers() {
    const savedUsers = localStorage.getItem('echo_users');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        const defaultUsers = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.com', role: 'Admin' },
            { id: 2, username: 'Kevin', email: 'kevin@echoai.com', role: 'User' },
            { id: 3, username: 'Samantha', email: 'samantha.sabrina@gmail.com', role: 'User' },
            { id: 4, username: 'Britney', email: 'britneypears@live.be', role: 'User' },
            { id: 5, username: 'Thomas', email: 'thomas@echoai.com', role: 'User' },
            { id: 6, username: 'Sophie', email: 'sophie.v@gmail.com', role: 'User' },
            { id: 7, username: 'Lars', email: 'lars88@outlook.com', role: 'User' },
            { id: 8, username: 'Emma', email: 'emma.d@live.nl', role: 'User' },
            { id: 9, username: 'Milan', email: 'milan_dev@echoai.com', role: 'User' },
            { id: 10, username: 'Julia', email: 'julia.j@gmail.com', role: 'User' },
            { id: 11, username: 'Daan', email: 'daan_b@hotmail.com', role: 'User' },
            { id: 12, username: 'Lisa', email: 'lisa.m@echoai.com', role: 'User' },
            { id: 13, username: 'Bram', email: 'bram.v@live.be', role: 'User' },
            { id: 14, username: 'Tessa', email: 'tessa.t@gmail.com', role: 'User' },
            { id: 15, username: 'Jesse', email: 'jesse_w@echoai.com', role: 'User' },
            { id: 16, username: 'Lotte', email: 'lotte.s@outlook.com', role: 'User' },
            { id: 17, username: 'Sem', email: 'sem_v@gmail.com', role: 'User' },
            { id: 18, username: 'Fleur', email: 'fleur.d@echoai.com', role: 'User' },
            { id: 19, username: 'Luuk', email: 'luuk_h@live.nl', role: 'User' },
            { id: 20, username: 'Noa', email: 'noa.z@gmail.com', role: 'User' },
            { id: 21, username: 'Sven', email: 'sven_p@echoai.com', role: 'User' },
            { id: 22, username: 'Eva', email: 'eva.v@outlook.com', role: 'User' },
            { id: 23, username: 'Thijs', email: 'thijs_m@gmail.com', role: 'User' },
            { id: 24, username: 'Lieke', email: 'lieke.b@echoai.com', role: 'User' }
        ];
        localStorage.setItem('echo_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    // Filter de lijst op basis van de zoekterm
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filter) || 
        user.email.toLowerCase().includes(filter)
    );

    filteredUsers.forEach(user => {
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
        users = users.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(users));
        
        // Haal de huidige zoekterm op om de lijst gefilterd te houden na verwijderen
        const currentSearch = document.getElementById('userSearch')?.value.toLowerCase() || '';
        renderUsers(currentSearch);
    }
}

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
