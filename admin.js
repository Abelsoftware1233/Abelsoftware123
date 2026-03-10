// Importeer de Firebase functies (SDK)
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.x/firebase-firestore.js";

// 1. Haal alle gebruikers op uit de database
async function getRemoteUsers() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    
    querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
}

// 2. Verwijder een gebruiker uit de database
async function deleteUser(userId) {
    if (confirm('Zeker weten?')) {
        const db = getFirestore();
        await deleteDoc(doc(db, "users", userId));
        renderUsers(); // Ververs de tabel
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Haal de gebruikers op van je Java backend zodra de pagina laadt
    fetchUsersFromDatabase();
});

async function fetchUsersFromDatabase() {
    try {
        // Dit roept je Java UserService/Controller aan
        const response = await fetch('/api/users'); 
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error("Fout bij ophalen gebruikers:", error);
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge">${user.role || 'User'}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Verwijderen</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
