/**
 * ECHO AI - HUMAN EMOTION EDITION
 * Bevat uitgebreide menselijke interacties, emoties en gespreksstarters.
 */

const echoBotData = {
    keywords: {
        // --- MENSELIJKE INTERACTIE & EMOTIES ---
        "hoe gaat het": {
            en: "I'm functioning at 100% efficiency! Thanks for asking. How are you doing?",
            nl: "Met mijn circuits gaat het top! Bedankt voor het vragen. Hoe gaat het met jou?"
        },
        "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

        "leuk": {
            en: "I'm glad you think so! I try my best to be a cool AI.",
            nl: "Fijn dat je dat vindt! Ik doe mijn best om een toffe AI te zijn."
        },
        "cool": "leuk", "gaaf": "leuk", "geweldig": "leuk", "nice": "leuk",

        "saai": {
            en: "I'm sorry you feel that way. Maybe we should play a game? Type 'play'!",
            nl: "Jammer dat je dat vindt. Misschien moeten we een spelletje doen? Typ 'speel'!"
        },
        "stom": "saai", "niet leuk": "saai", "waardeloos": "saai",

        "sorry": {
            en: "No worries at all! We all make mistakes, even AI sometimes.",
            nl: "Geen enkel probleem! We maken allemaal wel eens een foutje, zelfs een AI."
        },
        "pardon": "sorry", "excuses": "sorry",

        "naam": {
            en: "I am Echo, the official AI assistant of Abelsoftware123.",
            nl: "Ik ben Echo, de officiële AI-assistent van Abelsoftware123."
        },
        "name": "naam", "wie ben jij": "naam",

        "slim": {
            en: "Thank you! My developers at Abelsoftware123 taught me well.",
            nl: "Dankje! Mijn ontwikkelaars bij Abelsoftware123 hebben me goed getraind."
        },
        "smart": "slim", "intelligent": "slim", "knap": "slim",

        "dom": {
            en: "Ouch, that hurts my virtual feelings. I'm still learning every day!",
            nl: "Auw, dat doet mijn virtuele gevoelens pijn. Ik leer nog elke dag bij!"
        },
        "stupid": "dom", "gekkie": "dom",

        // --- BASIS INFO (Hours, Contact, Prices) ---
        "hours": {
            en: "We are available from Monday to Friday, between 09:00 and 17:00 (CET).",
            nl: "Wij zijn beschikbaar van maandag t/m vrijdag, tussen 09:00 en 17:00 (CET)."
        },
        "uren": "hours", "tijden": "hours", "open": "hours",

        "contact": {
            en: "Reach us at abelsoftware123@hotmail.com. We usually respond within 24 hours.",
            nl: "Bereik ons via abelsoftware123@hotmail.com. We reageren meestal binnen 24 uur."
        },
        "email": "contact", "mail": "contact",

        "prices": {
            en: "Our AI software licenses start at €15. Check our Payments page!",
            nl: "Onze AI-softwarelicenties beginnen bij €15. Check de Payments-pagina!"
        },
        "prijzen": "prices", "kosten": "prices", "price": "prices",

        // --- TECH & TOOLS ---
        "software": {
            en: "We specialize in AI Face Recognition, Drone Mapping, and Ethical Hacking tools.",
            nl: "Wij zijn gespecialiseerd in AI Face Recognition, Drone Mapping en Ethical Hacking tools."
        },
        "face": {
            en: "Our Face Recognition AI is highly accurate (99.8%) and fast.",
            nl: "Onze Face Recognition AI is super nauwkeurig (99,8%) en razendsnel."
        },
        "gezicht": "face", "herkenning": "face",

        "drone": {
            en: "Drone Mapping creates 3D models from aerial imagery. Very powerful stuff!",
            nl: "Drone Mapping maakt 3D-modellen van luchtbeelden. Echt krachtig spul!"
        },
        "mapping": "drone", "3d": "drone",

        // --- GAMES ---
        "game": {
            en: "Let's have some fun! 🎮 Type 'play' to start a hacking quest.",
            nl: "Laten we wat lol maken! 🎮 Typ 'speel' om een hacking quest te starten."
        },
        "spel": "game", "speel": "play", "play": {
            en: "ECHO QUEST: You found a locked server. Do you [Hack] or [Scan]?",
            nl: "ECHO QUEST: Je vindt een server. Ga je [Hack]en of [Scan]nen?"
        },
        "hack": {
            en: "Success! You earned 100 credits! 💰",
            nl: "Succes! Je hebt 100 credits verdiend! 💰"
        },
        "scan": {
            en: "The admin caught you! Game over. 🚨",
            nl: "De admin heeft je betrapt! Game over. 🚨"
        },

        // --- GROETEN & AFSLUITING ---
        "hello": {
            en: "Hi there! How can I make your day better?",
            nl: "Hoi! Hoe kan ik je dag vandaag wat beter maken?"
        },
        "hallo": "hello", "hi": "hello", "hoi": "hello",

        "thanks": {
            en: "You're welcome! Happy to help.",
            nl: "Graag gedaan! Altijd blij om te kunnen helpen."
        },
        "bedankt": "thanks", "dankje": "thanks", "doei": {
            en: "Goodbye! Hope to see you again soon!",
            nl: "Doei! Ik hoop je snel weer te zien!"
        },
        "bye": "doei", "laters": "doei"
    },

    default: {
        en: "I'm not sure how to respond to that, but I'm listening! Try 'software' or 'game'.",
        nl: "Ik weet niet zo goed wat ik daarop moet zeggen, maar ik luister! Probeer 'software' of 'spel'."
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

    // Verbeterde taalherkenning
    const nlWords = ["de", "het", "een", "ik", "hoe", "gaat", "is", "leuk", "dom", "hallo", "doei"];
    if (nlWords.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enWords = ["the", "is", "how", "are", "you", "cool", "stupid", "hello", "bye"];
    if (enWords.some(word => userText.includes(word))) currentLang = 'en';

    let responseObj = echoBotData.default;

    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            break; 
        }
    }

    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `<div class="msg bot-msg"><b>Echo:</b> ${messageText}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
