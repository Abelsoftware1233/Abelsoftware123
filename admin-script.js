// Configuratie voor paginering
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
            currentPage = 1; // Reset naar pagina 1 bij een nieuwe zoekopdracht
            const searchTerm = e.target.value.toLowerCase();
            renderUsers(searchTerm);
        });
    }

    // Eerste keer laden
    renderUsers();
});

function getStoredUsers() {
    const savedUsers = localStorage.getItem('echo_users');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // De volledige lijst met 74 testgebruikers (24 origineel + 50 extra)
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
            { id: 24, username: 'Lieke', email: 'lieke.b@echoai.com', role: 'User' },
            // Extra gegenereerde gebruikers (50 stuks)
            { id: 25, username: 'Liam412', email: 'liam412@gmail.com', role: 'User' },
            { id: 26, username: 'Yara_Dev', email: 'yara_dev@echoai.com', role: 'Admin' },
            { id: 27, username: 'Finn88', email: 'finn88@outlook.com', role: 'User' },
            { id: 28, username: 'Zoe_Smit', email: 'zoe_smit@live.nl', role: 'User' },
            { id: 29, username: 'HugoV', email: 'hugov@hotmail.com', role: 'User' },
            { id: 30, username: 'Mila_2024', email: 'mila_2024@gmail.com', role: 'User' },
            { id: 31, username: 'James_Echo', email: 'james_echo@echoai.com', role: 'User' },
            { id: 32, username: 'Nora_D', email: 'nora_d@outlook.com', role: 'User' },
            { id: 33, username: 'Levi_Bakker', email: 'levi_bakker@live.nl', role: 'User' },
            { id: 34, username: 'Tess_Visser', email: 'tess_visser@gmail.com', role: 'User' },
            { id: 35, username: 'Luca99', email: 'luca99@echoai.com', role: 'Admin' },
            { id: 36, username: 'Evi_Meijer', email: 'evi_meijer@hotmail.com', role: 'User' },
            { id: 37, username: 'Bibi_X', email: 'bibi_x@outlook.com', role: 'User' },
            { id: 38, username: 'Xavi_Dev', email: 'xavi_dev@echoai.com', role: 'User' },
            { id: 39, username: 'Mason_P', email: 'mason_p@live.nl', role: 'User' },
            { id: 40, username: 'Liv_deVries', email: 'liv_devries@gmail.com', role: 'User' },
            { id: 41, username: 'Sara_M', email: 'sara_m@echoai.com', role: 'User' },
            { id: 42, username: 'Noah_Smit', email: 'noah_smit@hotmail.com', role: 'User' },
            { id: 43, username: 'Meis_V', email: 'meis_v@outlook.com', role: 'User' },
            { id: 44, username: 'Lucas_B', email: 'lucas_b@live.nl', role: 'User' },
            { id: 45, username: 'Yara_22', email: 'yara_22@gmail.com', role: 'User' },
            { id: 46, username: 'Finn_Echo', email: 'finn_echo@echoai.com', role: 'User' },
            { id: 47, username: 'Zoe_Bakker', email: 'zoe_bakker@hotmail.com', role: 'User' },
            { id: 48, username: 'Liam_X', email: 'liam_x@outlook.com', role: 'User' },
            { id: 49, username: 'Mila_Dijkstra', email: 'mila_dijkstra@live.nl', role: 'User' },
            { id: 50, username: 'James_V', email: 'james_v@gmail.com', role: 'Admin' },
            { id: 51, username: 'Nora_S', email: 'nora_s@echoai.com', role: 'User' },
            { id: 52, username: 'Levi_87', email: 'levi_87@hotmail.com', role: 'User' },
            { id: 53, username: 'Tess_Echo', email: 'tess_echo@echoai.com', role: 'User' },
            { id: 54, username: 'Luca_Visser', email: 'luca_visser@outlook.com', role: 'User' },
            { id: 55, username: 'Evi_44', email: 'evi_44@live.nl', role: 'User' },
            { id: 56, username: 'Bibi_Smit', email: 'bibi_smit@gmail.com', role: 'User' },
            { id: 57, username: 'Xavi_99', email: 'xavi_99@echoai.com', role: 'User' },
            { id: 58, username: 'Mason_V', email: 'mason_v@hotmail.com', role: 'User' },
            { id: 59, username: 'Liv_Dev', email: 'liv_dev@echoai.com', role: 'User' },
            { id: 60, username: 'Sara_2024', email: 'sara_2024@outlook.com', role: 'User' },
            { id: 61, username: 'Noah_B', email: 'noah_b@live.nl', role: 'User' },
            { id: 62, username: 'Meis_Smit', email: 'meis_smit@gmail.com', role: 'User' },
            { id: 63, username: 'Lucas_V', email: 'lucas_v@echoai.com', role: 'User' },
            { id: 64, username: 'Yara_Bakker', email: 'yara_bakker@hotmail.com', role: 'User' },
            { id: 65, username: 'Finn_77', email: 'finn_77@outlook.com', role: 'User' },
            { id: 66, username: 'Zoe_Visser', email: 'zoe_visser@live.nl', role: 'User' },
            { id: 67, username: 'Liam_Dev', email: 'liam_dev@echoai.com', role: 'User' },
            { id: 68, username: 'Mila_V', email: 'mila_v@gmail.com', role: 'User' },
            { id: 69, username: 'James_Smit', email: 'james_smit@hotmail.com', role: 'User' },
            { id: 70, username: 'Nora_Echo', email: 'nora_echo@echoai.com', role: 'User' },
            { id: 71, username: 'Levi_P', email: 'levi_p@outlook.com', role: 'User' },
            { id: 72, username: 'Tess_44', email: 'tess_44@live.nl', role: 'User' },
            { id: 73, username: 'Luca_D', email: 'luca_d@gmail.com', role: 'User' },
            { id: 74, username: 'Evi_Echo', email: 'evi_echo@echoai.com', role: 'User' }
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

    // Filter de lijst
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filter) || 
        user.email.toLowerCase().includes(filter)
    );

    // Paginering logica
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    // Rijen toevoegen aan tabel
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

    // "Vorige" knop
    html += `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">«</button>`;

    // Paginanummer knoppen
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    // "Volgende" knop
    html += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">»</button>`;

    paginationContainer.innerHTML = html;
}

window.changePage = function(page) {
    currentPage = page;
    const currentSearch = document.getElementById('userSearch')?.value.toLowerCase() || '';
    renderUsers(currentSearch);
};

function deleteUser(id) {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
        let users = getStoredUsers();
        users = users.filter(user => user.id !== id);
        localStorage.setItem('echo_users', JSON.stringify(users));
        
        const currentSearch = document.getElementById('userSearch')?.value.toLowerCase() || '';
        renderUsers(currentSearch);
    }
}

window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
