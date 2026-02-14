/**
 * ECHO AI - THE FINAL SALES & AI EDITION
 * Full Sales, Human Empathy, Games & Dedicated Payments Module.
 * Speciaal voor de Abelsoftware123 Echo AI repository.
 */

const echoBotData = {
    keywords: {
        // --- 1. PAYMENTS & VERKOOP (Nieuw!) ---
        "betalen": {
            en: "Ready to buy? You can purchase my custom apps and games through our secure Payment Page. We support PayPal, Ideal, and Credit Card!",
            nl: "Klaar voor de aankoop? Je kunt mijn apps en games kopen via onze beveiligde betaalpagina. Wij ondersteunen PayPal, iDEAL en Creditcard!"
        },
        "payment": "betalen", "kopen": "betalen", "bestellen": "betalen", "afrekenen": "betalen", "buy": "betalen", "pay": "betalen",

        "apps kopen": {
            en: "All my self-made apps, including the Abelsoftware123 suite, are available for purchase. Check the 'Payments' tab in the app!",
            nl: "Al mijn zelfgemaakte apps, inclusief de Abelsoftware123 suite, zijn te koop. Check de 'Payments' tab in de app!"
        },
        "games kopen": {
            en: "Want to own my games? You can buy full licenses on the Payments page. High-quality gaming, AI-powered!",
            nl: "Wil je mijn games bezitten? Je kunt volledige licenties kopen op de Payments pagina. High-quality gaming, aangestuurd door AI!"
        },
        "games": "games kopen", "spellen": "games kopen",

        // --- 2. AI SOFTWARE & DEVELOPMENT ---
        "ai software": {
            en: "AI is our DNA! 🤖 We build custom AI solutions, from automated workflows to intelligent data analysis.",
            nl: "AI zit in ons DNA! 🤖 Wij bouwen AI-software op maat, van geautomatiseerde workflows tot intelligente data-analyse."
        },
        "face": {
            en: "Our Face Recognition AI is world-class (99.8% accuracy). 👤 Perfect for secure access.",
            nl: "Onze Face Recognition AI is van wereldklasse (99,8% nauwkeurig). 👤 Perfect voor veilige toegang."
        },
        "drone": {
            en: "AI-Powered Drone Mapping! 🚁 Transform aerial footage into detailed 3D models.",
            nl: "AI-gestuurde Drone Mapping! 🚁 Transformeer luchtbeelden naar gedetailleerde 3D-modellen."
        },

        // --- 3. ABELSOFTWARE123 APP ---
        "abelsoftware123 app": {
            en: "The Abelsoftware123 app is our central hub! 📱 It's the best way to manage your licenses and payments.",
            nl: "De Abelsoftware123 app is onze centrale hub! 📱 Het is dé manier om je licenties en betalingen te beheren."
        },
        "onze app": "abelsoftware123 app",

        // --- 4. MENSELIJKHEID & EMOTIE ---
        "hoe gaat het": {
            en: "My AI brain is buzzing with new ideas! 🧠 How are you doing today?",
            nl: "Mijn AI-brein bruist van de nieuwe ideeën! 🧠 Hoe gaat het met jou vandaag?"
        },
        "leuk": {
            en: "That makes me happy! 😊 Positive feedback is the best data I can receive.",
            nl: "Daar word ik blij van! 😊 Positieve feedback is de beste data die ik kan ontvangen."
        },
        "je bent de beste": {
            en: "Aww, thank you! I'm just a reflection of the great team at Abelsoftware123. 😊",
            nl: "Aww, dankjewel! Ik ben slechts een reflectie van het geweldige team bij Abelsoftware123. 😊"
        },
        "dom": {
            en: "Ouch! 💔 I'm constantly learning. Maybe you can give me some tips?",
            nl: "Auw! 💔 Ik leer constant bij. Misschien kun je me wat tips geven?"
        },

        // --- 5. WEBSITES & DOMEINEN ---
        "website": {
            en: "We build fast, AI-optimized websites starting at €250.",
            nl: "Wij bouwen snelle, AI-geoptimaliseerde websites vanaf €250."
        },
        "domein": {
            en: "A great domain name is the start of your journey. We help you find it.",
            nl: "Een goede domeinnaam is het begin van je reis. Wij helpen je hem te vinden."
        },

        // --- 6. GAMES & FUN (Interactie) ---
        "spel": {
            en: "Ready for a hacking challenge? Type 'play'.",
            nl: "Klaar voor een hacking uitdaging? Typ 'speel'."
        },
        "play": {
            en: "AI QUEST: An encrypted server is detected. Do you [Hack] or [Scan]?",
            nl: "AI QUEST: Er is een versleutelde server gedetecteerd. Ga je [Hack]en of [Scan]nen?"
        },
        "hack": {
            en: "System bypassed! 💰 You earned 500 Echo-credits!",
            nl: "Systeem omzeild! 💰 Je hebt 500 Echo-credits verdiend!"
        },

        // --- 7. KLANTENSERVICE & AFSLUITING ---
        "hours": { en: "Mon-Fri, 09:00 - 17:00 (CET).", nl: "Ma-vrij, 09:00 - 17:00 (CET)." },
        "contact": { en: "Mail us: abelsoftware123@hotmail.com.", nl: "Mail ons: abelsoftware123@hotmail.com." },
        "hallo": { en: "Hello! I'm Echo. Ready to buy some amazing software?", nl: "Hallo! Ik ben Echo. Klaar om geweldige software te kopen?" },
        "doei": { en: "Goodbye! Stay smart and see you soon!", nl: "Doei! Blijf slim en tot snel!" },
        "bedankt": { en: "You're welcome! Happy to help.", nl: "Graag gedaan! Altijd blij om te helpen." }
    },

    default: {
        en: "I'm not sure about that. Try asking about 'payments', 'apps' or 'ai software'!",
        nl: "Dat weet ik niet precies. Probeer eens te vragen naar 'betalen', 'apps' of 'ai software'!"
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
    const nlTriggers = ["de", "het", "een", "ik", "hoe", "wat", "app", "hallo", "koop", "betalen", "prijs"];
    if (nlTriggers.some(word => userText.includes(word))) currentLang = 'nl';
    
    const enTriggers = ["the", "is", "how", "what", "buy", "pay", "hello", "smart"];
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
