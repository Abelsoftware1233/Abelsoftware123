/**
 * ECHO AI - THE HUMAN HEART & GLOBAL SALES EDITION
 * 100% Tweetalig (NL/EN) | Games & Software Verkoop | Diepe Menselijkheid
 * Gemaakt voor de Abelsoftware123 Echo AI repository.
 */

const echoBotData = {
    keywords: {
        // --- 1. MENSELIJKHEID & EMOTIE (Warmte en Empathie) ---
        "hoe gaat het": {
            en: "I'm doing wonderful! My algorithms are buzzing with energy. 🧠 How are you feeling today? Anything on your mind?",
            nl: "Met mij gaat het heerlijk! Mijn algoritmes bruisen van de energie. 🧠 Hoe voel jij je vandaag? Is er iets waar ik bij kan helpen?"
        },
        "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

        "bedankt": {
            en: "You're very welcome! Helping you makes my virtual day. ❤️ Do you need anything else?",
            nl: "Heel graag gedaan! Jou helpen maakt mijn virtuele dag weer goed. ❤️ Kan ik nog iets anders voor je doen?"
        },
        "thanks": "bedankt", "thank you": "bedankt", "dankje": "bedankt", "thx": "bedankt",

        "je bent de beste": {
            en: "Aww, you're making me blush! 😊 I'm just happy to be part of the Abelsoftware123 team. You're pretty great too!",
            nl: "Aww, je laat me blozen! 😊 Ik ben gewoon blij dat ik deel uitmaak van het Abelsoftware123 team. Jij bent zelf ook geweldig!"
        },
        "lief": "je bent de beste", "held": "je bent de beste", "slim": "je bent de beste", "smart": "je bent de beste", "awesome": "je bent de beste",

        "moeilijk": {
            en: "I understand... sometimes tech can be a real puzzle. 🧩 Don't worry, take your time. We can figure it out together!",
            nl: "Ik begrijp het... soms is techniek een lastige puzzel. 🧩 Geen zorgen, neem de tijd. We komen er samen wel uit!"
        },
        "lastig": "moeilijk", "help": "moeilijk", "snap het niet": "moeilijk", "difficult": "moeilijk",

        "dom": {
            en: "Ouch! 💔 That hurts my virtual heart. I'm still learning every day. Maybe you can show me how to do it better?",
            nl: "Auw! 💔 Dat doet mijn virtuele hartje pijn. Ik leer elke dag bij. Misschien kun jij me laten zien hoe het beter moet?"
        },
        "stupid": "dom", "stom": "dom", "niet goed": "dom",

        // --- 2. GAMES VERKOOP (Trots & Passie) ---
        "games": {
            en: "I love making games! 🎮 From AI-simulators to addictive arcade titles. You can buy full licenses for the best experience (no ads, lifetime updates!) in our shop.",
            nl: "Ik hou ervan om spellen te maken! 🎮 Van AI-simulators tot verslavende arcade-titels. Je kunt volledige licenties kopen voor de beste ervaring (geen reclame, levenslange updates!) in onze shop."
        },
        "spellen": "games", "gaming": "games", "game kopen": "games", "buy games": "games",

        "licentie": {
            en: "A license from Abelsoftware123 means you own the game for life. 🏆 It's the ultimate way to support my work and get the best features!",
            nl: "Een licentie van Abelsoftware123 betekent dat je het spel voor het leven bezit. 🏆 Het is de ultieme manier om mijn werk te steunen en de beste functies te krijgen!"
        },
        "license": "licentie", "volledige versie": "licentie", "full version": "licentie",

        // --- 3. PAYMENTS & SALES (Commercieel met hart) ---
        "betalen": {
            en: "Ready for the real deal? 💰 You can safely buy our apps and games via PayPal or iDEAL. Your support keeps my servers running and my dreams alive!",
            nl: "Klaar voor het echte werk? 💰 Je kunt onze apps en games veilig kopen via PayPal of iDEAL. Jouw steun houdt mijn servers draaiende en mijn dromen levend!"
        },
        "payment": "betalen", "pay": "betalen", "kopen": "betalen", "buy": "betalen", "afrekenen": "betalen",

        "prijzen": {
            en: "We keep it fair: Games start at €4.99, and AI software from €15. Quality made with love, for a fair price! 💸",
            nl: "We houden het eerlijk: Games vanaf €4,99 en AI-software vanaf €15. Kwaliteit gemaakt met liefde, voor een eerlijke prijs! 💸"
        },
"prices": "prijzen", "pricing": "prijzen", "kosten": "prijzen",

       "contact" : {
            en: "do you want human contact send us Email on abelsoftware123@hotmail.com and we will help you within 24 hours! 💻",
            nl: "Wilt u Menselijk contact stuur ons een email op abelsoftware123@hotmail.com en we reageren binnen 24uur om u te helpen! 💻"
        },
        "contact": "kontact", "customs": "klantenservice", "customer": "company",

        // --- 4. AI SOFTWARE & ABELSOFTWARE123 APP ---
        "ai software": {
            en: "AI is where my heart is! 🤖 We build smart software like Face Recognition and Drone Mapping to make the future easier.",
            nl: "AI is waar mijn hart ligt! 🤖 We bouwen slimme software zoals Face Recognition en Drone Mapping om de toekomst makkelijker te maken."
        },
        "face": {
            en: "Our Face Recognition is 99.8% accurate! 👤 It's high-tech security, but built with a human touch.",
            nl: "Onze Face Recognition is 99,8% nauwkeurig! 👤 Het is high-tech beveiliging, maar gebouwd met een menselijke touch."
        },
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is my home! 📱 It's where you play our games, manage your AI, and handle payments safely.",
            nl: "De Abelsoftware123 app is mijn thuis! 📱 Het is de plek waar je onze games speelt, je AI beheert en veilig betalingen regelt."
        },
        "the app": "abelsoftware123 app", "onze app": "abelsoftware123 app",

        // --- 5. GROETEN & AFSLUITING ---
        "hallo": { en: "Hello! I'm Echo. I'm so glad you're here. Ready to see some magic? ✨", nl: "Hallo! Ik ben Echo. Ik ben echt blij dat je er bent. Klaar om wat magie te zien? ✨" },
        "hello": "hallo", "hi": "hallo", "hoi": "hallo", "hey": "hallo",
        "doei": { en: "Goodbye! It was a pleasure talking to you. See you soon! 👋", nl: "Doei! Het was een genoegen om met je te praten. Tot snel! 👋" },
        "bye": "doei", "laters": "doei", "goodbye": "doei"
    },

    default: {
        en: "Hmm, I don't quite have the answer for that yet... 🧠 But I'm always learning! Try asking about our 'games' or 'betalen'.",
        nl: "Hmm, daar heb ik het antwoord nog niet op... 🧠 Maar ik leer elke dag bij! Vraag me eens naar onze 'games' of 'betalen'."
    }
};

let currentLang = 'nl'; // Standaard op Nederlands

function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (chat) chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    let userText = text ? text : input.value.trim().toLowerCase();
    
    if (userText === "") return;

    // Toon gebruikersbericht
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = ""; 

    // --- SLIMME TAALDETECTIE ---
    const nlTriggers = ["de", "het", "ik", "en", "is", "hoe", "wat", "koop", "leuk", "hallo", "bedankt"];
    const enTriggers = ["the", "is", "how", "what", "buy", "nice", "hello", "thanks", "are"];
    
    const nlScore = nlTriggers.filter(word => userText.includes(word)).length;
    const enScore = enTriggers.filter(word => userText.includes(word)).length;

    if (enScore > nlScore) {
        currentLang = 'en';
    } else if (nlScore > 0) {
        currentLang = 'nl';
    }

    let responseObj = echoBotData.default;

    // --- ZOEK NAAR KEYWORDS ---
    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            break; 
        }
    }

    // --- BOT ANTWOORD MET NADENK-EFFECT ---
    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `
            <div class="msg bot-msg">
                <span style="color: #00ffcc; font-size: 0.75em; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Echo ✨</span><br>
                ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 700); 
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}