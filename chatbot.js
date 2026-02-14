/**
 * ECHO AI - THE INFINITE ENTERPRISE EDITION (V2)
 * Inclusief Abelsoftware123 App integratie, Sales, Psychologie & Games.
 */

const echoBotData = {
    keywords: {
        // --- 1. ABELSOFTWARE123 APP (Specifieke Focus) ---
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is our central hub! Download it to manage your licenses, get exclusive AI tools, and receive real-time updates.",
            nl: "De Abelsoftware123 app is onze centrale hub! Download de app om je licenties te beheren, exclusieve AI-tools te gebruiken en real-time updates te ontvangen."
        },
        "onze app": "abelsoftware123 app", "app downloaden": "abelsoftware123 app", "software app": "abelsoftware123 app",

        // --- 2. MENSELIJKHEID & SMALLTALK ---
        "hoe gaat het": {
            en: "I'm doing great! My servers are cool and my code is clean. How's your day going?",
            nl: "Met mij gaat het super! Mijn servers blijven koel en mijn code is strak. Hoe gaat jouw dag?"
        },
        "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

        "leuk": {
            en: "Awesome! I love positive energy. It makes my algorithms run smoother.",
            nl: "Te gek! Ik hou van positieve energie. Daar gaan mijn algoritmes sneller van draaien."
        },
        "cool": "leuk", "gaaf": "leuk", "geweldig": "leuk", "nice": "leuk", "top": "leuk",

        "slim": {
            en: "I appreciate that! I'm designed to be the smartest assistant in your dev-stack.",
            nl: "Dat waardeer ik! Ik ben ontworpen om de slimste assistent in jouw dev-stack te zijn."
        },
        "smart": "slim", "intelligent": "slim", "knap": "slim",

        "dom": {
            en: "That's not very nice... I'm doing my best! Maybe you can help me improve my code?",
            nl: "Dat is niet zo aardig... Ik doe mijn best! Misschien kun je me helpen mijn code te verbeteren?"
        },
        "stom": "dom", "stupid": "dom",

        "wie": {
            en: "I am Echo AI, developed by Abelsoftware123. Your gateway to high-end AI tools.",
            nl: "Ik ben Echo AI, ontwikkeld door Abelsoftware123. Jouw ingang naar high-end AI tools."
        },
        "who": "wie", "naam": "wie", "name": "wie",

        // --- 3. VERKOOP: WEBSITES, APPS & DOMEINEN ---
        "website": {
            en: "A website is your digital business card. We build them starting at €250.",
            nl: "Een website is je digitale visitekaartje. Wij bouwen ze vanaf €250."
        },
        "site": "website", "webshop": "website", "laten maken": "website",

        "app": {
            en: "Mobile apps increase user loyalty. We build native-feel apps with Flutter or React Native.",
            nl: "Mobiele apps verhogen klantloyaliteit. Wij bouwen native-feel apps met Flutter of React Native."
        },
        "applicatie": "app", "mobiel": "app", "ios": "app", "android": "app",

        "domein": {
            en: "A good domain name is gold. We help you find and register the best names.",
            nl: "Een goede domeinnaam is goud waard. Wij helpen je de beste namen te vinden en registreren."
        },
        "domain": "domein", "url": "domein", ".nl": "domein", ".com": "domein",

        "offerte": {
            en: "Want a custom price? Mail abelsoftware123@hotmail.com for a free quote!",
            nl: "Een prijs op maat? Mail abelsoftware123@hotmail.com voor een gratis offerte!"
        },
        "prijsopgave": "offerte", "hoe duur": "offerte",

        // --- 4. TECH & REPOSITORY (AI Tools) ---
        "face": {
            en: "Our Face Recognition AI is 99.8% accurate, even in low light.",
            nl: "Onze Face Recognition AI is 99,8% nauwkeurig, zelfs bij weinig licht."
        },
        "gezicht": "face", "herkenning": "face",

        "drone": {
            en: "Transform aerial shots into high-detail 3D maps. Perfect for construction.",
            nl: "Transformeer luchtfoto's naar gedetailleerde 3D-kaarten. Perfect voor de bouw."
        },
        "mapping": "drone", "3d": "drone",

        "hacking": {
            en: "Security is a priority. Our ethical hacking tools help you find leaks.",
            nl: "Veiligheid is prioriteit. Onze ethical hacking tools helpen je lekken te vinden."
        },
        "hacken": "hacking", "cyber": "hacking",

        // --- 5. KLANTENSERVICE & AFSPRAKEN ---
        "hours": {
            en: "Our team is active Mon-Fri, 09:00 - 17:00 (CET).",
            nl: "Ons team is actief ma-vrij, 09:00 - 17:00 (CET)."
        },
        "uren": "hours", "tijden": "hours", "open": "hours",

        "contact": {
            en: "Mail us at abelsoftware123@hotmail.com. Don't hesitate to reach out!",
            nl: "Mail ons op abelsoftware123@hotmail.com. Aarzel niet om contact op te nemen!"
        },
        "mail": "contact", "email": "contact",

        "prices": {
            en: "Licenses start at €15. Web development starts at €250.",
            nl: "Licenties vanaf €15. Web-ontwikkeling vanaf €250."
        },
        "prijzen": "prices", "kosten": "prices",

        "werkt niet": {
            en: "Oh no! Describe the error or check the 'Issues' tab on our GitHub.",
            nl: "Oh nee! Beschrijf de fout of check de 'Issues' tab op onze GitHub."
        },
        "error": "werkt niet", "fout": "werkt niet",

        // --- 6. GAMES ---
        "game": {
            en: "Ready for a challenge? 🎮 Typ 'play' to start.",
            nl: "Klaar voor een uitdaging? 🎮 Typ 'speel' om te starten."
        },
        "spel": "game", "speel": "play", "play": {
            en: "QUEST: Do you [Hack] or [Scan]?",
            nl: "QUEST: Ga je [Hack]en of [Scan]nen?"
        },
        "hack": {
            en: "BREACH SUCCESSFUL! +100 credits! 💰",
            nl: "BREACH GELUKT! +100 credits! 💰"
        },

        // --- 7. GROETEN & AFSLUITING ---
        "hallo": { en: "Hello! Ready to start a project?", nl: "Hallo! Klaar om een project te starten?" },
        "hoi": "hallo", "hi": "hallo",
        "thanks": { en: "You're welcome!", nl: "Graag gedaan!" },
        "bedankt": "thanks",
        "doei": { en: "See you later!", nl: "Laters!" },
        "bye": "doei"
    },

    default: {
        en: "I'm not sure, but I can tell you about our 'apps', 'websites', or 'prices'!",
        nl: "Dat weet ik niet zeker, maar ik kan je alles vertellen over onze 'apps', 'websites' of 'prijzen'!"
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

    const nlTriggers = ["de", "het", "een", "hoe", "wat", "koop", "maken", "app", "hallo"];
    if (nlTriggers.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enTriggers = ["the", "is", "how", "what", "buy", "create", "site", "hello"];
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
                <span style="color: #00ffcc; font-weight: bold;">Echo AI</span><br>
                ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 600);
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
