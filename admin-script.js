/**
 * Echo AI - Ultimate Admin Management System
 * Version: 2.5 (Fix: Geen Kick-Loop)
 * Owner: Abelsoftware123
 */

// --- 1. SLIMMERE TOEGANGSCONTROLE (Voorkomt Loops op Login/Registreer) ---
function checkAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Alleen controleren als we daadwerkelijk op de admin-pagina zijn
    const isPageAdmin = window.location.pathname.includes('admin.html');
    
    if (isPageAdmin) {
        if (!isLoggedIn || !currentUser) return false;
        
        const usernameLow = currentUser.username.toLowerCase();
        const roleLow = (currentUser.role || "").toLowerCase();
        
        // Check of de gebruiker admin-rechten heeft
        return (usernameLow === 'abelsoftware123_admin' || usernameLow === 'admin' || roleLow === 'admin');
    }
    
    return true; // Sta toegang toe op login/registreer pagina's
}

// Voer de check uit. Als we op de admin pagina zijn en geen recht hebben -> Kick.
if (!checkAccess()) {
    alert("Toegang geweigerd: Je hebt niet de juiste rechten.");
    window.location.href = 'login.html'; // Stuur terug naar login bij fout
}

// Global variables voor paginering
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const adminNameElement = document.getElementById('adminName');
    
    if (adminNameElement && currentUser) {
        adminNameElement.textContent = currentUser.username;
    }

    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentPage = 1;
            renderUsers(e.target.value.toLowerCase());
        });
    }
    // Alleen renderen als de tabel bestaat op de huidige pagina
    if (document.getElementById('userTableBody')) {
        renderUsers();
    }
});

// --- 2. DATABASE LOGICA (PERMANENT + LOCAL + GENERATOR) ---
function getStoredUsers() {
    const permanentUsers = (typeof getPermanentUsers === 'function') ? getPermanentUsers() : [];
    let savedUsers = localStorage.getItem('echo_users');
    let localUsers = savedUsers ? JSON.parse(savedUsers) : [];

    let combinedUsers = [...permanentUsers];
    localUsers.forEach(lUser => {
        if (!combinedUsers.some(pUser => pUser.username.toLowerCase() === lUser.username.toLowerCase())) {
            combinedUsers.push(lUser);
        }
    });

    if (combinedUsers.length <= 2) {
        const vNamen = ["Gerlinde", "Noah", "Gabriel", "Michaël", "Finn", "Levi", "Britney", "Mila", "James", "Yasmina", "Nora", "Hugo", "Jessica", "Tessa", "Evelien", "Luca", "Xavi", "Bibi", "Lotte", "Halim", "Hakim", "Mohammed", "Ali", "Sem", "Sophie", "Bram", "Daan", "Milan", "Zoe"];
        const domains = ["outlook.com", "gmail.com", "hotmail.com", "live.nl", "protonmail.com"];

        for (let i = 3; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            combinedUsers.push({
                id: i,
                username: `${v}${i}`,
                email: `${v.toLowerCase()}${i}@${d}`,
                role: 'User',
                password: "echo123"
            });
        }
        localStorage.setItem('echo_users', JSON.stringify(combinedUsers));
    }
    return combinedUsers;
}

// --- 3. MODAL FUNCTIES (ADD & EDIT) ---
window.openAddUserModal = () => {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.style.display = 'block';
};

window.closeAddUserModal = () => {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
        ['newUsername', 'newEmail', 'newPassword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }
};

window.openEditModal = (id) => {
    const users = getStoredUsers();
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editUserModal').style.display = 'block';
    }
};

window.closeEditModal = () => {
    const modal = document.getElementById('editUserModal');
    if (modal) modal.style.display = 'none';
};

// --- 4. CORE ACTIES ---
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

window.saveEditUser = function() {
    const id = parseInt(document.getElementById('editUserId').value);
    let users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        users[index].username = document.getElementById('editUsername').value;
        users[index].email = document.getElementById('editEmail').value;
        users[index].role = document.getElementById('editRole').value;
        localStorage.setItem('echo_users', JSON.stringify(users));
        closeEditModal();
        renderUsers();
    }
};

window.resetPassword = function(id) {
    const newPass = "Echo" + Math.floor(1000 + Math.random() * 9000);
    if (confirm(`Wachtwoord herstellen naar: ${newPass}?`)) {
        let users = getStoredUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index].password = newPass;
            localStorage.setItem('echo_users', JSON.stringify(users));
            alert("Wachtwoord succesvol gewijzigd!");
        }
    }
};

window.deleteUser = function(id) {
    if (confirm('Gebruiker definitief verwijderen?')) {
        let users = getStoredUsers().filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(users));
        renderUsers();
    }
};

// --- 5. RENDER LOGICA ---
function updateStats(users) {
    if(document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = users.length;
    if(document.getElementById('adminCount')) document.getElementById('adminCount').textContent = users.filter(u => (u.role || "").toLowerCase() === 'admin').length;
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    updateStats(users);
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    const filteredUsers = users.filter(user => 
        (user.username || "").toLowerCase().includes(filter) || (user.email || "").toLowerCase().includes(filter)
    );

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    paginatedUsers.forEach(user => {
        const uLow = (user.username || "").toLowerCase();
        const isProtected = (uLow === 'abelsoftware123_admin' || uLow === 'admin');
        
        tableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${(user.role || "User").toLowerCase()}">${user.role}</span></td>
                <td>
                    ${!isProtected ? `
                        <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                        <button class="btn-reset" onclick="resetPassword(${user.id})">Reset</button>
                        <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                    ` : `<span style="color:#888; font-size:11px;">System Protected</span>`}
                </td>
            </tr>
        `;
    });
    renderPaginationControls(filteredUsers.length);
}

// --- 6. PAGINERING & LOGOUT ---
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

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
