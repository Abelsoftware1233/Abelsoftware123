/**
 * ECHO AI - ULTIMATE EXTENDED EDITION
 * Bevat uitgebreide keywords, aliassen en slimme taalherkenning.
 */

const echoBotData = {
    keywords: {
        // --- BASIS INFO ---
        "hours": {
            en: "We are available from Monday to Friday, between 09:00 and 17:00 (CET).",
            nl: "Wij zijn beschikbaar van maandag t/m vrijdag, tussen 09:00 en 17:00 (CET)."
        },
        "uren": "hours", "tijden": "hours", "openingstijden": "hours", "open": "hours", "wanneer": "hours",

        "contact": {
            en: "You can reach us at abelsoftware123@hotmail.com. We usually respond within 24 hours.",
            nl: "Je kunt ons bereiken op abelsoftware123@hotmail.com. We reageren meestal binnen 24 uur."
        },
        "email": "contact", "mail": "contact", "hulp": "contact", "support": "contact", "bericht": "contact",

        "prices": {
            en: "Our AI software licenses start at €15. Check our Payments page for more details!",
            nl: "Onze AI-softwarelicenties beginnen bij €15. Bekijk de Payments-pagina voor details!"
        },
        "prijzen": "prices", "kosten": "prices", "betalen": "prices", "price": "prices", "euro": "prices", "goedkoop": "prices",

        // --- SOFTWARE & TECH ---
        "software": {
            en: "We specialize in AI Face Recognition, Drone Mapping, and Ethical Hacking tools.",
            nl: "Wij zijn gespecialiseerd in AI Face Recognition, Drone Mapping en Ethical Hacking tools."
        },
        "tools": "software", "programma": "software", "producten": "software",

        "face": {
            en: "Our Face Recognition AI is built for speed and security. Accuracy: 99.8%.",
            nl: "Onze Face Recognition AI is gebouwd voor snelheid en veiligheid. Nauwkeurigheid: 99,8%."
        },
        "gezicht": "face", "herkenning": "face", "biometrie": "face",

        "drone": {
            en: "Drone Mapping allows you to create 3D maps from aerial footage automatically.",
            nl: "Met Drone Mapping kun je automatisch 3D-kaarten maken van luchtbeelden."
        },
        "mapping": "drone", "kaarten": "drone", "vliegen": "drone", "3d": "drone",

        "api": {
            en: "Yes! We offer a REST API for easy integration into your own Python or JS projects.",
            nl: "Jazeker! We bieden een REST API voor eenvoudige integratie in je eigen Python of JS projecten."
        },
        "integratie": "api", "koppeling": "api", "developer": "api",

        "update": {
            en: "We release updates monthly. Check the 'Releases' tab in the repo for the latest patch notes.",
            nl: "We brengen maandelijks updates uit. Check de 'Releases' tab in de repo voor de laatste versie."
        },
        "versie": "update", "nieuw": "update", "laatste": "update",

        "security": {
            en: "All our tools are tested for safety. We follow 'Privacy by Design' principles.",
            nl: "Al onze tools zijn getest op veiligheid. We werken volgens 'Privacy by Design' principes."
        },
        "veilig": "security", "privacy": "security", "veiligheid": "security",

        // --- HULP & EDUCATIE ---
        "tutorial": {
            en: "We have a Wiki page in the repository with step-by-step guides for all tools.",
            nl: "We hebben een Wiki-pagina in de repository met stap-voor-stap handleidingen voor alle tools."
        },
        "uitleg": "tutorial", "hoe": "tutorial", "leren": "tutorial", "documentatie": "tutorial",

        // --- CARRIÈRE & BEDRIJF ---
        "jobs": {
            en: "We are always looking for AI enthusiasts! Send your CV to our email.",
            nl: "We zoeken altijd AI-liefhebbers! Stuur je CV naar onze e-mail."
        },
        "werken": "jobs", "vacature": "jobs", "stage": "jobs",

        "who": {
            en: "Abelsoftware123 is a tech-focused lab creating accessible AI solutions for everyone.",
            nl: "Abelsoftware123 is een tech-lab dat toegankelijke AI-oplossingen maakt voor iedereen."
        },
        "wie": "who", "over": "who", "bedrijf": "who",

        // --- FUN & GAMES ---
        "game": {
            en: "I love games! 🎮 Type 'play' to start a mini-hacking quest.",
            nl: "Ik hou van games! 🎮 Typ 'speel' om een mini-hacking quest te starten."
        },
        "spel": "game", "gaming": "game", "spelen": "game", "verveeld": "game",

        "play": {
            en: "ECHO QUEST: You found a locked server. Do you try to [Hack] it or [Scan] for vulnerabilities?",
            nl: "ECHO QUEST: Je hebt een vergrendelde server gevonden. Probeer je te [Hack]en of te [Scan]nen op zwakheden?"
        },
        "speel": "play",

        "hack": {
            en: "CRITICAL HIT! You breached the server. You earned 100 Echo-credits! 💰 Type 'thanks' to exit.",
            nl: "CRITICAL HIT! Je bent binnengedrongen. Je hebt 100 Echo-credits verdiend! 💰 Typ 'bedankt' om te stoppen."
        },
        "scan": {
            en: "The scan took too long and the admin found you. Game over! 🚨 Try 'play' again.",
            nl: "De scan duurde te lang en de admin heeft je gevonden. Game over! 🚨 Probeer opnieuw met 'speel'."
        },

        "joke": {
            en: "Why did the AI cross the road? To optimize the path to the other side!",
            nl: "Waarom stak de AI de weg over? Om het pad naar de overkant te optimaliseren!"
        },
        "mop": "joke", "grappig": "joke",

        // --- AFSLUITING ---
        "hello": {
            en: "Hello! Welcome to Abelsoftware123. How can I assist you today?",
            nl: "Hallo! Welkom bij Abelsoftware123. Hoe kan ik je vandaag helpen?"
        },
        "hallo": "hello", "hi": "hello", "hey": "hello", "hoi": "hello",

        "thanks": {
            en: "You're welcome! Let me know if you have any other questions.",
            nl: "Graag gedaan! Laat het me weten als je nog andere vragen hebt."
        },
        "bedankt": "thanks", "dank": "thanks", "super": "thanks", "top": "thanks"
    },

    default: {
        en: "I'm not sure I understand. Try typing 'software', 'prices', 'api', or 'game'!",
        nl: "Ik begrijp het niet helemaal. Probeer 'software', 'prijzen', 'api' of 'spel' te typen!"
    }
};

let currentLang = 'en';

function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (chat) chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    let userText = text ? text : input.value.trim().toLowerCase();
    
    if (userText === "") return;

    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = ""; 

    // Taalherkenning
    const nlTriggers = ["de", "het", "ik", "hoe", "wat", "uren", "spel", "prijzen", "mop", "wie"];
    if (nlTriggers.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enTriggers = ["the", "is", "how", "what", "game", "prices", "joke", "who"];
    if (enTriggers.some(word => userText.includes(word))) currentLang = 'en';

    let responseObj = echoBotData.default;
    let found = false;

    // Doorzoek keywords en aliassen
    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            found = true;
            break; 
        }
    }

    // Bot reactie met delay
    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `<div class="msg bot-msg"><b>Echo:</b> ${messageText}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
