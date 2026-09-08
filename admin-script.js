/**
 * Echo AI - Admin Management System V3.0 (Backend-connected)
 * Praat nu met /api/admin/* endpoints i.p.v. localStorage
 */

let currentPage = 1;
const rowsPerPage = 10;
let allUsers = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadAdminInfo();
    await loadUsers();

    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentPage = 1;
            renderUsers(e.target.value.toLowerCase());
        });
    }
});

/**
 * Haalt het eigen profiel op om de naam boven in de sidebar te tonen
 */
async function loadAdminInfo() {
    try {
        const response = await fetch('/api/user/profile', { credentials: 'include' });
        if (response.status === 401 || response.status === 403) {
            window.location.href = 'login.html';
            return;
        }
        const user = await response.json();
        const adminNameElement = document.getElementById('adminName');
        if (adminNameElement) adminNameElement.textContent = user.username;
    } catch (error) {
        console.error("Fout bij laden admin info:", error);
    }
}

/**
 * Haalt alle gebruikers op bij de backend
 */
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', { credentials: 'include' });

        if (response.status === 401 || response.status === 403) {
            alert("Toegang geweigerd: Je hebt niet de juiste rechten.");
            window.location.href = 'login.html';
            return;
        }

        allUsers = await response.json();
        renderUsers();
    } catch (error) {
        console.error("Fout bij laden gebruikers:", error);
        addLog("❌ Fout bij laden gebruikers van server.");
    }
}

// --- MODAL FUNCTIES ---
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
    const user = allUsers.find(u => u.id === id);
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role.replace('ROLE_', '');
        document.getElementById('editUserModal').style.display = 'block';
    }
};

window.closeEditModal = () => {
    const modal = document.getElementById('editUserModal');
    if (modal) modal.style.display = 'none';
};

// --- CORE ACTIES (nu via fetch naar de backend) ---

window.saveNewUser = async function() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !email || !password) return alert("Vul alle velden in.");

    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Aanmaken mislukt.');

        addLog(`Nieuwe gebruiker aangemaakt: ${username}`);
        closeAddUserModal();
        await loadUsers();
    } catch (error) {
        alert("❌ " + error.message);
    }
};

window.saveEditUser = async function() {
    const id = parseInt(document.getElementById('editUserId').value);
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;

    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, role })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Bijwerken mislukt.');

        addLog(`Gebruiker gewijzigd (ID: ${id})`);
        closeEditModal();
        await loadUsers();
    } catch (error) {
        alert("❌ " + error.message);
    }
};

window.resetPassword = async function(id) {
    if (!confirm("Wachtwoord van deze gebruiker resetten?")) return;

    try {
        const response = await fetch(`/api/admin/users/${id}/reset-password`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Resetten mislukt.');

        addLog(`Wachtwoord gereset voor ID: ${id}`);
        alert("Wachtwoord succesvol gewijzigd naar: " + data.newPassword);
    } catch (error) {
        alert("❌ " + error.message);
    }
};

window.deleteUser = async function(id) {
    if (!confirm('Gebruiker definitief verwijderen?')) return;

    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Verwijderen mislukt.');

        addLog(`Gebruiker verwijderd (ID: ${id})`);
        await loadUsers();
    } catch (error) {
        alert("❌ " + error.message);
    }
};

// --- RENDER & STATS ---

function updateStats(users) {
    if (document.getElementById('totalUsersCount')) document.getElementById('totalUsersCount').textContent = users.length;
    const adminCount = users.filter(u => (u.role || "").toUpperCase().includes('ADMIN')).length;
    if (document.getElementById('adminCount')) document.getElementById('adminCount').textContent = adminCount;
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
    updateStats(allUsers);
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const filteredUsers = allUsers.filter(user =>
        (user.username || "").toLowerCase().includes(filter) || (user.email || "").toLowerCase().includes(filter)
    );

    filteredUsers.sort((a, b) => a.id - b.id);

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    paginatedUsers.forEach(user => {
        const roleDisplay = (user.role || "ROLE_USER").replace('ROLE_', '');
        tableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${roleDisplay.toLowerCase()}">${roleDisplay}</span></td>
                <td>
                    <div class="btn-group">
                        <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                        <button class="btn-reset" onclick="resetPassword(${user.id})">Reset</button>
                        <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    renderPaginationControls(filteredUsers.length);
}

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

window.performLogout = async function() {
    try {
        await fetch('/perform_logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
        console.error("Fout bij uitloggen:", e);
    }
    window.location.href = 'login.html';
};
