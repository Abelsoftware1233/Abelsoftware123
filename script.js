document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Voorkom dat de pagina ververst

    const statusMsg = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password_confirm').value;

    // 1. Check of wachtwoorden gelijk zijn
    if (password !== confirmPassword) {
        showStatus("❌ Wachtwoorden komen niet overeen!", "error");
        return;
    }

    // Knop uitschakelen tijdens laden
    submitBtn.disabled = true;
    submitBtn.innerText = "Verwerken...";

    try {
        // 2. Data versturen naar je Java Backend (RegistrationController)
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const result = await response.text();

        if (response.ok) {
            showStatus("✅ Succes! Je wordt nu doorgestuurd...", "success");
            
            // 3. DIT IS DE FIX: Na 1.5 seconde doorsturen naar de profielpagina
            setTimeout(() => {
                window.location.href = "profile.html"; 
            }, 1500);
        } else {
            showStatus(result, "error");
            submitBtn.disabled = false;
            submitBtn.innerText = "Create Account";
        }

    } catch (error) {
        showStatus("❌ Kan geen verbinding maken met de server.", "error");
        submitBtn.disabled = false;
        submitBtn.innerText = "Create Account";
    }
});

function showStatus(text, type) {
    const statusMsg = document.getElementById('statusMessage');
    statusMsg.innerText = text;
    statusMsg.className = type;
    statusMsg.style.display = 'block';
}
@RestController // Belangrijk voor JavaScript/Fetch
public class RegistrationController {

    @PostMapping("/api/register") // Moet matchen met je fetch() in script.js
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request) {
        try {
            userService.registerNewUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok().build(); // JavaScript handelt de redirect daarna af
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
