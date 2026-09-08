/**
 * ECHO AI - PROFILE ENGINE V3.0 (Backend-connected)
 * Purpose: Profile management via PostgreSQL backend (no more LocalStorage)
 */

(function() {
    'use strict';

    const elements = {
        profileForm: document.getElementById('profileForm'),
        profilePreview: document.getElementById('profilePreview'),
        imageUpload: document.getElementById('imageUpload'),
        statusMsg: document.getElementById('statusMessage'),
        usernameField: document.getElementById('username'),
        emailField: document.getElementById('email'),
        firstNameField: document.getElementById('firstName'),
        lastNameField: document.getElementById('lastName'),
        newPassField: document.getElementById('newPassword'),
        confirmPassField: document.getElementById('confirmPassword'),
        adminLink: document.getElementById('adminLink')
    };

    async function init() {
        console.log("🚀 Echo AI Engine: Loading profile from server...");
        const authenticated = await loadUserData();
        if (authenticated) {
            setupEventListeners();
        }
    }

    /**
     * Haalt het profiel op bij de backend (GET /api/user/profile).
     * Spring Security regelt via de sessie-cookie of je bent ingelogd.
     */
    async function loadUserData() {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status === 401 || response.status === 403) {
                console.error("⛔ Access Denied: geen actieve sessie.");
                window.location.href = 'login.html';
                return false;
            }

            if (!response.ok) throw new Error('Kon profiel niet ophalen');

            const user = await response.json();

            if (elements.usernameField) elements.usernameField.value = user.username || '';
            if (elements.emailField) elements.emailField.value = user.email || '';
            if (elements.firstNameField) elements.firstNameField.value = user.firstName || '';
            if (elements.lastNameField) elements.lastNameField.value = user.lastName || '';

            if (user.profilePictureUrl && elements.profilePreview) {
                elements.profilePreview.src = user.profilePictureUrl;
            }

            if (elements.adminLink) {
                const isAdmin = user.role === 'ROLE_ADMIN';
                elements.adminLink.style.display = isAdmin ? 'block' : 'none';
            }

            return true;
        } catch (error) {
            console.error("❌ Fout bij laden profiel:", error);
            displayStatus("❌ Kon profiel niet laden.", "error");
            return false;
        }
    }

    function setupEventListeners() {
        if (elements.imageUpload) {
            elements.imageUpload.addEventListener('change', processImage);
        }
        if (elements.profileForm) {
            elements.profileForm.addEventListener('submit', handleProfileUpdate);
        }
        window.logout = performLogout;
    }

    function processImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2.5 * 1024 * 1024) {
            displayStatus("❌ Afbeelding is te groot! Max 2.5MB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (elements.profilePreview) {
                elements.profilePreview.src = e.target.result;
            }
        };
        reader.onerror = () => console.error("❌ Fout bij lezen bestand.");
        reader.readAsDataURL(file);
    }

    /**
     * Stuurt de wijzigingen naar de backend (PUT /api/user/profile)
     * i.p.v. naar localStorage. Veldnamen matchen UpdateProfileRequest.java.
     */
    async function handleProfileUpdate(event) {
        event.preventDefault();
        console.log("💾 Profiel opslaan naar server...");

        const newPass = elements.newPassField.value;
        const confirmPass = elements.confirmPassField.value;

        if (newPass !== "" && newPass !== confirmPass) {
            displayStatus("❌ Wachtwoorden komen niet overeen!", "error");
            return;
        }

        if (!validateEmail(elements.emailField.value)) {
            displayStatus("❌ Ongeldig e-mailadres!", "error");
            return;
        }

        const payload = {
            email: elements.emailField.value,
            firstName: elements.firstNameField.value,
            lastName: elements.lastNameField.value
        };

        if (newPass !== "") {
            payload.newPassword = newPass;
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Onbekende fout');
            }

            displayStatus("✅ Profiel succesvol bijgewerkt!", "success");
            elements.newPassField.value = '';
            elements.confirmPassField.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("💾 Fout bij opslaan:", error);
            displayStatus(`❌ Fout: ${error.message}`, "error");
        }
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function displayStatus(message, type) {
        if (!elements.statusMsg) return;
        elements.statusMsg.textContent = message;
        elements.statusMsg.className = type;
        elements.statusMsg.style.display = 'block';
        setTimeout(() => {
            elements.statusMsg.style.display = 'none';
        }, 5000);
    }

    async function performLogout() {
        try {
            await fetch('/perform_logout', { method: 'POST', credentials: 'include' });
        } catch (e) {
            console.error("Fout bij uitloggen:", e);
        }
        window.location.href = 'login.html';
    }

    init();

})();
