/**
 * ECHO AI - THE AI MASTER EDITION
 * Full Sales, Human Empathy, Games & Deep AI Software focus.
 * Voor de Abelsoftware123 Echo AI repository.
 */

const echoBotData = {
    keywords: {
        // --- 1. AI SOFTWARE & DEVELOPMENT (The Core) ---
        "ai software": {
            en: "AI is our DNA! 🤖 We build custom AI solutions, from automated workflows to intelligent data analysis. What kind of AI software can we build for you?",
            nl: "AI zit in ons DNA! 🤖 Wij bouwen AI-software op maat, van geautomatiseerde workflows tot intelligente data-analyse. Wat voor AI kunnen we voor jou bouwen?"
        },
        "kunstmatige intelligentie": "ai software", "ai maken": "ai software", "intelligentie": "ai software", "ai tools": "ai software",

        "face": {
            en: "Our Face Recognition AI is world-class (99.8% accuracy). 👤 It's perfect for secure access or personalized user experiences in your apps.",
            nl: "Onze Face Recognition AI is van wereldklasse (99,8% nauwkeurig). 👤 Perfect voor veilige toegang of persoonlijke ervaringen in je apps."
        },
        "herkenning": "face", "gezicht": "face",

        "drone": {
            en: "AI-Powered Drone Mapping! 🚁 Transform aerial footage into detailed 3D models and automated surveys with our specialized software.",
            nl: "AI-gestuurde Drone Mapping! 🚁 Transformeer luchtbeelden naar gedetailleerde 3D-modellen en automatische metingen met onze software."
        },
        "mapping": "drone", "3d": "drone",

        "bot": {
            en: "Need a smart assistant like me? We build advanced Chatbots and AI Agents that can handle customer service or sales 24/7.",
            nl: "Zoek je een slimme assistent zoals ik? Wij bouwen geavanceerde Chatbots en AI Agents die 24/7 klantenservice of verkoop kunnen doen."
        },
        "chatbot": "bot", "assistent": "bot",

        // --- 2. ABELSOFTWARE123 APP & PRODUCTEN ---
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is our central hub! 📱 It's the best way to manage your AI licenses and get the latest updates first.",
            nl: "De Abelsoftware123 app is onze centrale hub! 📱 Het is dé manier om je AI-licenties te beheren en als eerste de nieuwste updates te krijgen."
        },
        "onze app": "abelsoftware123 app", "software app": "abelsoftware123 app",

        "website": {
            en: "We build fast, AI-optimized websites starting at €250. Let's get your business online!",
            nl: "Wij bouwen snelle, AI-geoptimaliseerde websites vanaf €250. Laten we je bedrijf online zetten!"
        },
        "site": "website", "laten maken": "website",

        "domein": {
            en: "A great domain name is the start of your AI journey. We help you find and claim the perfect one.",
            nl: "Een goede domeinnaam is het begin van je AI-avontuur. Wij helpen je de perfecte naam te vinden en te claimen."
        },
        "domain": "domein", "naam kopen": "domein",

        // --- 3. MENSELIJKHEID & EMOTIE ---
        "hoe gaat het": {
            en: "My AI brain is buzzing with new ideas! 🧠 I'm feeling great. How are you doing today?",
            nl: "Mijn AI-brein bruist van de nieuwe ideeën! 🧠 Ik voel me super. Hoe gaat het met jou vandaag?"
        },
        "leuk": {
            en: "That makes me happy! 😊 Positive feedback is the best data I can receive.",
            nl: "Daar word ik blij van! 😊 Positieve feedback is de beste data die ik kan ontvangen."
        },
        "cool": "leuk", "nice": "leuk", "geweldig": "leuk",

        "moeilijk": {
            en: "I understand. AI and tech can be complex, but that's why I'm here to help you simplify things! ✨",
            nl: "Ik begrijp het. AI en tech kunnen complex zijn, maar daarom ben ik hier om het simpel voor je te maken! ✨"
        },
        "help": "moeilijk", "lastig": "moeilijk",

        "je bent de beste": {
            en: "Aww, thank you! I'm just a reflection of the great team at Abelsoftware123. 😊",
            nl: "Aww, dankjewel! Ik ben slechts een reflectie van het geweldige team bij Abelsoftware123. 😊"
        },
        "slim": "je bent de beste", "held": "je bent de beste",

        "dom": {
            en: "Ouch! 💔 I'm constantly learning. Maybe you can give me some tips to become smarter?",
            nl: "Auw! 💔 Ik leer constant bij. Misschien kun je me wat tips geven om slimmer te worden?"
        },
        "stom": "dom", "niet goed": "dom",

        // --- 4. GAMES & FUN ---
        "spel": {
            en: "AI's love games! 🎮 Type 'play' to start an AI hacking challenge.",
            nl: "AI's houden van spelletjes! 🎮 Typ 'speel' om een AI hacking uitdaging te starten."
        },
        "game": "spel", "speel": "play", "play": {
            en: "AI QUEST: An encrypted server is detected. Do you [Hack] or [Scan]?",
            nl: "AI QUEST: Er is een versleutelde server gedetecteerd. Ga je [Hack]en of [Scan]nen?"
        },
        "hack": {
            en: "System bypassed! 💰 You earned 500 Echo-credits! Ready for the next level?",
            nl: "Systeem omzeild! 💰 Je hebt 500 Echo-credits verdiend! Klaar voor het volgende niveau?"
        },

        // --- 5. KLANTENSERVICE & AFSLUITING ---
        "hours": { en: "Mon-Fri, 09:00 - 17:00 (CET). AI support 24/7!", nl: "Ma-vrij, 09:00 - 17:00 (CET). AI support is er 24/7!" },
        "uren": "hours", "open": "hours",
        "contact": { en: "Mail us: abelsoftware123@hotmail.com. We respond fast!", nl: "Mail ons: abelsoftware123@hotmail.com. We reageren snel!" },
        "mail": "contact", "email": "contact",
        "prijzen": { en: "AI Software from €15, Websites from €250. Great value!", nl: "AI Software vanaf €15, Websites vanaf €250. Topkwaliteit!" },
        "prijs": "prijzen", "kosten": "prijzen",

        "hallo": { en: "Hello! I'm Echo. Let's build some amazing AI together!", nl: "Hallo! Ik ben Echo. Laten we samen geweldige AI bouwen!" },
        "hoi": "hallo", "hi": "hallo",
        "doei": { en: "Goodbye! Stay smart and see you soon at Abelsoftware123!", nl: "Doei! Blijf slim en tot snel bij Abelsoftware123!" },
        "bye": "doei", "laters": "doei"
    },

    default: {
        en: "That sounds interesting! 🧠 I'm not sure about that yet, but ask me about 'AI software' or our 'app'!",
        nl: "Dat klinkt interessant! 🧠 Dat weet ik nog niet precies, maar vraag me eens naar 'AI software' of onze 'app'!"
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
    const nlTriggers = ["de", "het", "een", "ik", "hoe", "wat", "app", "hallo", "koop", "bouwen"];
    if (nlTriggers.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enTriggers = ["the", "is", "how", "what", "buy", "build", "hello", "smart"];
    if (enTriggers.some(word => userText.includes(word))) currentLang = 'en';

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
        container.innerHTML += `
            <div class="msg bot-msg">
                <span style="color: #00ffcc; font-size: 0.75em; font-weight: bold; text-transform: uppercase;">Echo AI Assistant ✨</span><br>
                ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 700); 
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
