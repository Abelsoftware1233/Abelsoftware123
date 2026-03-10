/**
 * Echo AI - Ultimate Admin Management System
 * Version: 2.2 (Case-Insensitive & Anti-Lockout)
 * Owner: Abelsoftware123
 */

// --- 1. STRIKTE TOEGANGSCONTROLE (NU OOK VOOR KLEINE LETTERS) ---
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const isLoggedIn = localStorage.getItem('isLoggedIn');

function checkAccess() {
    if (!isLoggedIn || !currentUser) return false;

    // We zetten alles om naar kleine letters voor de vergelijking
    const usernameLow = currentUser.username.toLowerCase();
    const roleLow = (currentUser.role || "").toLowerCase();

    // Toegang als de naam abelsoftware123_admin is, of admin, of als de rol admin is
    return (
        usernameLow === 'abelsoftware123_admin' || 
        usernameLow === 'admin' || 
        roleLow === 'admin'
    );
}

if (!checkAccess()) {
    alert("Toegang geweigerd: Je hebt niet de juiste rechten.");
    window.location.href = 'profiel.html';
}

// Global variables voor paginering
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) adminNameElement.textContent = currentUser.username;

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
        let users = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.nl', role: 'Admin', password: 'admin1501' },
            { id: 2, username: 'admin', email: 'info@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
        ];

        const vNamen = ["Liam", "Noah", "Lucas", "Yara", "Finn", "Levi", "Zoe", "Mila", "James", "Sara", "Nora", "Hugo", "Liv", "Tess", "Evi", "Luca", "Xavi", "Bibi", "Lotte", "Sem"];
        const domains = ["echoai.com", "gmail.com", "outlook.com", "hotmail.com", "live.nl"];

        for (let i = 3; i <= 500; i++) {
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

// --- 3. MODAL FUNCTIES ---
window.openAddUserModal = () => document.getElementById('addUserModal').style.display = 'block';
window.closeAddUserModal = () => {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('newUsername').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
};

window.saveNewUser = function() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !email || !password) return alert("Vul alle velden in.");

    let users = getStoredUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ id: newId, username, email, password, role });
    localStorage.setItem('echo_users', JSON.stringify(users));
    
    closeAddUserModal();
    renderUsers(); 
};

// --- 4. RENDER LOGICA ---
function updateStats(users) {
    const totalUsersElem = document.getElementById('totalUsersCount');
    const adminCountElem = document.getElementById('adminCount');
    if (totalUsersElem) totalUsersElem.textContent = users.length;
    if (adminCountElem) adminCountElem.textContent = users.filter(u => u.role.toLowerCase() === 'admin').length;
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    updateStats(users);
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
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    paginatedUsers.forEach(user => {
        const uLow = user.username.toLowerCase();
        const isProtected = (uLow === 'abelsoftware123_admin' || uLow === 'admin');
        
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    ${!isProtected ? 
                    `<button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>` : 
                    `<span style="color:#888; font-size:11px;">System Admin</span>`}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    renderPaginationControls(filteredUsers.length);
}

// --- 5. PAGINERING ---
function renderPaginationControls(totalItems) {
    const container = document.getElementById('pagination');
    if (!container) return;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let html = `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">«</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="color:#00f0ff">...</span>`;
        }
    }

    html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">»</button>`;
    container.innerHTML = html;
}

window.changePage = (page) => {
    currentPage = page;
    renderUsers(document.getElementById('userSearch')?.value.toLowerCase() || '');
};

// --- 6. ACTIES ---
window.deleteUser = function(id) {
    if (confirm('Gebruiker definitief verwijderen?')) {
        let users = getStoredUsers();
        users = users.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(users));
        renderUsers();
    }
};

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
