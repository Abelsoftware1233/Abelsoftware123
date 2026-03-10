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
