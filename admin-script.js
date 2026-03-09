document.addEventListener('DOMContentLoaded', function() {
    // 1. Check if admin is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Access denied. Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Display admin name
    const adminData = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Admin' };
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = adminData.username;
    }

    // 3. Fetch and display users
    renderUsers();
});

// Helper function to manage user data
function getStoredUsers() {
    const savedUsers = localStorage.getItem('echo_users');
    
    if (savedUsers) {
        return JSON.parse(savedUsers);
    } else {
        // Consolidated default data
        const defaultUsers = [
            { id: 1, username: 'Abelsoftware123_Admin', email: 'abelsoftware123@hotmail.com', role: 'Admin' },
            { id: 2, username: 'Kevin', email: 'kevin@echoai.com', role: 'User' },
            { id: 3, username: 'Samantha', email: 'samantha.sabrina@gmail.com', role: 'User' },
            { id: 4, username: 'Britney', email: 'britneypears@live.be', role: 'User' }
        ];
        localStorage.setItem('echo_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

function renderUsers() {
    const users = getStoredUsers();
    const tableBody = document.getElementById('userTableBody');
    
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge">${user.role}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = getStoredUsers();
        // Filter out the user
        users = users.filter(user => user.id !== id);
        // Save new list
        localStorage.setItem('echo_users', JSON.stringify(users));
        // Refresh table
        renderUsers();
    }
}

// Logout function
window.performLogout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};
