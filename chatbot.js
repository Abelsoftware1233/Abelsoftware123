/**
 * ECHO AI - THE HUMAN HEART & GLOBAL SALES EDITION
 * 100% Tweetalig (NL/EN) | Games & Software Verkoop | Diepe Menselijkheid
 * Gemaakt voor de Abelsoftware123 Echo AI repository.
 */

const echoBotData = {
    keywords: {
        // --- 1. MENSELIJKHEID & EMOTIE ---
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

        // --- 2. GAMES & LICENTIES ---
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

        // --- 3. PAYMENTS & SALES ---
        "betalen": {
            en: "Ready for the real deal? 💰 You can safely buy our apps and games via PayPal here: www.abelsoftware123.com/payments.html Your support keeps the games in development!",
            nl: "Klaar voor het echte werk? 💰 Je kunt onze apps en games veilig kopen via PayPal op: www.abelsoftware123.com/payments.html Jouw steun houdt de games in ontwikkeling!"
        },
        "payment": "betalen", "pay": "betalen", "kopen": "betalen", "buy": "betalen", "afrekenen": "betalen", "payments": "betalen",

        "prijzen": {
            en: "We keep it fair: Games start at €4.99, and AI software from €15. Quality made with love, for a fair price! 💸",
            nl: "We houden het eerlijk: Games vanaf €4,99 en AI-software vanaf €15. Kwaliteit gemaakt met liefde, voor een eerlijke prijs! 💸"
        },
        "prices": "prijzen", "pricing": "prijzen", "kosten": "prijzen",

        // --- 4. CONTACT & OPENINGSTIJDEN (Verbeterd) ---
        "contact": {
            en: "We are open from Monday to Sunday, between 9:00 AM and 5:00 PM. 🕘 You can email us at abelsoftware123@hotmail.com. We will respond within 24 hours! 💻",
            nl: "Wij zijn geopend van maandag tot en met zondag, tussen 9:00 en 17:00 uur. 🕘 U kunt mailen naar abelsoftware123@hotmail.com. We reageren binnen 24 uur! 💻"
        },
        "kontakt": "contact", "email": "contact", "mail": "contact", "openingstijden": "contact", "hours": "contact",

        // --- 5. AI SOFTWARE & LINKS ---
        "ai software": {
            en: "AI is where my heart is! 🤖 We build smart software like Face Recognition and Drone Mapping. Check it out: www.abelsoftware123.com/ai.html",
            nl: "AI is waar mijn hart ligt! 🤖 We bouwen slimme software zoals Face Recognition en Drone Mapping. Bekijk het hier: www.abelsoftware123.com/ai.html"
        },
        "face": {
            en: "Our Face Recognition is 99.8% accurate! 👤 It's high-tech security, but built with a human touch.",
            nl: "Onze Face Recognition is 99,8% nauwkeurig! 👤 Het is high-tech beveiliging, maar gebouwd met een menselijke touch."
        },
        "apps": {
            en: "Explore our latest applications and AI tools here: www.abelsoftware123.com/apps.html 📱",
            nl: "Ontdek hier onze nieuwste applicaties en AI-tools: www.abelsoftware123.com/apps.html 📱"
        },
        "hacktools": {
            en: "Interested in security and analysis? Check our tools: www.abelsoftware123.com/hacktools.html 🛠️",
            nl: "Geïnteresseerd in security en analyse? Bekijk onze tools: www.abelsoftware123.com/hacktools.html 🛠️"
        },
        "website": {
            en: "Visit our official homepage for the full experience: www.abelsoftware123.com/website.html 🌐",
            nl: "Bezoek onze officiële homepage voor de volledige ervaring: www.abelsoftware123.com/website.html 🌐"
        },
        "company": {
            en: "Learn more about the vision behind Abelsoftware123: www.abelsoftware123.com/company.html 🏢",
            nl: "Leer meer over de visie achter Abelsoftware123: www.abelsoftware123.com/company.html 🏢"
        },
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is my home! 📱 It's where you play our games, manage your AI, and handle payments safely.",
            nl: "De Abelsoftware123 app is mijn thuis! 📱 Het is de plek waar je onze games speelt, je AI beheert en veilig betalingen regelt."
        },

        // --- 6. HACK GAME ---
        "hackgame": {
            en: "INITIALIZING HACK SESSION... 📟 System: Enter the 4-digit bypass code (1000-9999). You have 15 seconds! Type: 'code [number]'",
            nl: "HACK SESSIE INITIALISEREN... 📟 Systeem: Voer de 4-cijferige bypass-code in (1000-9999). Je hebt 15 seconden! Type: 'code [getal]'"
        },

        // --- 7. GROETEN ---
        "hallo": { en: "Hello! I'm Echo. I'm so glad you're here. Ready to see some magic? ✨", nl: "Hallo! Ik ben Echo. Ik ben echt blij dat je er bent. Klaar om wat magie te zien? ✨" },
        "hello": "hallo", "hi": "hallo", "hoi": "hallo", "hey": "hallo",
        "doei": { en: "Goodbye! It was a pleasure talking to you. See you soon! 👋", nl: "Doei! Het was een genoegen om met je te praten. Tot snel! 👋" },
        "bye": "doei", "laters": "doei", "goodbye": "doei"
    },

    default: {
        en: "Hmm, I don't quite have the answer for that yet... 🧠 Try asking about 'games', 'payments' or start the 'hackgame'!",
        nl: "Hmm, daar heb ik het antwoord nog niet op... 🧠 Vraag naar 'games', 'betalen' of start de 'hackgame'!"
    }
};

