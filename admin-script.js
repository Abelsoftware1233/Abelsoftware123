/**
 * Echo AI - Ultimate Admin Management System
 * Version: 2.8 (Compact Layout Integration)
 * Owner: Abelsoftware123
 */

// --- 1. TOEGANGSCONTROLE ---
// De admin-pagina is bereikbaar als /admin, /admin/ en /admin.html.
// Alle drie moeten vergrendeld zijn.
const IS_ADMIN_PAGE = /\/admin(\.html)?\/?$/i.test(window.location.pathname);
const ADMIN_SESSION_KEY = 'adminSession';
const ADMIN_SESSION_MAX_MS = 60 * 60 * 1000; // sessie verloopt na 1 uur

// Verberg de pagina meteen, zodat er niets zichtbaar is voordat de check klaar is
if (IS_ADMIN_PAGE) document.documentElement.style.display = 'none';

// Een admin-sessie geldt alleen in dit tabblad en verdwijnt als je de browser/tab sluit
function hasValidAdminSession() {
    try {
        const s = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
        return !!s && s.ok === true && (Date.now() - s.time) < ADMIN_SESSION_MAX_MS;
    } catch (e) {
        return false;
    }
}

function checkAccess() {
    if (!IS_ADMIN_PAGE) return true;

    let currentUser = null;
    try { currentUser = JSON.parse(localStorage.getItem('currentUser')); } catch (e) {}
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn || !currentUser) return false;
    if (!hasValidAdminSession()) return false;   // verplicht opnieuw inloggen

    const usernameLow = (currentUser.username || '').toLowerCase();
    const roleLow = (currentUser.role || '').toLowerCase();
    return (usernameLow === 'abelsoftware123' || usernameLow === 'admin' || roleLow === 'admin');
}

function denyAdminAccess() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.replace('login.html');
}

if (IS_ADMIN_PAGE) {
    if (checkAccess()) {
        document.documentElement.style.display = '';
    } else {
        denyAdminAccess();
    }
    // Terug-knop of bfcache mag het dashboard ook niet opnieuw tonen
    window.addEventListener('pageshow', function () {
        if (!checkAccess()) denyAdminAccess();
    });
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
    if (document.getElementById('userTableBody')) {
        renderUsers();
    }
});

// --- 2. DATABASE LOGICA ---
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

    if (combinedUsers.length <= 5) {
        const vNamen = ["Gerlinde", "Noah", "Gabriel", "Michaël", "Finn", "Levi", "Britney", "Mila", "Faisel", "Yasmina", "Nora", "Hugo", "Jessica", "Tessa", "Evelien", "Luca", "Xavi", "Bibi", "Lotte", "Halim", "Hakim", "Mohammed", "Ali", "Sem", "Sophie", "Bram", "Daan", "Milan", "Zoe"];
        const domains = ["outlook.com", "gmail.com", "hotmail.com", "live.nl", "protonmail.com"];

        for (let i = combinedUsers.length + 1; i <= 500; i++) {
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

// --- 3. MODAL FUNCTIES ---
window.openAddUserModal = () => {
    const modal = document.getElementById('addUserModal');
    if (modal) modal.style.display = 'block';
};

window.closeAddUserModal = () => {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
        ['newUsername', 'newEmail', 'newPassword'].forEach(id => {
            if (document.getElementById(id)) document.getElementById(id).value = '';
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
    addLog(`Nieuwe gebruiker aangemaakt: ${username}`);
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
        addLog(`Gebruiker gewijzigd (ID: ${id})`);
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
            addLog(`Wachtwoord gereset voor ID: ${id}`);
            alert("Wachtwoord succesvol gewijzigd naar: " + newPass);
        }
    }
};

window.deleteUser = function(id) {
    if (id === 1 || id === 2) return alert("Systeembeveiliging: Eigenaar kan niet verwijderd worden.");
    if (confirm('Gebruiker definitief verwijderen?')) {
        let savedUsers = localStorage.getItem('echo_users');
        let localUsers = savedUsers ? JSON.parse(savedUsers) : [];
        localUsers = localUsers.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(localUsers));
        addLog(`Gebruiker verwijderd (ID: ${id})`);
        renderUsers();
    }
};

// --- 5. RENDER & STATS (Compacte versie voor Foto 2) ---
function updateStats(users) {
    if(document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = users.length;
    const adminCount = users.filter(u => (u.role || "").toLowerCase() === 'admin' || u.id === 1 || u.id === 2).length;
    if(document.getElementById('adminCount')) document.getElementById('adminCount').textContent = adminCount;
}

function addLog(message) {
    const logBody = document.getElementById('logTableBody');
    if (logBody) {
        const time = new Date().toLocaleTimeString();
        const entry = `<div>[${time}] ${message}</div>`;
        logBody.innerHTML = entry + logBody.innerHTML;
    }
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

    filteredUsers.sort((a, b) => a.id - b.id);

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

        paginatedUsers.forEach(user => {
        const isOwner = (user.id === 1 || user.id === 2);
        
        tableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username} ${isOwner ? '⭐' : ''}</td>
                <td>${user.email}</td>
                <td><span class="badge ${(user.role || "User").toLowerCase()}">${user.role}</span></td>
                <td>
                    ${!isOwner ? `
                        <div class="btn-group">
                            <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                            <button class="btn-reset" onclick="resetPassword(${user.id})">Reset</button>
                            <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    ` : `<span style="color:#00f0ff; font-weight:bold; font-size:11px;">OWNER</span>`}
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
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.replace('login.html');
};
