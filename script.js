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


    // === OPGELOST: Logica voor de 'Contact' knop ===
    // Zorg ervoor dat de HTML-knop de ID 'contact-knop' heeft.
    const contactKnop = document.getElementById('contact-knop');
    const emailAdres = 'abelsoftware123@hotmail.com'; // Definieer het e-mailadres

    if (contactKnop) {
        // Voeg een event listener toe aan de knop
        contactKnop.addEventListener('click', function(event) {
            // Dit voorkomt de standaard navigatie van de <a>-tag in de HTML
            event.preventDefault(); 
            
            // Gebruik de correcte 'mailto:' syntax
            window.location.href = 'mailto:' + emailAdres;

            // OPTIONEEL: Om te debuggen
            console.log('Contact knop geklikt. E-mailadres:', emailAdres);
        });
    } else {
        console.error("De knop met ID 'contact-knop' is niet gevonden.");
    }
});
