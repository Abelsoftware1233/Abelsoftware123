/**
 * Abelsoftware123 - Ultimate Admin Management System
 * Version: 2.6 (Strict Access & 100 Manual Users)
 * Owner: Abelsoftware123
 */

// --- 1. STRIKTE TOEGANGSCONTROLE ---
// Controleert of de bezoeker is ingelogd en of de gebruikersnaam of rol 'admin' is.
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const isLoggedIn = localStorage.getItem('isLoggedIn');

function checkAccess() {
    if (!isLoggedIn || !currentUser) return false;
    
    const usernameLow = currentUser.username.toLowerCase();
    const roleLow = (currentUser.role || "").toLowerCase();
    
    // Alleen toegang voor de hoofdadmin of gebruikers met de rol 'admin'
    return (
        usernameLow === 'abelsoftware123_admin' || 
        usernameLow === 'admin' || 
        roleLow === 'admin'
    );
}

if (!checkAccess()) {
    alert("Toegang geweigerd: Je hebt niet de juiste rechten om dit paneel te bekijken.");
    window.location.href = 'profiel.html';
}

// --- 2. PAGINERING SETTINGS ---
let currentPage = 1;
const rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) adminNameElement.textContent = currentUser.username;
    
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentPage = 1;
            renderUsers(e.target.value.toLowerCase());
        });
    }
    renderUsers();
});

