// --- 2. DATABASE & GENERATOR (UITGEBREIDE NAMENLIJST) ---
function getStoredUsers() {
    let savedUsers = localStorage.getItem('echo_users');
    
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // De vaste Admin accounts
        let users = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.nl', role: 'Admin', password: 'admin1501' },
            { id: 2, username: 'admin', email: 'info@abelsoftware.nl', role: 'Admin', password: 'admin1501' }
        ];

        // Uitgebreide lijst met 60+ diverse namen
        const vNamen = [
            "Liam", "Noah", "Lucas", "Yara", "Finn", "Levi", "Zoe", "Mila", "James", "Sara", 
            "Nora", "Hugo", "Liv", "Tess", "Evi", "Luca", "Xavi", "Bibi", "Lotte", "Halim", 
            "Hakim", "Mohammed", "Ali", "Britney", "Sem", "Sophie", "Bram", "Daan", "Milan", 
            "Meis", "Fleur", "Lynn", "Jesse", "Mason", "Isabella", "Adam", "Eva", "Luuk", 
            "Roos", "Anuar", "Fatima", "Omar", "Sander", "Thijs", "Lieke", "Saar", "Noor", 
            "Noud", "Stijn", "Mats", "Bo", "Puck", "Kyra", "Yasin", "Amira", "Elena", 
            "Kasper", "Olivier", "Ruben", "Tijn", "Sven", "Lars", "Maud", "Isa", "Frenkie"
        ];

        const domains = ["echoai.com", "gmail.com", "outlook.com", "hotmail.com", "live.nl", "icloud.com", "protonmail.com"];

        // Loop om 500 gebruikers te genereren
        for (let i = 3; i <= 500; i++) {
            const v = vNamen[Math.floor(Math.random() * vNamen.length)];
            const d = domains[Math.floor(Math.random() * domains.length)];
            
            // We maken de username uniek door het ID toe te voegen
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
