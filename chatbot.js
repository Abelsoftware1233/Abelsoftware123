/**
 * ECHO AI - THE INFINITE ENTERPRISE EDITION
 * De meest uitgebreide versie voor je Echo AI repository.
 * Inclusief sales, psychologie, games en diepe tech-kennis.
 */

const echoBotData = {
    keywords: {
        // --- 1. MENSELIJKHEID, EMOTIES & SMALLTALK ---
        "hoe gaat het": {
            en: "I'm doing great! My servers are cool and my code is clean. How's your day going?",
            nl: "Met mij gaat het super! Mijn servers blijven koel en mijn code is strak. Hoe gaat jouw dag?"
        },
        "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

        "leuk": {
            en: "Awesome! I love positive energy. It makes my algorithms run smoother.",
            nl: "Te gek! Ik hou van positieve energie. Daar gaan mijn algoritmes sneller van draaien."
        },
        "cool": "leuk", "gaaf": "leuk", "geweldig": "leuk", "nice": "leuk", "top": "leuk", "fijn": "leuk",

        "slim": {
            en: "I appreciate that! I'm designed to be the smartest assistant in your dev-stack.",
            nl: "Dat waardeer ik! Ik ben ontworpen om de slimste assistent in jouw dev-stack te zijn."
        },
        "smart": "slim", "intelligent": "slim", "knap": "slim", "goed zo": "slim",

        "dom": {
            en: "That's not very nice... I'm doing my best! Maybe you can help me improve my code?",
            nl: "Dat is niet zo aardig... Ik doe mijn best! Misschien kun je me helpen mijn code te verbeteren?"
        },
        "stom": "dom", "stupid": "dom", "slecht": "dom", "waardeloos": "dom",

        "wie": {
            en: "I am Echo AI, developed by Abelsoftware123. I'm your gateway to high-end AI tools and web-dev.",
            nl: "Ik ben Echo AI, ontwikkeld door Abelsoftware123. Ik ben jouw ingang naar high-end AI tools en web-dev."
        },
        "who": "wie", "naam": "wie", "name": "wie", "jou": "wie",

        "waarom": {
            en: "Because we believe AI should be accessible, affordable, and powerful for everyone!",
            nl: "Omdat wij geloven dat AI toegankelijk, betaalbaar en krachtig moet zijn voor iedereen!"
        },
        "why": "waarom",

        // --- 2. VERKOOP: WEBSITES, APPS & DOMEINEN ---
        "website": {
            en: "A website is your digital business card. We build them with React, Vue, or WordPress starting at €250.",
            nl: "Een website is je digitale visitekaartje. Wij bouwen ze met React, Vue, of WordPress vanaf €250."
        },
        "site": "website", "webshop": "website", "online": "website", "laten maken": "website", "bouw": "website",

        "app": {
            en: "Mobile apps increase user loyalty. We build native-feel apps with Flutter or React Native.",
            nl: "Mobiele apps verhogen klantloyaliteit. Wij bouwen native-feel apps met Flutter of React Native."
        },
        "applicatie": "app", "mobiel": "app", "ios": "app", "android": "app", "software maken": "app",

        "domein": {
            en: "A good domain name is gold. We help you find and register the best names for your brand.",
            nl: "Een goede domeinnaam is goud waard. Wij helpen je de beste namen te vinden en registreren."
        },
        "domain": "domein", "url": "domein", "naam": "domein", ".nl": "domein", ".com": "domein",

        "offerte": {
            en: "Want a custom price? Send your requirements to abelsoftware123@hotmail.com for a free quote!",
            nl: "Een prijs op maat? Stuur je eisen naar abelsoftware123@hotmail.com voor een gratis offerte!"
        },
        "quote": "offerte", "prijsopgave": "offerte", "hoe duur": "offerte",

        // --- 3. TECH & REPOSITORY (AI Tools) ---
        "face": {
            en: "Our Face Recognition AI uses deep learning to identify features even in low light. 99.8% accurate.",
            nl: "Onze Face Recognition AI gebruikt deep learning om kenmerken te herkennen, zelfs bij weinig licht."
        },
        "gezicht": "face", "herkenning": "face", "beveiliging": "face",

        "drone": {
            en: "Transform your aerial shots into high-detail 3D maps. Perfect for construction and agriculture.",
            nl: "Transformeer je luchtfoto's naar gedetailleerde 3D-kaarten. Perfect voor de bouw en landbouw."
        },
        "mapping": "drone", "3d": "drone", "kaarten": "drone",

        "hacking": {
            en: "Security is a priority. Our ethical hacking tools help you find leaks before the bad guys do.",
            nl: "Veiligheid is prioriteit. Onze ethical hacking tools helpen je lekken te vinden voordat anderen dat doen."
        },
        "hacken": "hacking", "cyber": "hacking", "pentest": "hacking",

        "python": {
            en: "Much of our AI backend is built in Python due to its powerful library ecosystem.",
            nl: "Veel van onze AI-backend is gebouwd in Python vanwege het krachtige ecosysteem aan libraries."
        },
        "javascript": "python", "coderen": "python", "taal": "python", "js": "python",

        // --- 4. KLANTENSERVICE & AFSPRAKEN ---
        "hours": {
            en: "Our team is active Mon-Fri, 09:00 - 17:00 (CET). Weekend support is via email only.",
            nl: "Ons team is actief ma-vrij, 09:00 - 17:00 (CET). Weekend support is alleen via e-mail."
        },
        "uren": "hours", "tijden": "hours", "open": "hours", "wanneer": "hours",

        "contact": {
            en: "Direct line: abelsoftware123@hotmail.com. Don't hesitate to reach out!",
            nl: "Directe lijn: abelsoftware123@hotmail.com. Aarzel niet om contact op te nemen!"
        },
        "mail": "contact", "email": "contact", "hulp": "contact",

        "prices": {
            en: "Licenses start at €15. Web development starts at €250. Quality tech for fair prices.",
            nl: "Licenties vanaf €15. Web-ontwikkeling vanaf €250. Kwaliteitstechnologie voor eerlijke prijzen."
        },
        "prijzen": "prices", "kosten": "prices", "goedkoop": "prices", "duur": "prices",

        "werkt niet": {
            en: "Oh no! Please describe the error or check the 'Issues' tab on our GitHub repository.",
            nl: "Oh nee! Beschrijf de fout of check de 'Issues' tab op onze GitHub repository."
        },
        "error": "werkt niet", "fout": "werkt niet", "bug": "werkt niet", "haperen": "werkt niet",

        // --- 5. GAMES & ENTERTAINMENT (Uitgebreide Quest) ---
        "game": {
            en: "Ready for a challenge? 🎮 Type 'play' to start 'Echo Quest: The Server Breach'.",
            nl: "Klaar voor een uitdaging? 🎮 Typ 'speel' om 'Echo Quest: The Server Breach' te starten."
        },
        "spel": "game", "spelen": "game",

        "play": {
            en: "QUEST: You're at the server door. Do you [Brute-force], [Phish] or [Scan]?",
            nl: "QUEST: Je staat voor de serverdeur. Ga je voor [Brute-force], [Phish] of [Scan]?"
        },
        "speel": "play",

        "brute-force": {
            en: "Too slow! The admin locked you out. 🚨 Type 'play' to try a different method.",
            nl: "Te traag! De admin heeft je buiten gesloten. 🚨 Typ 'speel' voor een andere methode."
        },
        "phish": {
            en: "It worked! You got the password. You earned 200 Echo-credits! 💰 Want more? Type 'play'.",
            nl: "Het werkte! Je hebt het wachtwoord. Je hebt 200 Echo-credits verdiend! 💰 Meer? Typ 'speel'."
        },
        "scan": {
            en: "You found a vulnerability! You're halfway in. Now [Hack] the system!",
            nl: "Je hebt een zwakte gevonden! Je bent halverwege. Nu het systeem [Hack]en!"
        },
        "hack": {
            en: "DATABASE BREACH SUCCESSFUL! You are a master hacker. 🏆",
            nl: "DATABASE BREACH GELUKT! Je bent een meesterhacker. 🏆"
        },

        // --- 6. GROETEN & AFSLUITING ---
        "hallo": { en: "Hello there! How can I help you with your next big project?", nl: "Hallo daar! Hoe kan ik je helpen met je volgende grote project?" },
        "hoi": "hallo", "hi": "hallo", "hey": "hallo", "goeiedag": "hallo",

        "thanks": { en: "You're welcome! I'm always here if you need more info.", nl: "Graag gedaan! Ik ben er altijd als je meer info nodig hebt." },
        "bedankt": "thanks", "dankje": "thanks", "thx": "thanks",

        "doei": { en: "See you later! Don't forget to star our Echo AI repository!", nl: "Laters! Vergeet niet onze Echo AI repository een ster te geven!" },
        "bye": "doei", "doeg": "doei", "laters": "doei", "fijne dag": "doei"
    },

    default: {
        en: "I don't have a specific answer for that, but I can talk about websites, apps, or AI software! What's on your mind?",
        nl: "Daar heb ik geen specifiek antwoord op, maar ik kan je alles vertellen over websites, apps of AI software! Wat denk je?"
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

    // Geavanceerde taal-guessing
    const nlTriggers = ["de", "het", "ik", "en", "is", "hoe", "wat", "koop", "maken", "site", "prijs", "hallo", "bedankt"];
    const nlMatchCount = nlTriggers.filter(word => userText.includes(word)).length;
    if (nlMatchCount > 0) currentLang = 'nl';

    let responseObj = echoBotData.default;

    // Doorzoek de enorme database
    for (let key in echoBotData.keywords) {
        if (userText.includes(key)) {
            let match = echoBotData.keywords[key];
            if (typeof match === "string") match = echoBotData.keywords[match];
            responseObj = match;
            break; 
        }
    }

    // "Typing" effect voor de bot
    setTimeout(() => {
        const messageText = currentLang === 'nl' ? responseObj.nl : responseObj.en;
        container.innerHTML += `
            <div class="msg bot-msg">
                <span style="font-size: 0.7em; letter-spacing: 1px; color: #00ffcc; text-transform: uppercase; font-weight: bold;">Assistant Echo</span><br>
                ${messageText}
            </div>`;
        container.scrollTop = container.scrollHeight;
    }, 700);
}

function handleKey(event) {
    if (event.key === "Enter") askBot();
}
