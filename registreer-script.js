document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('statusMessage');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password_confirm').value;

            if (password !== passwordConfirm) {
                showStatus("❌ Wachtwoorden komen niet overeen!", "error");
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Registratie mislukt.');
                }

                showStatus("✅ Account aangemaakt! Je wordt doorgestuurd naar login...", "success");

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                showStatus(`❌ ${error.message}`, "error");
            }
        });
    }

    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
