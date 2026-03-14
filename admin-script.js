/**
 * Echo AI - Ultimate Admin Management System
 * Version: 3.0 (Advanced Logging Integrated)
 * Owner: Abelsoftware123
 */

// --- 1. TOEGANGSCONTROLE & INLOG LOGS ---
function checkAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isPageAdmin = window.location.pathname.includes('admin.html');
    
    if (isPageAdmin) {
        if (!isLoggedIn || !currentUser) return false;
        const usernameLow = currentUser.username.toLowerCase();
        const roleLow = (currentUser.role || "").toLowerCase();
        return (usernameLow === 'abelsoftware123' || usernameLow === 'admin' || roleLow === 'admin');
    }
    return true;
}

if (!checkAccess()) {
    alert("Toegang geweigerd: Je hebt niet de juiste rechten.");
    window.location.href = 'login.html';
}

// --- 2. HET LOGSYSTEEM ---
function createLog(action) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logs = JSON.parse(localStorage.getItem('echo_logs')) || [];
    
    const newLog = {
        timestamp: new Date().toLocaleString('nl-NL'),
        admin: currentUser ? currentUser.username : "Systeem",
        action: action
    };

    logs.unshift(newLog); // Nieuwste bovenaan
    if (logs.length > 50) logs.pop(); // Maximaal 50 logs bewaren
    
    localStorage.setItem('echo_logs', JSON.stringify(logs));
    renderLogs();
}

function renderLogs() {
    const logContainer = document.getElementById('logTableBody');
    if (!logContainer) return;

    const logs = JSON.parse(localStorage.getItem('echo_logs')) || [];
    if (logs.length === 0) {
        logContainer.innerHTML = '<i style="color: #666; padding: 10px; display: block;">Geen recente activiteiten...</i>';
        return;
    }

    logContainer.innerHTML = logs.map(log => `
        <div style="padding: 8px; border-bottom: 1px solid #222; font-size: 13px; line-height: 1.4;">
            <span style="color: #666; font-family: monospace;">[${log.timestamp}]</span> 
            <b style="color: #00f0ff;">${log.admin}</b> 
            <span style="color: #ccc;">${log.action}</span>
        </div>
    `).join('');
}

// --- 3. CORE DATABASE LOGICA ---
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
        const vNamen = ["Gerlinde", "Noah", "Gabriel", "Michaël", "Finn", "Levi", "Britney", "Mila", "James", "Yasmina", "Nora", "Hugo", "Jessica", "Tessa", "Evelien", "Luca", "Xavi", "Bibi", "Lotte", "Halim", "Hakim", "Mohammed", "Ali", "Sem", "Sophie", "Bram", "Daan", "Milan", "Zoe"];
        const domains = ["outlook.com", "gmail.com", "hotmail.com", "live.nl", "protonmail.com"];

        for (let i = combinedUsers.length + 1; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            combinedUsers.push({
                id: i, username: `${v}${i}`, email: `${v.toLowerCase()}${i}@${d}`, role: 'User', password: "echo123"
            });
        }
        localStorage.setItem('echo_users', JSON.stringify(combinedUsers));
    }
    return combinedUsers;
}

// --- 4. ACTIONS MET LOGGING ---
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
    
    createLog(`Nieuwe gebruiker aangemaakt: ${username} (${role})`);
    closeAddUserModal();
    renderUsers(); 
};

window.saveEditUser = function() {
    const id = parseInt(document.getElementById('editUserId').value);
    let users = getStoredUsers();
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
        const oldRole = users[index].role;
        users[index].username = document.getElementById('editUsername').value;
        users[index].email = document.getElementById('editEmail').value;
        users[index].role = document.getElementById('editRole').value;
        
        localStorage.setItem('echo_users', JSON.stringify(users));
        createLog(`Gebruiker gewijzigd: ${users[index].username} (Rol: ${oldRole} -> ${users[index].role})`);
        closeEditModal();
        renderUsers();
    }
};

window.resetPassword = function(id) {
    const newPass = "Echo" + Math.floor(1000 + Math.random() * 9000);
    if (confirm(`Wachtwoord herstellen?`)) {
        let users = getStoredUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index].password = newPass;
            localStorage.setItem('echo_users', JSON.stringify(users));
            createLog(`Wachtwoord gereset voor: ${users[index].username}`);
            alert("Nieuw wachtwoord: " + newPass);
        }
    }
};

window.deleteUser = function(id) {
    if (id === 1 || id === 2) return alert("Systeembeveiliging: De eigenaar kan niet verwijderd worden.");
    if (confirm('Gebruiker definitief verwijderen?')) {
        let allUsers = getStoredUsers();
        const userToDelete = allUsers.find(u => u.id === id);
        
        let localUsers = JSON.parse(localStorage.getItem('echo_users')) || [];
        localUsers = localUsers.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(localUsers));
        
        createLog(`GEBRUIKER VERWIJDERD: ${userToDelete ? userToDelete.username : 'ID ' + id}`);
        renderUsers();
    }
};

// --- 5. RENDER & UI ---
let currentPage = 1;
const rowsPerPage = 10;

function updateStats(users) {
    if(document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = users.length;
    const adminCount = users.filter(u => (u.role || "").toLowerCase() === 'admin' || u.id === 1 || u.id === 2).length;
    if(document.getElementById('adminCount')) document.getElementById('adminCount').textContent = adminCount;
}

function renderUsers(filter = '') {
    const users = getStoredUsers();
    updateStats(users);
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    const filteredUsers = users.filter(user => 
        (user.username || "").toLowerCase().includes(filter) || (user.email || "").toLowerCase().includes(filter)
    ).sort((a, b) => a.id - b.id);

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
                        <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                        <button class="btn-reset" onclick="resetPassword(${user.id})">Reset</button>
                        <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                    ` : `<span style="color:#00f0ff; font-weight:bold;">OWNER</span>`}
                </td>
            </tr>
        `;
    });
    renderPaginationControls(filteredUsers.length);
}

// --- INITIALISATIE ---
document.addEventListener('DOMContentLoaded', function() {
    renderLogs();
    // Check of we net zijn ingelogd (eenmalige log)
    if (sessionStorage.getItem('loginLogged') !== 'true' && window.location.pathname.includes('admin.html')) {
        createLog("Dashboard geopend (Sessie gestart)");
        sessionStorage.setItem('loginLogged', 'true');
    }
});

// Overige modal/paginering functies
window.performLogout = function() {
    createLog("Uitgelogd uit systeem");
    sessionStorage.removeItem('loginLogged');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

window.changePage = (page) => { currentPage = page; renderUsers(document.getElementById('userSearch')?.value.toLowerCase() || ''); };
window.openAddUserModal = () => document.getElementById('addUserModal').style.display = 'block';
window.closeAddUserModal = () => { document.getElementById('addUserModal').style.display = 'none'; };
window.closeEditModal = () => document.getElementById('editUserModal').style.display = 'none';

function renderPaginationControls(totalItems) {
    const container = document.getElementById('pagination');
    if (!container) return;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    let html = `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">«</button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
    }
    html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">»</button>`;
    container.innerHTML = html;
}
