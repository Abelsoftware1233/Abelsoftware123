async function handleRegistration(event) {
    event.preventDefault(); // Voorkom dat de pagina herlaadt

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userData = {
        username: username,
        email: email,
        passwordHash: password // Je Java UserService regelt de hashing
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert("Registratie gelukt! De data staat nu veilig in PostgreSQL.");
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            alert("Fout bij registreren: " + errorText);
        }
    } catch (error) {
        console.error("Server onbereikbaar:", error);
        alert("Kan geen verbinding maken met de Java server.");
    }
}
