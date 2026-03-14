/**
 * Abelsoftware123 - UNIFIED CORE ENGINE V2.0 (LocalStorage Only)
 * Developed for: profile Software Repository
 * Author: Abelsoftware123 
 * Purpose: Pure LocalStorage Database Management
 */

(function() {
    'use strict';

    // --- CONFIGURATIE ---
    const DB_NAME = 'echo_users';
    const SESSION_KEY = 'currentUser';
    const LOGIN_STATUS = 'isLoggedIn';

    // --- ELEMENTEN ---
    const elements = {
        profileForm: document.getElementById('profileForm'), // Zorg dat je <form id="profileForm"> hebt
        profilePreview: document.getElementById('profilePreview'),
        imageUpload: document.getElementById('imageUpload'),
        statusMsg: document.getElementById('statusMessage'),
        emailField: document.getElementById('emailAddress') || document.getElementById('email'),
        firstNameField: document.getElementById('firstName'),
        lastNameField: document.getElementById('lastName'),
        newPassField: document.getElementById('newPassword'),
        confirmPassField: document.getElementById('confirmPassword')
    };

    /**
     * INITIALISATIE
     */
    function init() {
        console.log("🚀 Echo AI Engine: Loading Local Storage Mode...");
        
        const loggedIn = localStorage.getItem(LOGIN_STATUS) === 'true';
        const user = JSON.parse(localStorage.getItem(SESSION_KEY));

        if (!loggedIn || !user) {
            window.location.href = 'login.html';
            return;
        }

        loadUserData(user);
        setupEventListeners();
    }

    /**
     * DATA LADEN IN FORMULIER
     */
    function loadUserData(user) {
        if (elements.emailField) elements.emailField.value = user.email || '';
        if (elements.firstNameField) elements.firstNameField.value = user.firstName || '';
        if (elements.lastNameField) elements.lastNameField.value = user.lastName || '';
        
        if (user.profilePic && elements.profilePreview) {
            elements.profilePreview.src = user.profilePic;
        }
    }

    /**
     * EVENT LISTENERS
     */
    function setupEventListeners() {
        // Foto uploaden
        if (elements.imageUpload) {
            elements.imageUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(event) {
                    if (elements.profilePreview) elements.profilePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        // Formulier verzenden (De SAVE knop)
        if (elements.profileForm) {
            elements.profileForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Voorkom dat de pagina herlaadt voor de save
                handleProfileUpdate();
            });
        }

        // Maak de functie ook globaal beschikbaar voor de onclick="saveProfileChanges()"
        window.saveProfileChanges = handleProfileUpdate;
    }

    /**
     * OPSLAAN LOGICA
     */
    function handleProfileUpdate() {
        console.log("💾 Opslaan naar LocalStorage...");

        const newPass = elements.newPassField.value;
        const confirmPass = elements.confirmPassField.value;

        // Wachtwoord Check
        if (newPass !== "" && newPass !== confirmPass) {
            displayStatus("❌ Wachtwoorden komen niet overeen!", "error");
            return;
        }

        let currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
        let allUsers = JSON.parse(localStorage.getItem(DB_NAME)) || [];

        // Update het object
        currentUser.firstName = elements.firstNameField.value;
        currentUser.lastName = elements.lastNameField.value;
        currentUser.email = elements.emailField.value;
        
        if (elements.profilePreview) {
            currentUser.profilePic = elements.profilePreview.src;
        }

        if (newPass !== "") {
            currentUser.password = newPass;
        }

        // 1. Update Sessie
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

        // 2. Update 'Database' (allUsers)
        const userIndex = allUsers.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            allUsers[userIndex] = { ...allUsers[userIndex], ...currentUser };
            localStorage.setItem(DB_NAME, JSON.stringify(allUsers));
        }

        displayStatus("✅ Gegevens succesvol bijgewerkt!", "success");

        // Optioneel: herlaad na 1 seconde om resultaat te zien
        setTimeout(() => {
            window.location.reload();
        }, 1200);
    }

    function displayStatus(message, type) {
        if (elements.statusMsg) {
            elements.statusMsg.textContent = message;
            elements.statusMsg.style.display = 'block';
            elements.statusMsg.className = type;
            setTimeout(() => { elements.statusMsg.style.display = 'none'; }, 4000);
        } else {
            alert(message);
        }
    }

    init();
})();
