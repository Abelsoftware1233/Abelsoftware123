function getStoredUsers() {
    let savedUsers = localStorage.getItem('echo_users');
    
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // Alleen JIJ bent hier de Admin
        let users = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'admin@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
        ];

        const vNamen = ["Liam", "Noah", "Lucas", "Yara", "Finn", "Levi", "Zoe", "Mila", "James", "Sara", "Nora", "Hugo", "Liv", "Tess", "Evi", "Luca", "Xavi", "Bibi", "Lotte", "Sem"];
        const domains = ["echoai.com", "gmail.com", "outlook.com", "hotmail.com", "live.nl"];

        // De rest van de 499 accounts worden nu ALTIJD 'User'
        for (let i = users.length + 1; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            
            users.push({
                id: i,
                username: `${v}${i}`,
                email: `${v.toLowerCase()}.${i}@${d}`,
                role: 'User', // Iedereen is nu standaard User
                password: "echo123"
            });
        }

        localStorage.setItem('echo_users', JSON.stringify(users));
        return users;
    }
}
// Modal openen/sluiten
window.openAddUserModal = function() {
    document.getElementById('addUserModal').style.display = 'block';
};

window.closeAddUserModal = function() {
    document.getElementById('addUserModal').style.display = 'none';
};

// Nieuwe gebruiker opslaan in de database
window.saveNewUser = function() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;

    if (!username || !email || !password) {
        alert("Vul alle velden in aub.");
        return;
    }

    let users = getStoredUsers();
    
    // Nieuw ID bepalen (hoogste ID + 1)
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUserObj = {
        id: newId,
        username: username,
        email: email,
        password: password,
        role: role
    };

    users.push(newUserObj);
    localStorage.setItem('echo_users', JSON.stringify(users));
    
    alert("Gebruiker " + username + " is succesvol toegevoegd!");
    closeAddUserModal();
    renderUsers(); // Tabel direct verversen
};
