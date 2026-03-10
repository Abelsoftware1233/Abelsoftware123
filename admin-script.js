/**
 * Echo AI - Ultimate Admin Management System
 * Version: 2.0 (500 Users + Manual Add)
 * Protected for: Abelsoftware123_Admin
 */

// --- 1. STRIKTE TOEGANGSCONTROLE ---
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.username !== 'Abelsoftware123_Admin') {
    alert("Toegang geweigerd: Je hebt niet de juiste rechten.");
    window.location.href = 'profiel.html';
}

// Global variables voor paginering
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    // Admin naam bovenaan zetten
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) adminNameElement.textContent = currentUser.username;

    // Zoekfunctie activeren
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentPage = 1;
            renderUsers(e.target.value.toLowerCase());
        });
    }

    renderUsers();
});

// --- 2. DATABASE & GENERATOR ---
function getStoredUsers() {
    let savedUsers = localStorage.getItem('echo_users');
    
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // De enige echte Admin
        let users = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'admin@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
        ];

        const vNamen = ["Liam", "Noah", "Lucas", "Yara", "Finn", "Levi", "Zoe", "Mila", "James", "Sara", "Nora", "Hugo", "Liv", "Tess", "Evi", "Luca", "Xavi", "Bibi", "Lotte", "Sem"];
        const domains = ["echoai.com", "gmail.com", "outlook.com", "hotmail.com", "live.nl"];

        // Genereer de overige 499 accounts als 'User'
        for (let i = 2; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            
            users.push({
                id: i,
                username: `${v}${i}`,
                email: `${v.toLowerCase()}.${i}@${d}`,
                role: 'User',
                password: "echo123"
            });
        }

        localStorage.setItem('echo_users', JSON.stringify(users));
        return users;
    }
}

// --- 3. MODAL (TOEVOEGEN) FUNCTIES ---
window.openAddUserModal = function() {
    document.getElementById('addUserModal').style.display = 'block';
};

window.closeAddUserModal = function() {
    document.getElementById('addUserModal').style.display = 'none';
    // Velden leegmaken
    document.getElementById('newUsername').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
};

window.saveNewUser = function() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !email || !password) {
        alert("Vul alle velden in.");
        return;
    }

    let users = getStoredUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    users.push({ id: newId, username, email, password, role });
    localStorage.setItem('echo_users', JSON.stringify(users));
    
    alert(`Gebruiker ${username} succesvol toegevoegd!`);
    closeAddUserModal();
    renderUsers(); 
};

// --- 4. RENDER LOGICA (TABEL & STATS) ---
function updateStats(users) {
    const totalUsersElem = document.getElementById('totalUsersCount');
    const adminCountElem = document.getElementById('adminCount');

    if (totalUsersElem) totalUsersElem.textContent = users.length;
    if (adminCountElem) adminCountElem.textContent = users.filter(u => u.role === 'Admin').length;
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    updateStats(users); // Update de tellers bovenaan

    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filter) || 
        user.email.toLowerCase().includes(filter)
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    paginatedUsers.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    ${user.username !== 'Abelsoftware123_Admin' ? 
                    `<button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>` : 
                    `<span style="color:#888; font-size:12px;">Protected</span>`}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPaginationControls(filteredUsers.length);
}

// --- 5. PAGINERING ---
function renderPaginationControls(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let html = '';

    html += `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">«</button>`;

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (startPage > 1) {
        html += `<button class="btn-page" onclick="changePage(1)">1</button>`;
        if (startPage > 2) html += `<span style="padding:0 5px">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span style="padding:0 5px">...</span>`;
        html += `<button class="btn-page" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">»</button>`;

    paginationContainer.innerHTML = html;
}

window.changePage = function(page) {
    currentPage = page;
    const currentSearch = document.getElementById('userSearch')?.value.toLowerCase() || '';
    renderUsers(currentSearch);
};

// --- 6. ACTIES ---
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
