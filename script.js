document.addEventListener('DOMContentLoaded', function() {
    // === Logica voor het tonen/verbergen van secties (INFO/TOOLS/SETUP/FAQ) ===
    const futuristicButtons = document.querySelectorAll('.futuristic-button');
    const contentSections = document.querySelectorAll('.content-section');

    // Functie om alle contentsecties te verbergen
    function hideAllContentSections() {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
    }

    // Functie om een specifieke contentsectie te tonen
    function showContentSection(targetId) {
        hideAllContentSections(); // Eerst alles verbergen
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    // Event listeners toevoegen aan de futuristische knoppen
    futuristicButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Vormt de ID: "introductie-content", "tools-content", etc.
            const target = this.dataset.contentTarget + '-content'; 
            showContentSection(target);
        });
    });

    // Toon de 'INFO' sectie standaard bij het laden van de pagina
    showContentSection('introductie-content');


    // === NIEUWE Logica voor de 'Contact' knop ===
    const contactKnop = document.getElementById('contact-knop');
    
    if (contactKnop) {
        // Voeg een event listener toe aan de knop
        contactKnop.addEventListener('click', function(event) {
            // Dit voorkomt de standaard navigatie van de <a>-tag in de HTML
            event.preventDefault(); 
            
            // Stelt de 'mailto' link in via JavaScript
            window.location.href = 'mailto:abelsoftware123@hotmail.com';
        });
    }
});
