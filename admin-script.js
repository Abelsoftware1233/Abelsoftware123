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
