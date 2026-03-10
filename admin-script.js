/**
 * Echo AI - Admin Database Script
 * Database grootte: 500 gebruikers
 * Paginering: 10 rijen per pagina
 */

let currentPage = 1;
const rowsPerPage = 10;

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
            currentPage = 1; // Reset naar pagina 1 bij zoeken
            renderUsers(e.target.value.toLowerCase());
        });
    }

    renderUsers();
});

// Functie om de database op te halen of te genereren (tot 500)
function getStoredUsers() {
    let savedUsers = localStorage.getItem('echo_users');
    
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // Basislijst met jouw specifieke namen
        let users = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.com', role: 'Admin' },
            { id: 2, username: 'Kevin', email: 'kevin@echoai.com', role: 'User' },
            { id: 3, username: 'Samantha', email: 'samantha.sabrina@gmail.com', role: 'User' },
            { id: 4, username: 'Britney', email: 'britneypears@live.be', role: 'User' },
            { id: 5, username: 'Thomas', email: 'thomas@echoai.com', role: 'User' }
        ];

        // Datasets voor automatische generatie van de overige 495 gebruikers
        const vNamen = ["Liam", "Noah", "Lucas", "Yara", "Finn", "Levi", "Zoe", "Mila", "James", "Sara", "Nora", "Hugo", "Mason", "Liv", "Tess", "Evi", "Luca", "Xavi", "Bibi", "Meis", "Daan", "Bram", "Sven", "Eva", "Lotte", "Sem", "Fleur", "Luuk", "Noa", "Jesse"];
        const aNamen = ["de Vries", "Bakker", "Jansen", "Smit", "Meijer", "Visser", "Mulder", "Peters", "Hendriks", "Bos", "Dekker", "Vos", "Dijkstra", "de Jong", "Brouwer"];
        const domains = ["echoai.com", "gmail.com", "outlook.com", "hotmail.com", "live.nl"];

        for (let i = users.length + 1; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const a = aNamen[Math.floor(Math.random() * aNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            
            users.push({
                id: i,
                username: `${v}${i}`,
                email: `${v.toLowerCase()}.${i}@${d}`,
                role: Math.random() > 0.9 ? 'Admin' : 'User'
            });
        }

        localStorage.setItem('echo_users', JSON.stringify(users));
        return users;
    }
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    // Filteren
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filter) || 
        user.email.toLowerCase().includes(filter)
    );

    // Paginering berekenen
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    // Tabel vullen
    paginatedUsers.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Verwijderen</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPaginationControls(filteredUsers.length);
}

function renderPaginationControls(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let html = '';

    // Vorige knop
    html += `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">«</button>`;

    // Slimme nummerweergave (toont niet alle 50 knoppen tegelijk)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) html += `<button class="btn-page" onclick="changePage(1)">1</button><span>...</span>`;

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) html += `<span>...</span><button class="btn-page" onclick="changePage(${totalPages})">${totalPages}</button>`;

    // Volgende knop
    html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">»</button>`;

    paginationContainer.innerHTML = html;
}

window.changePage = function(page) {
    currentPage = page;
    const currentSearch = document.getElementById('userSearch')?.value.toLowerCase() || '';
    renderUsers(currentSearch);
};

window.deleteUser = function(id) {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        let users = getStoredUsers();
        users = users.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(users));
        renderUsers(document.getElementById('userSearch')?.value.toLowerCase() || '');
    }
};

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
