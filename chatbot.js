/**
 * ECHO AI - INTEGRATED SMART BOT
 * Combineert jouw originele database met slimme functies en games.
 */

const echoBotData = {
    // Jouw uitgebreide database met alle info
    keywords: {
        // --- BASIS INFO (Jouw originele data + uitbreiding) ---
        "hours": {
            en: "We are available from Monday to Friday, between 09:00 and 17:00 (CET).",
            nl: "Wij zijn beschikbaar van maandag t/m vrijdag, tussen 09:00 en 17:00 (CET)."
        },
        "uren": "hours", "tijden": "hours", "openingstijden": "hours", "open": "hours",

        "contact": {
            en: "You can reach us at abelsoftware123@hotmail.com. We usually respond within 24 hours.",
            nl: "Je kunt ons bereiken op abelsoftware123@hotmail.com. We reageren meestal binnen 24 uur."
        },
        "email": "contact", "mail": "contact", "hulp": "contact", "support": "contact",

        "prices": {
            en: "Our AI software licenses start at €15. Check our Payments page for more details!",
            nl: "Onze AI-softwarelicenties beginnen bij €15. Bekijk de Payments-pagina voor details!"
        },
        "prijzen": "prices", "kosten": "prices", "betalen": "prices", "price": "prices",

        "software": {
            en: "We specialize in AI Face Recognition, Drone Mapping, and Ethical Hacking tools.",
            nl: "Wij zijn gespecialiseerd in AI Face Recognition, Drone Mapping en Ethical Hacking tools."
        },
        "tools": "software", "programma": "software",

        // --- WELKOM ---
        "hello": {
            en: "Hello! Welcome to Abelsoftware123. How can I assist you today?",
            nl: "Hallo! Welkom bij Abelsoftware123. Hoe kan ik je vandaag helpen?"
        },
        "hallo": "hello", "hi": "hello", "hey": "hello", "hoi": "hello",

        // --- SPECIFIEKE AI TOOLS ---
        "face": {
            en: "Our Face Recognition AI is built for speed and security. Accuracy: 99.8%.",
            nl: "Onze Face Recognition AI is gebouwd voor snelheid en veiligheid. Nauwkeurigheid: 99,8%."
        },
        "gezicht": "face", "herkenning": "face",

        "drone": {
            en: "Drone Mapping allows you to create 3D maps from aerial footage automatically.",
            nl: "Met Drone Mapping kun je automatisch 3D-kaarten maken van luchtbeelden."
        },
        "mapping": "drone", "kaarten": "drone",

        // --- GAMES SECTIE ---
        "game": {
            en: "I love games! 🎮 Type 'play' to start a mini-hacking quest.",
            nl: "Ik hou van games! 🎮 Typ 'speel' om een mini-hacking quest te starten."
        },
        "spel": "game", "gaming": "game", "spelen": "game",

        "play": {
            en: "ECHO QUEST: You found a locked server. Do you try to [Hack] it or [Scan] for vulnerabilities?",
            nl: "ECHO QUEST: Je hebt een vergrendelde server gevonden. Probeer je te [Hack]en of te [Scan]nen op zwakheden?"
        },
        "speel": "play",

        "hack": {
            en: "CRITICAL HIT! You breached the server. You earned 100 Echo-credits! 💰",
            nl: "CRITICAL HIT! Je bent binnengedrongen. Je hebt 100 Echo-credits verdiend! 💰"
        },
        "scan": {
            en: "The scan took too long and the admin found you. Game over! 🚨",
            nl: "De scan duurde te lang en de admin heeft je gevonden. Game over! 🚨"
        },

        // --- AFSLUITING ---
        "thanks": {
            en: "You're welcome! Let me know if you have any other questions.",
            nl: "Graag gedaan! Laat het me weten als je nog andere vragen hebt."
        },
        "bedankt": "thanks", "dankje": "thanks", "bedankt": "thanks"
    },

    // Default antwoorden
    default: {
        en: "I'm not sure I understand. Please try typing 'software', 'prices', 'hours' or 'game'!",
        nl: "Ik begrijp het niet helemaal. Probeer 'software', 'prijzen', 'uren' of 'spel' te typen!"
    }
};

// De huidige taal van de sessie
let currentLang = 'en';

// Functie om de chat te openen/sluiten
function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (!chat) return;
    chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

// Functie om berichten te verwerken
function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    
    // Pak tekst uit input of van knop
    let userText = text ? text : input.value.trim().toLowerCase();
    
    if (userText === "") return;

    // Toon gebruikersbericht
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = ""; 

    // --- SLIMME LOGICA ---
    
    // 1. Detecteer taal op basis van veelvoorkomende NL woorden
    const nlTriggers = ["de", "het", "ik", "hoe", "wat", "uren", "spel", "prijzen"];
    if (nlTriggers.some(word => userText.includes(word))) {
        currentLang = 'nl';
    } else {
        // Alleen terug naar EN als er duidelijke EN woorden zijn, anders taal vasthouden
        const enTriggers = ["the", "is", "how", "what", "game", "prices"];
        if (enTriggers.some(word => userText.includes(word))) currentLang = 'en';
    }

    let responseObj = echoBotData.default;
    let found = false;

    // 2. Zoek door de database
    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            
            // Als het een alias is (string), zoek de hoofd-key op
            if (typeof match === "string") {
                match = echoBotData.keywords[match];
            }
            
            responseObj = match;
            found = true;
            break; 
        }
    }

    // 3. Toon bot antwoord met vertraging
    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `
            <div class="msg bot-msg">
                <b>Echo AI:</b> ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight; // Auto-scroll
    }, 600);
}

// Enter-toets ondersteuning
function handleKey(event) {
    if (event.key === "Enter") {
        askBot();
    }
}
