/**
 * Echo AI - Unified Profile & Session Script
 * Handelt profielupdates, foto-uploads en database synchronisatie af.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. Toegangscontrole & Variabelen
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const profileForm = document.getElementById('profileForm');

    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Dashboard link tonen/verbergen voor Admins
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.style.display = (currentUser.role === 'Admin') ? 'block' : 'none';
    }

    // 3. Velden vullen met huidige data
    if (document.getElementById('username')) document.getElementById('username').value = currentUser.username || '';
    if (document.getElementById('email')) document.getElementById('email').value = currentUser.email || '';
    if (document.getElementById('firstName')) document.getElementById('firstName').value = currentUser.firstName || '';
    if (document.getElementById('lastName')) document.getElementById('lastName').value = currentUser.lastName || '';
    
    const profilePreview = document.getElementById('profilePreview');
    if (profilePreview && currentUser.profilePic) {
        profilePreview.src = currentUser.profilePic;
    }

    // 4. Foto Preview Logica (FileReader)
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload && profilePreview) {
        imageUpload.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 5. Formulier Opslaan Logica
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newEmail = document.getElementById('email').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;
            
            // Wachtwoord validatie
            if (newPass !== "" && newPass !== confirmPass) {
                showStatus("❌ Wachtwoorden komen niet overeen!", "error");
                return;
            }

            // Database ophalen (echo_users)
            let allUsers = JSON.parse(localStorage.getItem('echo_users')) || [];
            const userIndex = allUsers.findIndex(u => u.username === currentUser.username);

            if (userIndex !== -1) {
                // Gegevens bijwerken in de lokale variabele
                const updatedUser = {
                    ...allUsers[userIndex],
                    email: newEmail,
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    profilePic: profilePreview ? profilePreview.src : allUsers[userIndex].profilePic
                };

                // Alleen wachtwoord updaten als er een nieuw wachtwoord is ingevuld
                if (newPass !== "") {
                    updatedUser.password = newPass;
                }

                // Opslaan in de database (Lijst met alle gebruikers)
                allUsers[userIndex] = updatedUser;
                localStorage.setItem('echo_users', JSON.stringify(allUsers));

                // Opslaan in de huidige sessie (Ingelogde gebruiker)
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                showStatus("✅ Profiel succesvol bijgewerkt!", "success");
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Wachtwoord velden legen
                if(document.getElementById('newPassword')) document.getElementById('newPassword').value = '';
                if(document.getElementById('confirmPassword')) document.getElementById('confirmPassword').value = '';
            } else {
                showStatus("❌ Fout: Gebruiker niet gevonden in database.", "error");
            }
        });
    }
});

/**
 * Status meldingen tonen in Neon stijl
 */
function showStatus(message, type) {
    const statusMsg = document.getElementById('statusMessage');
    if (statusMsg) {
        statusMsg.textContent = message;
        statusMsg.className = type; // 'success' of 'error'
        statusMsg.style.display = 'block';
        
        // Verberg melding na 4 seconden
        setTimeout(() => {
            statusMsg.style.display = 'none';
        }, 4000);
    } else {
        alert(message);
    }
}

/**
 * Logout functie
 */
window.logout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