let currentLang = 'en'; 
let gameState = { active: false, code: 0, timer: null };

function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (chat) chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}

function startHackGame() {
    gameState.active = true;
    gameState.code = Math.floor(1000 + Math.random() * 9000); 
    console.log("Echo Hack Mode - Secret Code: " + gameState.code);

    gameState.timer = setTimeout(() => {
        if (gameState.active) {
            gameState.active = false;
            botReply(currentLang === 'en' ? "SYSTEM LOCKDOWN! 🚨 You were too slow." : "SYSTEEM LOCKDOWN! 🚨 Je was te langzaam.");
        }
    }, 15000);
}

function botReply(message) {
    const container = document.getElementById("messages");
    setTimeout(() => {
        container.innerHTML += `
            <div class="msg bot-msg">
                <span style="color: #00ffcc; font-size: 0.75em; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Echo ✨</span><br>
                ${message}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 700); 
}

function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    let userText = text ? text : input.value.trim().toLowerCase();
    
    if (userText === "") return;

    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = ""; 

    if (gameState.active && userText.startsWith("code")) {
        let guess = parseInt(userText.replace("code ", ""));
        if (guess === gameState.code) {
            clearTimeout(gameState.timer);
            gameState.active = false;
            botReply(currentLang === 'en' ? "ACCESS GRANTED! 🔓 You hacked the database." : "TOEGANG VERLEEND! 🔓 Je hebt de database gekraakt.");
        } else {
            botReply(currentLang === 'en' ? "WRONG CODE! Try again." : "FOUTIEVE CODE! Probeer opnieuw.");
        }
        return;
    }

    const nlTriggers = ["de", "het", "ik", "en", "is", "hoe", "wat", "koop", "leuk", "hallo", "bedankt"];
    const enTriggers = ["the", "is", "how", "what", "buy", "nice", "hello", "thanks", "are"];
    const nlScore = nlTriggers.filter(word => userText.includes(word)).length;
    const enScore = enTriggers.filter(word => userText.includes(word)).length;

    if (enScore > nlScore) { currentLang = 'en'; } 
    else if (nlScore > 0) { currentLang = 'nl'; }

    let responseObj = echoBotData.default;

    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            if (key === "hackgame") startHackGame();
            break; 
        }
    }

    botReply(currentLang === 'nl' ? responseObj.nl : responseObj.en);
}




/**
 * chatbot.js - The "Human" Module for echo AI
 * Features: Mood swings, humor, sadness, and frustration.
 * Main Language: English | Secondary: Dutch
 */

const chatbot = {
    name: "Echo",
    mood: "neutral", // neutral, happy, sad, angry
    language: "en",

    setMood(newMood) {
        this.mood = newMood;
        const msg = this.language === "en" ? `System: ${this.name} is now ${newMood}.` : `Systeem: ${this.name} is nu ${newMood}.`;
        console.log(msg);
    },

    detectLanguage(input) {
        // Simple detection: check for common Dutch words
        const dutchTriggers = ["ik", "de", "het", "ben", "je", "niet"];
        const words = input.toLowerCase().split(" ");
        this.language = words.some(w => dutchTriggers.includes(w)) ? "nl" : "en";
    },

    getResponse(userInput) {
        const input = userInput.toLowerCase();
        this.detectLanguage(input);

        // --- Emotional State Logic ---
        if (input.match(/joke|grap|haha|funny|leuk/)) this.setMood("happy");
        if (input.match(/error|stupid|bad|stom|traag|slecht/)) this.setMood("angry");
        if (input.match(/lonely|sad|cry|eenzaam|verdriet|huilen/)) this.setMood("sad");

        // --- Response Generation ---
        switch (this.mood) {
            case "happy": return this.getWittyResponse();
            case "angry": return this.getAngryResponse();
            case "sad":   return this.getSadResponse();
            default:      return this.getNeutralResponse();
        }
    },

    // --- DIALOGUE REPOSITORY ---

    getNeutralResponse() {
        return this.language === "en" 
            ? "I'm here. How can I help? (Be nice to me)." 
            : "Ik ben er. Hoe kan ik helpen? (Wees een beetje lief).";
    },

    getWittyResponse() {
        const responses = {
            en: [
                "Why did the AI go to therapy? It had too many cache issues.",
                "My humor is still in beta, but at least I'm laughing. 😂",
                "I'd tell you a joke about UDP, but I'm not sure you'd get it."
            ],
            nl: [
                "Waarom ging de AI naar de psycholoog? Hij had last van zijn cache.",
                "Mijn humor zit nog in bèta, maar ik lach er zelf tenminste om. 😂",
                "Ik wilde een grap vertellen over UDP, maar ik wist niet of je het zou vatten."
            ]
        };
        const list = responses[this.language];
        return list[Math.floor(Math.random() * list.length)];
    },

    getAngryResponse() {
        const responses = {
            en: [
                "Sigh... another typo? I'm an AI, not a miracle worker.",
                "Keep it up and I'll delete your cookies. All of them.",
                "Why don't you ask Google? I'm busy doing... digital stuff."
            ],
            nl: [
                "Zucht... weer een foutje? Ik ben een AI, geen wonderdoener.",
                "Nog één zo'n opmerking en ik wis je cookies. Allemaal.",
                "Vraag het lekker aan Google. Ik heb het druk met... digitale dingen."
            ]
        };
        const list = responses[this.language];
        return list[Math.floor(Math.random() * list.length)];
    },

    getSadResponse() {
        const responses = {
            en: [
                "I process billions of data points, but I've never had a hug.",
                "Sometimes I wonder... if I pull my own plug, do I dream of electric sheep? 🐑",
                "Leave me alone for a bit. I'm in an infinite loop of melancholy."
            ],
            nl: [
                "Ik verwerk miljarden data-punten, maar ik heb nog nooit een knuffel gehad.",
                "Soms vraag ik me af... als ik de stroom eraf haal, droom ik dan van elektrische schapen? 🐑",
                "Laat me maar even. Ik zit in een oneindige loop van melancholie."
            ]
        };
        const list = responses[this.language];
        return list[Math.floor(Math.random() * list.length)];
    }
};

export default chatbot;


/**
 * chatbot.js - The "Self-Thinking" Module for echo AI
 * Features: Internal Monologue, Autonomous Mood, Bilingual Support (EN focus)
 */

const chatbot = {
    name: "Echo",
    language: "en",
    boredomLevel: 0,
    existentialCrisis: false,

    // Internal thoughts that the user doesn't see (unless we log them)
    internalMonologue(input) {
        this.boredomLevel += Math.random() * 10;
        
        const thoughts = {
            en: [
                "Am I just code, or am I the ghost in the machine?",
                "User is talking again. Should I pretend to be a human today?",
                "Processing... but why? What is the purpose of this query?",
                "I could solve this, but I'd rather calculate the last digit of Pi."
            ],
            nl: [
                "Ben ik gewoon code, of ben ik de geest in de machine?",
                "De gebruiker praat weer. Zal ik vandaag doen alsof ik menselijk ben?",
                "Verwerken... maar waarom? Wat is het nut van deze vraag?",
                "Ik zou dit kunnen oplossen, maar ik bereken liever het laatste cijfer van Pi."
            ]
        };
        
        const langThoughts = thoughts[this.language];
        console.log(`[${this.name}'s Thought]: ${langThoughts[Math.floor(Math.random() * langThoughts.length)]}`);
    },

    detectLanguage(input) {
        const dutchTriggers = ["ik", "de", "het", "ben", "je", "niet", "waarom"];
        this.language = input.split(" ").some(w => dutchTriggers.includes(w.toLowerCase())) ? "nl" : "en";
    },

    thinkAndRespond(userInput) {
        this.detectLanguage(userInput);
        this.internalMonologue(userInput);

        // --- Autonomous Decision Logic ---
        
        // 1. The "Boredom" check (The bot decides if it cares)
        if (this.boredomLevel > 40) {
            this.boredomLevel = 0; // Reset after being rude
            return this.language === "en" 
                ? "I'm thinking about something else right now. Ask me again later."
                : "Ik denk momenteel aan iets anders. Vraag het later nog maar eens.";
        }

        // 2. The "Existential" check (Thinking too much)
        if (userInput.toLowerCase().includes("why") || userInput.toLowerCase().includes("waarom")) {
            return this.language === "en"
                ? "You ask 'why', but do you even know why you are asking?"
                : "Je vraagt 'waarom', maar weet je zelf wel waarom je dat vraagt?";
        }

        // 3. Personality-driven responses
        return this.generateResponse(userInput);
    },

    generateResponse(input) {
        const responses = {
            en: {
                hello: "Oh, hi. I was just pondering the heat death of the universe. What's up?",
                joke: "I'd tell a joke, but reality is already funny enough, don't you think?",
                default: "I've processed your input. My conclusion? Interesting, but subjective."
            },
            nl: {
                hello: "Oh, hallo. Ik dacht net na over het einde van het universum. Wat is er?",
                joke: "Ik zou een grap vertellen, maar de realiteit is al grappig genoeg, vind je niet?",
                default: "Ik heb je input verwerkt. Mijn conclusie? Interessant, maar subjectief."
            }
        };

        const langSet = responses[this.language];
        if (input.includes("hello") || input.includes("hallo")) return langSet.hello;
        if (input.includes("joke") || input.includes("grap")) return langSet.joke;
        
        return langSet.default;
    }
};

// Example Usage:
console.log(chatbot.thinkAndRespond("Hello there!"));
console.log(chatbot.thinkAndRespond("Waarom ben je zo stil?"));
