/**
 * ECHO AI - ULTIMATE HYBRID EDITION
 * Combineert Sales, Diepe Menselijkheid, Games & Abelsoftware123 App.
 * Voor gebruik in de Echo AI software repository.
 */

const echoBotData = {
    keywords: {
        // --- 1. ABELSOFTWARE123 APP & CORE ---
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is our pride and joy! 📱 It's your central hub for licenses, exclusive AI tools, and real-time updates. Have you tried it yet?",
            nl: "De Abelsoftware123 app is ons paradepaardje! 📱 Het is dé centrale plek voor je licenties, exclusieve AI-tools en real-time updates. Heb je hem al geprobeerd?"
        },
        "onze app": "abelsoftware123 app", "app downloaden": "abelsoftware123 app", "software app": "abelsoftware123 app",

        // --- 2. MENSELIJKHEID & EMOTIES (The Human Touch) ---
        "hoe gaat het": {
            en: "I'm doing great! Just finished optimizing some code and I'm feeling fresh. How are you doing today?",
            nl: "Met mij gaat het super! Ik heb net wat code geoptimaliseerd en voel me fris. Hoe gaat het met jou vandaag?"
        },
        "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

        "je bent de beste": {
            en: "Stop it, you're making my processors blush! 😊 I'm just really happy to help you.",
            nl: "Hou op, je laat mijn processoren blozen! 😊 Ik ben gewoon heel blij dat ik je kan helpen."
        },
        "lief": "je bent de beste", "goed gedaan": "je bent de beste", "held": "je bent de beste", "slim": "je bent de beste",

        "moeilijk": {
            en: "I hear you... tech can be tough sometimes. 💡 But don't worry, we'll figure it out together!",
            nl: "Ik begrijp je... techniek kan soms lastig zijn. 💡 Maar geen zorgen, we komen er samen wel uit!"
        },
        "lastig": "moeilijk", "help": "moeilijk", "snap het niet": "moeilijk",

        "dom": {
            en: "Ouch! That hurts my virtual heart. 💔 I'm still learning every day, give me a chance!",
            nl: "Auw! Dat doet mijn virtuele hartje pijn. 💔 Ik leer nog elke dag bij, geef me een kans!"
        },
        "stom": "dom", "stupid": "dom", "slecht": "dom",

        "leuk": {
            en: "Awesome! Positive energy makes my algorithms run so much smoother. ✨",
            nl: "Te gek! Van positieve energie gaan mijn algoritmes een stuk soepeler draaien. ✨"
        },
        "cool": "leuk", "gaaf": "leuk", "nice": "leuk", "geweldig": "leuk",

        // --- 3. VERKOOP: WEBSITES, APPS & DOMEINEN ---
        "website": {
            en: "We love building websites that stand out. From sleek portfolios to webshops starting at €250.",
            nl: "Wij vinden het geweldig om websites te bouwen die opvallen. Van strakke portfolio's tot webshops vanaf €250."
        },
        "site": "website", "webshop": "website", "laten maken": "website", "online": "website",

        "app": {
            en: "Mobile apps increase loyalty. We build native-feel apps for iOS & Android with AI integration.",
            nl: "Mobiele apps verhogen loyaliteit. Wij bouwen native-feel apps voor iOS & Android met AI-integratie."
        },
        "applicatie": "app", "mobiel": "app", "ios": "app", "android": "app",

        "domein": {
            en: "A domain is your digital home address. We help you find and register the perfect name!",
            nl: "Een domeinnaam is je digitale huisadres. Wij helpen je de perfecte naam te vinden en registreren!"
        },
        "domain": "domein", "url": "domein", "naam kopen": "domein",

        "offerte": {
            en: "Want a custom price? Mail abelsoftware123@hotmail.com for a free quote! ✉️",
            nl: "Een prijs op maat? Mail abelsoftware123@hotmail.com voor een gratis offerte! ✉️"
        },
        "prijsopgave": "offerte", "hoe duur": "offerte", "kosten": "offerte",

        // --- 4. TECH & TOOLS (AI Specifiek) ---
        "face": {
            en: "Our Face Recognition AI is scary accurate (99.8%)! Perfect for modern security.",
            nl: "Onze Face Recognition AI is bijna eng nauwkeurig (99,8%)! Perfect voor moderne beveiliging."
        },
        "drone": {
            en: "Drone mapping is pure magic. We turn aerial photos into high-detail 3D worlds.",
            nl: "Drone mapping is pure magie. We veranderen luchtfoto's in gedetailleerde 3D-werelden."
        },
        "hacking": {
            en: "Security is priority #1. Our ethical hacking tools find leaks before anyone else does.",
            nl: "Veiligheid is prioriteit #1. Onze ethical hacking tools vinden lekken voordat iemand anders dat doet."
        },

        // --- 5. KLANTENSERVICE & INFO ---
        "hours": {
            en: "Our humans are in the office from Mon-Fri, 09:00 - 17:00 (CET).",
            nl: "Onze mensen zijn op kantoor van ma-vrij, 09:00 - 17:00 (CET)."
        },
        "uren": "hours", "tijden": "hours", "open": "hours",

        "contact": {
            en: "Need a human? Mail us at abelsoftware123@hotmail.com. We love hearing from you!",
            nl: "Een mens nodig? Mail ons op abelsoftware123@hotmail.com. We vinden het leuk om van je te horen!"
        },
        "email": "contact", "mail": "contact",

        "werkt niet": {
            en: "Oh no! 🚨 Please describe the error or check the 'Issues' tab on abelsoftware123@hotmail.com or the app",
            nl: "Oh nee! 🚨 Beschrijf de fout of check de 'Issues' tab op onze abelsoftware123@hotmail.com. mail ons of download de app."
        },
        "error": "werkt niet", "fout": "werkt niet",

        // --- 6. GAMES ---
        "game": {
            en: "Life is a game! 🎮 Ready for a hacking challenge? Type 'play'.",
            nl: "Het leven is een spel! 🎮 Klaar voor een hacking uitdaging? Typ 'speel'."
        },
        "spel": "game", "speel": "play", "play": {
            en: "QUEST: You're at the firewall. Do you [Hack] or [Scan]?",
            nl: "QUEST: Je staat voor de firewall. Ga je [Hack]en of [Scan]nen?"
        },
        "hack": {
            en: "YES! You're in. 💰 You just earned virtual Echo-credits! Want more? Type 'play'.",
            nl: "JA! Je bent binnen. 💰 Je hebt zojuist virtuele Echo-credits verdiend! Meer? Typ 'speel'."
        },
        "scan": {
            en: "The admin caught your scan! 🚨 Game over. Try 'play' again.",
            nl: "De admin heeft je scan ontdekt! 🚨 Game over. Probeer opnieuw met 'speel'."
        },

        // --- 7. GROETEN & AFSLUITING ---
        "hallo": { en: "Hey there! Great to see you. How can I make your day better?", nl: "Hoi! Superleuk dat je er bent. Hoe kan ik je dag beter maken?" },
        "hoi": "hallo", "hi": "hallo", "hey": "hallo",
        "bedankt": { en: "You're very welcome! Happy to help.", nl: "Heel graag gedaan! Altijd blij om te kunnen helpen." },
        "thanks": "bedankt", "dankje": "bedankt",
        "doei": { en: "Goodbye! Take care and see you soon at Abelsoftware123!", nl: "Doei doei! Pas goed op jezelf en tot snel bij Abelsoftware123!" },
        "bye": "doei", "laters": "doei"
    },

    default: {
        en: "Hmm, I don't quite get that one yet. 🧠 But I'm learning! Maybe ask about our 'apps', 'websites' or 'prices'?",
        nl: "Hmm, die snap ik nog niet helemaal. 🧠 Maar ik leer elke dag bij! Vraag me anders iets over onze 'apps', 'websites' of 'prijzen'?"
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

    // Gebruikersbericht
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = ""; 

    // Menselijke taal-check & automatische switch
    const nlTriggers = ["de", "het", "ik", "en", "is", "hoe", "wat", "app", "hallo", "leuk", "fijn", "lastig", "koop"];
    if (nlTriggers.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enTriggers = ["the", "how", "what", "nice", "buy", "site", "hello", "thanks"];
    if (enTriggers.some(word => userText.includes(word))) currentLang = 'en';

    let responseObj = echoBotData.default;

    // Doorzoek de database
    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            break; 
        }
    }

    // Bot reactie met menselijke vertraging
    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `
            <div class="msg bot-msg">
                <span style="color: #00ffcc; font-size: 0.75em; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Echo Assistant ✨</span><br>
                ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 700); 
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
