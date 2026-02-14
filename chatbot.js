/**
 * ECHO AI - ADVANCED SMART CHATBOT SYSTEM
 * Versie: 2.0 (Deep Integration & Game Suite)
 * Geschikt voor: Abelsoftware123 / Echo AI Repository
 */

// --- DE SLIMME DATABASE ---
const echoBotData = {
    // Scoresysteem voor de gebruiker
    userState: {
        score: 0,
        language: 'en',
        lastInquiry: null
    },

    // Keywords met meertalige ondersteuning en aliassen
    keywords: {
        // --- WELKOM ---
        "hello": {
            en: "Hello! Welcome to Echo AI by Abelsoftware123. How can I assist you today?",
            nl: "Hallo! Welkom bij Echo AI van Abelsoftware123. Hoe kan ik je vandaag helpen?"
        },
        "hallo": "hello", "hi": "hello", "hey": "hello", "hoi": "hello",

        // --- PRODUCTEN & SERVICES ---
        "software": {
            en: "We specialize in AI Face Recognition, Drone Mapping, and Ethical Hacking tools. Which one interests you?",
            nl: "Wij zijn gespecialiseerd in AI Face Recognition, Drone Mapping en Ethical Hacking tools. Welke spreekt je aan?"
        },
        "face": {
            en: "Our Face Recognition AI uses neural networks for 99.8% accuracy. Perfect for security apps.",
            nl: "Onze Face Recognition AI gebruikt neurale netwerken voor 99,8% nauwkeurigheid. Perfect voor beveiliging."
        },
        "gezicht": "face", "herkenning": "face",
        
        "drone": {
            en: "Echo Drone Mapping turns aerial photos into 3D point clouds automatically. Save hours of manual work!",
            nl: "Echo Drone Mapping zet luchtfoto's automatisch om in 3D-modellen. Bespaar uren aan handmatig werk!"
        },
        "mapping": "drone", "kaarten": "drone",

        "hack": {
            en: "Our Ethical Hacking suite provides automated vulnerability scans and pentesting scripts.",
            nl: "Onze Ethical Hacking suite biedt automatische kwetsbaarheidsscans en pentesting scripts."
        },
        "beveiliging": "hack", "hacking": "hack", "cyber": "hack",

        // --- PRIJZEN & CONTACT ---
        "price": {
            en: "Licenses start at €15. Check our Payments page for Personal vs. Enterprise options!",
            nl: "Licenties beginnen bij €15. Bekijk de Payments-pagina voor de Personal en Enterprise opties!"
        },
        "prijzen": "price", "kosten": "price", "license": "price", "kopen": "price",

        "contact": {
            en: "Reach us at abelsoftware123@hotmail.com. Our team responds within 24 hours.",
            nl: "Bereik ons via abelsoftware123@hotmail.com. Ons team reageert binnen 24 uur."
        },
        "help": "contact", "support": "contact", "email": "contact",

        // --- GAMES & INTERACTIE ---
        "game": {
            en: "I'm not just a bot, I'm a gamer! 🎮 Type 'play' to start a mini hacking-quest and earn Echo-credits!",
            nl: "Ik ben niet alleen een bot, ik ben een gamer! 🎮 Typ 'speel' om een hacking-quest te starten en Echo-credits te verdienen!"
        },
        "spel": "game", "gaming": "game", "spelen": "game",

        "play": {
            en: "SYSTEM BREACH IN PROGRESS... 🔓 You see two firewalls: [Blue] (Easy) or [Red] (Hard). Which one do you attack?",
            nl: "SYSTEM BREACH BEZIG... 🔓 Je ziet twee firewalls: [Blauw] (Makkelijk) of [Rood] (Moeilijk). Welke val je aan?"
        },
        "speel": "play",

        "blue": {
            en: "Success! You bypassed the firewall. +50 Echo-credits! 💰 Type 'score' to see your total.",
            nl: "Succes! Je bent door de firewall heen. +50 Echo-credits! 💰 Typ 'score' voor je totaal."
        },
        "blauw": "blue",

        "red": {
            en: "ACCESS DENIED! The system traced you. You lost 20 credits. 🚨 Try again?",
            nl: "TOEGANG GEWEIGERD! Het systeem heeft je getraceerd. Je verliest 20 credits. 🚨 Opnieuw?"
        },
        "rood": "red",

        "score": {
            en: "Your current Echo-rank is: High-Level User. Total Credits: {score}",
            nl: "Je huidige Echo-rank is: High-Level User. Totaal Credits: {score}"
        },

        // --- BEDANKJES ---
        "thanks": {
            en: "You're welcome! Echo AI is always here to help.",
            nl: "Graag gedaan! Echo AI staat altijd voor je klaar."
        },
        "bedankt": "thanks", "dankje": "thanks", "top": "thanks", "bedankt": "thanks"
    },

    // Standaard antwoord als niets wordt gevonden
    default: {
        en: "Intriguing question... 🤖 I don't have that in my database yet. Try 'software', 'prices', or 'game'!",
        nl: "Interessante vraag... 🤖 Dat staat nog niet in mijn database. Probeer 'software', 'prijzen' of 'spel'!"
    }
};

// --- DE CORE LOGICA ---

function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (!chat) return;
    chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
}

function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    
    let userText = text ? text : input.value.trim().toLowerCase();
    if (userText === "") return;

    // Toon gebruiker bericht
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    if (input) input.value = "";

    // 1. Slimme Taaldetectie
    const dutchWords = ["de", "het", "een", "ik", "en", "is", "hoe", "wat", "spel", "prijzen"];
    const inputWords = userText.split(/\s+/);
    const isDutch = inputWords.some(word => dutchWords.includes(word));
    echoBotData.userState.language = isDutch ? 'nl' : 'en';

    // 2. Slimme Matching & Score Updates
    let responseObj = echoBotData.default;
    let foundKey = null;

    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            foundKey = key;
            let match = echoBotData.keywords[key];
            
            // Volg aliassen
            if (typeof match === "string") {
                match = echoBotData.keywords[match];
            }
            
            responseObj = match;
            break;
        }
    }

    // 3. Game Logica (Score bijwerken)
    if (foundKey === "blue" || foundKey === "blauw") echoBotData.userState.score += 50;
    if (foundKey === "red" || foundKey === "rood") echoBotData.userState.score -= 20;

    // 4. Response Genereren
    let finalResponse = isDutch ? responseObj.nl : responseObj.en;
    
    // Dynamische data invullen (zoals score)
    finalResponse = finalResponse.replace("{score}", echoBotData.userState.score);

    // 5. Bot Typing Animatie
    setTimeout(() => {
        const botMsgHtml = `
            <div class="msg bot-msg">
                <div style="font-weight: bold; color: #00ffcc; margin-bottom: 4px;">Echo AI Bot</div>
                ${finalResponse}
            </div>`;
        container.innerHTML += botMsgHtml;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

// Enter-toets ondersteuning
function handleKey(event) {
    if (event.key === "Enter") {
        askBot();
    }
}
