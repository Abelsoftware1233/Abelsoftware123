/**
 * ECHO AI - UNIFIED CORE ENGINE V2.0
 * Developed for: Echo AI Software Repository
 * Author: Abelsoftware123 
 * Purpose: LocalStorage Database Management & Profile Synchronization
 */

(function() {
    'use strict';

    // --- CONFIGURATION & DATABASE KEYS ---
    const DB_NAME = 'echo_users';
    const SESSION_KEY = 'currentUser';
    const LOGIN_STATUS = 'isLoggedIn';

    // --- DOM ELEMENT SELECTORS ---
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

    /**
     * INITIALIZATION: Starts the Echo AI Engine logic
     */
    async function init() {
        console.log("🚀 Echo AI Engine: Loading Core Modules...");
        
        // Ensure initial database exists
        if (!localStorage.getItem(DB_NAME)) {
            localStorage.setItem(DB_NAME, JSON.stringify([]));
        }

        const authenticated = checkAccess();
        if (authenticated) {
            loadUserData();
            setupEventListeners();
        }
    }

    /**
     * 1. ACCESS CONTROL & SECURITY
     */
    function checkAccess() {
        const loggedIn = localStorage.getItem(LOGIN_STATUS) === 'true';
        const user = JSON.parse(localStorage.getItem(SESSION_KEY));

        if (!loggedIn || !user) {
            console.error("⛔ Access Denied: No active session found.");
            window.location.href = 'login.html';
            return false;
        }

        console.info(`✅ Access Granted: Session active for ${user.username}`);
        
        // Handle Admin Visibility
        if (elements.adminLink) {
            const isAdmin = user.role === 'Admin' || user.role === 'ROLE_ADMIN';
            elements.adminLink.style.display = isAdmin ? 'block' : 'none';
        }
        return true;
    }

    /**
     * 2. DATA BINDING: Filling the UI with stored data
     */
    function loadUserData() {
        const user = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (!user) return;

        // Populate fields
        if (elements.usernameField) elements.usernameField.value = user.username || '';
        if (elements.emailField) elements.emailField.value = user.email || '';
        if (elements.firstNameField) elements.firstNameField.value = user.firstName || '';
        if (elements.lastNameField) elements.lastNameField.value = user.lastName || '';
        
        // Load Profile Image
        if (user.profilePic && elements.profilePreview) {
            elements.profilePreview.src = user.profilePic;
            console.log("🖼️ Profile image loaded from LocalStorage.");
        }
    }

    /**
     * 3. EVENT REGISTRATION
     */
    function setupEventListeners() {
        // Handle image selection
        if (elements.imageUpload) {
            elements.imageUpload.addEventListener('change', processImage);
        }

        // Handle profile update
        if (elements.profileForm) {
            elements.profileForm.addEventListener('submit', handleProfileUpdate);
        }

        // Expose Logout to Global Scope
        window.logout = performLogout;
    }

    /**
     * 4. IMAGE PROCESSING: Converting file to Base64 String
     */
    function processImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Size validation (Max 2.5MB to stay within LocalStorage limits)
        if (file.size > 2.5 * 1024 * 1024) {
            displayStatus("❌ Image is too large! Max size is 2.5MB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (elements.profilePreview) {
                elements.profilePreview.src = e.target.result;
                console.log("📸 Image preview updated successfully.");
            }
        };
        reader.onerror = () => console.error("❌ Error reading file.");
        reader.readAsDataURL(file);
    }

    /**
     * 5. PERSISTENCE LOGIC: Saving to the LocalStorage Database
     */
    function handleProfileUpdate(event) {
        event.preventDefault();
        console.log("💾 Persistence Engine: Starting update...");

        const newPass = elements.newPassField.value;
        const confirmPass = elements.confirmPassField.value;

        // Logic Validation
        if (newPass !== "" && newPass !== confirmPass) {
            displayStatus("❌ Passwords do not match!", "error");
            return;
        }

        if (!validateEmail(elements.emailField.value)) {
            displayStatus("❌ Invalid email format!", "error");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY));
        
        // Construct Updated Profile Object
        const updatedUser = {
            ...currentUser,
            email: elements.emailField.value,
            firstName: elements.firstNameField.value,
            lastName: elements.lastNameField.value,
            profilePic: elements.profilePreview.src,
            updatedAt: new Date().toLocaleString()
        };

        // Update password only if provided
        if (newPass !== "") {
            updatedUser.password = newPass;
            console.warn("🔑 User password has been updated.");
        }

        try {
            // STEP A: Update Current Session
            localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

            // STEP B: Update Main User Registry
            syncWithMasterRegistry(updatedUser);

            displayStatus("✅ Profile updated successfully!", "success");
            
            // Clean up UI
            elements.newPassField.value = '';
            elements.confirmPassField.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("💾 Storage Exception:", error);
            displayStatus("❌ Error: Browser storage quota exceeded.", "error");
        }
    }

    /**
     * 6. UTILITY METHODS
     */
    function syncWithMasterRegistry(updatedUser) {
        let allUsers = JSON.parse(localStorage.getItem(DB_NAME)) || [];
        const index = allUsers.findIndex(u => u.username === updatedUser.username);
        
        if (index !== -1) {
            allUsers[index] = updatedUser;
            localStorage.setItem(DB_NAME, JSON.stringify(allUsers));
            console.info("🗄️ Master Registry synchronized.");
        }
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function displayStatus(message, type) {
        if (!elements.statusMsg) return;

        elements.statusMsg.textContent = message;
        elements.statusMsg.className = type; // CSS classes: 'success' or 'error'
        elements.statusMsg.style.display = 'block';
        
        console.log(`[EchoAI-UI] ${type.toUpperCase()}: ${message}`);

        setTimeout(() => {
            elements.statusMsg.style.display = 'none';
        }, 5000);
    }

    function performLogout() {
        console.log("🚪 Ending session...");
        localStorage.setItem(LOGIN_STATUS, 'false');
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }

    // Initialize Engine
    init();

})();
