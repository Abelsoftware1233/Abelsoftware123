document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTEN SELECTEREN ---
    // Registratie elementen
    const registrationForm = document.getElementById('registrationForm');
    
    // Profiel elementen
    const profileForm = document.getElementById('profileForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // --- 1. REGISTRATIE LOGICA ---
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('password_confirm').value;

            if (password !== confirmPassword) {
                alert("❌ Wachtwoorden komen niet overeen!");
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    alert("✅ Registratie geslaagd! Je wordt doorgestuurd naar de login.");
                    window.location.href = "/login.html";
                } else {
                    const errorMsg = await response.text();
                    alert("❌ Fout: " + errorMsg);
                }
            } catch (error) {
                console.error("Netwerkfout:", error);
                alert("❌ Kan geen verbinding maken met de server.");
            }
        });
    }

    // --- 2. PROFIEL LADEN (Bij het openen van profile.html) ---
    if (profileForm) {
        async function loadUserProfile() {
            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const user = await response.json();
                    // Vul de velden in de HTML
                    if (usernameInput) usernameInput.value = user.username || '';
                    if (emailInput) emailInput.value = user.email || '';
                    if (firstNameInput) firstNameInput.value = user.firstName || '';
                    if (lastNameInput) lastNameInput.value = user.lastName || '';
                } else {
                    console.error("Sessie verlopen of niet ingelogd.");
                    // Optioneel: window.location.href = "/login.html";
                }
            } catch (error) {
                console.error("Fout bij laden profiel:", error);
            }
        }

        loadUserProfile();

        // --- 3. PROFIEL BIJWERKEN LOGICA ---
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newPassword = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;

            if (newPassword && newPassword !== confirmPass) {
                alert("❌ Nieuwe wachtwoorden komen niet overeen!");
                return;
            }

            const updateData = {
                email: emailInput.value,
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                newPassword: newPassword || null
            };

            try {
                const response = await fetch('/api/profile/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    alert("✅ Profiel succesvol bijgewerkt!");
                    if (newPasswordInput) newPasswordInput.value = '';
                    if (confirmPasswordInput) confirmPasswordInput.value = '';
                } else {
                    const error = await response.text();
                    alert("❌ Update mislukt: " + error);
                }
            } catch (error) {
                alert("❌ Netwerkfout bij opslaan.");
            }
        });
    }
});