// --- 3. DATABASE (100 GEBRUIKERS VOLUIT GESCHREVEN) ---
function getStoredUsers() {
    let savedUsers = localStorage.getItem('echo_users');
    if (savedUsers) return JSON.parse(savedUsers);

    // Handmatige lijst met 100 unieke gebruikers en variërende e-mails
    let users = [
        { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.nl', role: 'Admin', password: 'admin1501' },
        { id: 2, username: 'admin', email: 'info@abelsoftware.nl', role: 'Admin', password: 'admin1501' },
        { id: 3, username: 'Gerlinde3', email: 'gerlinde3@gmail.com', role: 'User', password: 'echo123' },
        { id: 4, username: 'Noah4', email: 'noah4@outlook.com', role: 'User', password: 'echo123' },
        { id: 5, username: 'Gabriel5', email: 'gabriel5@hotmail.com', role: 'User', password: 'echo123' },
        { id: 6, username: 'Michaël6', email: 'michael6@live.nl', role: 'User', password: 'echo123' },
        { id: 7, username: 'Finn7', email: 'finn7@protonmail.com', role: 'User', password: 'echo123' },
        { id: 8, username: 'Levi8', email: 'levi8@echoai.com', role: 'User', password: 'echo123' },
        { id: 9, username: 'Britney9', email: 'britney9@icloud.com', role: 'User', password: 'echo123' },
        { id: 10, username: 'Mila10', email: 'mila10@gmail.com', role: 'User', password: 'echo123' },
        { id: 11, username: 'James11', email: 'james11@outlook.com', role: 'User', password: 'echo123' },
        { id: 12, username: 'Yasmina12', email: 'yasmina12@hotmail.com', role: 'User', password: 'echo123' },
        { id: 13, username: 'Nora13', email: 'nora13@live.nl', role: 'User', password: 'echo123' },
        { id: 14, username: 'Hugo14', email: 'hugo14@protonmail.com', role: 'User', password: 'echo123' },
        { id: 15, username: 'Jessica15', email: 'jessica15@echoai.com', role: 'User', password: 'echo123' },
        { id: 16, username: 'Tessa16', email: 'tessa16@icloud.com', role: 'User', password: 'echo123' },
        { id: 17, username: 'Evelien17', email: 'evelien17@gmail.com', role: 'User', password: 'echo123' },
        { id: 18, username: 'Luca18', email: 'luca18@outlook.com', role: 'User', password: 'echo123' },
        { id: 19, username: 'Xavi19', email: 'xavi19@hotmail.com', role: 'User', password: 'echo123' },
        { id: 20, username: 'Bibi20', email: 'bibi20@live.nl', role: 'User', password: 'echo123' },
        { id: 21, username: 'Lotte21', email: 'lotte21@protonmail.com', role: 'User', password: 'echo123' },
        { id: 22, username: 'Halim22', email: 'halim22@echoai.com', role: 'User', password: 'echo123' },
        { id: 23, username: 'Hakim23', email: 'hakim23@icloud.com', role: 'User', password: 'echo123' },
        { id: 24, username: 'Mohammed24', email: 'mohammed24@gmail.com', role: 'User', password: 'echo123' },
        { id: 25, username: 'Ali25', email: 'ali25@outlook.com', role: 'User', password: 'echo123' },
        { id: 26, username: 'Sem26', email: 'sem26@hotmail.com', role: 'User', password: 'echo123' },
        { id: 27, username: 'Sophie27', email: 'sophie27@live.nl', role: 'User', password: 'echo123' },
        { id: 28, username: 'Bram28', email: 'bram28@protonmail.com', role: 'User', password: 'echo123' },
        { id: 29, username: 'Daan29', email: 'daan29@echoai.com', role: 'User', password: 'echo123' },
        { id: 30, username: 'Milan30', email: 'milan30@icloud.com', role: 'User', password: 'echo123' },
        { id: 31, username: 'Mila31', email: 'mila31@gmail.com', role: 'User', password: 'echo123' },
        { id: 32, username: 'Zoe32', email: 'zoe32@outlook.com', role: 'User', password: 'echo123' },
        { id: 33, username: 'Nora33', email: 'nora33@hotmail.com', role: 'User', password: 'echo123' },
        { id: 34, username: 'Luca34', email: 'luca34@live.nl', role: 'User', password: 'echo123' },
        { id: 35, username: 'Tess35', email: 'tess35@protonmail.com', role: 'User', password: 'echo123' },
        { id: 36, username: 'Mila36', email: 'mila36@echoai.com', role: 'User', password: 'echo123' },
        { id: 37, username: 'Zoe37', email: 'zoe37@icloud.com', role: 'User', password: 'echo123' },
        { id: 38, username: 'Finn38', email: 'finn38@gmail.com', role: 'User', password: 'echo123' },
        { id: 39, username: 'Xavi39', email: 'xavi39@outlook.com', role: 'User', password: 'echo123' },
        { id: 40, username: 'Zoe40', email: 'zoe40@hotmail.com', role: 'User', password: 'echo123' },
        { id: 41, username: 'Meis41', email: 'meis41@live.nl', role: 'User', password: 'echo123' },
        { id: 42, username: 'Fleur42', email: 'fleur42@protonmail.com', role: 'User', password: 'echo123' },
        { id: 43, username: 'Lynn43', email: 'lynn43@echoai.com', role: 'User', password: 'echo123' },
        { id: 44, username: 'Jesse44', email: 'jesse44@icloud.com', role: 'User', password: 'echo123' },
        { id: 45, username: 'Mason45', email: 'mason45@gmail.com', role: 'User', password: 'echo123' },
        { id: 46, username: 'Isabella46', email: 'isabella46@outlook.com', role: 'User', password: 'echo123' },
        { id: 47, username: 'Adam47', email: 'adam47@hotmail.com', role: 'User', password: 'echo123' },
        { id: 48, username: 'Eva48', email: 'eva48@live.nl', role: 'User', password: 'echo123' },
        { id: 49, username: 'Luuk49', email: 'luuk49@protonmail.com', role: 'User', password: 'echo123' },
        { id: 50, username: 'Roos50', email: 'roos50@echoai.com', role: 'User', password: 'echo123' },
        { id: 51, username: 'Anuar51', email: 'anuar51@icloud.com', role: 'User', password: 'echo123' },
        { id: 52, username: 'Fatima52', email: 'fatima52@gmail.com', role: 'User', password: 'echo123' },
        { id: 53, username: 'Omar53', email: 'omar53@outlook.com', role: 'User', password: 'echo123' },
        { id: 54, username: 'Sander54', email: 'sander54@hotmail.com', role: 'User', password: 'echo123' },
        { id: 55, username: 'Thijs55', email: 'thijs55@live.nl', role: 'User', password: 'echo123' },
        { id: 56, username: 'Lieke56', email: 'lieke56@protonmail.com', role: 'User', password: 'echo123' },
        { id: 57, username: 'Saar57', email: 'saar57@echoai.com', role: 'User', password: 'echo123' },
        { id: 58, username: 'Noor58', email: 'noor58@icloud.com', role: 'User', password: 'echo123' },
        { id: 59, username: 'Bram59', email: 'bram59@gmail.com', role: 'User', password: 'echo123' },
        { id: 60, username: 'Sophie60', email: 'sophie60@outlook.com', role: 'User', password: 'echo123' },
        { id: 61, username: 'Daan61', email: 'daan61@hotmail.com', role: 'User', password: 'echo123' },
        { id: 62, username: 'Milan62', email: 'milan62@live.nl', role: 'User', password: 'echo123' },
        { id: 63, username: 'Meis63', email: 'meis63@protonmail.com', role: 'User', password: 'echo123' },
        { id: 64, username: 'Fleur64', email: 'fleur64@echoai.com', role: 'User', password: 'echo123' },
        { id: 65, username: 'Lynn65', email: 'lynn65@icloud.com', role: 'User', password: 'echo123' },
        { id: 66, username: 'Jesse66', email: 'jesse66@gmail.com', role: 'User', password: 'echo123' },
        { id: 67, username: 'Mason67', email: 'mason67@outlook.com', role: 'User', password: 'echo123' },
        { id: 68, username: 'Isabella68', email: 'isabella68@hotmail.com', role: 'User', password: 'echo123' },
        { id: 69, username: 'Adam69', email: 'adam69@live.nl', role: 'User', password: 'echo123' },
        { id: 70, username: 'Eva70', email: 'eva70@protonmail.com', role: 'User', password: 'echo123' },
        { id: 71, username: 'Luuk71', email: 'luuk71@echoai.com', role: 'User', password: 'echo123' },
        { id: 72, username: 'Roos72', email: 'roos72@icloud.com', role: 'User', password: 'echo123' },
        { id: 73, username: 'Anuar73', email: 'anuar73@gmail.com', role: 'User', password: 'echo123' },
        { id: 74, username: 'Fatima74', email: 'fatima74@outlook.com', role: 'User', password: 'echo123' },
        { id: 75, username: 'Omar75', email: 'omar75@hotmail.com', role: 'User', password: 'echo123' },
        { id: 76, username: 'Sander76', email: 'sander76@live.nl', role: 'User', password: 'echo123' },
        { id: 77, username: 'Thijs77', email: 'thijs77@protonmail.com', role: 'User', password: 'echo123' },
        { id: 78, username: 'Lieke78', email: 'lieke78@echoai.com', role: 'User', password: 'echo123' },
        { id: 79, username: 'Saar79', email: 'saar79@icloud.com', role: 'User', password: 'echo123' },
        { id: 80, username: 'Noor80', email: 'noor80@gmail.com', role: 'User', password: 'echo123' },
        { id: 81, username: 'Gerlinde81', email: 'gerlinde81@outlook.com', role: 'User', password: 'echo123' },
        { id: 82, username: 'Noah82', email: 'noah82@hotmail.com', role: 'User', password: 'echo123' },
        { id: 83, username: 'Gabriel83', email: 'gabriel83@live.nl', role: 'User', password: 'echo123' },
        { id: 84, username: 'Michaël84', email: 'michael84@protonmail.com', role: 'User', password: 'echo123' },
        { id: 85, username: 'Finn85', email: 'finn85@echoai.com', role: 'User', password: 'echo123' },
        { id: 86, username: 'Levi86', email: 'levi86@icloud.com', role: 'User', password: 'echo123' },
        { id: 87, username: 'Britney87', email: 'britney87@gmail.com', role: 'User', password: 'echo123' },
        { id: 88, username: 'Mila88', email: 'mila88@outlook.com', role: 'User', password: 'echo123' },
        { id: 89, username: 'James89', email: 'james89@hotmail.com', role: 'User', password: 'echo123' },
        { id: 90, username: 'Yasmina90', email: 'yasmina90@live.nl', role: 'User', password: 'echo123' },
        { id: 91, username: 'Nora91', email: 'nora91@protonmail.com', role: 'User', password: 'echo123' },
        { id: 92, username: 'Hugo92', email: 'hugo92@echoai.com', role: 'User', password: 'echo123' },
        { id: 93, username: 'Jessica93', email: 'jessica93@icloud.com', role: 'User', password: 'echo123' },
        { id: 94, username: 'Tessa94', email: 'tessa94@gmail.com', role: 'User', password: 'echo123' },
        { id: 95, username: 'Evelien95', email: 'evelien95@outlook.com', role: 'User', password: 'echo123' },
        { id: 96, username: 'Luca96', email: 'luca96@hotmail.com', role: 'User', password: 'echo123' },
        { id: 97, username: 'Xavi97', email: 'xavi97@live.nl', role: 'User', password: 'echo123' },
        { id: 98, username: 'Bibi98', email: 'bibi98@protonmail.com', role: 'User', password: 'echo123' },
        { id: 99, username: 'Lotte99', email: 'lotte99@echoai.com', role: 'User', password: 'echo123' },
        { id: 100, username: 'Halim100', email: 'halim100@icloud.com', role: 'User', password: 'echo123' }
    ];

    localStorage.setItem('echo_users', JSON.stringify(users));
    return users;
}

// --- 4. RENDER LOGICA ---
function renderUsers(filter = '') {
    const users = getStoredUsers();
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filter) || user.email.toLowerCase().includes(filter)
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

    paginatedUsers.forEach(user => {
        const uLow = user.username.toLowerCase();
        const isProtected = (uLow === 'abelsoftware123_admin' || uLow === 'admin');
        
        tableBody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    ${!isProtected ? `
                        <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                    ` : `<span style="color:#888;">System Protected</span>`}
                </td>
            </tr>
        `;
    });
    renderPaginationControls(filteredUsers.length);
}

// --- 5. PAGINERING & LOGOUT ---
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

window.changePage = (page) => {
    currentPage = page;
    renderUsers();
};

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
