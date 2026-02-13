// Database met vragen en antwoorden
const echoBotData = {
    "prijzen": "Onze tarieven zijn erg scherp! Bekijk de prijzenpagina voor meer info.",
    "uren": "Wij zijn geopend van maandag tot vrijdag, tussen 09:00 en 17:00.",
    "contact": "Je kunt ons mailen via info@jouwwebsite.nl.",
    "hallo": "Hoi! Hoe kan ik je vandaag helpen?",
    "bedankt": "Graag gedaan! Heb je nog meer vragen?",
    "default": "Ik begrijp het niet helemaal. Probeer een van de knoppen hierboven!"
};

// Functie om chat te openen/sluiten
function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (chat.style.display === "flex") {
        chat.style.display = "none";
    } else {
        chat.style.display = "flex";
    }
}

// Functie om vragen te verwerken
function askBot(tekst = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    
    // Pak tekst uit input of van de knop
    let userText = tekst ? tekst : input.value.trim().toLowerCase();
    if (userText === "") return;

    // Toon bericht van de gebruiker
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    input.value = ""; // Maak veld leeg

    // Zoek naar antwoord
    let botResponse = echoBotData["default"];
    for (let key in echoBotData) {
        if (userText.includes(key)) {
            botResponse = echoBotData[key];
            break;
        }
    }

    // Laat de bot antwoorden na een korte pauze (voor realisme)
    setTimeout(() => {
        container.innerHTML += `<div class="msg bot-msg"><b>Bot:</b> ${botResponse}</div>`;
        container.scrollTop = container.scrollHeight; // Scroll naar beneden
    }, 600);
}

// Enter-toets ondersteuning
function handleKey(event) {
    if (event.key === "Enter") {
        askBot();
    }
}
